import * as THREE from 'three';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createXPS} from './xps-reference.js';
import {drawEditor,editorState,editorDirtyRects} from './editor-screen.js';
import {drawCV,drawMail} from './laptop-views.js';
const host=document.getElementById('sculpture'),canvas=document.getElementById('scene'),journey=document.querySelector('.scroll-journey'),work=document.getElementById('work');
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,px=0,py=0,start=performance.now();
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
document.body.classList.toggle('reduced',reduced);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
window.addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;},{passive:true});
const heroCopy=document.querySelector('.hero-copy'),annotation=document.querySelector('.annotation'),workReveals=[...work.querySelectorAll('.reveal')];
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
 else{work.style.opacity=smooth(.85,.97,p);work.style.transform=`translateY(${-remaining}px)`;work.style.pointerEvents=p>.93?'auto':'none';}
 if(p>.84&&!projectsRevealed){projectsRevealed=true;workReveals.forEach(e=>e.classList.add('visible'));}
}
try{
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.03,100),pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const {laptop,lid,display}=await createXPS();scene.add(laptop);
const key=new THREE.DirectionalLight(0xffefdc,2);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,2);rim.position.set(3,2,-3);scene.add(rim);const glow=new THREE.PointLight(0xff641b,12,12);glow.position.set(2,-1,3);scene.add(glow);
const maxAnisotropy=renderer.capabilities.getMaxAnisotropy();

// The laptop screen uses two textures. The editor / CV / mail view changes over time and is
// patched in small strips; the project art is uploaded once and cross-faded on the GPU.
// Re-uploading one large canvas per change used to stall the GPU for well over 100ms.
const SCREEN_W=1600,SCREEN_H=1000;
const texCanvas=document.createElement('canvas');texCanvas.width=SCREEN_W;texCanvas.height=SCREEN_H;const ctx=texCanvas.getContext('2d');ctx.imageSmoothingQuality='high';
const screenTexture=new THREE.CanvasTexture(texCanvas);screenTexture.colorSpace=THREE.SRGBColorSpace;screenTexture.generateMipmaps=false;screenTexture.minFilter=THREE.LinearFilter;screenTexture.magFilter=THREE.LinearFilter;screenTexture.anisotropy=maxAnisotropy;
const projectCanvas=document.createElement('canvas');projectCanvas.width=SCREEN_W;projectCanvas.height=SCREEN_H;const projectCtx=projectCanvas.getContext('2d');
const projectTexture=new THREE.CanvasTexture(projectCanvas);projectTexture.colorSpace=THREE.SRGBColorSpace;projectTexture.minFilter=THREE.LinearMipmapLinearFilter;projectTexture.anisotropy=maxAnisotropy;
const stripCanvas=document.createElement('canvas'),stripCtx=stripCanvas.getContext('2d'),stripTexture=new THREE.CanvasTexture(stripCanvas),stripAt=new THREE.Vector2();
const screenMixUniform={value:0};
const projectImage=new Image(),amposterImage=new Image(),cvImage=new Image();
let renderDirty=true,screenDirty=true,screenRevision=0;
function screenArt(){const ctx=projectCtx;
 ctx.fillStyle='#141414';ctx.fillRect(0,0,1600,1000);
 ctx.fillStyle='#eeeae1';ctx.font='600 16px monospace';ctx.fillText('VAN IDEE NAAR WERKENDE SOFTWARE',65,95);
 ctx.font='800 150px "Barlow Condensed",Impact,sans-serif';ctx.fillText('GESELECTEERD',65,282);ctx.fillStyle='#8d8d8d';ctx.fillText('WERK.',65,425);
 ctx.fillStyle='#eeeae1';ctx.fillRect(65,493,1470,1);ctx.font='600 31px "DM Sans",sans-serif';ctx.fillText('ThermaVoltFlow Simulator',65,555);ctx.fillText('Amposter',940,555);
 ctx.font='16px monospace';ctx.fillStyle='#f28b53';ctx.fillText('SVELTE · PHP · LARAVEL · gRPC',65,595);ctx.fillText('REACT · FIREBASE · JAVA',940,595);
 if(projectImage.complete&&projectImage.naturalWidth){ctx.drawImage(projectImage,65,635,800,800*projectImage.naturalHeight/projectImage.naturalWidth);}else{ctx.fillStyle='#d3c8b6';ctx.fillRect(65,635,800,365);}
 ctx.fillStyle='#20221e';ctx.fillRect(920,635,615,365);ctx.fillStyle='#ff7a35';ctx.font='700 43px "DM Sans",sans-serif';ctx.fillText('Amposter',955,705);ctx.fillStyle='#141414';ctx.font='24px "DM Sans",sans-serif';ctx.fillText('Web + Android',955,762);ctx.font='19px "DM Sans",sans-serif';ctx.fillText('Accounts · Profielen · Berichten',955,816);ctx.fillText('Reacties · Groepen',955,855);ctx.fillStyle='#a7aa9a';ctx.font='16px monospace';ctx.fillText('AFZONDERLIJKE SPRING BOOT-BACKEND',955,934);
 if(amposterImage.complete&&amposterImage.naturalWidth){ctx.fillStyle='#d8d0c2';ctx.fillRect(920,635,615,365);ctx.drawImage(amposterImage,920,635,615,615*amposterImage.naturalHeight/amposterImage.naturalWidth);}
 projectTexture.needsUpdate=true;renderDirty=true;
}
projectImage.onload=screenArt;amposterImage.onload=screenArt;
cvImage.src='./assets/projects/cv-preview.png';projectImage.src='./assets/projects/thermavolt.jpg';amposterImage.src='./assets/projects/amposter-web.jpg';
screenArt();document.fonts.ready.then(screenArt);

// Cross-fade between the live view and the project art in the shader instead of on the canvas.
display.material.color.set(0xffffff);display.material.toneMapped=false;// A display emits its own image.
display.material.map=screenTexture;
display.material.onBeforeCompile=shader=>{
 shader.uniforms.projectMap={value:projectTexture};shader.uniforms.screenMix=screenMixUniform;
 shader.fragmentShader='uniform sampler2D projectMap;\nuniform float screenMix;\n'+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n\tdiffuseColor.rgb = mix( diffuseColor.rgb, texture2D( projectMap, vMapUv ).rgb, screenMix );');
};
display.material.customProgramCacheKey=()=>'laptop-screen-mix';display.material.needsUpdate=true;

let screenMix=0,lastScreenPaint=-Infinity,modeStarted=start,shownMode='',shownEditor=null;
cvImage.onload=()=>{if((document.body.dataset.laptopMode||'work')==='cv')screenDirty=true;};
window.addEventListener('laptopmodechange',()=>{modeStarted=performance.now();screenMix=0;screenDirty=true;});
const viewSeconds=now=>(now-Math.max(start,modeStarted))/1000;
function paintFullScreen(mode,seconds){
 if(mode==='cv')drawCV(ctx,cvImage);else if(mode==='contact')drawMail(ctx);else drawEditor(ctx,seconds,reduced);
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
 if(screenMix>=1)return;// the live view is fully covered by the project art
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
const hoverBox=new THREE.Box3(),hoverHit=new THREE.Vector3();let lastHover=0;
canvas.addEventListener('pointermove',event=>{
 if(event.timeStamp-lastHover<65)return;lastHover=event.timeStamp;
 const box=canvas.getBoundingClientRect();hitPointer.set((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1);raycaster.setFromCamera(hitPointer,camera);
 hoverBox.setFromObject(laptop);canvas.style.cursor=raycaster.ray.intersectBox(hoverBox,hoverHit)?'pointer':'default';
});
canvas.addEventListener('click',event=>{if(hitsLaptop(event))laptopLink.click();});

// Resolution: a fixed pixel ratio within a pixel budget. Changing it mid-animation reallocates
// the canvas and causes a hitch, so it only ever steps down when frames are consistently slow.
const PIXEL_BUDGET=3e6;
let ratioCap=2,currentRatio=0,mobile=innerWidth<650;
function resize(){
 const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
 const ratio=Math.round(Math.max(1,Math.min(devicePixelRatio,ratioCap,Math.sqrt(PIXEL_BUDGET/(w*h))))*20)/20;
 if(ratio!==currentRatio){currentRatio=ratio;renderer.setPixelRatio(ratio);}
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();mobile=innerWidth<650;renderDirty=true;
}
new ResizeObserver(resize).observe(host);resize();
let sampled=0,slow=0,lastRenderAt=0;
function governFrameRate(now){
 const gap=lastRenderAt?now-lastRenderAt:0;lastRenderAt=now;
 if(!gap||gap>100)return;// ignore the first frame and tab switches
 sampled++;if(gap>20)slow++;
 if(sampled<90)return;
 if(slow>15&&currentRatio>1){ratioCap=Math.max(1,currentRatio-.25);resize();}
 sampled=slow=0;
}

function pose(now,p){
 const elapsed=(now-start)/1000,turn=smooth(.06,.50,p),zoom=smooth(.53,.96,p),intro=reduced?1:smooth(0,.6,elapsed);
 const openingTime=clamp(elapsed/2.4),opening=reduced?1:Math.pow(openingTime,4)*(5-4*openingTime),openAmount=Math.max(opening,smooth(0,.15,p));
 laptop.rotation.set(THREE.MathUtils.lerp(THREE.MathUtils.lerp(.15,.12,openAmount),0,turn),THREE.MathUtils.lerp(THREE.MathUtils.lerp(-1.08,-.42,openAmount),0,turn),THREE.MathUtils.lerp(THREE.MathUtils.lerp(-.09,-.055,openAmount),0,turn));
 laptop.rotation.y+=(reduced?0:px*.08)*(1-turn);laptop.rotation.x+=(reduced?0:py*.045)*(1-turn);
 const tangent=Math.tan(THREE.MathUtils.degToRad(17.5)),startDistance=mobile?10.5:10.8,viewWidth=2*tangent*startDistance*camera.aspect,initialScale=Math.min(1.18,viewWidth*.36/4.7);
 laptop.scale.setScalar(THREE.MathUtils.lerp(initialScale,1,turn));
 laptop.position.set(THREE.MathUtils.lerp(viewWidth*.265,0,turn),THREE.MathUtils.lerp(mobile?-1.3:-.1,-.01,turn)-(1-intro)*.12,0);
 const destination=Math.min(1.4125/tangent,2.26/(tangent*camera.aspect))*.84;
 camera.position.set(0,THREE.MathUtils.lerp(.65,-.01,turn),THREE.MathUtils.lerp(startDistance,destination,zoom));camera.lookAt(0,-.01,-.25);
 lid.rotation.x=THREE.MathUtils.lerp(THREE.MathUtils.degToRad(99.6)*(1-openAmount),.16,turn);
 return {openAmount,intro};
}

let lastRenderKey='',lastNow=0;
function frame(now){requestAnimationFrame(frame);if(document.hidden){lastNow=0;lastRenderAt=0;return;}
 const dt=lastNow?Math.min(.1,(now-lastNow)/1000):1/60;lastNow=now;
 const p=progress();updatePage(p);if(p>=1&&!reduced){lastRenderAt=0;return;}
 const {openAmount,intro}=pose(now,p);updateScreen(now,p,dt);
 const renderKey=[p.toFixed(5),openAmount.toFixed(5),intro.toFixed(5),reduced?0:px.toFixed(4),reduced?0:py.toFixed(4),screenMix.toFixed(4),screenRevision].join(':');
 if(renderDirty||renderKey!==lastRenderKey){renderer.render(scene,camera);lastRenderKey=renderKey;renderDirty=false;governFrameRate(now);}else lastRenderAt=0;
}
start=modeStarted=performance.now();document.body.classList.remove('booting');
requestAnimationFrame(frame);
}catch(e){document.body.classList.remove('booting');canvas.hidden=true;host.querySelector('.fallback').hidden=false;console.error('Laptop scene unavailable',e);document.body.classList.add('no-webgl');window.addEventListener('scroll',()=>updatePage(progress()),{passive:true});updatePage(progress());}
