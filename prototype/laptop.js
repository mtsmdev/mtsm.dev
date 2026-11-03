import * as THREE from 'three';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createXPS} from './xps-reference.js';
import {drawEditor,editorFrameKey} from './editor-screen.js';
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
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(1.25);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.03,100),pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const {laptop,lid,display}=await createXPS();scene.add(laptop);start=performance.now();
let screenDirty=true,screenRevision=0;
const texCanvas=document.createElement('canvas');texCanvas.width=3200;texCanvas.height=2000;const ctx=texCanvas.getContext('2d');ctx.scale(2,2);ctx.imageSmoothingQuality='high';
const screenTexture=new THREE.CanvasTexture(texCanvas);screenTexture.colorSpace=THREE.SRGBColorSpace;screenTexture.generateMipmaps=false;screenTexture.minFilter=THREE.LinearFilter;screenTexture.magFilter=THREE.LinearFilter;screenTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();
const projectImage=new Image(),amposterImage=new Image(),cvImage=new Image();cvImage.src='./assets/projects/cv-preview.png';const projectCanvas=document.createElement('canvas');projectCanvas.width=1600;projectCanvas.height=1000;const projectCtx=projectCanvas.getContext('2d');
function screenArt(){const ctx=projectCtx;
 ctx.fillStyle='#141414';ctx.fillRect(0,0,1600,1000);
 ctx.fillStyle='#eeeae1';ctx.font='600 16px monospace';ctx.fillText('VAN IDEE NAAR WERKENDE SOFTWARE',65,95);
 ctx.font='800 150px "Barlow Condensed",Impact,sans-serif';ctx.fillText('GESELECTEERD',65,282);ctx.fillStyle='#8d8d8d';ctx.fillText('WERK.',65,425);
 ctx.fillStyle='#eeeae1';ctx.fillRect(65,493,1470,1);ctx.font='600 31px "DM Sans",sans-serif';ctx.fillText('ThermaVoltFlow Simulator',65,555);ctx.fillText('Amposter',940,555);
 ctx.font='16px monospace';ctx.fillStyle='#f28b53';ctx.fillText('SVELTE · PHP · LARAVEL · gRPC',65,595);ctx.fillText('REACT · FIREBASE · JAVA',940,595);
 if(projectImage.complete&&projectImage.naturalWidth){ctx.drawImage(projectImage,65,635,800,800*projectImage.naturalHeight/projectImage.naturalWidth);}else{ctx.fillStyle='#d3c8b6';ctx.fillRect(65,635,800,365);}
 ctx.fillStyle='#20221e';ctx.fillRect(920,635,615,365);ctx.fillStyle='#ff7a35';ctx.font='700 43px "DM Sans",sans-serif';ctx.fillText('Amposter',955,705);ctx.fillStyle='#141414';ctx.font='24px "DM Sans",sans-serif';ctx.fillText('Web + Android',955,762);ctx.font='19px "DM Sans",sans-serif';ctx.fillText('Accounts · Profielen · Berichten',955,816);ctx.fillText('Reacties · Groepen',955,855);ctx.fillStyle='#a7aa9a';ctx.font='16px monospace';ctx.fillText('AFZONDERLIJKE SPRING BOOT-BACKEND',955,934);
 if(amposterImage.complete&&amposterImage.naturalWidth){ctx.fillStyle='#d8d0c2';ctx.fillRect(920,635,615,365);ctx.drawImage(amposterImage,920,635,615,615*amposterImage.naturalHeight/amposterImage.naturalWidth);}
 screenDirty=true;
}
projectImage.onload=screenArt;projectImage.src='./assets/projects/thermavolt.jpg';amposterImage.onload=screenArt;amposterImage.src='./assets/projects/amposter-web.jpg';
screenArt();document.fonts.ready.then(screenArt);

let screenMix=0,lastScreenPaint=-Infinity,lastScreenTime=0,modeStarted=start,lastScreenKey='';
cvImage.onload=()=>{screenDirty=true;};window.addEventListener('laptopmodechange',()=>{modeStarted=performance.now();screenMix=0;lastScreenPaint=-Infinity;screenDirty=true;});
function updateScreen(elapsed,p,now){
 const target=p>.001?1:0,delta=Math.min(.1,Math.max(0,(now-lastScreenTime)/1000));lastScreenTime=now;
 const previous=screenMix;screenMix=reduced?target:THREE.MathUtils.damp(screenMix,target,14,delta);if(Math.abs(screenMix-target)<.001)screenMix=target;
 const mode=document.body.dataset.laptopMode||'work',seconds=(now-Math.max(start,modeStarted))/1000;
 const key=mode+':'+screenMix.toFixed(3)+':'+(mode==='work'&&screenMix<1?editorFrameKey(seconds,reduced):'static');
 // Screen compositing is independent of the camera animation frame rate.
 if((screenDirty||key!==lastScreenKey)&&now-lastScreenPaint>=33){
  ctx.globalAlpha=1;
  if(screenMix<1){const mode=document.body.dataset.laptopMode||'work';if(mode==='cv')drawCV(ctx,cvImage);else if(mode==='contact')drawMail(ctx);else drawEditor(ctx,(now-Math.max(start,modeStarted))/1000,reduced);}
  if(screenMix>0){ctx.globalAlpha=screenMix;ctx.drawImage(projectCanvas,0,0);ctx.globalAlpha=1;}
  screenTexture.needsUpdate=true;lastScreenPaint=now;lastScreenKey=key;screenDirty=false;screenRevision++;
 }

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
// A display emits its own image: retain the source whites and text contrast.
display.material.color.set(0xffffff);display.material.toneMapped=false;
display.material.map=screenTexture;display.material.needsUpdate=true;
const key=new THREE.DirectionalLight(0xffefdc,2);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,2);rim.position.set(3,2,-3);scene.add(rim);const glow=new THREE.PointLight(0xff641b,12,12);glow.position.set(2,-1,3);scene.add(glow);
let renderDirty=true,lastRenderKey='',lastMovement=performance.now(),lastP=-1,lastPX=0,lastPY=0,currentRatio=1.25;
function resize(){renderDirty=true;renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
function frame(now){requestAnimationFrame(frame);if(document.hidden)return;const p=progress();updatePage(p);if(p>=1&&!reduced)return;
 const moving=(!reduced&&now-start<2500)||Math.abs(p-lastP)>.00001||(!reduced&&(Math.abs(px-lastPX)>.0005||Math.abs(py-lastPY)>.0005));
 if(moving)lastMovement=now;lastP=p;lastPX=px;lastPY=py;
 const desiredRatio=now-lastMovement<180?1.25:Math.min(Math.max(devicePixelRatio,2),2.5);
 if(desiredRatio!==currentRatio){currentRatio=desiredRatio;renderer.setPixelRatio(currentRatio);renderDirty=true;}const turn=smooth(.06,.50,p),zoom=smooth(.53,.96,p),intro=reduced?1:smooth(0,.6,(now-start)/1000),mobile=innerWidth<650;const elapsed=(now-start)/1000;document.body.classList.remove('booting');const openingTime=clamp(elapsed/2.4);const opening=reduced?1:Math.pow(openingTime,4)*(5-4*openingTime);const openAmount=Math.max(opening,smooth(0,.15,p));laptop.rotation.set(THREE.MathUtils.lerp(THREE.MathUtils.lerp(.15,.12,openAmount),0,turn),THREE.MathUtils.lerp(THREE.MathUtils.lerp(-1.08,-.42,openAmount),0,turn),THREE.MathUtils.lerp(THREE.MathUtils.lerp(-.09,-.055,openAmount),0,turn));laptop.rotation.y+=(reduced?0:px*.08)*(1-turn);laptop.rotation.x+=(reduced?0:py*.045)*(1-turn);const startDistance=mobile?10.5:10.8,viewWidth=2*Math.tan(THREE.MathUtils.degToRad(17.5))*startDistance*camera.aspect;const initialScale=Math.min(1.18,viewWidth*.36/4.7);laptop.scale.setScalar(THREE.MathUtils.lerp(initialScale,1,turn));laptop.position.set(THREE.MathUtils.lerp(viewWidth*.265,0,turn),THREE.MathUtils.lerp(mobile?-1.3:-.1,-.01,turn)-(1-intro)*.12,0);const tangent=Math.tan(THREE.MathUtils.degToRad(17.5)),destination=Math.min(1.4125/tangent,2.26/(tangent*camera.aspect))*.84;camera.position.set(0,THREE.MathUtils.lerp(.65,-.01,turn),THREE.MathUtils.lerp(mobile?10.5:10.8,destination,zoom));camera.lookAt(0,-.01,-.25);lid.rotation.x=THREE.MathUtils.lerp(THREE.MathUtils.degToRad(99.6)*(1-openAmount),.16,turn);updateScreen(elapsed,p,now);
 const renderKey=[p.toFixed(5),openAmount.toFixed(5),intro.toFixed(5),reduced?0:px.toFixed(4),reduced?0:py.toFixed(4),screenRevision].join(':');
 if(renderDirty||renderKey!==lastRenderKey){renderer.render(scene,camera);lastRenderKey=renderKey;renderDirty=false;}}
requestAnimationFrame(frame);
}catch(e){document.body.classList.remove('booting');canvas.hidden=true;host.querySelector('.fallback').hidden=false;console.error('Laptop scene unavailable',e);document.body.classList.add('no-webgl');window.addEventListener('scroll',()=>updatePage(progress()),{passive:true});updatePage(progress());}















