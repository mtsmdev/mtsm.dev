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
  'hero.name':'Moatasem Al-Refaai','hero.role':'Software developer · UI/UX',
  'tabs.label':'What the laptop shows','tabs.work':'Projects','tabs.cv':'My CV','tabs.contact':'Contact','tabs.hint':'Drag to spin',
  'dock.label':'Jump to','dock.home':'Home','dock.work':'Work','dock.about':'About','dock.contact':'Contact','dock.cv':'CV',
  'contact.copy':'Copy email address',
  'hero.label':'Introduction',
  'hero.ihsan':'<strong>Ihsan</strong> <span lang="ar">(إحسان)</span> is Arabic for doing something as well as you possibly can, with care and attention, even when no one is watching. That’s how I like to build.',
  'hero.intro':'Hi, I’m Moatasem. I build web apps that work well and feel good to use, from frontend to API.',
  'loader.label':'Loading workspace',
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
 },
 ar:{
  'meta.title':'معتصم الرفاعي — مطوّر برمجيات',
  'meta.description':'معرض أعمال معتصم الرفاعي، مطوّر برمجيات. تطبيقات ويب وأندرويد وتصميم واجهات وتجربة مستخدم، من الواجهة الأمامية حتى الـ API.',
  'lang.label':'اختر اللغة',
  'hero.name':'معتصم الرفاعي','hero.role':'مطوّر برمجيات · UI/UX',
  'tabs.label':'ما يعرضه الحاسوب','tabs.work':'المشاريع','tabs.cv':'سيرتي الذاتية','tabs.contact':'تواصل','tabs.hint':'اسحب للتدوير',
  'dock.label':'انتقل إلى','dock.home':'الرئيسية','dock.work':'الأعمال','dock.about':'عنّي','dock.contact':'تواصل','dock.cv':'السيرة',
  'contact.copy':'انسخ البريد الإلكتروني',
  'hero.label':'مقدمة',
  'hero.ihsan':'<strong>الإحسان</strong> أن تؤدي عملك على أحسن وجه، بإتقان وعناية، حتى حين لا يراك أحد. وهكذا أحب أن أبني.',
  'hero.intro':'أهلًا، أنا معتصم. أبني تطبيقات ويب تعمل بكفاءة ويسهل استخدامها، من الواجهة الأمامية حتى الـ API.',
  'loader.label':'جارٍ تحميل مساحة العمل',
  'laptop.label':'حاسوبي Dell XPS 15 9500. يُفتح الغطاء تلقائيًا. مرّر الصفحة لينتقل الحاسوب إلى المنتصف وتستعرض مشاريعي عبر شاشته.',
  'work.eyebrow':'المشاريع','work.platforms':'ويب · موبايل · سطح المكتب',
  'work.title':'أعمال<br><span>مختارة.</span>',
  'work.intro':'بعض المشاريع التي أفخر بها، من محاكي للطاقة إلى منصة اجتماعية. في كل مشروع تجد ما يقدّمه والتقنيات التي بُني بها.',
  'case.tech':'التقنيات المستخدمة',
  'link.demo':'عرض مباشر ↗','link.website':'الموقع ↗','link.ghFrontend':'GitHub: الواجهة الأمامية ↗','link.ghBackend':'GitHub: الواجهة الخلفية ↗',
  'case1.kind':'تطبيق ويب',
  'case1.lead':'ماذا يتغيّر حين تستخدم الطاقة بذكاء أكبر؟',
  'case1.body':'حاكِ الألواح الشمسية والبطارية المنزلية وشحن السيارة الكهربائية وتسخين المياه في لوحة تحكم واحدة. سترى فورًا أثر الطقس وإعداداتك وجدولك على تدفّق الطاقة وعلى ما توفّره.',
  'case1.f1':'الألواح الشمسية والبطارية المنزلية والسيارة الكهربائية والمياه الساخنة في محاكاة واحدة',
  'case1.f2':'ترى فورًا أثر الطقس والتخطيط',
  'case1.f3':'بُني باستخدام Codex عبر البرمجة الوكيلة (agentic coding)',
  'case1.open':'افتح العرض التجريبي لـ ThermaVoltFlow',
  'case1.alt':'لقطة شاشة للوحة تحكم ThermaVoltFlow مع محاكاة الطاقة.',
  'case1.caption':'لقطة شاشة من مستودع GitHub',
  'case2.kind':'ويب + أندرويد',
  'case2.lead':'منصة اجتماعية، من الواجهة الأمامية حتى الخلفية.',
  'case2.body':'تطبيق ويب وأندرويد فيه حسابات وملفات شخصية ودردشة وتفاعلات ومجموعات. بُني باستخدام React وFirebase وReact Query وCloudflare Workers.',
  'case2.backendLabel':'الواجهة الخلفية',
  'case2.backend':'وبنيتُ أيضًا واجهة خلفية مستقلة بـ Java Spring Boot، مع PostgreSQL وREST API وترحيلات Flyway وRedis وOpenAPI وDocker.',
  'case2.open':'افتح Amposter',
  'case2.altWeb':'تطبيق Amposter على الويب مع الخط الزمني والرسائل والمجموعات.',
  'case2.altChat':'شاشة الدردشة في تطبيق Amposter على أندرويد.',
  'case2.altProfile':'شاشة الملف الشخصي في تطبيق Amposter على أندرويد.',
  'case2.phones':'من الويب<br>إلى أندرويد.<small>React · Firebase · Java</small>',
  'case2.caption':'ويب وأندرويد · لقطات شاشة من سيرتي الذاتية',
  'archive.eyebrow':'مشاريع أخرى','archive.title':'مشاريع أصغر وأعمال دراسية.',
  'filters.label':'تصفية المشاريع',
  'filter.all':'الكل <span>8</span>','filter.web':'ويب <span>3</span>','filter.mobile':'موبايل <span>2</span>','filter.desktop':'سطح المكتب <span>3</span>',
  'kind.desktop':'سطح المكتب','kind.webDesktop':'ويب + سطح المكتب','kind.multiplayer':'متعدد اللاعبين','kind.quiz':'اختبار','kind.mobile':'موبايل','kind.web':'ويب',
  'p03.body':'تطبيق لنظام Windows يجلب مواقيت الصلاة في الخلفية ويشغّل تنبيهًا صوتيًا في موعدها. مع تخزين مؤقت محلي ومعالجة للأخطاء وتسجيل للأحداث.',
  'p04.name':'إدارة محطات الشحن<small>Angular · TypeScript · Spring Boot</small>',
  'p04.body':'مشروع دراسي لإدارة محطات شحن السيارات الكهربائية: واجهة Angular فيها تسجيل دخول وإنشاء حساب وشاشات للمستخدمين والمشرفين وعرض للمواقع. تعمل على REST API مبنية بـ Spring Boot، وإلى جانبها تطبيق JavaFX.',
  'p05.body':'لعبة Monopoly متعددة اللاعبين، طوّرناها في فريق من أربعة. في تطبيق JavaFX تلعب بالدور وتشتري الشوارع وتدفع الإيجار، ويحافظ Firestore على تزامن حالة اللعبة بين اللاعبين.',
  'p06.name':'قبعة الفرز<small>Python · Pygame</small>',
  'p06.body':'اختبار يساعد الطلاب على اختيار تخصصهم. يمكن استخدامه بالكامل من لوحة المفاتيح، وتظهر النتيجة في النهاية.',
  'p07.body':'تطبيق أندرويد للبحث عن أرقام E للمضافات الغذائية، مع شرح لكل مكوّن ورمز لوني ووضعين فاتح وداكن.',
  'p08.body':'مشروع تعليمي على أندرويد: أنجز مهامك اليومية الثابتة واجمع النقاط. مع وضعين فاتح وداكن.',
  'p09.body':'موقع لمحبي اللعبة، فيه متجر تجريبي وعرض للمركبات والخرائط والإصدارات.',
  'p10.name':'تطبيق ويب لمطعم<small>HTML · CSS · JavaScript</small>',
  'p10.body':'مشروع دراسي: قائمة طعام مع بحث ومفضّلة وخطوات طلب تنتهي بدفع تجريبي.',
  'about.eyebrow':'عنّي',
  'about.title':'شغوف بالتعلّم.<br><em>والمستخدم أولًا.</em>',
  'about.body':'أنا معتصم الرفاعي، مطوّر برمجيات. أعمل غالبًا بأطر TypeScript، ولديّ شغف خاص بتصميم الواجهات وتجربة المستخدم. أبني واجهات متعددة اللغات تعمل في الاتجاهين (LTR وRTL)، وأستمتع بالقدر نفسه بالعمل على الـ APIs وقواعد البيانات. وأقضي هذه الأيام وقتًا طويلًا في البرمجة الوكيلة (agentic coding).',
  'about.workLabel':'الخبرة العملية','about.work':'مطوّر برمجيات مستقل<br>نوفمبر 2025 – حتى الآن',
  'about.eduLabel':'التعليم','about.eduName':'هندسة البرمجيات','about.edu':'جامعة لايدن للعلوم التطبيقية<br>سبتمبر 2021 – يونيو 2025',
  'about.langLabel':'اللغات','about.langs':'الهولندية · الإنجليزية · العربية','about.langNote':'لذلك أبني واجهات تعمل بسلاسة من اليمين إلى اليسار أيضًا.',
  'about.cvLink':'السيرة الذاتية (PDF) ↗',
  'footer.eyebrow':'هل نعمل معًا؟','footer.cta':'لنبنِ<br>شيئًا معًا<span>↗</span>','footer.name':'معتصم الرفاعي'
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
  copied:'Gekopieerd',
  projects:{one:'# project',other:'# projecten'}
 },
 en:{
  mode:{
   work:{button:'View my work',headline:'CODE WITH',label:'View my projects'},
   cv:{button:'View my CV',headline:['MOATASEM','AL-REFAAI'],label:'Open my full CV as a PDF'},
   contact:{button:'Email me',headline:['LET’S','TALK'],label:'Send an email to career@mtsm.dev'}
  },
  words:['COFFEE','TEA','COCOA','IHSAN'],
  copied:'Copied',
  projects:{one:'# project',other:'# projects'}
 },
 ar:{
  mode:{
   work:{button:'شاهد أعمالي',headline:'برمجة',label:'استعرض مشاريعي'},
   cv:{button:'اطّلع على سيرتي',headline:['معتصم','الرفاعي'],label:'افتح سيرتي الذاتية كاملة بصيغة PDF'},
   contact:{button:'راسلني',headline:['لنتحدث','معًا'],label:'أرسل بريدًا إلى career@mtsm.dev'}
  },
  words:['بالقهوة','بالشاي','بالكاكاو','بإحسان'],
  copied:'تم النسخ',
  projects:{zero:'لا مشاريع',one:'مشروع واحد',two:'مشروعان',few:'# مشاريع',many:'# مشروعًا',other:'# مشروع'}
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
 // External-link arrows point the reading direction: ↗ in LTR, ↖ in RTL.
 const [from,to]=lang==='ar'?['↗','↖']:['↖','↗'];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 for(let node;(node=walker.nextNode());)if(node.nodeValue.includes(from))node.nodeValue=node.nodeValue.split(from).join(to);
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
