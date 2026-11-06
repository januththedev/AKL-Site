import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNetwork, nextStop, nodeFor, tourOrder, tourStart } from '../../components/taste/destinations';
import { defaultContent } from '../../content/default';
import { withProfileReach } from '../../lib/company-profile';
import { ORIGIN } from '../../lib/geo';
import type { Destination } from '../../lib/types';

const list = withProfileReach(defaultContent.destinations);
const dest = (slug: string, title = slug): Destination => ({ slug, title, region: 'R', description: 'D', image: '/x.webp' });

test('the globe is built from the same destinations the home page lists, Colombo first', () => {
  const hubs = buildNetwork(list);
  assert.ok(hubs.network);
  const net = hubs.network!;
  assert.equal(net.origin, 0);
  assert.deepEqual(net.cities[0], [ORIGIN.lon, ORIGIN.lat]);
  assert.equal(net.names[0], 'Colombo');
  assert.equal(hubs.hubOf.length, list.length);
  // every destination of the content has a node, and the "Sri Lanka" entry is Colombo itself
  assert.ok(hubs.hubOf.every(node => node >= 0));
  assert.equal(hubs.home, list.findIndex(d => d.slug === 'sri-lanka'));
  assert.equal(hubs.hubOf[hubs.home], 0);
});

test('each node carries the title of the destination placed on it', () => {
  const hubs = buildNetwork(list);
  const net = hubs.network!;
  list.forEach((d, i) => {
    if (i === hubs.home) return;
    assert.equal(net.names[hubs.hubOf[i]], d.title);
  });
  assert.equal(net.cities.length, net.names.length);
});

test('destinations on the same spot share one node, and unknown places stay off the map', () => {
  const hubs = buildNetwork([dest('dubai'), dest('uae', 'United Arab Emirates'), dest('narnia', 'Narnia'), dest('qatar')]);
  assert.equal(hubs.hubOf[0], hubs.hubOf[1]);
  assert.equal(hubs.hubOf[2], -1);
  assert.notEqual(hubs.hubOf[3], hubs.hubOf[0]);
  assert.equal(hubs.network!.cities.length, 3); // Colombo, Dubai, Doha
  assert.equal(nodeFor(hubs, 2), 0);              // an unknown place shows the whole network
  assert.equal(nodeFor(hubs, 99), 0);
});

test('with nothing but Colombo there is no network to draw', () => {
  assert.equal(buildNetwork([dest('sri-lanka', 'Sri Lanka')]).network, null);
  assert.equal(buildNetwork([]).network, null);
});

test('the overview faces the middle of the network', () => {
  const net = buildNetwork(list).network!;
  const lons = net.cities.map(c => c[0]);
  assert.ok(net.view > Math.min(...lons) && net.view < Math.max(...lons));
});

test('the tour starts at Colombo, visits every other destination once in content order, then comes round', () => {
  const hubs = buildNetwork(list);
  const order = tourOrder(list.length, hubs.home);
  assert.equal(order[0], hubs.home);
  assert.equal(order.length, list.length);
  assert.deepEqual([...order].sort((a, b) => a - b), list.map((_, i) => i));
  assert.deepEqual(order.slice(1), list.map((_, i) => i).filter(i => i !== hubs.home));
  assert.equal(tourStart(hubs), hubs.home);
  let at = order[0];
  const walked: number[] = [];
  for (let i = 0; i < order.length; i++) { walked.push(at); at = nextStop(order, at); }
  assert.deepEqual(walked, order);
  assert.equal(at, order[0]); // wrapped
});

test('without a Colombo entry the tour starts at the first destination', () => {
  const hubs = buildNetwork([dest('europe', 'Europe'), dest('australia', 'Australia')]);
  assert.equal(hubs.home, -1);
  assert.equal(tourStart(hubs), 0);
  assert.deepEqual(tourOrder(2, -1), [0, 1]);
  assert.equal(nextStop([], 0), 0);
});

test('the vendored globe keeps the patch that turns it to a chosen node', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../../public/taste/effects/dotted-globe/effect.js', import.meta.url), 'utf8');
  assert.match(source, /export function focusHub/);
  assert.match(source, /INSTANCES\.set\(el, /);
  assert.match(source, /names: Array\.isArray\(n\.names\)/);
});
