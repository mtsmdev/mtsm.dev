// The horizontal year ruler on the projects panel turns into the vertical timeline, in three steps:
// 1. the ruler line folds into the newest year's dot (the other years slide in with it and fade as they
//    crowd together) while that dot and its label slide sideways to the
//    timeline's column (the label growing into the big year label);
// 2. the dot holds its place while the timeline scrolls up underneath it;
// 3. when the real first dot arrives it takes over, and the vertical line draws down from it.
// Everything is tied to the scroll position, so it scrubs both ways. Runs only while the panel rides
// the laptop journey.
(function(){
const panel=document.querySelector('.work-screen'),timeline=document.querySelector('.timeline'),journey=document.querySelector('.scroll-journey');
if(!panel||!timeline||!journey)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const firstYear=timeline.querySelector('.tl-year'),year=firstYear.dataset.year;
const srcItem=panel.querySelector(`.work-ruler li[data-year="${year}"]`);
if(!srcItem)return;
const srcDot=srcItem.querySelector('.ruler-dot'),srcLabel=srcItem.querySelector('.ruler-year');
const ruler=panel.querySelector('.work-ruler'),cue=panel.querySelector('.work-cue');
// On phones the year label rises into the panel heading's place, so the heading makes way.
const heading=[panel.querySelector('h2'),panel.querySelector('.work-sub')].filter(Boolean);
const others=[...ruler.children].filter(li=>li!==srcItem),otherDots=others.map(li=>li.querySelector('.ruler-dot'));
const tgtLabel=firstYear.querySelector('.tl-year-label');
const tgtItem=()=>firstYear.querySelector('.tl-item:not([hidden])');

const layer=document.createElement('div');layer.className='morph-layer';layer.setAttribute('aria-hidden','true');
const dot=document.createElement('span');dot.className='morph-dot';
const label=document.createElement('span');label.className='morph-year';label.textContent=year;
layer.append(dot,label);document.body.append(layer);
function copyLabelStyle(){
 const cs=getComputedStyle(tgtLabel);
 Object.assign(label.style,{fontFamily:cs.fontFamily,fontSize:cs.fontSize,fontWeight:cs.fontWeight,lineHeight:cs.lineHeight,letterSpacing:cs.letterSpacing});
}
copyLabelStyle();

const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const lerp=(a,b,t)=>a+(b-a)*t;
let active=false,lastAway='0';
const chips=document.querySelector('.project-filters');

// Where the first dot sits in the page. Its track does not stick, so this ignores sticky offsets.
function targetDot(){
 const item=tgtItem();if(!item)return null;
 const node=item.querySelector('.tl-node'),track=item.querySelector('.tl-track');
 if(!track){const b=node.getBoundingClientRect();return {node,x:b.left+b.width/2,y:b.top+b.height/2,size:node.offsetWidth,stickyY:-Infinity};}
 const t=track.getBoundingClientRect(),cs=getComputedStyle(node);
 return {node,x:t.left+t.width/2,y:t.top+parseFloat(cs.marginTop)+node.offsetHeight/2,size:node.offsetWidth,stickyY:cs.position==='sticky'?parseFloat(cs.top)+node.offsetHeight/2:-Infinity};
}
// The ruler dot and its label, from layout offsets so the folding (a transform) does not distort them.
function source(){
 const li=srcItem,frame=ruler.offsetParent.getBoundingClientRect();
 const ox=li.offsetLeft+srcDot.offsetLeft+srcDot.offsetWidth/2,oy=li.offsetTop+srcDot.offsetTop+srcDot.offsetHeight/2;
 return {originX:ox,x:frame.left+ruler.offsetLeft+ox,y:frame.top+ruler.offsetTop+oy,size:srcDot.offsetWidth,
  rel:{x:li.offsetLeft+srcLabel.offsetLeft-ox,y:li.offsetTop+srcLabel.offsetTop-oy},fontSize:parseFloat(getComputedStyle(srcLabel).fontSize)};
}
function setSources(o){srcDot.style.opacity=srcLabel.style.opacity=o;}
function setTargets(o,node,label=o){tgtLabel.style.opacity=label;if(node)node.style.opacity=o;}
function clear(){
 if(!active)return;active=false;layer.classList.remove('on');
 for(const el of [srcDot,srcLabel,tgtLabel,ruler,cue,...others,...heading])el?.removeAttribute('style');lastAway='0';
 const t=targetDot();if(t)t.node.style.opacity='';
 timeline.style.removeProperty('--line-reveal');copyLabelStyle();chips?.classList.add('chips-in');
}
function update(){
 queued=false;
 const tgt=reduced||!document.body.classList.contains('journey-on')||firstYear.hidden?null:targetDot();
 if(!tgt){clear();return;}
 active=true;
 const H=innerHeight,narrow=innerWidth<=760,start=journey.offsetTop+journey.offsetHeight-H,d=scrollY-start;
 const lr=tgtLabel.getBoundingClientRect(),yr=firstYear.getBoundingClientRect();
 // The label's resting place (it is sticky on wide screens): the top of its year group, same column.
 const labelRel={x:lr.left-tgt.x,y:yr.top-tgt.y};
 // The hold line: where the real dot will be when it takes over (its sticky spot, or low enough
 // that a non-sticky label above it is still on screen).
 const holdY=Math.max(tgt.stickyY,-labelRel.y+16);
 const src=source();
 // Step 1 runs over the first stretch of scrolling after the hand-off (shorter if the timeline is close).
 // On phones it takes almost the whole way, so the label grows gradually instead of all at once.
 const total=tgt.y+Math.max(0,d)-holdY,span=Math.max(80,narrow?tgt.y+Math.max(0,d)-H*.45:Math.min(H*.42,total*.8));// on phones: until the real dot has lit up (45% down)
 const a=clamp(d/span),fold=smooth(0,.55,a),move=narrow?smooth(0,1,a):ease(smooth(.25,1,a));
 // The filter chips rise in once the year label has landed in its column, or as they reach the label's
 // height, whichever comes first; scrolling back up sends them away again.
 // On phones they show as soon as they are in view, so it is clear early on that they can be tapped.
 if(chips&&!reduced&&narrow)chips.classList.toggle('chips-in',chips.getBoundingClientRect().top<H*.92);
 else if(chips&&!reduced){const labelBottom=Math.max(src.y,holdY)+lerp(src.rel.y,labelRel.y,move)+lr.height;chips.classList.toggle('chips-in',a>=.95||chips.getBoundingClientRect().top<=labelBottom);}
 // Step 3: once the real dot reaches the hold line, the line draws down over the next stretch.
 timeline.style.setProperty('--line-reveal',clamp(narrow?(d-span)/(H*.6):(holdY-tgt.y)/(H*.6)).toFixed(3));
 // Step 1, the ruler: everything folds into the dot; the other years and the hint fade.
 // Only the line is scaled; the other years and their markers slide in at full size (never squashed) and
 // fade as they close in on each other.
 ruler.style.setProperty('--fold-x',src.originX.toFixed(1)+'px');
 ruler.style.setProperty('--line-scale',(1-fold).toFixed(4));
 ruler.style.setProperty('--line-alpha',(1-smooth(.5,1,fold)).toFixed(3));
 const left=1-fold,crowd=smooth(.3,.75,left);
 others.forEach((li,i)=>{
  const dot=otherDots[i],dx=src.originX-(li.offsetLeft+dot.offsetLeft+dot.offsetWidth/2);
  li.style.transform=fold?`translateX(${(dx*fold).toFixed(1)}px)`:'';
  li.style.opacity=fold?Math.min(crowd,clamp(Math.abs(dx)*left/48)).toFixed(3):'';
 });
 if(cue)cue.style.opacity=(1-smooth(0,.2,a)).toFixed(3);
 const away=narrow?smooth(.1,.55,a).toFixed(3):'0';
 if(away!==lastAway){lastAway=away;for(const el of heading){el.style.opacity=away==='0'?'':1-away;el.style.transform=away==='0'?'':`translateY(${(-28*away).toFixed(1)}px)`;}}
 // On phones the year label is simply part of the timeline; only the dot travels.
 const targetLabel=narrow?'':'0';
 if(d<=0){layer.classList.remove('on');setSources('');setTargets('0',tgt.node,targetLabel);return;}
 if(narrow?a>=1:tgt.y<=holdY){layer.classList.remove('on');setSources('0');setTargets('',tgt.node);return;}
 setSources('0');setTargets('0',tgt.node,targetLabel);layer.classList.add('on');
 label.style.visibility=narrow?'hidden':'';
 if(narrow)srcLabel.style.opacity=(1-smooth(0,.3,a)).toFixed(3);
 // Step 2, the travelling dot: sideways during step 1, riding up with the page until the hold line.
 // On phones it goes straight to the real dot instead of holding.
 const x=lerp(src.x,tgt.x,move),y=narrow?lerp(src.y,tgt.y,move):Math.max(src.y,holdY),size=lerp(src.size,tgt.size,move);
 dot.style.width=dot.style.height=size.toFixed(2)+'px';
 dot.style.transform=`translate(${(x-size/2).toFixed(1)}px,${(y-size/2).toFixed(1)}px)`;
 // Its label moves from under the ruler dot to beside the timeline dot, growing as it goes.
 const relX=lerp(src.rel.x,labelRel.x,move),relY=lerp(src.rel.y,labelRel.y,move),scale=lerp(src.fontSize/parseFloat(label.style.fontSize),1,move);
 label.style.transform=`translate(${(x+relX).toFixed(1)}px,${(y+relY).toFixed(1)}px) scale(${scale.toFixed(4)})`;
}
let queued=false;
const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{copyLabelStyle();queue();},{passive:true});
addEventListener('timelinechange',queue);addEventListener('i18nchange',()=>{copyLabelStyle();queue();});
new MutationObserver(queue).observe(document.body,{attributes:true,attributeFilter:['class']});
queue();

// Filter chips rise in one after another, with a small turn, as soon as they come into view.
if(chips&&!reduced){
 [...chips.children].forEach((chip,i)=>chip.style.setProperty('--i',i));
 chips.classList.add('chips-ready');
 // Without the journey they simply rise in when they come into view.
 new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!active)chips.classList.add('chips-in');},{threshold:.3}).observe(chips);
}
})();
