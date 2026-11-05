// Builds small thumbnails of real client logos for the home page's logo row.
// Source: the verified catalogue (content/client-catalog.json), light-surface logos only.
// Output: public/clients/marquee/<id>.webp (64 px high) and components/taste/marquee-logos.json.
// Run: node scripts/build-marquee-logos.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(root, 'content/client-catalog.json'), 'utf8'));
const out = join(root, 'public/clients/marquee');
mkdirSync(out, { recursive: true });

const HEIGHT = 64;
const WANT = 18;
const picked = [];
for (const logo of catalog) {
  if (picked.length >= WANT) break;
  if (logo.surface !== 'light') continue;
  const ratio = logo.width / logo.height;
  if (ratio < 1.2 || ratio > 6) continue; // very square or very long marks read badly in a row
  const file = join(root, 'public', logo.src);
  const image = sharp(file).trim({ threshold: 8 }).resize({ height: HEIGHT, withoutEnlargement: true });
  const { data, info } = await image.webp({ quality: 82, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(out, `${logo.id}.webp`), data);
  picked.push({ id: logo.id, name: logo.name, src: `/clients/marquee/${logo.id}.webp`, width: info.width, height: info.height, bytes: data.length });
}

writeFileSync(join(root, 'components/taste/marquee-logos.json'), JSON.stringify(picked.map(({ bytes, ...rest }) => rest), null, 2) + '\n');
const total = picked.reduce((sum, p) => sum + p.bytes, 0);
console.log(`${picked.length} logos, ${Math.round(total / 1024)} KB in total`);
