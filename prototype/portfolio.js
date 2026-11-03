const filters=document.querySelectorAll('[data-filter]');
const projects=document.querySelectorAll('.tl-project');
const laptopAction=document.getElementById('laptop-action'),primaryAction=document.querySelector('.hero .primary');
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
  const rtl=document.documentElement.dir==='rtl',start=rtl?box.right-ihsanTip.offsetWidth:box.left;// align with the word's reading start
  const left=Math.min(start,innerWidth-16-ihsanTip.offsetWidth)-copy.left;
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
// The headline is visible from the first paint, so the word starts cycling once its entrance has played.
let introPlayed=false;
function whenIntroDone(run){
 if(introPlayed)return run(900);
 introPlayed=true;run(2400);
}
// Hero headline and button labels in the current language.
function renderHero(){
 const copy=i18n.text().hero;
 laptopAction.textContent=copy.label;laptopAction.setAttribute('aria-label',copy.label);
 primaryAction.querySelector('.btn-label').textContent=copy.button;
 const heading=document.querySelector('.hero h1');
 rotator?.stop();rotator=null;let rotatingWord=null;const words=wordsFor();
 heading.replaceChildren(...[copy.headline,null].map((text,index)=>{
  const line=document.createElement('span');line.className='line';
  const content=document.createElement('span');
  if(index===1){rotatingWord=buildRotatingWord(content,words);const dot=document.createElement('span');dot.className='dot';dot.textContent='.';content.append(dot);}
  else content.textContent=text;
  line.append(content);return line;
 }));
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reducedMotion)whenIntroDone(delay=>{if(rotatingWord.isConnected&&!rotator)rotator=startRotator(rotatingWord,delay,words);});
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
 const journey=document.querySelector('.scroll-journey');
 const reduced=document.body.classList.contains('reduced')||document.body.classList.contains('no-webgl');
 const top=journey.offsetTop+journey.offsetHeight-(reduced?0:innerHeight);
 scrollToProjects(top,reduced);
 history.replaceState(null,'','#work');
}
document.querySelectorAll('a[href="#work"]').forEach(link=>{if(link===laptopAction||link===primaryAction)return;link.addEventListener('click',event=>{event.preventDefault();enterProjects();});});
for(const link of [laptopAction,primaryAction])link.addEventListener('click',event=>{event.preventDefault();enterProjects();});
renderHero();
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 // Projects can belong to several categories; milestones only show on the full timeline.
 const filter=button.dataset.filter;
 projects.forEach(project=>{project.hidden=!(filter==='all'||project.dataset.category.split(' ').includes(filter));});
 document.querySelectorAll('.tl-milestone').forEach(m=>{m.hidden=filter!=='all';});
 document.querySelectorAll('.tl-year').forEach(year=>{year.hidden=!year.querySelector('.tl-item:not([hidden])');});
 window.dispatchEvent(new CustomEvent('timelinechange'));
}));
// Re-render script-made copy when the visitor switches language.
window.addEventListener('i18nchange',renderHero);


// Dock: highlight the section in view. The projects section is pinned during the laptop journey,
// so it counts as active only once the journey has (nearly) finished.
const dockItems=[...document.querySelectorAll('.dock-item[data-section]')];
const journeyEl=document.querySelector('.scroll-journey'),aboutEl=document.getElementById('about'),contactEl=document.getElementById('contact');
let spyQueued=false;
function spy(){
 spyQueued=false;
 const probe=scrollY+innerHeight*.45,journeyEnd=journeyEl.offsetTop+journeyEl.offsetHeight-innerHeight;
 const active=probe>=contactEl.offsetTop||innerHeight+scrollY>=document.documentElement.scrollHeight-4?'contact':probe>=aboutEl.offsetTop?'about':scrollY>=journeyEnd-innerHeight*.25?'work':'top';
 for(const item of dockItems){if(item.dataset.section===active)item.setAttribute('aria-current','true');else item.removeAttribute('aria-current');}
}
addEventListener('scroll',()=>{if(!spyQueued){spyQueued=true;requestAnimationFrame(spy);}},{passive:true});
addEventListener('resize',spy,{passive:true});spy();
// Dock 'Start' returns to the top of the hero.
document.querySelector('.dock-item[data-section=top]')?.addEventListener('click',event=>{event.preventDefault();stopJourney();scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});history.replaceState(null,'',location.pathname+location.search);});
// Cards light up where the pointer is (a radial highlight that follows it).
document.querySelector('.timeline')?.addEventListener('pointermove',event=>{
 const card=event.target.closest('.tl-card');if(!card||event.pointerType==='touch')return;
 const box=card.getBoundingClientRect();
 card.style.setProperty('--mx',((event.clientX-box.left)/box.width*100).toFixed(1)+'%');
 card.style.setProperty('--my',((event.clientY-box.top)/box.height*100).toFixed(1)+'%');
},{passive:true});

// Timeline items and years light up as they pass through the middle of the screen.
const lightUp=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('in-view',e.isIntersecting||e.boundingClientRect.top<0);},{rootMargin:'0px 0px -45% 0px'});
document.querySelectorAll('.tl-item,.tl-year').forEach(el=>lightUp.observe(el));
