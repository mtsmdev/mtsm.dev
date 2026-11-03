import * as THREE from 'three';

// Detailed geometry and UV atlases from the HMX XPS 15 9500 viewer supplied by the user.
// Preserve the source attribution in assets/xps/manifest.json when packaging this prototype.
export async function createXPS(onProgress=()=>{}){
 const base='./assets/xps/',manifest=await (await fetch(base+'manifest.json')).json();
 const scale=4.7/34.44;
 const hingeY=-3.16224*scale-1.08,hingeZ=-9.06133*scale+1;
 const laptop=new THREE.Group(),lid=new THREE.Group();laptop.name='Dell XPS 15 9500 — HMX reference geometry';lid.position.set(0,hingeY,hingeZ);laptop.add(lid);
 const cache=new Map(),loader=new THREE.TextureLoader(),textureJobs=[];
 // Progress counts every mesh and texture download, so a loader can show real progress.
 let done=0,total=0;const tick=()=>{done++;if(total)onProgress(done,total);};
 function tex(name,colour=true){const file=manifest.textures[name];if(!file)return null;const key=file+colour;if(cache.has(key))return cache.get(key);let resolve,reject;textureJobs.push(new Promise((yes,no)=>{resolve=yes;reject=no;}).then(tick));const t=loader.load(base+file,resolve,undefined,reject);t.colorSpace=colour?THREE.SRGBColorSpace:THREE.NoColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;cache.set(key,t);return t;}
 const silverIds=new Set([23,24,25,26,28,29,31,32,62,65,71,75,77,83]);
 const mats=manifest.materials.map((m,i)=>{
  const silver=silverIds.has(i),c=(m.diffusecolour||'0.02,0.02,0.02').split(',').map(Number);
  const color=new THREE.Color().setRGB(...c);
  if(silver)color.set(i===62||i===83?0xb2b6ba:0xc2c5c7);
  if(i===1)color.set(0x191b1e);
  if([3,14,17,19,48,59,60].includes(i))color.set(0x14171b);
  const material=new THREE.MeshStandardMaterial({color,metalness:silver?.92:.05,roughness:silver?.28:.58,envMapIntensity:silver?.8:.03,side:THREE.DoubleSide});
  material.name=m.name; if(!silver){material.metalness=0;material.roughness=.8;} if([73,78,79,76,67,68].includes(i))material.color.set(0x090b0e);
  if(m.diffusetexture)material.map=tex(m.diffusetexture);
  if(m.ambocctexture){material.aoMap=tex(m.ambocctexture,false);material.aoMapIntensity=.7;}
  if(m.alphatexture){material.alphaMap=tex(m.alphatexture,false);material.alphaTest=.35;material.transparent=false;}
  if([7,11].includes(i)){material.color.set(0xcbd4de);material.emissive.set(0x78818c);material.emissiveIntensity=.35;}
  if(i===33){material.color.set(0x151719);material.roughness=.85;}
  if(i===50)return new THREE.MeshBasicMaterial({color:0xe9e2d4,toneMapped:false,side:THREE.DoubleSide});
  return material;
 });
 let display;
 const meshes=manifest.meshes.filter(m=>!m.name.startsWith('Hotspot')&&m.material!==27);
 total=meshes.length+textureJobs.length;onProgress(done,total);
 await Promise.all(meshes.map(async m=>{
  const response=await fetch(base+m.file);if(!response.ok)throw Error('XPS mesh unavailable: '+m.name);const data=await response.arrayBuffer(),dv=new DataView(data);
  const n=dv.getUint32(0,true),nn=dv.getUint32(4,true),nu=dv.getUint32(8,true),ni=dv.getUint32(12,true);let at=16;
  const raw=new Uint16Array(data,at,n);at+=n*2;const normals=new Int16Array(data,at,nn);at+=nn*2;const uvs=new Uint16Array(data,at,nu);at+=nu*2;
  const positions=new Float32Array(n),normal=new Float32Array(nn),uv=new Float32Array(nu);
  for(let i=0;i<n;i++){const a=i%3;positions[i]=(m.bbox[a]+raw[i]/65535*(m.bbox[a+3]-m.bbox[a]))*scale;positions[i]+=a===0?-.3317*scale:a===1?-1.08:1.0;if(m.screen)positions[i]-=a===1?hingeY:a===2?hingeZ:0;}
  for(let i=0;i<nn;i++)normal[i]=normals[i]/32757;
  for(let i=0;i<nu;i++){const a=i%2;uv[i]=m.uvbox[a]+uvs[i]/65535*(m.uvbox[a+2]-m.uvbox[a]);}
  const indices=n/3>65535?new Uint32Array(data.slice(at,at+ni*4)):new Uint16Array(data.slice(at,at+ni*2));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setAttribute('normal',new THREE.BufferAttribute(normal,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setAttribute('uv1',new THREE.BufferAttribute(uv.slice(),2));g.setIndex(new THREE.BufferAttribute(indices,1));g.computeBoundingSphere();
  // The display has its own UV atlas region; normalize this surface to fill it with the portfolio.
  if(m.material===50){for(let i=0;i<nu;i++){const a=i%2;uv[i]=(uv[i]-m.uvbox[a])/(m.uvbox[a+2]-m.uvbox[a]);}g.attributes.uv.needsUpdate=true;}
  const mesh=new THREE.Mesh(g,mats[m.material]);mesh.name=m.name;(m.screen?lid:laptop).add(mesh);if(m.material===50)display=mesh;tick();
 }));
 if(!display)throw Error('XPS display mesh missing');
 await Promise.all(textureJobs);
 return {laptop,lid,display};
}


