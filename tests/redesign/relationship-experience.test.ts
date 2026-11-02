import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { companyYear, yearsOfExperience, nextCompanyDateChange } from '../../lib/brand';
import { profileClients } from '../../lib/company-profile';
import catalog from '../../content/client-catalog.json';
import scene from '../../content/client-scene.json';

test('completed experience advances in August at Sri Lankan midnight, independently of copyright year', () => {
  const before = new Date('2027-07-31T18:29:59Z');
  const after = new Date('2027-07-31T18:30:00Z');
  assert.equal(yearsOfExperience(before), 46);
  assert.equal(yearsOfExperience(after), 47);
  assert.equal(yearsOfExperience(new Date('2027-01-01T00:00:00Z')), 46);
  assert.equal(companyYear(new Date('2027-01-01T00:00:00Z')), 2027);
  assert.equal(yearsOfExperience(new Date('1979-12-31T18:30:00Z')), 0);
  assert.equal(nextCompanyDateChange('experience', before).toISOString(), after.toISOString());
  assert.equal(nextCompanyDateChange('experience', after).toISOString(), '2028-07-31T18:30:00.000Z');
  assert.equal(nextCompanyDateChange('year', before).toISOString(), '2027-12-31T18:30:00.000Z');
});

test('the restored photo opening and its session behaviour match the pre-client-change version', () => {
  const expected = {
    'components/Intro.tsx': 'de161b2036b494d3a14ec232bbe81e4c9e87d123d702b7318dd43338c4f529c4',
    'components/intro.css': 'f2e8062fa180a9b39d71909a87701f591b51b79593fb2de7a45469978a9f6ab4',
    'lib/intro.ts': '20a8297851c778b81feead1045dfa40149d550d189d74764c029b749685f8a9b',
    'content/client-logos.json': 'b2adb04deeda75fcf6ec762948498dd4910dc679bfd143b5efc143109b9f27cb',
  };
  for (const [file, digest] of Object.entries(expected)) {
    assert.equal(createHash('sha256').update(readFileSync(new URL(`../../${file}`, import.meta.url))).digest('hex'), digest, file);
  }
});

test('the coded scene count, priority order and actual company artwork agree with the verified catalogue', () => {
  const key = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const names = new Set(profileClients.map(client => key(client.name)));
  assert.equal(new Set(catalog.map(logo => logo.id)).size, catalog.length);
  assert.equal(new Set(scene.logoIds).size, scene.logoCount);
  assert.ok(scene.logoCount <= 100 && scene.logoCount > 8);
  assert.deepEqual(scene.logoIds, catalog.slice(0, 100).map(logo => logo.id));
  const priorities = ['saptco', 'public-transportation', 'riyadh-cables', 'sapco', 'lodige'];
  assert.deepEqual(scene.logoIds.slice(0, priorities.length - scene.missingPriority.length), priorities.filter(id => !scene.missingPriority.includes(id)));
  assert.equal(scene.exactSequenceReady, scene.logoCount === 100 && scene.missingPriority.length === 0);
  const hashes = new Set<string>();
  for (const logo of catalog) {
    assert.ok(names.has(key(logo.profileName)), logo.name);
    assert.match(logo.src, /^\/clients\/(?:verified-[ab]\/)?[a-z0-9-]+\.(png|jpe?g|webp|svg)$/);
    const asset = readFileSync(new URL(`../../public${logo.src}`, import.meta.url));
    const hash = createHash('sha256').update(asset).digest('hex');
    assert.ok(!hashes.has(hash), `Repeated artwork: ${logo.name}`);
    hashes.add(hash);
    assert.ok(logo.width > 0 && logo.height > 0 && /^https:\/\//.test(logo.sourceUrl));
    if (logo.src.endsWith('.svg')) assert.doesNotMatch(asset.toString(), /<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/i, logo.name);
  }
  for (const layout of [scene.landscape, scene.portrait]) {
    assert.ok(layout.width > 0 && layout.height > 0 && layout.initialScale > 1);
    assert.ok(layout.centerX > 0 && layout.centerX < 1 && layout.centerY > 0 && layout.centerY < 1);
    assert.deepEqual(layout.layers.map(layer => layer.group), ['core', 'lodige', 'ring', 'outer']);
    assert.equal(layout.layers.reduce((sum, layer) => sum + layer.bytes, 0), layout.totalBytes);
    for (const layer of layout.layers) {
      const file = readFileSync(new URL(`../../public${layer.src}`, import.meta.url));
      assert.equal(createHash('sha256').update(file).digest('hex'), layer.sha256);
      assert.equal(file.byteLength, layer.bytes);
      assert.equal(file.subarray(8, 12).toString(), 'WEBP');
    }
  }
});
