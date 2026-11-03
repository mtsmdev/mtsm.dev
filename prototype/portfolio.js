const filters=document.querySelectorAll('[data-filter]');
const projects=document.querySelectorAll('.archive-project');
const laptopAction=document.getElementById('laptop-action'),primaryAction=document.querySelector('.hero .primary');
const modeLinks={work:'#work',cv:'assets/moatasem-cv.pdf',contact:'mailto:career@mtsm.dev'};
// Button, label and headline for a mode, in the current language (see i18n.js).
const copyFor=mode=>({...i18n.text().mode[mode],href:modeLinks[mode]});
// The last headline word cycles through what the code is made with, typed like in an editor.
// The final word is Ihsan, which gets an explanatory tooltip.
const wordsFor=()=>i18n.text().words.map((text,i,all)=>({text,tip:i===all.length-1}));
const ihsanTip=document.getElementById('ihsan-tip'),heroCopy=document.querySelector('.hero-copy');
let rotator=null;
function startRotator(word,delay,headlineWords){
 const wrap=word.parentElement;let index=0,timer=null,tipOpen=false,openedAt=0;
 const later=(ms,next)=>{clearTimeout(timer);timer=setTimeout(next,ms);};
 function placeTip(){
  const box=word.getBoundingClientRect(),copy=heroCopy.getBoundingClientRect();
  const left=Math.min(box.left,innerWidth-16-ihsanTip.offsetWidth)-copy.left;
  ihsanTip.style.left=Math.max(16-copy.left,left)+'px';ihsanTip.style.top=(box.bottom-copy.top+12)+'px';
 }
 function openTip(){if(!word.classList.contains('is-term'))return;clearTimeout(timer);tipOpen=true;openedAt=performance.now();placeTip();ihsanTip.classList.add('open');}
 function closeTip(resume=true){if(!tipOpen)return;tipOpen=false;ihsanTip.classList.remove('open');if(resume)later(1400,erase);}
 function markTerm(on){
  word.classList.toggle('is-term',on);
  if(on){word.tabIndex=0;word.setAttribute('aria-describedby','ihsan-tip');}
  else{word.removeAttribute('tabindex');word.removeAttribute('aria-describedby');}
 }
 function erase(){
  if(tipOpen)return;
  if(word.textContent===headlineWords[index].text){wrap.classList.add('typing');markTerm(false);}
  if(word.textContent.length){word.textContent=word.textContent.slice(0,-1);later(40+Math.random()*30,erase);}
  else{index=(index+1)%headlineWords.length;later(260,type);}
 }
 function type(){
  const target=headlineWords[index],typed=word.textContent;
  if(typed.length<target.text.length){word.textContent=target.text.slice(0,typed.length+1);later(75+Math.random()*80,type);return;}
  wrap.classList.remove('typing');markTerm(!!target.tip);later(target.tip?4500:2400,erase);
 }
 word.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openTip();});
 word.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')closeTip();});
 word.addEventListener('focus',openTip);word.addEventListener('blur',()=>closeTip());
 word.addEventListener('click',()=>{if(!tipOpen)openTip();else if(performance.now()-openedAt>400)closeTip();});
 word.addEventListener('keydown',e=>{if(e.key==='Escape')closeTip();});
 const outside=e=>{if(tipOpen&&e.target!==word)closeTip();};document.addEventListener('pointerdown',outside);
 const reposition=()=>{if(tipOpen)placeTip();};addEventListener('resize',reposition,{passive:true});
 later(delay,erase);
 return {stop(){clearTimeout(timer);closeTip(false);document.removeEventListener('pointerdown',outside);removeEventListener('resize',reposition);}};
}
function buildRotatingWord(content,headlineWords){
 const wrap=document.createElement('span');wrap.className='word-wrap';
 const word=document.createElement('span');word.className='word';word.textContent=headlineWords[0].text;
 const caret=document.createElement('span');caret.className='caret';caret.setAttribute('aria-hidden','true');
 wrap.append(word,caret);content.append(wrap);return word;
}
function whenIntroDone(run){
 if(!document.body.classList.contains('booting'))return run(900);
 const watch=new MutationObserver(()=>{if(!document.body.classList.contains('booting')){watch.disconnect();run(2600);}});
 watch.observe(document.body,{attributes:true,attributeFilter:['class']});
}
function setLaptopMode(mode,rebuild=false){
 if(!modeLinks[mode])return;const copy=copyFor(mode);
 document.body.dataset.laptopMode=mode;
 document.querySelectorAll('[data-laptop-mode]').forEach(link=>{if(link.dataset.laptopMode===mode)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 for(const link of [laptopAction,primaryAction]){link.setAttribute('href',copy.href);link.setAttribute('aria-label',copy.label);if(mode==='cv'){link.target='_blank';link.rel='noopener';}else{link.removeAttribute('target');link.removeAttribute('rel');}}
 laptopAction.textContent=copy.label;
 primaryAction.textContent=copy.button;
 const heading=document.querySelector('.hero h1');
 const current=heading.dataset.mode;
 if(current!==mode||rebuild){
  rotator?.stop();rotator=null;let rotatingWord=null;const words=wordsFor();
  const lines=mode==='work'?[copy.headline,null]:copy.headline;
  heading.replaceChildren(...lines.map((text,index)=>{
   const line=document.createElement('span');line.className='line';
   const content=document.createElement('span');
   if(index===1&&mode==='work')rotatingWord=buildRotatingWord(content,words);else content.textContent=text;
   if(index===1){const dot=document.createElement('span');dot.className='dot';dot.textContent='.';content.append(dot);}
   line.append(content);return line;
  }));
  heading.dataset.mode=mode;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(rotatingWord&&!reducedMotion)whenIntroDone(delay=>{if(rotatingWord.isConnected&&!rotator)rotator=startRotator(rotatingWord,delay,words);});
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
 updateCount(count);
}));
const counter=document.querySelector('.filter-count');
function updateCount(count){counter.textContent=i18n.plural(count,i18n.text().projects);}
updateCount(projects.length);
// Re-render script-made copy when the visitor switches language.
window.addEventListener('i18nchange',()=>{
 setLaptopMode(document.body.dataset.laptopMode||'work',true);
 updateCount([...projects].filter(p=>!p.hidden).length);
});

