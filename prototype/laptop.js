import * as THREE from 'three';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createXPS} from './xps-reference.js';
import {drawEditor,editorState,editorDirtyRects,setEditorLanguage} from './editor-screen.js';
import {drawCV,drawMail} from './laptop-views.js';
const host=document.getElementById('sculpture'),canvas=document.getElementById('scene'),journey=document.querySelector('.scroll-journey'),work=document.getElementById('work');
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,px=0,py=0,start=performance.now();
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
document.body.classList.toggle('reduced',reduced);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
// Tilt follows a mouse or pen; touch scrolling must not shake the laptop.
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;},{passive:true});
const heroCopy=document.querySelector('.hero-copy'),annotation=document.querySelector('.laptop-panel'),workReveals=[...work.querySelectorAll('.reveal')];
const panel=work.querySelector('.work-screen'),workBody=work.querySelector('.work-body');
if(!reduced)panel.style.opacity='0';// shown on the laptop screen once scrolling starts
let journeyTop=0,journeyEnd=1,lastPageProgress=-1,projectsRevealed=false;
function measureJourney(){journeyTop=journey.getBoundingClientRect().top+window.scrollY;journeyEnd=Math.max(1,journey.offsetHeight-innerHeight);lastPageProgress=-1;}
measureJourney();window.addEventListener('resize',measureJourney,{passive:true});
new ResizeObserver(measureJourney).observe(journey);
function progress(){return clamp((window.scrollY-journeyTop)/journeyEnd);}
function updatePage(p){
 if(p===lastPageProgress)return;lastPageProgress=p;
 const remaining=Math.max(0,journeyTop+journeyEnd-window.scrollY);
 heroCopy.style.opacity=1-smooth(.03,.27,p);heroCopy.style.transform=`translateY(${-smooth(0,.3,p)*50}px)`;heroCopy.style.visibility=p>.3?'hidden':'visible';annotation.style.opacity=1-smooth(.35,.65,p);
 if(reduced){work.style.opacity=1;work.style.transform='';work.style.pointerEvents='auto';}
 else{
  // The section is pinned during the journey. Its opening panel rides on the laptop screen (mapPanel);
  // the timeline below fades in as the screen fills the page.
  work.style.opacity=1;work.style.transform=`translateY(${-remaining}px)`;workBody.style.opacity=smooth(.85,.97,p);work.style.pointerEvents=p>.93?'auto':'none';
  if(p>=1){panel.style.transform='none';panel.style.opacity='1';}
 }
 if(p>.84&&!projectsRevealed){projectsRevealed=true;workReveals.forEach(e=>e.classList.add('visible'));}
}
const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
// Loader progress: downloads fill the first 90%, warm-up (fonts, shaders, uploads) the rest.
const loaderBox=host.querySelector('.scene-loader'),loaderPct=host.querySelector('.scene-loader-pct');
const showLoad=v=>{if(!loaderBox)return;loaderBox.style.setProperty('--load',v.toFixed(3));loaderPct.textContent=Math.round(v*100)+'%';};
try{
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.03,100),pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const {laptop,lid,display}=await createXPS((done,total)=>showLoad(done/total*.9));scene.add(laptop);
const key=new THREE.DirectionalLight(0xffefdc,2);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,2);rim.position.set(3,2,-3);scene.add(rim);const glow=new THREE.PointLight(0xff641b,12,12);glow.position.set(2,-1,3);scene.add(glow);
const maxAnisotropy=renderer.capabilities.getMaxAnisotropy();

// The editor / CV / mail view is a canvas texture patched in small strips (re-uploading the whole
// canvas per change used to stall the GPU). Once scrolling starts the screen fades to the projects
// panel's background colour, and the real HTML panel is mapped on top of it (see mapPanel).
const SCREEN_W=1600,SCREEN_H=1000;
const texCanvas=document.createElement('canvas');texCanvas.width=SCREEN_W;texCanvas.height=SCREEN_H;const ctx=texCanvas.getContext('2d');ctx.imageSmoothingQuality='high';
const screenTexture=new THREE.CanvasTexture(texCanvas);screenTexture.colorSpace=THREE.SRGBColorSpace;screenTexture.generateMipmaps=false;screenTexture.minFilter=THREE.LinearFilter;screenTexture.magFilter=THREE.LinearFilter;screenTexture.anisotropy=maxAnisotropy;
const stripCanvas=document.createElement('canvas'),stripCtx=stripCanvas.getContext('2d'),stripTexture=new THREE.CanvasTexture(stripCanvas),stripAt=new THREE.Vector2();
const screenMixUniform={value:0};
const cvImage=new Image();cvImage.src='./assets/projects/cv-preview.png';
let renderDirty=true,screenDirty=true,screenRevision=0;
const pageLang=()=>window.i18n?.lang||'nl';
const loadArabicFonts=()=>['800 128px Alexandria','400 24px "IBM Plex Sans Arabic"','700 24px "IBM Plex Sans Arabic"'].map(font=>document.fonts.load(font,'ب').catch(()=>{}));
// Fade the live view to the panel colour in the shader, so no texture upload is needed.
display.material.color.set(0xffffff);display.material.toneMapped=false;// A display emits its own image.
display.material.map=screenTexture;
display.material.onBeforeCompile=shader=>{
 shader.uniforms.panelColor={value:new THREE.Color('#13120f')};shader.uniforms.screenMix=screenMixUniform;
 shader.fragmentShader='uniform vec3 panelColor;\nuniform float screenMix;\n'+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n\tdiffuseColor.rgb = mix( diffuseColor.rgb, panelColor, screenMix );');
};
display.material.customProgramCacheKey=()=>'laptop-screen-mix';display.material.needsUpdate=true;

let screenMix=0,lastScreenPaint=-Infinity,modeStarted=start,shownMode='',shownEditor=null;
cvImage.onload=()=>{if((document.body.dataset.laptopMode||'work')==='cv')screenDirty=true;};
window.addEventListener('laptopmodechange',()=>{modeStarted=performance.now();screenMix=0;screenDirty=true;});
const viewSeconds=now=>(now-Math.max(start,modeStarted))/1000;
function paintFullScreen(mode,seconds){
 if(mode==='cv')drawCV(ctx,cvImage,pageLang());else if(mode==='contact')drawMail(ctx,pageLang());else drawEditor(ctx,seconds,reduced);
 screenTexture.needsUpdate=true;shownMode=mode;shownEditor=mode==='work'?editorState(seconds,reduced):null;screenDirty=false;screenRevision++;
}
// Redraw one rectangle of the editor and upload just that strip into the screen texture.
function patchScreen(rect,seconds){
 if(stripCanvas.width!==rect.w||stripCanvas.height!==rect.h){stripCanvas.width=rect.w;stripCanvas.height=rect.h;}
 stripCtx.setTransform(1,0,0,1,-rect.x,-rect.y);drawEditor(stripCtx,seconds,reduced);
 stripAt.set(rect.x,SCREEN_H-rect.y-rect.h);// texture rows are flipped
 renderer.copyTextureToTexture(stripTexture,screenTexture,null,stripAt);
}
function updateScreen(now,p,dt){
 const target=p>.001?1:0;
 screenMix=reduced?target:THREE.MathUtils.damp(screenMix,target,14,dt);if(Math.abs(screenMix-target)<.001)screenMix=target;
 screenMixUniform.value=screenMix;
 if(screenMix>=1)return;// the live view is fully covered by the projects panel
 const mode=document.body.dataset.laptopMode||'work',seconds=viewSeconds(now);
 if(screenDirty||mode!==shownMode){paintFullScreen(mode,seconds);lastScreenPaint=now;return;}
 if(mode!=='work'||now-lastScreenPaint<33)return;
 const next=editorState(seconds,reduced),rects=editorDirtyRects(shownEditor,next);
 if(!rects.length)return;
 for(const rect of rects)patchScreen(rect,seconds);
 shownEditor=next;lastScreenPaint=now;screenRevision++;
}

const laptopLink=document.getElementById('laptop-action'),raycaster=new THREE.Raycaster(),hitPointer=new THREE.Vector2();
function hitsLaptop(event){const box=canvas.getBoundingClientRect();hitPointer.set((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1);raycaster.setFromCamera(hitPointer,camera);return raycaster.intersectObject(laptop,true).length>0;}
const hoverBox=new THREE.Box3(),hoverHit=new THREE.Vector3();let lastHover=0,overLaptop=false;
function pointerOverLaptop(event){
 const box=canvas.getBoundingClientRect();hitPointer.set((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1);raycaster.setFromCamera(hitPointer,camera);
 hoverBox.setFromObject(laptop);return !!raycaster.ray.intersectBox(hoverBox,hoverHit);
}
// Grab and spin: dragging turns the laptop, releasing lets it spring back to its pose.
const spin={yaw:0,pitch:0,vYaw:0,vPitch:0,dragging:false,id:null,x:0,y:0,moved:0};
canvas.addEventListener('pointerdown',event=>{
 if(progress()>.04||!pointerOverLaptop(event))return;
 spin.dragging=true;spin.id=event.pointerId;spin.x=event.clientX;spin.y=event.clientY;spin.moved=0;spin.vYaw=spin.vPitch=0;
 canvas.setPointerCapture(event.pointerId);document.body.classList.add('grabbing');
});
canvas.addEventListener('pointermove',event=>{
 if(spin.dragging&&event.pointerId===spin.id){
  const dx=event.clientX-spin.x,dy=event.clientY-spin.y;spin.x=event.clientX;spin.y=event.clientY;spin.moved+=Math.abs(dx)+Math.abs(dy);
  spin.yaw=THREE.MathUtils.clamp(spin.yaw+dx*.009,-1.6,1.6);spin.pitch=THREE.MathUtils.clamp(spin.pitch+dy*.004,-.35,.35);
  return;
 }
 if(event.timeStamp-lastHover<65)return;lastHover=event.timeStamp;
 overLaptop=progress()<.04&&pointerOverLaptop(event);document.body.classList.toggle('over-laptop',overLaptop);
});
const release=event=>{if(!spin.dragging||event.pointerId!==spin.id)return;spin.dragging=false;document.body.classList.remove('grabbing');};
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
canvas.addEventListener('pointerleave',()=>{if(!spin.dragging){overLaptop=false;document.body.classList.remove('over-laptop');}});
// A drag is not a click: only a short tap or click opens the current view.
canvas.addEventListener('click',event=>{if(spin.moved>6){spin.moved=0;return;}if(hitsLaptop(event))laptopLink.click();});
function settleSpin(dt){
 if(spin.dragging||(!spin.yaw&&!spin.pitch))return;
 // Slightly under-damped spring: a small overshoot reads as weight.
 const k=38,c=8;
 spin.vYaw+=(-k*spin.yaw-c*spin.vYaw)*dt;spin.vPitch+=(-k*spin.pitch-c*spin.vPitch)*dt;
 spin.yaw+=spin.vYaw*dt;spin.pitch+=spin.vPitch*dt;
 if(Math.abs(spin.yaw)<1e-4&&Math.abs(spin.vYaw)<1e-3)spin.yaw=spin.vYaw=0;
 if(Math.abs(spin.pitch)<1e-4&&Math.abs(spin.vPitch)<1e-3)spin.pitch=spin.vPitch=0;
}

// Resolution: a fixed pixel ratio within a pixel budget. Changing it mid-animation reallocates
// the canvas and causes a hitch, so it only ever steps down when frames are consistently slow.
const PIXEL_BUDGET=3e6;
let ratioCap=2,currentRatio=0,mobile=innerWidth<650,portrait=false,freeTop=0;
const heroActions=document.querySelector('.hero .actions');
function resize(){
 const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
 const ratio=Math.round(Math.max(1,Math.min(devicePixelRatio,ratioCap,Math.sqrt(PIXEL_BUDGET/(w*h))))*20)/20;
 if(ratio!==currentRatio){currentRatio=ratio;renderer.setPixelRatio(ratio);}
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();mobile=innerWidth<650;
 // On portrait screens the laptop sits in the free space below the hero buttons.
 portrait=camera.aspect<.9;freeTop=heroActions?heroCopy.offsetTop+heroActions.offsetTop+heroActions.offsetHeight:0;
 // Portrait: the laptop tabs sit between the buttons and the laptop.
 if(portrait&&annotation){host.parentElement.style.setProperty('--panel-top',(freeTop+18)+'px');freeTop+=annotation.offsetHeight+18;}
 if(portrait)fitPortrait(w,h);
 layoutPanel();
 renderDirty=true;
}
// Fit the opened laptop into the free space below the hero buttons. The corners of its bounding
// box are projected through the starting camera, so perspective is accounted for exactly.
const fitBox=new THREE.Box3(),fitCam=new THREE.PerspectiveCamera(35,1,.03,100),corner=new THREE.Vector3();
let fitScale=1,fitX=0,fitY=0;
// Right-to-left pages put the text on the right, so the laptop mirrors to the left side.
let side=document.documentElement.dir==='rtl'?-1:1;
function measureLaptop(){
 laptop.rotation.set(.12,-.42*side,-.055*side);laptop.scale.setScalar(1);laptop.position.set(0,0,0);lid.rotation.x=0;
 laptop.updateMatrixWorld(true);fitBox.setFromObject(laptop);
}
measureLaptop();
function fitPortrait(w,h){
 const distance=mobile?10.5:10.8,perPx=2*Math.tan(THREE.MathUtils.degToRad(17.5))*distance/h;
 fitCam.aspect=w/h;fitCam.updateProjectionMatrix();fitCam.position.set(0,.65,distance);fitCam.lookAt(0,-.01,-.25);fitCam.updateMatrixWorld();
 const bottom=h-96,top=Math.min(freeTop+12,bottom-80);// leave room for the dock
 const bounds=()=>{
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(let i=0;i<8;i++){
   corner.set(i&1?fitBox.max.x:fitBox.min.x,i&2?fitBox.max.y:fitBox.min.y,i&4?fitBox.max.z:fitBox.min.z).multiplyScalar(fitScale);
   corner.x+=fitX;corner.y+=fitY;corner.project(fitCam);
   const x=(corner.x+1)/2*w,y=(1-corner.y)/2*h;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  return {minX,maxX,minY,maxY};
 };
 fitScale=1;fitX=0;fitY=0;
 for(let pass=0;pass<4;pass++){
  let b=bounds();const k=Math.min(w*.92/(b.maxX-b.minX),(bottom-top)/(b.maxY-b.minY));
  fitScale*=k;fitX*=k;fitY*=k;// zoom about the view centre, then re-centre
  b=bounds();fitX+=(w/2-(b.minX+b.maxX)/2)*perPx;fitY+=((b.minY+b.maxY)/2-(top+bottom)/2)*perPx;
 }
}
// ===== The real projects panel on the laptop screen =====
// Screen corners come from the display's UVs; with a flipped canvas texture, UV (0,1) is the top-left.
const uvAttr=display.geometry.attributes.uv,posAttr=display.geometry.attributes.position;
const screenCorners=[[0,1],[1,1],[1,0],[0,0]].map(([u,v])=>{// TL, TR, BR, BL
 let best=0,bestD=Infinity;
 for(let i=0;i<uvAttr.count;i++){const d=(uvAttr.getX(i)-u)**2+(uvAttr.getY(i)-v)**2;if(d<bestD){bestD=d;best=i;}}
 return new THREE.Vector3().fromBufferAttribute(posAttr,best);
});
function screenFrame(){
 laptop.updateMatrixWorld(true);
 const [tl,tr,br,bl]=screenCorners.map(c=>c.clone().applyMatrix4(display.matrixWorld));
 const normal=new THREE.Vector3().subVectors(tr,tl).cross(new THREE.Vector3().subVectors(bl,tl)).normalize();
 return {center:tl.clone().add(tr).add(br).add(bl).multiplyScalar(.25),width:tl.distanceTo(tr),height:tl.distanceTo(bl),normal};
}
// In the final pose the lid stands exactly upright, so the screen faces the camera squarely.
laptop.rotation.set(0,0,0);laptop.scale.setScalar(1);laptop.position.set(0,-.01,0);
let finalLid=.16,leastTilt=Infinity;
for(let a=-.4;a<=.6;a+=.002){lid.rotation.x=a;const n=screenFrame().normal;if(Math.abs(n.y)<leastTilt){leastTilt=Math.abs(n.y);finalLid=a;}}
lid.rotation.x=finalLid;
const finalScreen=screenFrame(),screenAspect=finalScreen.width/finalScreen.height;
document.documentElement.style.setProperty('--screen-aspect',screenAspect.toFixed(4));
measureLaptop();
// Camera distance at which the screen is exactly as wide as the page.
const fitDistance=()=>finalScreen.center.z+finalScreen.width/2/(Math.tan(THREE.MathUtils.degToRad(17.5))*camera.aspect);
let panelTop=0,panelW=1,panelH=1,panelShown=true;
function layoutPanel(){
 // The panel's place in the page: full width, centred on the viewport, exactly where the screen ends up.
 panelW=host.clientWidth;panelH=panelW/screenAspect;panelTop=(host.clientHeight-panelH)/2;
 work.style.setProperty('--panel-offset',panelTop.toFixed(1)+'px');
}
// CSS matrix3d that maps the panel box (w x h) onto a quad: the perspective projection of a square.
function quadMatrix(w,h,[x0,y0,x1,y1,x2,y2,x3,y3]){
 const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
 let a,b,d,e,g=0,hh=0;
 if(Math.abs(dx3)<1e-6&&Math.abs(dy3)<1e-6){a=x1-x0;b=x2-x1;d=y1-y0;e=y2-y1;}
 else{const det=dx1*dy2-dx2*dy1;g=(dx3*dy2-dx2*dy3)/det;hh=(dx1*dy3-dx3*dy1)/det;a=x1-x0+g*x1;b=x3-x0+hh*x3;d=y1-y0+g*y1;e=y3-y0+hh*y3;}
 return `matrix3d(${a/w},${d/w},0,${g/w},${b/h},${e/h},0,${hh/h},0,0,1,0,${x0},${y0},0,1)`;
}
const projected=new THREE.Vector3(),panelTarget=[0,0,0,0,0,0,0,0];
function mapPanel(p){
 if(screenMix<=0||p<=0){if(panelShown){panel.style.opacity='0';panelShown=false;}return;}
 camera.updateMatrixWorld();laptop.updateMatrixWorld(true);
 const w=host.clientWidth,h=host.clientHeight,pts=[];
 for(const c of screenCorners){projected.copy(c).applyMatrix4(display.matrixWorld).project(camera);pts.push((projected.x+1)/2*w,(1-projected.y)/2*h-panelTop);}
 // Settle exactly onto the panel's place in the page for the hand-off.
 panelTarget.splice(0,8,0,0,panelW,0,panelW,panelH,0,panelH);
 const k=smooth(.9,.985,p);for(let i=0;i<8;i++)pts[i]+=(panelTarget[i]-pts[i])*k;
 // Hide it whenever the back of the lid faces the viewer.
 const facing=(pts[2]-pts[0])*(pts[7]-pts[1])-(pts[3]-pts[1])*(pts[6]-pts[0])>0;
 panel.style.transform=quadMatrix(panelW,panelH,pts);panel.style.opacity=facing?screenMix.toFixed(3):'0';panelShown=true;
}
const layoutObserver=new ResizeObserver(resize);layoutObserver.observe(host);layoutObserver.observe(heroCopy);resize();
// A language switch mirrors the scene for RTL and redraws every screen once its fonts are loaded.
window.addEventListener('i18nchange',async()=>{
 side=document.documentElement.dir==='rtl'?-1:1;measureLaptop();resize();
 setEditorLanguage(pageLang());
 if(pageLang()==='ar')await Promise.all(loadArabicFonts());
 screenDirty=true;
});
let sampled=0,slow=0,lastRenderAt=0;
function governFrameRate(now){
 const gap=lastRenderAt?now-lastRenderAt:0;lastRenderAt=now;
 if(!gap||gap>100)return;// ignore the first frame and tab switches
 sampled++;if(gap>20)slow++;
 if(sampled<90)return;
 if(slow>15&&currentRatio>1){ratioCap=Math.max(1,currentRatio-.25);resize();}
 sampled=slow=0;
}

let sx=0,sy=0;// pointer position eased so parallax glides instead of stepping with each event
function pose(now,p){
 const elapsed=(now-start)/1000,turn=smooth(.06,.50,p),zoom=smooth(.53,.96,p),intro=reduced?1:smooth(0,.6,elapsed);
 const openingTime=clamp(elapsed/2.4),opening=reduced?1:Math.pow(openingTime,4)*(5-4*openingTime),openAmount=Math.max(opening,smooth(0,.15,p));
 laptop.rotation.set(THREE.MathUtils.lerp(THREE.MathUtils.lerp(.15,.12,openAmount),0,turn),THREE.MathUtils.lerp(THREE.MathUtils.lerp(-1.08,-.42,openAmount),0,turn)*side,THREE.MathUtils.lerp(THREE.MathUtils.lerp(-.09,-.055,openAmount),0,turn)*side);
 // Pointer tilt (about ±10° of yaw) plus any grab-and-spin offset; both fade out as the laptop turns to the page.
 laptop.rotation.y+=((reduced?0:sx*.34)+spin.yaw)*(1-turn);laptop.rotation.x+=((reduced?0:sy*.14)+spin.pitch)*(1-turn);
 const tangent=Math.tan(THREE.MathUtils.degToRad(17.5)),startDistance=mobile?10.5:10.8,viewHeight=2*tangent*startDistance,viewWidth=viewHeight*camera.aspect;
 let startScale,startX,startY;
 if(portrait){startScale=fitScale;startX=fitX;startY=fitY;}
 else{startScale=Math.min(innerHeight<520?.78:.95,viewWidth*.36/4.7);startX=viewWidth*.265*side;startY=mobile?-1.3:innerHeight<520?-.35:-.1;}// short landscape: clear the header
 laptop.scale.setScalar(THREE.MathUtils.lerp(startScale,1,turn));
 laptop.position.set(THREE.MathUtils.lerp(startX,0,turn),THREE.MathUtils.lerp(startY,-.01,turn)-(1-intro)*.12,0);
 // Landscape zooms until the screen covers the view; portrait fits the screen's width instead of cropping it.
 // The camera ends centred on the screen at the distance where it exactly fills the page width.
 const c=finalScreen.center,lerp=THREE.MathUtils.lerp;
 camera.position.set(lerp(0,c.x,turn),lerp(.65,c.y,turn),lerp(startDistance,fitDistance(),portrait?turn:zoom));camera.lookAt(lerp(0,c.x,turn),lerp(-.01,c.y,turn),lerp(-.25,c.z,turn));
 lid.rotation.x=THREE.MathUtils.lerp(THREE.MathUtils.degToRad(99.6)*(1-openAmount),finalLid,turn);
 return {openAmount,intro};
}

// Warm up before the intro starts: wait for fonts and images, upload every texture and compile
// the shaders, then render the first pose. Otherwise that work lands in the first frames of the
// lid animation and makes it jump.
const loaded=img=>img.decode().catch(()=>{});
setEditorLanguage(pageLang());
const arabicFonts=pageLang()==='ar'?loadArabicFonts():[];
await Promise.race([Promise.all([document.fonts.ready,...arabicFonts,loaded(cvImage)]),new Promise(resolve=>setTimeout(resolve,2500))]);
paintFullScreen(document.body.dataset.laptopMode||'work',0);
scene.traverse(object=>{const m=object.material;if(m)for(const slot of ['map','aoMap','alphaMap'])if(m[slot])renderer.initTexture(m[slot]);});
renderer.initTexture(screenTexture);
await renderer.compileAsync(scene,camera);showLoad(1);
start=modeStarted=performance.now();pose(start,progress());
// Keep rendering the first pose until the GPU has drained the uploads (two quick frames in a row).
for(let i=0,quick=0,last=await nextFrame();i<30&&quick<2;i++){renderer.render(scene,camera);const now=await nextFrame();quick=now-last<25?quick+1:0;last=now;}

let lastRenderKey='',lastNow=0;
function frame(now){requestAnimationFrame(frame);if(document.hidden){lastNow=0;lastRenderAt=0;return;}
 const dt=lastNow?Math.min(.1,(now-lastNow)/1000):1/60;lastNow=now;
 const p=progress();updatePage(p);if(p>=1&&!reduced){lastRenderAt=0;return;}
 if(reduced){sx=sy=0;}else{sx=THREE.MathUtils.damp(sx,px,6,dt);sy=THREE.MathUtils.damp(sy,py,6,dt);if(Math.abs(sx-px)<1e-4)sx=px;if(Math.abs(sy-py)<1e-4)sy=py;}
 settleSpin(dt);
 const {openAmount,intro}=pose(now,p);updateScreen(now,p,dt);mapPanel(p);
 const renderKey=[p.toFixed(5),openAmount.toFixed(5),intro.toFixed(5),sx.toFixed(4),sy.toFixed(4),spin.yaw.toFixed(4),spin.pitch.toFixed(4),screenMix.toFixed(4),screenRevision].join(':');
 if(renderDirty||renderKey!==lastRenderKey){renderer.render(scene,camera);lastRenderKey=renderKey;renderDirty=false;governFrameRate(now);}else lastRenderAt=0;
}
// The intro clock starts on the first frame the visitor actually sees.
start=modeStarted=performance.now();document.body.classList.remove('booting');
requestAnimationFrame(frame);
}catch(e){document.body.classList.remove('booting');canvas.hidden=true;host.querySelector('.fallback').hidden=false;console.error('Laptop scene unavailable',e);document.body.classList.add('no-webgl');window.addEventListener('scroll',()=>updatePage(progress()),{passive:true});updatePage(progress());}
