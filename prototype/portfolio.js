const filters=document.querySelectorAll('[data-filter]');
const projects=document.querySelectorAll('.archive-project');
const laptopAction=document.getElementById('laptop-action'),primaryAction=document.querySelector('.hero .primary');
const modeCopy={
 work:{button:'Bekijk mijn werk',headline:['CODE MET','KOFFIE'],href:'#work',label:'Bekijk mijn projecten'},
 cv:{button:'Bekijk mijn CV',headline:['MOATASEM','AL-REFAAI'],href:'assets/moatasem-cv.pdf',label:'Open mijn volledige CV als PDF'},
 contact:{button:'Stuur mij een e-mail',headline:['LATEN WE','PRATEN'],href:'mailto:career@mtsm.dev',label:'Stuur een e-mail naar career@mtsm.dev'}
};
function setLaptopMode(mode){
 const copy=modeCopy[mode];if(!copy)return;
 document.body.dataset.laptopMode=mode;
 document.querySelectorAll('[data-laptop-mode]').forEach(link=>{if(link.dataset.laptopMode===mode)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 for(const link of [laptopAction,primaryAction]){link.setAttribute('href',copy.href);link.setAttribute('aria-label',copy.label);if(mode==='cv'){link.target='_blank';link.rel='noopener';}else{link.removeAttribute('target');link.removeAttribute('rel');}}
 laptopAction.textContent=copy.label;
 primaryAction.textContent=copy.button;
 const heading=document.querySelector('.hero h1');
 const current=heading.dataset.mode;
 if(current!==mode){
  heading.replaceChildren(...copy.headline.map((text,index)=>{
   const line=document.createElement('span');line.className='line';
   const content=document.createElement('span');content.textContent=text;
   if(index===1){const dot=document.createElement('span');dot.className='dot';dot.textContent='.';content.append(dot);}
   line.append(content);return line;
  }));
  heading.dataset.mode=mode;
 }
 window.dispatchEvent(new CustomEvent('laptopmodechange',{detail:mode}));
}
let journeyFrame=null;
function stopJourney(){if(journeyFrame!==null)cancelAnimationFrame(journeyFrame);journeyFrame=null;}
function scrollToProjects(top,reduced){
 stopJourney();
 if(reduced){window.scrollTo({top,behavior:'instant'});return;}
 const from=window.scrollY,distance=top-from,start=performance.now(),duration=2000;
 function advance(now){
  const t=Math.min(1,(now-start)/duration),eased=t*t*(3-2*t);
  window.scrollTo({top:from+distance*eased,behavior:'instant'});
  journeyFrame=t<1?requestAnimationFrame(advance):null;
 }
 journeyFrame=requestAnimationFrame(advance);
}
// Give control back immediately when the visitor scrolls or starts another action.
window.addEventListener('wheel',stopJourney,{passive:true});
window.addEventListener('touchstart',stopJourney,{passive:true});
window.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))stopJourney();});
document.addEventListener('click',event=>{const link=event.target.closest('a');if(link&&link.getAttribute('href')!=='#work')stopJourney();});
// The portal translates the project section during the camera journey, so use
// its document position rather than its temporary visual position for anchors.
function enterProjects(){
 setLaptopMode('work');
 const journey=document.querySelector('.scroll-journey');
 const reduced=document.body.classList.contains('reduced')||document.body.classList.contains('no-webgl');
 const top=journey.offsetTop+journey.offsetHeight-(reduced?0:innerHeight);
 scrollToProjects(top,reduced);
 history.replaceState(null,'','#work');
}
document.querySelectorAll('a[href="#work"]').forEach(link=>{if(link===laptopAction||link===primaryAction)return;link.addEventListener('click',event=>{event.preventDefault();enterProjects();});});
for(const link of [laptopAction,primaryAction])link.addEventListener('click',event=>{if((document.body.dataset.laptopMode||'work')==='work'){event.preventDefault();enterProjects();}});
document.querySelectorAll('[data-laptop-mode]').forEach(link=>link.addEventListener('click',event=>{
 event.preventDefault();stopJourney();setLaptopMode(link.dataset.laptopMode);
 window.scrollTo({top:0,behavior:'instant'});
 history.replaceState(null,'',link.getAttribute('href'));
}));
setLaptopMode(location.hash==='#cv'?'cv':location.hash==='#contact'?'contact':'work');
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 let count=0;
 projects.forEach(project=>{const show=button.dataset.filter==='all'||project.dataset.category===button.dataset.filter;project.hidden=!show;if(show)count++;});
 document.querySelector('.filter-count').textContent=count+' projecten';
}));

