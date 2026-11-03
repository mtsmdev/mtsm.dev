// A cursor that belongs to the site: a precise dot plus a trailing ring that reacts to what is under it
// (grows on links and buttons, shows "drag" over the laptop, squeezes on press). Mouse and pen only,
// so touch devices keep their native behaviour. Magnetic buttons (the hero's calls to action) swallow it.
(function(){
if(!matchMedia('(pointer: fine)').matches)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const root=document.documentElement;
const cursor=document.createElement('div');cursor.className='cursor';cursor.setAttribute('aria-hidden','true');
cursor.innerHTML='<span class="cursor-ring"><span class="cursor-label"></span></span><span class="cursor-dot"></span>';
document.body.append(cursor);
const ring=cursor.querySelector('.cursor-ring'),dot=cursor.querySelector('.cursor-dot'),label=cursor.querySelector('.cursor-label');
const pos={x:innerWidth/2,y:innerHeight/2},ringPos={x:pos.x,y:pos.y};
let running=false,last=0,state='',seen=false,eaten=null;
const labels={nl:{drag:'Sleep',open:'Open'},en:{drag:'Drag',open:'Open'},ar:{drag:'اسحب',open:'افتح'}};
const text=key=>(labels[window.i18n?.lang]||labels.nl)[key];
function setState(next){
 if(next===state)return;state=next;cursor.dataset.state=next;
 if(next==='text'){ringPos.x=pos.x;ringPos.y=pos.y;}
 label.textContent=next==='drag'?text('drag'):next==='open'?text('open'):'';
}
function stateFor(target){
 if(eaten)return 'eaten';
 if(document.body.classList.contains('grabbing'))return 'grabbing';
 if(document.body.classList.contains('over-laptop'))return 'drag';
 if(!(target instanceof Element))return '';
 if(target.closest('.tl-visual'))return 'open';
 if(target.closest('a,button,summary,[role=button],.tl-private'))return 'link';
 if(target.closest('p,h1,h2,h3,li,figcaption')&&getComputedStyle(target).userSelect!=='none')return 'text';
 return '';
}
function frame(now){
 const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;
 // The ring trails the dot with frame-rate-independent easing, except over text: there it is the
 // insertion bar and must sit exactly where a click or a selection will start.
 const k=reduced||state==='text'?1:1-Math.exp(-dt*18);
 ringPos.x+=(pos.x-ringPos.x)*k;ringPos.y+=(pos.y-ringPos.y)*k;
 dot.style.transform=`translate3d(${pos.x}px,${pos.y}px,0)`;
 ring.style.transform=`translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
 const trapping=eaten?moveTrap(eaten,dt):false;
 if(trapping||Math.abs(pos.x-ringPos.x)+Math.abs(pos.y-ringPos.y)>.1)requestAnimationFrame(frame);else running=false;
}
const wake=()=>{if(!running){running=true;last=0;requestAnimationFrame(frame);}};
addEventListener('pointermove',e=>{
 if(e.pointerType==='touch')return;
 pos.x=e.clientX;pos.y=e.clientY;
 if(!seen){seen=true;ringPos.x=pos.x;ringPos.y=pos.y;root.classList.add('has-cursor');}
  attract(e.target);
 cursor.classList.add('visible');setState(stateFor(e.target));wake();
},{passive:true});
addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')cursor.classList.add('pressed');},{passive:true});
addEventListener('pointerup',()=>{cursor.classList.remove('pressed');setState(stateFor(document.elementFromPoint(pos.x,pos.y)));},{passive:true});
document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
document.documentElement.addEventListener('mouseleave',()=>cursor.classList.remove('visible'));
addEventListener('blur',()=>cursor.classList.remove('visible'));
// Body classes from the laptop (hover, grab) change the state without a pointer move.
new MutationObserver(()=>{if(seen)setState(stateFor(document.elementFromPoint(pos.x,pos.y)));}).observe(document.body,{attributes:true,attributeFilter:['class']});

// Magnetic buttons swallow the cursor. Close by, the button leans out toward the pointer; over it, the
// cursor disappears into the button and lives on as a small trapped ring that chases the pointer around
// inside, stretching as it goes; on leaving, the cursor escapes from where that ring was.
function attract(target){
 const hovered=target instanceof Element?target.closest('[data-magnetic]'):null;
 for(const el of magnets){
  const parent=el.offsetParent;if(!parent)continue;
  const p=parent.getBoundingClientRect(),left=p.left+el.offsetLeft,top=p.top+el.offsetTop,w=el.offsetWidth,h=el.offsetHeight;// untranslated box
  const dist=Math.hypot(pos.x-Math.min(Math.max(pos.x,left),left+w),pos.y-Math.min(Math.max(pos.y,top),top+h));
  const pull=Math.max(0,1-dist/70),nx=Math.max(-1,Math.min(1,(pos.x-left-w/2)/(w/2))),ny=Math.max(-1,Math.min(1,(pos.y-top-h/2)/(h/2)));
  const lean=pull?`${(nx*12*pull).toFixed(1)}px ${(ny*9*pull).toFixed(1)}px`:'';
  if(el.style.translate!==lean)el.style.translate=lean;
  const v=el.getBoundingClientRect(),inside=dist===0||hovered===el||(pos.x>=v.left&&pos.x<=v.right&&pos.y>=v.top&&pos.y<=v.bottom);// leaning out, it can grab the cursor
  if(inside&&eaten!==el)swallow(el);else if(!inside&&eaten===el)release(el);
 }
}
function swallow(el){
 if(eaten)release(eaten);eaten=el;
 const box=el.getBoundingClientRect();el._trap.x=pos.x-box.left;el._trap.y=pos.y-box.top;el._trap.el.classList.add('on');
}
function release(el){
 const box=el.getBoundingClientRect();
 ringPos.x=box.left+el._trap.x;ringPos.y=box.top+el._trap.y;// the cursor escapes from the trapped ring
 el._trap.el.classList.remove('on');eaten=null;
}
function moveTrap(el,dt){
 const trap=el._trap,box=el.getBoundingClientRect(),r=16;
 const tx=Math.min(Math.max(pos.x-box.left,r),box.width-r),ty=Math.min(Math.max(pos.y-box.top,r),box.height-r);
 const k=1-Math.exp(-dt*9),lx=tx-trap.x,ly=ty-trap.y;trap.x+=lx*k;trap.y+=ly*k;
 const lag=Math.hypot(lx,ly),stretch=Math.min(.45,lag/50),angle=Math.atan2(ly,lx);
 trap.el.style.transform=`translate(${trap.x.toFixed(1)}px,${trap.y.toFixed(1)}px) rotate(${angle.toFixed(3)}rad) scale(${(1+stretch).toFixed(3)},${(1-stretch*.55).toFixed(3)})`;
 return lag>.1;
}
const magnets=reduced?[]:[...document.querySelectorAll('[data-magnetic]')];
for(const el of magnets){
 const ring=document.createElement('span');ring.className='btn-trapped';ring.setAttribute('aria-hidden','true');el.append(ring);
 el._trap={el:ring,x:0,y:0};
 // When the lean settles, the button may now be under a pointer that has not moved.
 el.addEventListener('transitionend',e=>{if(e.propertyName==='translate'&&seen){attract(document.elementFromPoint(pos.x,pos.y));setState(stateFor(document.elementFromPoint(pos.x,pos.y)));wake();}});
}
addEventListener('scroll',()=>{if(seen&&magnets.length){attract(document.elementFromPoint(pos.x,pos.y));setState(stateFor(document.elementFromPoint(pos.x,pos.y)));wake();}},{passive:true});
})();
