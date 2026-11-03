// Page translations. Dutch is the source language and is read from the HTML itself,
// so only the other languages live here. Elements opt in with data-i18n (inner HTML),
// data-i18n-label (aria-label) and data-i18n-alt (alt text). innerHTML is safe here: it only
// ever receives the static strings in this file or the page's own original markup.
(function(){
const strings={
 en:{
  'meta.title':'Moatasem Al-Refaai — Software developer',
  'meta.description':'Portfolio of Moatasem Al-Refaai, software developer. Web apps, Android apps and UI/UX, from frontend to API.',
  'lang.label':'Choose language',
  'brand.label':'Moatasem Al-Refaai, back to top',
  'nav.label':'Main navigation','nav.work':'Projects','nav.cv':'My CV','nav.contact':'Contact',
  'hero.label':'Introduction',
  'hero.ihsan':'<strong>Ihsan</strong> <span lang="ar">(إحسان)</span> is Arabic for doing something as well as you possibly can, with care and attention, even when no one is watching. That’s how I like to build.',
  'hero.intro':'Hi, I’m Moatasem. I build web apps that work well and feel good to use, from frontend to API.',
  'hero.annotation':'<span class="status-light"></span>MY WORKSPACE / XPS 15 9500<div class="fine">VS CODE · TYPESCRIPT · LOTS OF COFFEE</div>',
  'laptop.label':'My Dell XPS 15 9500. The lid opens by itself. Scroll to bring the laptop to the centre and see my projects through its screen.',
  'work.eyebrow':'PROJECTS','work.platforms':'WEB · MOBILE · DESKTOP',
  'work.title':'SELECTED<br><span>WORK.</span>',
  'work.intro':'A few projects I’m proud of, from an energy simulator to a social platform. For each one you’ll see what it does and what it’s built with.',
  'case.tech':'Technology used',
  'link.demo':'Live demo ↗','link.website':'Website ↗','link.ghFrontend':'GitHub: frontend ↗','link.ghBackend':'GitHub: backend ↗',
  'case1.kind':'WEB APP',
  'case1.lead':'What changes when you use energy more cleverly?',
  'case1.body':'Simulate solar panels, a home battery, EV charging and hot water in one dashboard. You see straight away what the weather, your settings and your schedule do to the energy flows and your savings.',
  'case1.f1':'Solar panels, home battery, EV and hot water in one simulation',
  'case1.f2':'See right away what weather and planning do',
  'case1.f3':'Built with Codex through agentic coding',
  'case1.open':'Open the ThermaVoltFlow demo',
  'case1.alt':'Screenshot of the ThermaVoltFlow dashboard with the energy simulation.',
  'case1.caption':'Screenshot from the GitHub repo',
  'case2.kind':'WEB + ANDROID',
  'case2.lead':'A social platform, from UI to backend.',
  'case2.body':'A web and Android app with accounts, profiles, chat, reactions and groups. Built with React, Firebase, React Query and Cloudflare Workers.',
  'case2.backendLabel':'THE BACKEND',
  'case2.backend':'I also built a separate backend in Java Spring Boot, with PostgreSQL, a REST API, Flyway migrations, Redis, OpenAPI and Docker.',
  'case2.open':'Open Amposter',
  'case2.altWeb':'Amposter web app with timeline, messages and groups.',
  'case2.altChat':'Chat screen in the Amposter Android app.',
  'case2.altProfile':'Profile screen in the Amposter Android app.',
  'case2.phones':'From web<br>to Android.<small>React · Firebase · Java</small>',
  'case2.caption':'Web and Android · screenshots from my CV',
  'archive.eyebrow':'MORE PROJECTS','archive.title':'Smaller projects and coursework.',
  'filters.label':'Filter projects',
  'filter.all':'All <span>8</span>','filter.web':'Web <span>3</span>','filter.mobile':'Mobile <span>2</span>','filter.desktop':'Desktop <span>3</span>',
  'kind.desktop':'DESKTOP','kind.webDesktop':'WEB + DESKTOP','kind.multiplayer':'MULTIPLAYER','kind.quiz':'QUIZ','kind.mobile':'MOBILE','kind.web':'WEB',
  'p03.body':'A Windows app that fetches prayer times in the background and plays a sound notification right on time. With local caching, error handling and logging.',
  'p04.name':'Charge Point Manager<small>Angular · TypeScript · Spring Boot</small>',
  'p04.body':'Study project for managing EV charge points: an Angular frontend with login, sign-up, screens for users and admins and an overview of locations. Runs on a Spring Boot REST API, with a JavaFX client next to it.',
  'p05.body':'Multiplayer Monopoly, built with a team of four. In the JavaFX app you take turns, buy streets and pay rent. Firestore keeps the game state in sync between players.',
  'p06.name':'Sorting Hat<small>Python · Pygame</small>',
  'p06.body':'A quiz that helps students choose a specialisation. Fully usable with the keyboard, with a result at the end.',
  'p07.body':'Android app for looking up E-numbers, with an explanation of each ingredient, a colour code and light and dark mode.',
  'p08.body':'Android learning project: tick off fixed daily tasks and earn points. With light and dark mode.',
  'p09.body':'Fan site about the game, with a demo web shop and an overview of vehicles, maps and variants.',
  'p10.name':'Restaurant web app<small>HTML · CSS · JavaScript</small>',
  'p10.body':'Study project: a menu with search, favourites and an ordering flow with a simulated payment.',
  'about.eyebrow':'ABOUT ME',
  'about.title':'Curious.<br><em>With an eye for the user.</em>',
  'about.body':'I’m Moatasem Al-Refaai, a software developer. I mostly work with TypeScript frameworks and have a soft spot for UI/UX. I build multilingual interfaces that work in both reading directions (LTR and RTL), and I’m just as happy digging into APIs and databases. Right now I spend a lot of time on agentic coding.',
  'about.workLabel':'EXPERIENCE','about.work':'Freelance software developer<br>Nov 2025 – present',
  'about.eduLabel':'EDUCATION','about.eduName':'Software Engineering','about.edu':'Leiden University of Applied Sciences<br>Sep 2021 – Jun 2025',
  'about.langLabel':'LANGUAGES','about.langs':'Dutch · English · Arabic','about.langNote':'Which is why I also build interfaces that read right to left.',
  'about.cvLink':'CV (PDF) ↗',
  'footer.eyebrow':'WANT TO WORK TOGETHER?','footer.cta':'LET’S BUILD<br>SOMETHING<span>↗</span>','footer.name':'MOATASEM AL-REFAAI'
 }
};
// Copy that scripts render (buttons, headline, counters), in every language.
const scriptStrings={
 nl:{
  mode:{
   work:{button:'Bekijk mijn werk',headline:'CODE MET',label:'Bekijk mijn projecten'},
   cv:{button:'Bekijk mijn CV',headline:['MOATASEM','AL-REFAAI'],label:'Open mijn volledige CV als PDF'},
   contact:{button:'Mail mij',headline:['LATEN WE','PRATEN'],label:'Stuur een e-mail naar career@mtsm.dev'}
  },
  words:['KOFFIE','THEE','CHOCOMELK','IHSAN'],
  projects:{one:'# project',other:'# projecten'}
 },
 en:{
  mode:{
   work:{button:'View my work',headline:'CODE WITH',label:'View my projects'},
   cv:{button:'View my CV',headline:['MOATASEM','AL-REFAAI'],label:'Open my full CV as a PDF'},
   contact:{button:'Email me',headline:['LET’S','TALK'],label:'Send an email to career@mtsm.dev'}
  },
  words:['COFFEE','TEA','COCOA','IHSAN'],
  projects:{one:'# project',other:'# projects'}
 }
};
const supported=Object.keys(scriptStrings);
const dutch={};
const root=document.documentElement;
let current='nl';
function capture(){
 dutch['meta.title']=document.title;
 dutch['meta.description']=document.querySelector('meta[name=description]')?.content||'';
 for(const el of document.querySelectorAll('[data-i18n]'))dutch[el.dataset.i18n]??=el.innerHTML;
 for(const el of document.querySelectorAll('[data-i18n-label]'))dutch[el.dataset.i18nLabel]??=el.getAttribute('aria-label');
 for(const el of document.querySelectorAll('[data-i18n-alt]'))dutch[el.dataset.i18nAlt]??=el.getAttribute('alt');
}
const t=key=>(current==='nl'?dutch[key]:strings[current]?.[key])??dutch[key]??'';
function apply(lang){
 if(!supported.includes(lang))lang='nl';
 current=lang;root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
 document.title=t('meta.title');
 document.querySelector('meta[name=description]')?.setAttribute('content',t('meta.description'));
 for(const el of document.querySelectorAll('[data-i18n]'))el.innerHTML=t(el.dataset.i18n);
 for(const el of document.querySelectorAll('[data-i18n-label]'))el.setAttribute('aria-label',t(el.dataset.i18nLabel));
 for(const el of document.querySelectorAll('[data-i18n-alt]'))el.setAttribute('alt',t(el.dataset.i18nAlt));
 for(const link of document.querySelectorAll('[data-lang]'))link.setAttribute('aria-current',String(link.dataset.lang===lang));
 const code=document.querySelector('.lang-current');if(code)code.textContent=lang.toUpperCase();
 window.dispatchEvent(new CustomEvent('i18nchange',{detail:lang}));
}
function choose(lang){
 try{localStorage.setItem('lang',lang);}catch{}
 const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);
 apply(lang);
}
capture();
// The inline script in <head> already picked the language, so the first paint uses the right direction.
const initial=supported.includes(root.lang)?root.lang:'nl';
if(initial!=='nl')apply(initial);else{root.lang='nl';root.dir='ltr';}
current=initial;
window.i18n={
 get lang(){return current;},
 t,
 text:()=>scriptStrings[current],
 plural(n,forms){const rule=new Intl.PluralRules(current).select(n);return (forms[rule]||forms.other).replace('#',n);},
 choose
};
// Language menu: switch in place, close on outside click or Escape.
const menu=document.querySelector('.lang-menu');
if(menu){
 menu.addEventListener('click',e=>{const link=e.target.closest('[data-lang]');if(!link)return;e.preventDefault();menu.open=false;if(link.dataset.lang!==current)choose(link.dataset.lang);});
 document.addEventListener('pointerdown',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false;});
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
}
})();
