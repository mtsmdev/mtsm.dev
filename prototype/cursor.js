// A cursor that belongs to the site: a precise dot plus a trailing ring that reacts to what is under it
// (grows on links and buttons, shows "drag" over the laptop, squeezes on press). Mouse and pen only,
// so touch devices keep their native behaviour. Magnetic buttons lean a little toward the pointer.
(function(){
if(!matchMedia('(pointer: fine)').matches)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const root=document.documentElement;
const cursor=document.createElement('div');cursor.className='cursor';cursor.setAttribute('aria-hidden','true');
cursor.innerHTML='<span class="cursor-ring"><span class="cursor-label"></span></span><span class="cursor-dot"></span>';
document.body.append(cursor);
const ring=cursor.querySelector('.cursor-ring'),dot=cursor.querySelector('.cursor-dot'),label=cursor.querySelector('.cursor-label');
const pos={x:innerWidth/2,y:innerHeight/2},ringPos={x:pos.x,y:pos.y};
let running=false,last=0,state='',seen=false;
const labels={nl:{drag:'Sleep',open:'Open'},en:{drag:'Drag',open:'Open'},ar:{drag:'اسحب',open:'افتح'}};
const text=key=>(labels[window.i18n?.lang]||labels.nl)[key];
function setState(next){
 if(next===state)return;state=next;cursor.dataset.state=next;
 if(next==='text'){ringPos.x=pos.x;ringPos.y=pos.y;}
 label.textContent=next==='drag'?text('drag'):next==='open'?text('open'):'';
}
function stateFor(target){
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
 if(Math.abs(pos.x-ringPos.x)+Math.abs(pos.y-ringPos.y)>.1)requestAnimationFrame(frame);else running=false;
}
const wake=()=>{if(!running){running=true;last=0;requestAnimationFrame(frame);}};
addEventListener('pointermove',e=>{
 if(e.pointerType==='touch')return;
 pos.x=e.clientX;pos.y=e.clientY;
 if(!seen){seen=true;ringPos.x=pos.x;ringPos.y=pos.y;root.classList.add('has-cursor');}
 cursor.classList.add('visible');setState(stateFor(e.target));wake();
},{passive:true});
addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')cursor.classList.add('pressed');},{passive:true});
addEventListener('pointerup',()=>{cursor.classList.remove('pressed');setState(stateFor(document.elementFromPoint(pos.x,pos.y)));},{passive:true});
document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
document.documentElement.addEventListener('mouseleave',()=>cursor.classList.remove('visible'));
addEventListener('blur',()=>cursor.classList.remove('visible'));
// Body classes from the laptop (hover, grab) change the state without a pointer move.
new MutationObserver(()=>{if(seen)setState(stateFor(document.elementFromPoint(pos.x,pos.y)));}).observe(document.body,{attributes:true,attributeFilter:['class']});

// Magnetic buttons: lean toward the pointer, spring back on leave.
if(!reduced)for(const el of document.querySelectorAll('[data-magnetic]')){
 el.addEventListener('pointermove',e=>{
  const box=el.getBoundingClientRect(),x=(e.clientX-box.left-box.width/2)/box.width,y=(e.clientY-box.top-box.height/2)/box.height;
  el.style.translate=`${(x*10).toFixed(1)}px ${(y*8).toFixed(1)}px`;
 });
 el.addEventListener('pointerleave',()=>{el.style.translate='';});
}
})();
