import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { buildSrcSet, variantUrl, type ImageVariants } from '../../components/responsive-image';

const manifest = JSON.parse(readFileSync(new URL('../../components/image-variants.json', import.meta.url), 'utf8')) as ImageVariants;

test('builds a width-descriptor srcset ending with the original', () => {
  assert.equal(
    buildSrcSet('/media/hero-team.webp', manifest),
    '/media/r/hero-team-640.webp 640w, /media/r/hero-team-1024.webp 1024w, /media/r/hero-team-1600.webp 1600w, /media/hero-team.webp 1680w',
  );
});

test('only variants narrower than the original are listed (portrait 1120px source)', () => {
  assert.match(buildSrcSet('/media/dubai-night.webp', manifest)!, /^\/media\/r\/dubai-night-640\.webp 640w, \/media\/r\/dubai-night-1024\.webp 1024w, \/media\/dubai-night\.webp 1120w$/);
});

test('unknown, external and non-media URLs are left alone', () => {
  for (const src of ['/media/not-there.webp', 'https://cdn.example.com/a.webp', '/intro/hero-team.webp', '/media/r/hero-team-640.webp', '__proto__', 'constructor']) {
    assert.equal(buildSrcSet(src, manifest), null, src);
  }
  assert.equal(variantUrl('/brand/logo.png', 640), '/brand/logo.png');
});

test('every manifest variant exists on disk with the original still in place', () => {
  for (const [src, entry] of Object.entries(manifest)) {
    assert.ok(existsSync(new URL(`../../public${src}`, import.meta.url)), src);
    for (const w of entry.widths) assert.ok(w < entry.width && existsSync(new URL(`../../public${variantUrl(src, w)}`, import.meta.url)), `${src} ${w}`);
  }
});
