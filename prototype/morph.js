// The horizontal year ruler on the projects panel flows into the vertical timeline. The newest
// year's dot travels to the first project's dot, its label grows into the sticky year label, the
// other years fall away and the spine grows down from the landed dot. It is tied to the scroll
// position, so it scrubs both ways. Only runs while the panel rides the laptop journey.
(function(){
const panel=document.querySelector('.work-screen'),timeline=document.querySelector('.timeline'),journey=document.querySelector('.scroll-journey');
if(!panel||!timeline||!journey)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const firstYear=timeline.querySelector('.tl-year'),year=firstYear.dataset.year;
const srcItem=panel.querySelector(`.work-ruler li[data-year="${year}"]`);
if(!srcItem)return;
const srcDot=srcItem.querySelector('.ruler-dot'),srcLabel=srcItem.querySelector('.ruler-year');
const others=[...panel.querySelectorAll('.work-ruler li')].filter(li=>li!==srcItem);
const ruler=panel.querySelector('.work-ruler'),cue=panel.querySelector('.work-cue');
const tgtLabel=firstYear.querySelector('.tl-year-label');
const tgtDot=()=>firstYear.querySelector('.tl-item:not([hidden]) .tl-node');

const layer=document.createElement('div');layer.className='morph-layer';layer.setAttribute('aria-hidden','true');
const dot=document.createElement('span');dot.className='morph-dot';
const label=document.createElement('span');label.className='morph-year';label.textContent=year;
layer.append(dot,label);document.body.append(layer);
function copyLabelStyle(){
 const cs=getComputedStyle(tgtLabel);
 Object.assign(label.style,{fontFamily:cs.fontFamily,fontSize:cs.fontSize,fontWeight:cs.fontWeight,lineHeight:cs.lineHeight,letterSpacing:cs.letterSpacing});
}
copyLabelStyle();addEventListener('resize',copyLabelStyle,{passive:true});

const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const lerp=(a,b,t)=>a+(b-a)*t;
let active=false;
const chips=document.querySelector('.project-filters');
function setSources(opacity){srcDot.style.opacity=srcLabel.style.opacity=opacity;}
function setTargets(opacity){tgtLabel.style.opacity=opacity;const d=tgtDot();if(d)d.style.opacity=opacity;}
function falloff(q){
 const fade=1-smooth(0,.4,q);
 for(const li of others){li.style.opacity=fade.toFixed(3);li.style.translate=`0 ${(q*36).toFixed(1)}px`;}
 ruler.style.borderTopColor=`rgba(255,255,255,${(.13*fade).toFixed(3)})`;
 if(cue)cue.style.opacity=(1-smooth(0,.2,q)).toFixed(3);
}
// Back to the plain layout (no journey, a filter that hides the first year, or reduced motion).
function clear(){
 if(!active)return;active=false;layer.classList.remove('on');
 for(const el of [srcDot,srcLabel,tgtLabel,ruler,cue,...others])el?.removeAttribute('style');
 const d=tgtDot();if(d)d.style.opacity='';
 timeline.style.removeProperty('--line-reveal');copyLabelStyle();chips?.classList.add('chips-in');
}
function update(){
 queued=false;
 if(reduced||!document.body.classList.contains('journey-on')||firstYear.hidden||!tgtDot()){clear();return;}
 active=true;
 // From the hand-off at the end of the laptop journey until the year label's place reaches 28% down the viewport.
 const start=journey.offsetTop+journey.offsetHeight-innerHeight;
 const end=firstYear.getBoundingClientRect().top+scrollY-innerHeight*.28;
 const q=clamp((scrollY-start)/Math.max(1,end-start));
 falloff(q);
 // The filters rise in once the year has landed, and step back if you scroll up again.
 if(chips)chips.classList.toggle('chips-in',q>=.92);
 timeline.style.setProperty('--line-reveal',smooth(.6,1,q).toFixed(3));
 if(q<=0){layer.classList.remove('on');setSources('');setTargets('0');return;}
 if(q>=1){layer.classList.remove('on');setSources('0');setTargets('');return;}
 setSources('0');setTargets('0');layer.classList.add('on');
 const e=ease(q);
 const s=srcDot.getBoundingClientRect(),t=tgtDot().getBoundingClientRect();
 const size=lerp(s.width,t.width,e),cx=lerp(s.left+s.width/2,t.left+t.width/2,e),cy=lerp(s.top+s.height/2,t.top+t.height/2,e);
 dot.style.width=dot.style.height=size.toFixed(2)+'px';
 dot.style.transform=`translate(${(cx-size/2).toFixed(1)}px,${(cy-size/2).toFixed(1)}px)`;
 const sl=srcLabel.getBoundingClientRect(),tl=tgtLabel.getBoundingClientRect();
 const scale=lerp(sl.height/tl.height,1,e);
 label.style.transform=`translate(${lerp(sl.left,tl.left,e).toFixed(1)}px,${lerp(sl.top,tl.top,e).toFixed(1)}px) scale(${scale.toFixed(4)})`;
}
let queued=false;
const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});
addEventListener('timelinechange',queue);addEventListener('i18nchange',()=>{copyLabelStyle();queue();});
new MutationObserver(queue).observe(document.body,{attributes:true,attributeFilter:['class']});
queue();

// Filter chips rise in one after another, with a small turn, when they come into view.
if(chips&&!reduced){
 [...chips.children].forEach((chip,i)=>chip.style.setProperty('--i',i));
 chips.classList.add('chips-ready');
 // Without the journey (or once a filter hides the first year) the chips simply rise in when seen.
 new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!active)chips.classList.add('chips-in');},{threshold:.6}).observe(chips);
}
})();
