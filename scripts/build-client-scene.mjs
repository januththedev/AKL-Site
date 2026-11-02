/** Build tiny artwork layers. All camera, blur and text motion runs as browser code. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const unique = new Map(), identities = new Set();
for (const file of ['client-logos.json', 'client-logos-a.json', 'client-logos-b.json']) {
  for (const logo of JSON.parse(await readFile(path.join(root, 'content', file), 'utf8'))) {
    const identity = logo.profileName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (unique.has(logo.id) || identities.has(identity)) continue;
    if (!logo.src.startsWith('/clients/') || !logo.sourceUrl || ![8, 9].includes(logo.profilePage)) throw new Error(`Incomplete provenance: ${logo.id}`);
    unique.set(logo.id, logo); identities.add(identity);
  }
}
const priority = ['saptco', 'public-transportation', 'riyadh-cables', 'sapco', 'lodige'];
const catalog = [...unique.values()].sort((a, b) => {
  const ai = priority.indexOf(a.id), bi = priority.indexOf(b.id);
  if (ai >= 0 || bi >= 0) return (ai < 0 ? 1000 : ai) - (bi < 0 ? 1000 : bi);
  return a.name.localeCompare(b.name, 'en');
});
await writeFile(path.join(root, 'content/client-catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
const logos = catalog.slice(0, 100);
const hash = createHash('sha256').update('client-scene-v1').update(JSON.stringify(logos));
const buffers = new Map();
for (const logo of logos) {
  const buffer = await readFile(path.join(root, 'public', logo.src));
  buffers.set(logo.id, buffer); hash.update(buffer);
}
const version = hash.digest('hex').slice(0, 12);
const destination = path.join(root, 'public/clients/scene');
await mkdir(destination, {recursive:true});

async function composition(width, height, portrait) {
  const scale = 2, cols = portrait ? 6 : 10, rows = Math.ceil(logos.length / cols), gap = portrait ? 6 : 7;
  const tw = Math.min((width - 100 - (cols - 1) * gap) / cols, (height - 100 - (rows - 1) * gap) / rows * 1.5);
  const th = tw / 1.5, gridW = cols * tw + (cols - 1) * gap, gridH = rows * th + (rows - 1) * gap;
  const left = (width - gridW) / 2, top = (height - gridH) / 2;
  const cx = Math.floor(cols / 2), cy = Math.floor((rows - 1) / 2);
  const core = priority.slice(0, 4).flatMap(id => logos.filter(logo => logo.id === id));
  const coreSlots = core.length === 4 ? [[cx - 1,cy],[cx,cy],[cx - 1,cy + 1],[cx,cy + 1]] : [[cx - 1,cy],[cx,cy],[cx + 1,cy]];
  const occupied = new Set(coreSlots.map(slot => slot.join(':')));
  const slots = Array.from({length:rows}, (_,row) => Array.from({length:cols}, (_,col) => [col,row])).flat()
    .filter(slot => !occupied.has(slot.join(':')))
    .sort((a,b) => (Math.abs(a[0]-cx)+Math.abs(a[1]-cy))-(Math.abs(b[0]-cx)+Math.abs(b[1]-cy)) || a[1]-b[1] || a[0]-b[0]);
  const rest = logos.filter(logo => !core.includes(logo));
  const placed = [...core.map((logo,i) => ({logo,slot:coreSlots[i],group:'core'})), ...rest.map((logo,i) => ({logo,slot:slots[i],group:logo.id === 'lodige' ? 'lodige' : i < 15 ? 'ring' : 'outer'}))];
  const groups = {core:[],lodige:[],ring:[],outer:[]};
  for (const {logo,slot,group} of placed) {
    const w = Math.round(tw*scale), h = Math.round(th*scale), x = Math.round((left+slot[0]*(tw+gap))*scale), y = Math.round((top+slot[1]*(th+gap))*scale);
    const plate = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="${Math.round(w*.055)}" fill="${logo.surface === 'dark' ? '#12382f' : '#f7f6f0'}" stroke="${logo.surface === 'dark' ? '#38544b' : '#d5ddd4'}"/></svg>`);
    const artwork = await sharp(buffers.get(logo.id)).resize({width:Math.round(w*.8),height:Math.round(h*.65),fit:'inside'}).png().toBuffer({resolveWithObject:true});
    const card = await sharp(plate).composite([{input:artwork.data,left:Math.round((w-artwork.info.width)/2),top:Math.round((h-artwork.info.height)/2)}]).png().toBuffer();
    groups[group].push({input:card,left:x,top:y});
  }
  const format = portrait ? 'portrait' : 'landscape', assets = [];
  for (const [group,items] of Object.entries(groups)) {
    const content = await sharp({create:{width:width*scale,height:height*scale,channels:4,background:'#0000'}}).composite(items).webp({quality:88,alphaQuality:100,effort:6}).toBuffer();
    const filename = `relationships-${format}-${group}-${version}.webp`;
    await writeFile(path.join(destination, filename), content);
    assets.push({group,src:`/clients/scene/${filename}`,bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')});
  }
  const centerX = coreSlots.reduce((sum,slot) => sum+left+slot[0]*(tw+gap)+tw/2,0)/core.length;
  const centerY = coreSlots.reduce((sum,slot) => sum+top+slot[1]*(th+gap)+th/2,0)/core.length;
  const coreW = core.length === 4 ? tw*2+gap : tw*3+gap*2;
  const coreH = core.length === 4 ? th*2+gap : th;
  return {width,height,centerX:centerX/width,centerY:centerY/height,initialScale:Math.min((width-70)/coreW,(height-120)/coreH),layers:assets,totalBytes:assets.reduce((sum,asset)=>sum+asset.bytes,0)};
}
const manifest = {version,duration:6000,logoCount:logos.length,targetLogoCount:100,logoIds:logos.map(logo=>logo.id),missingPriority:priority.filter(id=>!unique.has(id)),exactSequenceReady:priority.every(id=>unique.has(id))&&logos.length===100,landscape:await composition(1280,720,false),portrait:await composition(640,800,true)};
await writeFile(path.join(root,'content/client-scene.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({version,logos:logos.length,landscapeBytes:manifest.landscape.totalBytes,portraitBytes:manifest.portrait.totalBytes}));
