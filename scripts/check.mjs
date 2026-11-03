import {readFile,readdir,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'prototype');
const modules=['i18n.js','portfolio.js','particles.js','cursor.js','laptop.js','laptop-views.js','editor-screen.js','xps-reference.js','server.cjs'];
for(const file of modules)execFileSync(process.execPath,['--check',path.join(source,file)],{stdio:'inherit'});
const html=await readFile(path.join(source,'index.html'),'utf8');
const assets=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match=>match[1]).filter(value=>!/^https?:|^mailto:|^tel:|^[?]/.test(value));
for(const file of assets)await access(path.join(source,file.split('#')[0]));
const manifest=JSON.parse(await readFile(path.join(source,'assets/xps/manifest.json'),'utf8'));
for(const mesh of manifest.meshes)await access(path.join(source,'assets/xps',mesh.file));
for(const texture of Object.values(manifest.textures))await access(path.join(source,'assets/xps',texture));
for(const file of await readdir(path.join(source,'assets/projects')))await access(path.join(source,'assets/projects',file));
console.log(`Validated ${modules.length} scripts, HTML asset links, and laptop model assets.`);
