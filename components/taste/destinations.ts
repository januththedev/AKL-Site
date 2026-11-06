// Pure helpers that tie the site's destinations content to the globe: which node each destination is on the
// globe, and how the tour steps through them. No DOM and no React, so all of it is tested in node.
import { ORIGIN, isOrigin, resolveGeo } from '../../lib/geo';
import type { Destination } from '../../lib/types';

export type GlobeNetwork = {
  /** [longitude, latitude] of every node. Node 0 is Colombo, where every route starts. */
  cities: [number, number][];
  /** The label of each node: Colombo, then the title of the first destination placed there. */
  names: string[];
  origin: number;
  /** The longitude that faces the viewer when nothing in particular is chosen. */
  view: number;
};

export type DestinationHubs = {
  /** null when the content has nothing but Colombo to draw. */
  network: GlobeNetwork | null;
  /** For each destination: its node (0 is Colombo itself), or -1 when it has no place on the map. */
  hubOf: number[];
  /** The destination that stands for Colombo (the "Sri Lanka" entry), or -1. */
  home: number;
};

const place = (lon: number, lat: number) => `${lon.toFixed(2)},${lat.toFixed(2)}`;

/**
 * Places every destination of the content on the globe, using the same coordinates as the Talent Routes map.
 * Destinations that land on the same spot share one node; a destination that is Colombo is the origin itself.
 */
export function buildNetwork(destinations: readonly Destination[]): DestinationHubs {
  const cities: [number, number][] = [[ORIGIN.lon, ORIGIN.lat]];
  const names = ['Colombo'];
  const known = new Map<string, number>([[place(ORIGIN.lon, ORIGIN.lat), 0]]);
  let home = -1;
  const hubOf = destinations.map((destination, index) => {
    const geo = resolveGeo(destination.slug, destination.title);
    if (!geo) return -1;
    if (isOrigin(geo)) {
      if (home < 0) home = index;
      return 0;
    }
    const spot = place(geo.lon, geo.lat);
    const found = known.get(spot);
    if (found !== undefined) return found;
    cities.push([geo.lon, geo.lat]);
    names.push(destination.title);
    known.set(spot, cities.length - 1);
    return cities.length - 1;
  });
  if (cities.length < 2) return { network: null, hubOf, home };
  // face the middle of the network, so the overview shows as many routes as one side of a globe can
  const lons = cities.map(city => city[0]).sort((a, b) => a - b);
  const mid = lons.length >> 1;
  const view = lons.length % 2 ? lons[mid] : (lons[mid - 1] + lons[mid]) / 2;
  return { network: { cities, names, origin: 0, view }, hubOf, home };
}

/** The globe node to turn to for a destination; one with no place on the map shows the whole network. */
export const nodeFor = (hubs: DestinationHubs, destination: number) => {
  const node = hubs.hubOf[destination];
  return node === undefined || node < 0 ? 0 : node;
};

/** Where the tour starts: Colombo's own entry when the content has one, otherwise the first destination. */
export const tourStart = (hubs: DestinationHubs) => (hubs.home >= 0 ? hubs.home : 0);

/** The order the tour visits: Colombo first, then every other destination in the content's own order. */
export function tourOrder(count: number, home: number) {
  const all = Array.from({ length: Math.max(0, count) }, (_, index) => index);
  return home >= 0 && home < count ? [home, ...all.filter(index => index !== home)] : all;
}

/** The stop after `current`, wrapping round. */
export function nextStop(order: readonly number[], current: number) {
  if (!order.length) return 0;
  const at = order.indexOf(current);
  return order[(at + 1) % order.length];
}

/** How long the tour rests on each destination. */
export const TOUR_DWELL_MS = 4800;
