import test from 'node:test';
import assert from 'node:assert/strict';
import { industryAtScroll, industryChapterOffset } from '../../lib/industry-scroll';
import scene from '../../content/client-scene.json';

test('all seven industries are reachable in order and in reverse with ordinary scroll offsets', () => {
  const step = 420;
  const chapters = Array.from({ length: 7 }, (_, index) => industryChapterOffset(index, step, 7));
  assert.deepEqual(chapters.map(offset => industryAtScroll(offset, step, 7)), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(chapters.toReversed().map(offset => industryAtScroll(offset, step, 7)), [6, 5, 4, 3, 2, 1, 0]);
  assert.equal(industryAtScroll(step - .01, step, 7), 0);
  assert.equal(industryAtScroll(step, step, 7), 1);
  assert.equal(industryAtScroll(100_000, step, 7), 6);
  assert.equal(industryAtScroll(-100, step, 7), 0);
});

test('missing geometry or a single industry never produces an invalid selection', () => {
  for (const offset of [0, -1, NaN, Infinity]) {
    assert.equal(industryAtScroll(offset, 0, 7), 0);
    assert.equal(industryAtScroll(offset, 400, 1), 0);
    assert.equal(industryAtScroll(offset, 400, 0), 0);
  }
  assert.equal(industryChapterOffset(100, 400, 7), 6.15 * 400);
  assert.equal(industryChapterOffset(-1, 400, 7), .15 * 400);
});

test('the separate coded client sequence lasts exactly two seconds', () => {
  assert.equal(scene.duration, 2000);
});
