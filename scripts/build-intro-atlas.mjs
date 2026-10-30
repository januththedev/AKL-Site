import sharp from 'sharp';
import { readdir, writeFile } from 'node:fs/promises';
const sources=(await readdir('public/media')).filter(x=>x.endsWith('.webp')).sort();
const count=500;
// Deterministic crops, not 500 unique source photographs. Retain source credits.
const manifest=[];
async function atlas(name,columns,rows,width,height){
 const overlays=[];
 for(let i=0;i<count;i++){
  const source=sources[(i*7+Math.floor(i/13))%sources.length];
  const meta=await sharp(`public/media/${source}`).metadata();
  const zoom=1+(i%7)*.08;
  const cropW=Math.round(meta.width/zoom),cropH=Math.round(meta.height/zoom);
  const left=Math.floor((meta.width-cropW)*((i*37%101)/100));
  const top=Math.floor((meta.height-cropH)*((i*53%101)/100));
  const input=await sharp(`public/media/${source}`).extract({left,top,width:cropW,height:cropH}).resize(width-2,height-2,{fit:'cover'}).modulate({saturation:.8}).toBuffer();
  overlays.push({input,left:(i%columns)*width+1,top:Math.floor(i/columns)*height+1});
  if(name==='desktop')manifest.push({index:i,source:`/media/${source}`,crop:{left,top,width:cropW,height:cropH}});
 }
 await sharp({create:{width:columns*width,height:rows*height,channels:3,background:'#071916'}}).composite(overlays).webp({quality:52,effort:6}).toFile(`public/intro/atlas-${name}.webp`);
}
await atlas('desktop',25,20,80,54);
await atlas('mobile',20,25,56,70);
await writeFile('content/intro-atlas.json',JSON.stringify({tileCount:count,uniqueSources:sources.length,credits:'/image-credits',tiles:manifest},null,2)+'\n');
console.log(`Built two atlases: ${count} crops from ${sources.length} credited originals.`);
