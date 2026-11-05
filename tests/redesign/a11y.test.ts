import test from 'node:test';
import assert from 'node:assert/strict';
import { browseTarget, trapTabTarget, wrapIndex } from '../../lib/a11y';

test('wrapIndex wraps both directions and tolerates empty lists', () => {
  assert.equal(wrapIndex(-1, 5), 4);
  assert.equal(wrapIndex(5, 5), 0);
  assert.equal(wrapIndex(7, 5), 2);
  assert.equal(wrapIndex(3, 0), 0);
});

test('browseTarget maps keys to the next index with wrap-around', () => {
  assert.equal(browseTarget(0, 4, 'ArrowRight'), 1);
  assert.equal(browseTarget(3, 4, 'ArrowRight'), 0);
  assert.equal(browseTarget(0, 4, 'ArrowLeft'), 3);
  assert.equal(browseTarget(2, 4, 'Home'), 0);
  assert.equal(browseTarget(1, 4, 'End'), 3);
  assert.equal(browseTarget(1, 4, 'a'), null);
  assert.equal(browseTarget(0, 0, 'ArrowRight'), null);
});

test('trapTabTarget loops at the edges and recovers stray focus', () => {
  assert.equal(trapTabTarget(2, 3, false), 0);
  assert.equal(trapTabTarget(0, 3, true), 2);
  assert.equal(trapTabTarget(1, 3, false), null);
  assert.equal(trapTabTarget(1, 3, true), null);
  assert.equal(trapTabTarget(-1, 3, false), 0);
  assert.equal(trapTabTarget(-1, 3, true), 2);
  assert.equal(trapTabTarget(0, 1, false), 0);
  assert.equal(trapTabTarget(0, 0, false), null);
});
