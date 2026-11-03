import {cp, mkdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const destination=path.join(root,'dist');
if(path.dirname(destination)!==root||path.basename(destination)!=='dist')throw new Error('Unexpected output path');
await rm(destination,{recursive:true,force:true});
await mkdir(destination,{recursive:true});
const entries=['index.html','style.css','laptop.css','portfolio.css','portfolio.js','laptop.js','laptop-views.js','editor-screen.js','xps-reference.js','assets','vendor'];
for(const entry of entries)await cp(path.join(root,'prototype',entry),path.join(destination,entry),{recursive:true});
console.log('Static website built in dist/');
