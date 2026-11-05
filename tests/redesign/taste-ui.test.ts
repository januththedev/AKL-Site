import test from 'node:test';
import assert from 'node:assert/strict';
import { digitStrips, stageStatuses, nextTick, holdMs, STAGE_MS, PASSED_MS, pullbackAt, holdProgress, seg, ease, clamp } from '../../components/taste/logic';

test('every counter strip starts and ends on its real digit, so the figure reads right without the roll', () => {
  const strips = digitStrips('125,000+');
  const digits = strips.filter(s => s.kind === 'digit');
  assert.equal(digits.length, 6);
  assert.deepEqual(strips.filter(s => s.kind === 'char').map(s => (s as { ch: string }).ch), [',', '+']);
  for (const s of digits) {
    if (s.kind !== 'digit') continue;
    assert.equal(s.cells[0], s.target);
    assert.equal(s.cells.at(-1), s.target);
    assert.equal(s.cells.length, s.turns * 10 + 1);
  }
});

test('later digits turn more, up to four times round', () => {
  const turns = digitStrips('1234567').flatMap(s => (s.kind === 'digit' ? [s.turns] : []));
  assert.deepEqual(turns, [1, 2, 3, 4, 4, 4, 4]);
});

test('the pipeline runs one stage at a time, passes, then starts again', () => {
  assert.deepEqual(stageStatuses(0), ['run', 'next', 'next', 'next']);
  assert.deepEqual(stageStatuses(2), ['done', 'done', 'run', 'next']);
  assert.deepEqual(stageStatuses(4), ['done', 'done', 'done', 'done']);
  let tick = 0;
  const seen: number[] = [];
  for (let i = 0; i < 6; i++) { seen.push(tick); tick = nextTick(tick); }
  assert.deepEqual(seen, [0, 1, 2, 3, 4, 0]);
  assert.equal(holdMs(1), STAGE_MS);
  assert.equal(holdMs(4), PASSED_MS);
});

test('the pull-back starts filling the stage centred and ends resting in its slot at scale 1', () => {
  const geo = { S0: 6, dx: 220, dy: -80 };
  const start = pullbackAt(0, geo);
  const end = pullbackAt(1, geo);
  assert.ok(Math.abs(start.s - 6) < 1e-9);
  assert.equal(start.tx, 220);
  assert.equal(start.ty, -80);
  assert.ok(Math.abs(end.s - 1) < 1e-9);
  assert.ok(Math.abs(end.tx) < 1e-9);
  assert.ok(Math.abs(end.ty) < 1e-9);
});

test('the pull-back scale only ever shrinks, and it eases in log space', () => {
  const geo = { S0: 8, dx: 0, dy: 0 };
  let previous = Infinity;
  for (let i = 0; i <= 100; i++) {
    const { s } = pullbackAt(i / 100, geo);
    assert.ok(s <= previous + 1e-9, `scale grew at ${i}%`);
    previous = s;
  }
  // halfway through the eased shrink the scale is the geometric mean of the ends
  const mid = pullbackAt(0.45, geo).s;
  assert.ok(Math.abs(mid - Math.sqrt(8)) < 1e-9);
});

test('scroll progress through a held stage is 0 at the section top and 1 once its end reaches the top', () => {
  assert.equal(holdProgress(200, 2700, 900), 0);
  assert.equal(holdProgress(0, 2700, 900), 0);
  assert.equal(holdProgress(-900, 2700, 900), 0.5);
  assert.equal(holdProgress(-1800, 2700, 900), 1);
  assert.equal(holdProgress(-5000, 2700, 900), 1);
  assert.equal(holdProgress(0, 800, 900), 1);
});

test('easing helpers stay inside their ends', () => {
  assert.equal(ease.inOut(0), 0);
  assert.equal(ease.inOut(1), 1);
  assert.equal(seg(0.2, 0.2, 0.6), 0);
  assert.equal(seg(0.8, 0.2, 0.6), 1);
  assert.equal(clamp(5, 0, 1), 1);
});

test('the vendored globe keeps the patch that draws every arc from Colombo', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../../public/taste/effects/dotted-globe/effect.js', import.meta.url), 'utf8');
  assert.match(source, /export function configureNetwork/);
  assert.match(source, /if \(NETWORK\) return NETWORK\.cities/);
  assert.match(source, /out\.push\(\[o, j\]\)/);
});
