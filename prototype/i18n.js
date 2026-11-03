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
  'dock.label':'Jump to','dock.home':'Home','dock.work':'Work','dock.about':'About','dock.contact':'Contact','dock.cv':'CV',
  'hero.label':'Introduction',
  'hero.ihsan':'<strong>Ihsan</strong> <span lang="ar">(إحسان)</span> is Arabic for doing something as well as you possibly can, with care and attention, even when no one is watching. That’s how I like to build.',
  'hero.intro':'Hi, I’m Moatasem. I build web apps that work well and feel good to use, from frontend to API.',
  'loader.label':'Loading workspace',
  'laptop.label':'My Dell XPS 15 9500. The lid opens by itself. Scroll to bring the laptop to the centre and see my projects through its screen.',
  'work.title':"What I build.",
  'work.sub':"From an early Android app to agentic coding.",
  'work.now':"now",
  'work.cue':"Scroll through the timeline",
  'filters.label':"Filter projects",
  'filter.all':"All",
  'filter.web':"Web",
  'filter.mobile':"Mobile",
  'filter.desktop':"Desktop",
  'tech.label':"Technology used",
  'link.demo':"Live demo",
  'link.github':"GitHub",
  'link.website':"Website",
  'link.play':"Google Play",
  'link.private':"Private repo",
  'link.privateTip':"The code is in a private repository.",
  't.thermavolt.alt0':"The ThermaVoltFlow dashboard with the energy simulation.",
  't.thermavolt.period':"2026",
  't.thermavolt.kind':"Web app",
  't.thermavolt.lead':"What changes when you use energy more cleverly?",
  't.thermavolt.body':"An interactive dashboard that simulates rooftop solar, a home battery, EV charging and a solar water heater. Change the weather, day and night and your schedule, and see right away what it does to the energy flows and your savings. The Laravel backend talks to the Svelte frontend over gRPC.",
  't.thermavolt.note':"Agentically coded with Codex.",
  't.prayer.period':"2026",
  't.prayer.kind':"Windows app",
  't.prayer.body':"A windowless program that starts with Windows. Every day it fetches the prayer times of the mosque in Leidschendam from Mawaqit and plays the adhan right on time, with a reminder fifteen minutes before. No npm packages: just Node.js itself.",
  'm.freelance.date':"Nov 2025",
  'm.freelance.title':"Freelance software developer at WebTech Solutions",
  'm.freelance.sub':"My own business",
  't.amposter.alt0':"Amposter web app with timeline, messages and groups.",
  't.amposter.alt1':"Chat screen in the Android app.",
  't.amposter.alt2':"Profile screen in the Android app.",
  't.amposter.extraLabel':"My own backend",
  't.amposter.extraBody':"To move off Firebase I built a REST API in Spring Boot with PostgreSQL: Google sign-in, profiles, chat, notifications and uploads to R2, plus tools to migrate the data from Firebase to PostgreSQL.",
  't.amposter.period':"2025 — 2026",
  't.amposter.kind':"Web + Android",
  't.amposter.lead':"A social platform, from UI to backend.",
  't.amposter.body':"An Arabic social network that encourages worship and learning skills such as design. With posts, polls, chat, groups and notifications. The React app runs as a PWA and is on Google Play as an Android app; media go through Cloudflare Workers to R2.",
  't.varken.period':"Jul 2023",
  't.varken.kind':"Android app",
  't.varken.body':"Look up an E-number and see right away what it is, with a colour code and whether it can be pork-derived (halal or not). With light and dark themes.",
  't.monopoly.period':"2023",
  't.monopoly.kind':"Multiplayer game",
  't.monopoly.body':"A satirical take on Monopoly, built with a team of four. Players create a game or join with a game code, and Firestore keeps the game state in sync between everyone.",
  't.sorteerhoed.title':"Sorting Hat",
  't.sorteerhoed.period':"Mar 2023",
  't.sorteerhoed.kind':"Quiz",
  't.sorteerhoed.body':"A Harry Potter-style quiz that helps students choose their specialisation. Fully keyboard operable.",
  't.laadpaal.title':"Charge Point Manager",
  't.laadpaal.period':"Oct 2022 — Feb 2023",
  't.laadpaal.kind':"Team project for CGI",
  't.laadpaal.body':"An assignment from CGI, built as a team: users sign in, browse locations and charge points and make reservations; admins manage users and roles. It started as a JavaFX app and moved to Angular, both on one Spring Boot REST API.",
  't.hillclimb.period':"2022",
  't.hillclimb.kind':"Website",
  't.hillclimb.body':"A fan site about the game, with vehicles, maps, seasons and skins, plus a pretend shop to practise building a web store (no real payments).",
  't.restaurant.title':"Restaurant web app",
  't.restaurant.period':"2022",
  't.restaurant.kind':"Web app",
  't.restaurant.body':"A school project: a menu with search and favourites (saved in the browser) and an ordering flow that ends in a simulated payment.",
  'm.study.date':"Sep 2021",
  'm.study.title':"Started Software Engineering",
  'm.study.sub':"Leiden University of Applied Sciences",
  'm.prep.date':"2020 — 2021",
  'm.prep.title':"Preparatory year",
  'm.prep.sub':"Leiden University",
  't.achievement.period':"Sep 2019",
  't.achievement.kind':"Android app",
  't.achievement.body':"An early Android learning project: tick off fixed daily tasks and earn motivation points, with a weekly review.",
  'about.eyebrow':'ABOUT ME',
  'about.title':'Curious.<br><em>With an eye for the user.</em>',
  'about.body':'I’m Moatasem Al-Refaai, a software developer. I mostly work with TypeScript frameworks and have a soft spot for UI/UX. I build multilingual interfaces that work in both reading directions (LTR and RTL), and I’m just as happy digging into APIs and databases. Right now I spend a lot of time on agentic coding.',
  'about.workLabel':'EXPERIENCE','about.work':'Freelance software developer<br>Nov 2025 – present',
  'about.eduLabel':'EDUCATION','about.eduName':'Software Engineering','about.edu':'Leiden University of Applied Sciences<br>Sep 2021 – Jun 2025',
  'about.langLabel':'LANGUAGES','about.langs':'Dutch · English · Arabic','about.langNote':'Which is why I also build interfaces that read right to left.',
  'about.cvLink':'CV (PDF) ↗',
  'hero.contact':'Get in touch',
  'contact.title':'Let’s build something.','contact.lead':'A project, a question or just to say hi? Pick whatever is easiest for you, I’d love to hear from you.',
  'contact.mail':'Email','contact.whatsapp':'WhatsApp','contact.linkedin':'LinkedIn','contact.copyright':'© 2026 Moatasem Al-Refaai'
 },
 ar:{
  'meta.title':'معتصم الرفاعي — مطوّر برمجيات',
  'meta.description':'معرض أعمال معتصم الرفاعي، مطوّر برمجيات. تطبيقات ويب وأندرويد وتصميم واجهات وتجربة مستخدم، من الواجهة الأمامية حتى الـ API.',
  'lang.label':'اختر اللغة',
  'hero.name':'معتصم الرفاعي','hero.role':'مطوّر برمجيات · UI/UX',
  'dock.label':'انتقل إلى','dock.home':'الرئيسية','dock.work':'الأعمال','dock.about':'عنّي','dock.contact':'تواصل','dock.cv':'السيرة',
  'hero.label':'مقدمة',
  'hero.ihsan':'<strong>الإحسان</strong> أن تؤدي عملك على أحسن وجه، بإتقان وعناية، حتى حين لا يراك أحد. وهكذا أحب أن أبني.',
  'hero.intro':'أهلًا، أنا معتصم. أبني تطبيقات ويب تعمل بكفاءة ويسهل استخدامها، من الواجهة الأمامية حتى الـ API.',
  'loader.label':'جارٍ تحميل مساحة العمل',
  'laptop.label':'حاسوبي Dell XPS 15 9500. يُفتح الغطاء تلقائيًا. مرّر الصفحة لينتقل الحاسوب إلى المنتصف وتستعرض مشاريعي عبر شاشته.',
  'work.title':"ما أبنيه.",
  'work.sub':"من تطبيق أندرويد مبكر إلى البرمجة الوكيلة.",
  'work.now':"الآن",
  'work.cue':"مرّر عبر الخط الزمني",
  'filters.label':"تصفية المشاريع",
  'filter.all':"الكل",
  'filter.web':"ويب",
  'filter.mobile':"موبايل",
  'filter.desktop':"سطح المكتب",
  'tech.label':"التقنيات المستخدمة",
  'link.demo':"عرض مباشر",
  'link.github':"GitHub",
  'link.website':"الموقع",
  'link.play':"Google Play",
  'link.private':"مستودع خاص",
  'link.privateTip':"الشيفرة في مستودع خاص.",
  't.thermavolt.alt0':"لوحة تحكم ThermaVoltFlow مع محاكاة الطاقة.",
  't.thermavolt.period':"2026",
  't.thermavolt.kind':"تطبيق ويب",
  't.thermavolt.lead':"ماذا يتغيّر حين تستخدم الطاقة بذكاء أكبر؟",
  't.thermavolt.body':"لوحة تحكم تفاعلية تحاكي الألواح الشمسية والبطارية المنزلية وشحن السيارة الكهربائية وسخان المياه الشمسي. غيّر الطقس والليل والنهار وجدولك، وشاهد فورًا أثر ذلك على تدفّق الطاقة وما توفّره. تتواصل الواجهة الخلفية المبنية بـ Laravel مع واجهة Svelte عبر gRPC.",
  't.thermavolt.note':"بُرمج بأسلوب وكيلي باستخدام Codex.",
  't.prayer.period':"2026",
  't.prayer.kind':"تطبيق Windows",
  't.prayer.body':"برنامج بلا نافذة يعمل مع بدء تشغيل Windows. يجلب يوميًا مواقيت الصلاة لمسجد في لايدسخندام من موقع Mawaqit ويشغّل الأذان في موعده، مع تذكير قبل ربع ساعة. دون أي حزم npm، باستخدام Node.js وحده.",
  'm.freelance.date':"نوفمبر 2025",
  'm.freelance.title':"مطوّر برمجيات مستقل في WebTech Solutions",
  'm.freelance.sub':"عملي الخاص",
  't.amposter.alt0':"تطبيق Amposter على الويب مع الخط الزمني والرسائل والمجموعات.",
  't.amposter.alt1':"شاشة الدردشة في تطبيق أندرويد.",
  't.amposter.alt2':"شاشة الملف الشخصي في تطبيق أندرويد.",
  't.amposter.extraLabel':"واجهة خلفية خاصة",
  't.amposter.extraBody':"للانتقال من Firebase بنيتُ REST API بـ Spring Boot وPostgreSQL: تسجيل الدخول عبر Google والملفات الشخصية والدردشة والإشعارات والرفع إلى R2، مع أدوات لنقل البيانات من Firebase إلى PostgreSQL.",
  't.amposter.period':"2025 — 2026",
  't.amposter.kind':"ويب + أندرويد",
  't.amposter.lead':"منصة اجتماعية، من الواجهة الأمامية حتى الخلفية.",
  't.amposter.body':"شبكة اجتماعية عربية تشجّع على العبادة وتعلّم مهارات مثل التصميم، فيها منشورات واستطلاعات ودردشة ومجموعات وإشعارات. يعمل تطبيق React كتطبيق ويب تقدّمي (PWA) ومتاح على Google Play كتطبيق أندرويد، وتُرفع الوسائط عبر Cloudflare Workers إلى R2.",
  't.varken.period':"يوليو 2023",
  't.varken.kind':"تطبيق أندرويد",
  't.varken.body':"ابحث عن رقم E وشاهد فورًا ما هو، مع رمز لوني وبيان ما إذا كان قد يكون من مصدر خنزيري (حلال أم لا). مع وضعين فاتح وداكن.",
  't.monopoly.period':"2023",
  't.monopoly.kind':"لعبة متعددة اللاعبين",
  't.monopoly.body':"نسخة ساخرة من لعبة Monopoly، طوّرناها في فريق من أربعة. ينشئ اللاعبون لعبة أو ينضمون إليها برمز، ويحافظ Firestore على تزامن حالة اللعبة بين الجميع.",
  't.sorteerhoed.title':"قبعة الفرز",
  't.sorteerhoed.period':"مارس 2023",
  't.sorteerhoed.kind':"اختبار",
  't.sorteerhoed.body':"اختبار على طريقة هاري بوتر يساعد الطلاب على اختيار تخصصهم، ويمكن استخدامه بالكامل من لوحة المفاتيح.",
  't.laadpaal.title':"إدارة محطات الشحن",
  't.laadpaal.period':"أكتوبر 2022 — فبراير 2023",
  't.laadpaal.kind':"مشروع فريق لصالح CGI",
  't.laadpaal.body':"مشروع لصالح شركة CGI طوّرناه كفريق: يسجّل المستخدمون الدخول ويستعرضون المواقع ومحطات الشحن ويحجزون، ويدير المشرفون المستخدمين والصلاحيات. بدأ كتطبيق JavaFX ثم انتقل إلى Angular، وكلاهما على REST API واحدة مبنية بـ Spring Boot.",
  't.hillclimb.period':"2022",
  't.hillclimb.kind':"موقع ويب",
  't.hillclimb.body':"موقع لمحبي اللعبة فيه المركبات والخرائط والمواسم والأشكال، مع متجر تجريبي للتدرّب على بناء متجر إلكتروني (دون مدفوعات حقيقية).",
  't.restaurant.title':"تطبيق ويب لمطعم",
  't.restaurant.period':"2022",
  't.restaurant.kind':"تطبيق ويب",
  't.restaurant.body':"مشروع دراسي: قائمة طعام مع بحث ومفضّلة (تُحفظ في المتصفح) وخطوات طلب تنتهي بدفع تجريبي.",
  'm.study.date':"سبتمبر 2021",
  'm.study.title':"بدأت دراسة هندسة البرمجيات",
  'm.study.sub':"جامعة لايدن للعلوم التطبيقية",
  'm.prep.date':"2020 — 2021",
  'm.prep.title':"السنة التحضيرية",
  'm.prep.sub':"جامعة لايدن",
  't.achievement.period':"سبتمبر 2019",
  't.achievement.kind':"تطبيق أندرويد",
  't.achievement.body':"مشروع تعليمي مبكر على أندرويد: أنجز مهامك اليومية الثابتة واجمع نقاط التحفيز، مع مراجعة أسبوعية.",
  'about.eyebrow':'عنّي',
  'about.title':'شغوف بالتعلّم.<br><em>والمستخدم أولًا.</em>',
  'about.body':'أنا معتصم الرفاعي، مطوّر برمجيات. أعمل غالبًا بأطر TypeScript، ولديّ شغف خاص بتصميم الواجهات وتجربة المستخدم. أبني واجهات متعددة اللغات تعمل في الاتجاهين (LTR وRTL)، وأستمتع بالقدر نفسه بالعمل على الـ APIs وقواعد البيانات. وأقضي هذه الأيام وقتًا طويلًا في البرمجة الوكيلة (agentic coding).',
  'about.workLabel':'الخبرة العملية','about.work':'مطوّر برمجيات مستقل<br>نوفمبر 2025 – حتى الآن',
  'about.eduLabel':'التعليم','about.eduName':'هندسة البرمجيات','about.edu':'جامعة لايدن للعلوم التطبيقية<br>سبتمبر 2021 – يونيو 2025',
  'about.langLabel':'اللغات','about.langs':'الهولندية · الإنجليزية · العربية','about.langNote':'لذلك أبني واجهات تعمل بسلاسة من اليمين إلى اليسار أيضًا.',
  'about.cvLink':'السيرة الذاتية (PDF) ↗',
  'hero.contact':'تواصل معي',
  'contact.title':'لنبنِ شيئًا معًا.','contact.lead':'مشروع أو سؤال أو مجرد تعارف؟ اختر الطريقة الأسهل لك، ويسعدني أن أسمع منك.',
  'contact.mail':'البريد الإلكتروني','contact.whatsapp':'واتساب','contact.linkedin':'لينكدإن','contact.copyright':'© 2026 معتصم الرفاعي'
 }
};
// Copy that scripts render (buttons, headline, counters), in every language.
const scriptStrings={
 nl:{
  hero:{button:'Bekijk mijn werk',headline:'CODE MET',label:'Bekijk mijn projecten'},
  words:['KOFFIE','THEE','CHOCOMELK','IHSAN']
 },
 en:{
  hero:{button:'View my work',headline:'CODE WITH',label:'View my projects'},
  words:['COFFEE','TEA','COCOA','IHSAN']
 },
 ar:{
  hero:{button:'شاهد أعمالي',headline:'برمجة',label:'استعرض مشاريعي'},
  words:['بالقهوة','بالشاي','بالكاكاو','بإحسان']
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
 for(const el of document.querySelectorAll('[data-i18n-title]'))dutch[el.dataset.i18nTitle]??=el.getAttribute('title');
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
 for(const el of document.querySelectorAll('[data-i18n-title]'))el.setAttribute('title',t(el.dataset.i18nTitle));
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
