const code=`// Software met oog voor detail.
const ontwikkelaar = "Moatasem Al-Refaai";

const projecten = [
  "ThermaVoltFlow Simulator",
  "Amposter",
];

export function Portfolio() {
  return (
    <main lang="nl">
      <h1>Code met koffie.</h1>
      <Projecten items={projecten} />
    </main>
  );
}
`;
const lineOf=chars=>{let line=0;for(let i=0;i<chars;i++)if(code.charCodeAt(i)===10)line++;return line;};
// What the editor shows at a moment: typed characters and cursor visibility.
export function editorState(seconds,reduced){
 return {chars:reduced?code.length:Math.min(code.length,Math.floor(Math.max(0,seconds-1.6)*70)),cursor:reduced||Math.floor(seconds*2)%2===0};
}
// Screen areas that differ between two editor states, so only those pixels are re-uploaded.
export function editorDirtyRects(a,b){
 if(a.chars===b.chars&&a.cursor===b.cursor)return [];
 const first=lineOf(Math.min(a.chars,b.chars)),last=lineOf(Math.max(a.chars,b.chars));
 const top=Math.max(145,151+first*36),bottom=Math.min(795,191+last*36);
 const rects=[{x:345,y:top,w:1255,h:bottom-top}];
 if(first!==last)rects.push({x:1000,y:970,w:600,h:30});// status bar line counter
 return rects;
}
export function drawEditor(ctx,seconds,reduced){
 const w=1600,h=1000;ctx.fillStyle='#1e1e1e';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#323233';ctx.fillRect(0,0,w,48);ctx.fillStyle='#a9c8e1';ctx.font='bold 25px monospace';ctx.fillText('❮',22,32);ctx.fillStyle='#c4c4c4';ctx.font='18px Arial';ctx.fillText('Bestand   Bewerken   Selectie   Beeld   Uitvoeren   Terminal',75,31);ctx.textAlign='center';ctx.fillStyle='#9b9b9b';ctx.fillText('Portfolio.tsx — Moatasem — Visual Studio Code',1140,31);ctx.textAlign='left';
 ctx.fillStyle='#333333';ctx.fillRect(0,48,65,922);ctx.strokeStyle='#b2b2b2';ctx.lineWidth=3;for(let i=0;i<5;i++){const y=90+i*90;ctx.strokeRect(21,y,24,28);if(i===0)ctx.strokeRect(16,y-6,24,28);}ctx.fillStyle='#007acc';ctx.fillRect(0,65,3,60);
 ctx.fillStyle='#252526';ctx.fillRect(65,48,280,922);ctx.fillStyle='#bdbdbd';ctx.font='16px Arial';ctx.fillText('VERKENNER',87,84);ctx.font='bold 16px monospace';ctx.fillText('⌄ PORTFOLIO',87,131);ctx.font='18px monospace';ctx.fillStyle='#bbbbbb';ctx.fillText('⌄ src',102,179);ctx.fillText('⌄ components',122,221);ctx.fillStyle='#333a43';ctx.fillRect(65,240,280,45);ctx.fillStyle='#65c9f5';ctx.fillText('TS',143,269);ctx.fillStyle='#e0e0e0';ctx.fillText('Portfolio.tsx',178,269);ctx.fillStyle='#c5c5c5';ctx.fillText('  Projecten.tsx',142,314);ctx.fillText('  stijl.css',142,359);ctx.fillText('  package.json',103,415);ctx.fillText('  README.md',103,458);
 ctx.fillStyle='#2d2d2d';ctx.fillRect(345,48,1255,49);ctx.fillStyle='#1e1e1e';ctx.fillRect(345,48,255,49);ctx.fillStyle='#65c9f5';ctx.fillText('TS',367,79);ctx.fillStyle='#d6d6d6';ctx.fillText('Portfolio.tsx',404,79);ctx.fillStyle='#818181';ctx.fillText('×',567,79);ctx.font='16px Arial';ctx.fillText('src  ›  components  ›  Portfolio.tsx',372,126);
 const visible=reduced?code:code.slice(0,Math.floor(Math.max(0,seconds-1.6)*70));const lines=visible.split('\n');
 ctx.save();ctx.beginPath();ctx.rect(345,145,1255,650);ctx.clip();ctx.font='24px monospace';
 lines.forEach((line,i)=>{const y=181+i*36;ctx.fillStyle='#707070';ctx.fillText(String(i+1).padStart(2,' '),375,y);let x=435;
 const tokens=line.match(/\/\/.*|"[^"]*"|\b(?:const|export|function|return)\b|\b(?:Portfolio|Projecten)\b|[^\s]+|\s+/g)||[];
 for(const token of tokens){ctx.fillStyle=token.startsWith('//')?'#6a9955':token.startsWith('"')?'#ce9178':/^(const|export|function|return)$/.test(token)?'#c586c0':/^(Portfolio|Projecten)$/.test(token)?'#dcdcaa':'#9cdcfe';ctx.fillText(token,x,y);x+=ctx.measureText(token).width;}
 if(i===lines.length-1&&(reduced||Math.floor(seconds*2)%2===0)){ctx.fillStyle='#dedede';ctx.fillRect(x,y-23,2,29);}});ctx.restore();
 ctx.fillStyle='#252526';ctx.fillRect(345,810,1255,160);ctx.fillStyle='#bfbfbf';ctx.font='17px Arial';ctx.fillText('PROBLEMEN       UITVOER       TERMINAL',375,847);ctx.fillStyle='#6a9955';ctx.font='20px monospace';ctx.fillText('✓ Klaar om mijn werk te ontdekken.',375,897);ctx.fillStyle='#999999';ctx.font='18px monospace';ctx.fillText('Scroll naar beneden om de projecten te openen.',375,933);
 ctx.fillStyle='#007acc';ctx.fillRect(0,970,w,30);ctx.fillStyle='#ffffff';ctx.font='16px monospace';ctx.fillText('⑂ main     ✓ 0 fouten',24,991);ctx.fillText('TypeScript React     UTF-8     Ln '+lines.length+', Col 1',1060,991);
}
