const filters=document.querySelectorAll('[data-filter]');
const projects=document.querySelectorAll('.tl-project');
const laptopAction=document.getElementById('laptop-action'),primaryAction=document.querySelector('.hero .primary');
// The last headline word cycles through what the code is made with, typed like in an editor.
// "A>B" is the coffee joke: A is typed, struck through and shrunk, then B is typed after it.
// The final word is Ihsan, which gets an explanatory tooltip.
const wordsFor=()=>i18n.text().words.map((w,i,all)=>{const [text,then]=w.split('>');return {text,then,tip:i===all.length-1};});
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
 const typingDelay=()=>75+Math.random()*80;
 function erase(){
  if(tipOpen)return;
  wrap.classList.add('typing');markTerm(false);
  const after=word.querySelector('.after');
  if(after){// the joke: erase the second word, then let the struck one fade away
   if(after.textContent.length){after.textContent=after.textContent.slice(0,-1);later(40+Math.random()*30,erase);return;}
   word.querySelector('.struck')?.classList.add('gone');
   later(320,()=>{word.textContent='';index=(index+1)%headlineWords.length;later(200,type);});return;
  }
  if(word.textContent.length){word.textContent=word.textContent.slice(0,-1);later(40+Math.random()*30,erase);}
  else{index=(index+1)%headlineWords.length;later(260,type);}
 }
 function type(){
  const target=headlineWords[index],typed=word.textContent;
  if(typed.length<target.text.length){wrap.classList.add('typing');word.textContent=target.text.slice(0,typed.length+1);later(typingDelay(),type);return;}
  finishWord(target);
 }
 // A word is fully typed: strike it (the joke), or hold it and move on.
 function finishWord(target){
  if(target.then&&!word.querySelector('.struck')){
   wrap.classList.remove('typing');
   const struck=document.createElement('span');struck.className='struck';struck.textContent=word.textContent;
   const after=document.createElement('span');after.className='after';
   word.replaceChildren(struck,after);
   later(500,()=>{struck.classList.add('on');later(600,()=>{struck.classList.add('small');later(380,()=>typeAfter(target,after));});});
   return;
  }
  wrap.classList.remove('typing');markTerm(!!target.tip);later(target.tip?6000:3600,erase);
 }
 function typeAfter(target,after){
  if(after.textContent.length<target.then.length){wrap.classList.add('typing');after.textContent=target.then.slice(0,after.textContent.length+1);later(typingDelay(),()=>typeAfter(target,after));return;}
  wrap.classList.remove('typing');later(3800,erase);
 }
 word.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openTip();});
 word.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')closeTip();});
 word.addEventListener('focus',openTip);word.addEventListener('blur',()=>closeTip());
 word.addEventListener('click',()=>{if(!tipOpen)openTip();else if(performance.now()-openedAt>400)closeTip();});
 word.addEventListener('keydown',e=>{if(e.key==='Escape')closeTip();});
 const outside=e=>{if(tipOpen&&e.target!==word)closeTip();};document.addEventListener('pointerdown',outside);
 const reposition=()=>{if(tipOpen)placeTip();};addEventListener('resize',reposition,{passive:true});
 // The first word is already on the page: finish it (strike it if it's the joke) before cycling.
 later(delay,()=>finishWord(headlineWords[0]));
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
 if(reducedMotion&&words[0].then){
  const struck=document.createElement('span');struck.className='struck on small';struck.textContent=words[0].text;
  const after=document.createElement('span');after.className='after';after.textContent=words[0].then;
  rotatingWord.replaceChildren(struck,after);
 }
 if(!reducedMotion)whenIntroDone(delay=>{if(rotatingWord.isConnected&&!rotator)rotator=startRotator(rotatingWord,delay,words);});
}
let journeyFrame=null;
function stopJourney(){if(journeyFrame!==null)cancelAnimationFrame(journeyFrame);journeyFrame=null;}
function scrollToProjects(top,reduced,duration=2000){
 stopJourney();
 if(reduced){window.scrollTo({top,behavior:'instant'});return;}
 const from=window.scrollY,distance=top-from,start=performance.now();
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
laptopAction.addEventListener('click',event=>{event.preventDefault();enterProjects();});
// The main call to action goes all the way to the first project, through the journey and the morph.
function firstProject(){
 const card=document.querySelector('.tl-project:not([hidden]) .tl-card');if(!card)return enterProjects();
 const reduced=document.body.classList.contains('reduced')||document.body.classList.contains('no-webgl');
 const top=card.getBoundingClientRect().top+scrollY-(innerWidth<=760?96:124);
 scrollToProjects(top,reduced,2800);
 history.replaceState(null,'','#work');
}
primaryAction.addEventListener('click',event=>{event.preventDefault();firstProject();});
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
// Timeline items and years light up as they pass through the middle of the screen.
const lightUp=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('in-view',e.isIntersecting||e.boundingClientRect.top<0);},{rootMargin:'0px 0px -45% 0px'});
document.querySelectorAll('.tl-item,.tl-year').forEach(el=>lightUp.observe(el));

// The spine fades in a little before the first dot and runs on to the end of the last card (so the last
// dot rides the line until it stops), then fades out below it.
const timeline=document.querySelector('.timeline');
function placeSpine(){
 if(!timeline)return;
 const items=[...timeline.querySelectorAll('.tl-item')].filter(i=>i.offsetParent!==null);
 if(!items.length)return;
 const top=timeline.getBoundingClientRect().top;
 // A project dot's resting place is the top of its track (sticky moves it later); milestones are centred.
 const centre=item=>{const track=item.querySelector('.tl-track');if(track){const node=track.firstElementChild;return track.getBoundingClientRect().top+parseFloat(getComputedStyle(node).marginTop)+node.offsetHeight/2-top;}const b=item.querySelector('.tl-node').getBoundingClientRect();return b.top+b.height/2-top;};
 const fade=parseFloat(getComputedStyle(timeline).getPropertyValue('--spine-fade'))||80;
 timeline.style.setProperty('--spine-top',(centre(items[0])-fade).toFixed(1)+'px');
 const lastEnd=items[items.length-1].getBoundingClientRect().bottom-top;
 timeline.style.setProperty('--spine-bottom',(timeline.offsetHeight-lastEnd-fade).toFixed(1)+'px');
}
if(timeline){new ResizeObserver(placeSpine).observe(timeline);addEventListener('timelinechange',placeSpine);document.fonts?.ready.then(placeSpine);placeSpine();}

// Cards tilt a little toward the pointer, with the highlight following it.
if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 let tilted=null;
 const reset=card=>{card.style.transform='';};
 addEventListener('pointermove',event=>{
  const card=event.target instanceof Element?event.target.closest('.tl-card'):null;
  if(tilted&&tilted!==card){reset(tilted);tilted=null;}
  if(!card)return;
  const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width,y=(event.clientY-box.top)/box.height;
  const max=3;// big cards, so a small tilt
  card.style.setProperty('--mx',(x*100).toFixed(1)+'%');card.style.setProperty('--my',(y*100).toFixed(1)+'%');
  card.style.transform=`perspective(1100px) rotateX(${((.5-y)*max*1.6).toFixed(2)}deg) rotateY(${((x-.5)*max*2).toFixed(2)}deg)`;
  tilted=card;
 },{passive:true});
 document.addEventListener('pointerleave',()=>{if(tilted){reset(tilted);tilted=null;}});
}

// 'Print CV' in the dock: print.css turns the page into a CV.
document.querySelector('[data-print]')?.addEventListener('click',()=>print());

// Private repos: the link is an email asking for access, with the project and its repos filled in.
function privateLinks(){
 const mail=i18n.text().privateMail;
 for(const link of document.querySelectorAll('.tl-private[data-repos]')){
  const project=link.closest('.tl-card').querySelector('h3').textContent.trim();
  const fill=s=>s.replace('{project}',project).replace('{repos}',link.dataset.repos.split(' ').join('\n'));
  link.href=`mailto:career@mtsm.dev?subject=${encodeURIComponent(fill(mail.subject))}&body=${encodeURIComponent(fill(mail.body))}`;
 }
}
privateLinks();addEventListener('i18nchange',privateLinks);

// Copy buttons in the contact section: a short confirmation, announced to screen readers.
for(const button of document.querySelectorAll('[data-copy]')){
 const label=button.querySelector('span'),use=button.querySelector('use');label.setAttribute('aria-live','polite');
 button.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(button.dataset.copy);}catch{return;}
  label.textContent=i18n.text().copied;use.setAttribute('href','#i-check');button.classList.add('copied');
  clearTimeout(button._reset);button._reset=setTimeout(()=>{label.textContent=i18n.t('contact.actCopy');use.setAttribute('href','#i-copy');button.classList.remove('copied');},2000);
 });
}
