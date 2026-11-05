// Generates responsive WebP variants (AVIF saved only 2-14% at matched quality, so a second format was not worth it) of the originals in public/media into public/media/r/
// and a manifest (components/image-variants.json) that components/ResponsiveImage.tsx reads.
// Originals and their URLs are never touched. Variants live in a subfolder so scripts that list
// public/media/*.webp (the intro atlas builder) are unaffected.
// Deterministic: same input + sharp version = same output.   Usage: node scripts/build-image-variants.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'media');
const out = path.join(dir, 'r');
const manifestPath = path.join(root, 'components', 'image-variants.json');
const WIDTHS = [640, 1024, 1600];
fs.mkdirSync(out, { recursive: true });

const manifest = {};
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.webp')).sort()) {
  const name = file.replace(/\.webp$/, '');
  const meta = await sharp(path.join(dir, file)).metadata();
  const widths = WIDTHS.filter(w => w < meta.width);
  for (const w of widths) {
    const resized = () => sharp(path.join(dir, file)).resize({ width: w, withoutEnlargement: true });
    await resized().webp({ quality: 74, effort: 5 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  manifest[`/media/${file}`] = { width: meta.width, height: meta.height, widths };
  console.log(file, meta.width + 'x' + meta.height, widths.join('/'));
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');
