// Google Docs chrome around the CV. The CV itself is the real document, so Arabic uses the English UI.
const docsUI={
 nl:{menu:'Bestand   Bewerken   Beeld   Invoegen   Opmaak   Extra   Extensies   Help',style:'Normale tekst   ▾',share:'♧  Delen   ▾'},
 en:{menu:'File   Edit   View   Insert   Format   Tools   Extensions   Help',style:'Normal text   ▾',share:'♧  Share   ▾'}
};
export function drawCV(ctx,image,lang='nl'){
 const ui=docsUI[lang]||docsUI.en;
 ctx.fillStyle='#f8fafd';ctx.fillRect(0,0,1600,1000);
 // Google Docs-style document header and menu bar.
 ctx.fillStyle='#4285f4';ctx.beginPath();ctx.moveTo(28,17);ctx.lineTo(50,17);ctx.lineTo(63,30);ctx.lineTo(63,62);ctx.lineTo(28,62);ctx.closePath();ctx.fill();ctx.fillStyle='#a8c7fa';ctx.beginPath();ctx.moveTo(50,17);ctx.lineTo(50,30);ctx.lineTo(63,30);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(35,39,21,3);ctx.fillRect(35,47,15,3);
 ctx.fillStyle='#202124';ctx.font='25px Arial';ctx.fillText('Moatasem CV - v6',84,36);ctx.fillStyle='#62676c';ctx.font='27px Arial';ctx.fillText('☆   ♧   ☁',329,36);
 ctx.fillStyle='#30343b';ctx.font='18px Arial';ctx.fillText(ui.menu,84,70);
 ctx.fillStyle='#c2e7ff';ctx.beginPath();ctx.roundRect(1290,17,170,51,26);ctx.fill();ctx.fillStyle='#234f70';ctx.font='20px Arial';ctx.fillText(ui.share,1314,50);ctx.fillStyle='#c4d8ff';ctx.beginPath();ctx.arc(1532,42,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#345879';ctx.font='bold 19px Arial';ctx.fillText('M',1524,49);
 // The light formatting toolbar fills the screen, just like the supplied Docs view.
 ctx.fillStyle='#eef2f8';ctx.beginPath();ctx.roundRect(22,91,1530,57,28);ctx.fill();ctx.fillStyle='#52585e';ctx.font='24px Arial';ctx.fillText('⌕   ↶   ↷   ▣   A✓   ▧',44,128);ctx.font='19px Arial';ctx.fillText('100%  ▾',291,127);ctx.fillText(ui.style,403,127);ctx.fillText('Roboto   ▾',605,127);ctx.fillText('−',748,127);ctx.strokeStyle='#8d9299';ctx.lineWidth=1;ctx.strokeRect(779,103,41,32);ctx.fillText('11',788,126);ctx.fillText('+',834,127);ctx.font='bold 22px Arial';ctx.fillText('B',882,127);ctx.font='italic 22px Arial';ctx.fillText('I',923,127);ctx.font='22px Arial';ctx.fillText('U',964,127);ctx.fillText('A',1010,127);ctx.fillRect(1007,132,24,3);ctx.fillStyle='#5e656c';ctx.font='22px Arial';ctx.fillText('↗   ◇   ▧   ≡   ▾   ☷   ⋮',1073,127);
 // Ruler and paper use the actual rendered CV; the larger page exposes its upper portion.
 const pageX=210,pageY=185,pageW=1180;
 ctx.strokeStyle='#c9cdd1';ctx.beginPath();ctx.moveTo(24,169);ctx.lineTo(1538,169);ctx.stroke();ctx.font='12px Arial';ctx.fillStyle='#60656a';
 for(let i=0;i<=40;i++){const x=pageX+i*22.5;ctx.beginPath();ctx.moveTo(x,164);ctx.lineTo(x,i%2===0?151:158);ctx.stroke();if(i%2===0&&i>0&&i<40)ctx.fillText(String(i/2),x-3,148);}
 ctx.fillStyle='#5689e8';ctx.beginPath();ctx.moveTo(pageX+225,153);ctx.lineTo(pageX+241,153);ctx.lineTo(pageX+233,164);ctx.closePath();ctx.fill();
 ctx.fillStyle='#e8edf5';ctx.beginPath();ctx.arc(61,212,23,0,Math.PI*2);ctx.fill();ctx.fillStyle='#65717e';ctx.font='25px Arial';ctx.fillText('☷',49,220);
 ctx.fillStyle='#fff';ctx.shadowColor='#2330440e';ctx.shadowBlur=8;ctx.fillRect(pageX,pageY,pageW,1300);ctx.shadowBlur=0;ctx.strokeStyle='#c7cbd0';ctx.strokeRect(pageX-.5,pageY-.5,pageW+1,1300);
 if(image.complete&&image.naturalWidth)ctx.drawImage(image,pageX,pageY,pageW,pageW*image.naturalHeight/image.naturalWidth);
 // Workspace rail and scroll thumb complete the editor framing.
 ctx.fillStyle='#dfe3e7';ctx.beginPath();ctx.roundRect(1513,181,10,147,5);ctx.fill();
 for(const [y,color,label] of [[112,'#4285f4','31'],[212,'#fbbc04','✦'],[310,'#4285f4','✓'],[408,'#4285f4','♟'],[506,'#34a853','◈']]){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(1562,y,23,23,5);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 14px Arial';ctx.fillText(label,1565,y+17);}
 ctx.fillStyle='#545a62';ctx.font='30px Arial';ctx.fillText('+',1563,635);
}

const mailCopy={
 nl:{name:'MOATASEM AL-REFAAI',role:'Software developer · UI / UX',badge:'MAIL MIJ',eyebrow:'EEN PROJECT, EEN VRAAG OF EEN KOP KOFFIE',lines:['Een goed idee','begint met','hallo.'],sub:['Een project, een vraag of gewoon kennismaken?','Ik hoor graag van je.'],hint:'Klik op de laptop om een e-mail te schrijven',to:'Aan: Moatasem',sign:'TOT SNEL.'},
 en:{name:'MOATASEM AL-REFAAI',role:'Software developer · UI / UX',badge:'EMAIL ME',eyebrow:'A PROJECT, A QUESTION OR A CUP OF COFFEE',lines:['Every good idea','starts with a','hello.'],sub:['A project, a question or just saying hi?','I’d love to hear from you.'],hint:'Click the laptop to write an email',to:'To: Moatasem',sign:'TALK SOON.'},
 ar:{name:'معتصم الرفاعي',role:'مطوّر برمجيات · UI / UX',badge:'راسلني',eyebrow:'مشروع، سؤال، أو فنجان قهوة',lines:['كل فكرة جيدة','تبدأ بتحية','بسيطة.'],sub:['مشروع أو سؤال أو مجرد تعارف؟','يسعدني أن أسمع منك.'],hint:'انقر على الحاسوب لكتابة رسالة',to:'إلى: معتصم',sign:'إلى اللقاء قريبًا.'}
};
export function drawMail(ctx,lang='nl'){
 const c=mailCopy[lang]||mailCopy.nl,rtl=lang==='ar';
 // In Arabic the whole letter mirrors: X() flips positions, and text aligns to the right.
 const X=x=>rtl?1600-x:x,R=(x,w)=>rtl?1600-x-w:x;
 const display=rtl?'Alexandria,"IBM Plex Sans Arabic",sans-serif':'"DM Sans",Arial,sans-serif',text=rtl?'"IBM Plex Sans Arabic",Arial,sans-serif':'Arial';
 ctx.save();ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';
 const ink='#242720',muted='#77776b',orange='#f46c2e',paper='#f3eee4';
 ctx.fillStyle=paper;ctx.fillRect(0,0,1600,1000);
 // A personal stationery design with generous type and an illustrated envelope.
 ctx.fillStyle='#e9e2d5';ctx.fillRect(R(1060,540),0,540,1000);
 ctx.fillStyle=ink;ctx.beginPath();ctx.roundRect(R(80,65),65,65,65,16);ctx.fill();
 ctx.save();ctx.textAlign='center';ctx.direction='ltr';ctx.fillStyle=paper;ctx.font='bold 39px Arial';ctx.fillText('M',X(112.5),112);ctx.restore();
 ctx.fillStyle=ink;ctx.font=`bold 22px ${text}`;ctx.fillText(c.name,X(168),92);
 ctx.fillStyle=muted;ctx.font=`18px ${text}`;ctx.fillText(c.role,X(168),123);
 ctx.fillStyle=orange;ctx.beginPath();ctx.arc(X(1360),98,6,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=ink;ctx.font=`bold 17px ${text}`;ctx.fillText(c.badge,X(1382),104);
 ctx.strokeStyle='#cec8bc';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(80,169);ctx.lineTo(1520,169);ctx.stroke();
 ctx.fillStyle=orange;ctx.font=`bold 19px ${text}`;ctx.fillText(c.eyebrow,X(85),250);
 ctx.fillStyle=ink;ctx.font=`bold ${rtl?88:100}px ${display}`;
 ctx.fillText(c.lines[0],X(80),376);ctx.fillText(c.lines[1],X(80),490);
 ctx.fillStyle=orange;ctx.fillText(c.lines[2],X(80),604);
 ctx.fillStyle=muted;ctx.font=`27px ${rtl?text:'"DM Sans",Arial,sans-serif'}`;
 ctx.fillText(c.sub[0],X(85),682);ctx.fillText(c.sub[1],X(85),725);
 // The address is the main visual action, matching the laptop mailto interaction.
 ctx.fillStyle=ink;ctx.beginPath();ctx.roundRect(R(80,890),784,890,112,20);ctx.fill();
 ctx.save();ctx.direction='ltr';ctx.fillStyle=paper;ctx.font='bold 42px "DM Sans",Arial,sans-serif';ctx.fillText('career@mtsm.dev',X(119),856);ctx.restore();
 ctx.fillStyle=orange;ctx.beginPath();ctx.arc(X(907),840,34,0,Math.PI*2);ctx.fill();
 const ax=v=>X(907+v);// the arrow points up and away in the reading direction
 ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ax(-14),854);ctx.lineTo(ax(13),827);ctx.moveTo(ax(-10),827);ctx.lineTo(ax(13),827);ctx.lineTo(ax(13),850);ctx.stroke();
 ctx.fillStyle=muted;ctx.font=`18px ${text}`;ctx.fillText(c.hint,X(86),941);
 // Orange seal and layered paper make this feel like a letter rather than an app screenshot.
 const s=rtl?-1:1;
 ctx.save();ctx.translate(X(1320),490);ctx.rotate(-.12*s);
 ctx.fillStyle='#d8d0c1';ctx.beginPath();ctx.ellipse(0,241,197,24,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fffcf5';ctx.shadowColor='#5c432322';ctx.shadowBlur=30;ctx.shadowOffsetY=18;ctx.beginPath();ctx.roundRect(-177,-176,354,324,14);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.fillStyle=ink;ctx.font=`bold 24px ${text}`;ctx.fillText(c.to,-141*s,-120);
 ctx.fillStyle='#d5cebf';for(let i=0;i<3;i++){const w=i===2?145:262;ctx.fillRect(rtl?141-w:-141,-78+i*26,w,5);}
 ctx.fillStyle=orange;ctx.beginPath();ctx.roundRect(-213,-8,426,256,16);ctx.fill();
 ctx.strokeStyle='#d95220';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-207,235);ctx.lineTo(-40,100);ctx.moveTo(207,235);ctx.lineTo(40,100);ctx.stroke();
 ctx.fillStyle='#ff8a4e';ctx.beginPath();ctx.moveTo(-210,0);ctx.lineTo(0,156);ctx.lineTo(210,0);ctx.closePath();ctx.fill();
 ctx.fillStyle=ink;ctx.beginPath();ctx.arc(0,139,38,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.textAlign='center';ctx.direction='ltr';ctx.fillStyle=paper;ctx.font='bold 28px Arial';ctx.fillText('M',0,149);ctx.restore();
 ctx.restore();
 ctx.fillStyle=muted;ctx.font=`18px ${text}`;ctx.textAlign='center';ctx.fillText(c.sign,X(1320),865);
 ctx.restore();
}
