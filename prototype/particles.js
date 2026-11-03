// Ambient dust and embers drifting through the hero. Kept deliberately quiet: few particles,
// low alpha, slow flow. Pauses when the hero is off screen or the tab is hidden, and draws a
// single still frame for visitors who prefer reduced motion.
(function(){
const canvas=document.querySelector('.ambient-particles');
if(!canvas)return;
const ctx=canvas.getContext('2d'),light=canvas.parentElement.querySelector('.hero-light');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
let width=0,height=0,ratio=1,particles=[],running=false,visible=true,last=0,time=0;
const pointer={x:-9999,y:-9999,sx:0,sy:0,tx:0,ty:0};

// One soft glow sprite per colour, drawn once and stamped many times.
function sprite(rgb){
 const size=64,c=document.createElement('canvas');c.width=c.height=size;
 const g=c.getContext('2d'),grad=g.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
 grad.addColorStop(0,`rgba(${rgb},1)`);grad.addColorStop(.25,`rgba(${rgb},.55)`);grad.addColorStop(1,`rgba(${rgb},0)`);
 g.fillStyle=grad;g.fillRect(0,0,size,size);return c;
}
const sprites=[sprite('236,228,214'),sprite('255,128,60'),sprite('255,196,140')];

function spawn(anywhere){
 const depth=Math.random();// 0 = far, 1 = near
 return {
  x:Math.random()*width,y:anywhere?Math.random()*height:height+20,
  r:.6+depth*1.9,depth,
  speed:6+depth*16,// px per second upward
  phase:Math.random()*Math.PI*2,twinkle:.4+Math.random()*1.2,
  alpha:.12+depth*.45,sprite:sprites[Math.random()<.68?0:Math.random()<.6?1:2],
  vx:0,vy:0
 };
}
function resize(){
 const box=canvas.getBoundingClientRect();
 width=box.width;height=box.height;ratio=Math.min(devicePixelRatio||1,1.5);
 canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
 ctx.setTransform(ratio,0,0,ratio,0,0);
 const count=Math.round(Math.min(90,Math.max(28,width*height/16000)));
 while(particles.length<count)particles.push(spawn(true));
 particles.length=count;
 if(reduced)draw(0);
}
function draw(dt){
 ctx.clearRect(0,0,width,height);
 // Pointer parallax: near particles shift a little more than far ones.
 pointer.sx+=(pointer.tx-pointer.sx)*Math.min(1,dt*3);pointer.sy+=(pointer.ty-pointer.sy)*Math.min(1,dt*3);
 for(const p of particles){
  if(dt){
   // A slow flow field: each particle sways on its own sine path while rising.
   const flow=Math.sin(p.y*.006+time*.25+p.phase)*.6+Math.cos(p.x*.004-time*.18)*.4;
   p.x+=(flow*8*(.4+p.depth))*dt+p.vx*dt;p.y-=p.speed*dt-p.vy*dt;
   // Gentle push away from the cursor.
   const dx=p.x-pointer.x,dy=p.y-pointer.y,d2=dx*dx+dy*dy;
   if(d2<16000){const f=(1-d2/16000)*60;const d=Math.sqrt(d2)||1;p.vx+=dx/d*f*dt*4;p.vy+=dy/d*f*dt*4;}
   p.vx*=.94;p.vy*=.94;
   if(p.y<-20||p.x<-40||p.x>width+40)Object.assign(p,spawn(false));
  }
  const tw=.55+.45*Math.sin(time*p.twinkle+p.phase);
  const size=p.r*7;
  ctx.globalAlpha=p.alpha*tw;
  ctx.drawImage(p.sprite,p.x+pointer.sx*p.depth*18-size/2,p.y+pointer.sy*p.depth*12-size/2,size,size);
 }
 ctx.globalAlpha=1;
}
function frame(now){
 if(!running)return;
 const dt=last?Math.min(.05,(now-last)/1000):0;last=now;time+=dt;
 draw(dt);requestAnimationFrame(frame);
}
function update(){
 const should=!reduced&&visible&&!document.hidden;
 if(should&&!running){running=true;last=0;requestAnimationFrame(frame);}
 else if(!should)running=false;
}
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();}).observe(canvas);
document.addEventListener('visibilitychange',update);
if(fine)addEventListener('pointermove',e=>{
 const box=canvas.getBoundingClientRect();
 pointer.x=e.clientX-box.left;pointer.y=e.clientY-box.top;
 pointer.tx=e.clientX/innerWidth-.5;pointer.ty=e.clientY/innerHeight-.5;
 // A soft light follows the cursor; moved with transform so it never repaints the background.
 if(light)light.style.transform=`translate(${e.clientX-box.left}px,${e.clientY-box.top}px)`;
},{passive:true});
resize();update();
})();
