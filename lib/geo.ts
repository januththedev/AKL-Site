/*
 * Geography for the "Talent Routes" map.
 *
 * Approximate capital / major-city coordinates, used only to place illustrative pins on the
 * AKL logo-globe. Region-type destinations (Europe, Australia, the Gulf ...) use a representative
 * city; the map always labels a pin with the destination title, never the city.
 * No external data, no map tiles: a handful of numbers and a projection.
 */

export type GeoPoint = { city: string; lat: number; lon: number };

/** Colombo: where every route starts. */
export const ORIGIN: GeoPoint = { city: 'Colombo', lat: 6.93, lon: 79.85 };

/** The logo globe in a 512x320 box (same ellipse ratio as the official mark: 220.5 / 138). */
export const GLOBE = { w: 512, h: 320, cx: 256, cy: 160, rx: 220.5, ry: 138 } as const;

type Entry = { keys: string[]; point: GeoPoint };

const ENTRIES: Entry[] = [
  { keys: ['sri lanka', 'colombo'], point: ORIGIN },
  { keys: ['united arab emirates', 'uae', 'dubai', 'abu dhabi'], point: { city: 'Dubai', lat: 25.2, lon: 55.27 } },
  { keys: ['saudi arabia', 'saudi', 'ksa'], point: { city: 'Riyadh', lat: 24.71, lon: 46.68 } },
  { keys: ['kuwait'], point: { city: 'Kuwait City', lat: 29.38, lon: 47.98 } },
  { keys: ['qatar'], point: { city: 'Doha', lat: 25.29, lon: 51.53 } },
  { keys: ['oman'], point: { city: 'Muscat', lat: 23.59, lon: 58.41 } },
  { keys: ['bahrain'], point: { city: 'Manama', lat: 26.23, lon: 50.58 } },
  { keys: ['jordan'], point: { city: 'Amman', lat: 31.95, lon: 35.93 } },
  { keys: ['lebanon'], point: { city: 'Beirut', lat: 33.89, lon: 35.5 } },
  { keys: ['the gulf', 'gulf', 'middle east'], point: { city: 'Doha', lat: 25.29, lon: 51.53 } },
  { keys: ['maldives'], point: { city: 'Male', lat: 4.18, lon: 73.51 } },
  { keys: ['india'], point: { city: 'New Delhi', lat: 28.61, lon: 77.21 } },
  { keys: ['malaysia'], point: { city: 'Kuala Lumpur', lat: 3.14, lon: 101.69 } },
  { keys: ['singapore'], point: { city: 'Singapore', lat: 1.35, lon: 103.82 } },
  { keys: ['hong kong'], point: { city: 'Hong Kong', lat: 22.32, lon: 114.17 } },
  { keys: ['japan'], point: { city: 'Tokyo', lat: 35.68, lon: 139.69 } },
  { keys: ['south korea', 'korea'], point: { city: 'Seoul', lat: 37.57, lon: 126.98 } },
  { keys: ['asia', 'far east'], point: { city: 'Singapore', lat: 1.35, lon: 103.82 } },
  { keys: ['australia'], point: { city: 'Sydney', lat: -33.87, lon: 151.21 } },
  { keys: ['new zealand'], point: { city: 'Auckland', lat: -36.85, lon: 174.76 } },
  { keys: ['united kingdom', 'uk', 'britain', 'england'], point: { city: 'London', lat: 51.51, lon: -0.13 } },
  { keys: ['germany'], point: { city: 'Berlin', lat: 52.52, lon: 13.4 } },
  { keys: ['italy'], point: { city: 'Rome', lat: 41.9, lon: 12.5 } },
  { keys: ['romania'], point: { city: 'Bucharest', lat: 44.43, lon: 26.1 } },
  { keys: ['poland'], point: { city: 'Warsaw', lat: 52.23, lon: 21.01 } },
  { keys: ['cyprus'], point: { city: 'Nicosia', lat: 35.17, lon: 33.37 } },
  { keys: ['croatia'], point: { city: 'Zagreb', lat: 45.81, lon: 15.98 } },
  { keys: ['europe'], point: { city: 'Frankfurt', lat: 50.11, lon: 8.68 } },
];

// Whole-word match so e.g. "oman" does not hit "romania".
const MATCHERS = ENTRIES.map(e => ({
  point: e.point,
  tests: e.keys.map(k => new RegExp(`(?:^|[^a-z])${k}(?:$|[^a-z])`)),
}));

/** Resolve a destination (by slug first, then title) to an approximate point, or null if unknown. */
export function resolveGeo(slug: string, title = ''): GeoPoint | null {
  const bySlug = ` ${slug.toLowerCase().replace(/[-_]+/g, ' ')} `;
  const byTitle = ` ${title.toLowerCase()} `;
  for (const hay of [bySlug, byTitle]) {
    for (const m of MATCHERS) if (m.tests.some(t => t.test(hay))) return m.point;
  }
  return null;
}

export const isOrigin = (p: GeoPoint) => p.lat === ORIGIN.lat && p.lon === ORIGIN.lon;

export type Projection = {
  s: number; // viewBox units per degree
  cLon: number;
  cLat: number;
  project: (lon: number, lat: number) => { x: number; y: number };
};

/**
 * Sinusoidal-style projection scaled to the logo ellipse: parallels are straight chords and
 * meridians are half-ellipses, exactly like the grid drawn on the AKL mark. The frame is fitted
 * to the points so Colombo, the Gulf, Europe, Asia or Australia always land inside the globe.
 */
export function makeProjection(points: GeoPoint[]): Projection {
  const { cx, cy, rx, ry } = GLOBE;
  const lons = points.map(p => p.lon);
  const lats = points.map(p => p.lat);
  const cLon = (Math.min(...lons) + Math.max(...lons)) / 2;
  const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const dLon = Math.max(8, (Math.max(...lons) - Math.min(...lons)) / 2);
  const dLat = Math.max(5, (Math.max(...lats) - Math.min(...lats)) / 2);
  const s = Math.min((rx * 0.68) / dLon, (ry * 0.64) / dLat, 12);
  const project = (lon: number, lat: number) => {
    const yRaw = -(lat - cLat) * s;
    const v = Math.max(-0.995, Math.min(0.995, yRaw / ry));
    return { x: cx + (lon - cLon) * s * Math.sqrt(1 - v * v), y: cy + yRaw };
  };
  return { s, cLon, cLat, project };
}

export type Pt = { x: number; y: number };

const f2 = (n: number) => Math.round(n * 100) / 100;

/** Quadratic arc lifted above the chord (towards the top of the globe), kept inside the ellipse. */
export function arcBetween(a: Pt, b: Pt): { d: string; apex: Pt } {
  const { cx, cy, rx, ry } = GLOBE;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; } // always lift upwards
  let lift = Math.max(18, len * 0.3);
  let c: Pt = { x: 0, y: 0 };
  let apex: Pt = { x: 0, y: 0 };
  for (let i = 0; i < 8; i++) {
    c = { x: (a.x + b.x) / 2 + nx * lift, y: (a.y + b.y) / 2 + ny * lift };
    apex = { x: (a.x + 2 * c.x + b.x) / 4, y: (a.y + 2 * c.y + b.y) / 4 };
    if (((apex.x - cx) / rx) ** 2 + ((apex.y - cy) / ry) ** 2 <= 0.86) break;
    lift *= 0.8;
  }
  return { d: `M${f2(a.x)} ${f2(a.y)}Q${f2(c.x)} ${f2(c.y)} ${f2(b.x)} ${f2(b.y)}`, apex };
}

/** Graticule matching the projection: round-number parallels (chords) and meridians (half-ellipses). */
export function graticule(p: Projection) {
  const { cx, cy, rx, ry } = GLOBE;
  const step = [5, 10, 15, 20, 30, 45].find(st => p.s * st >= 40) ?? 45;

  const parallels: string[] = [];
  const ticks: { x: number; y: number; text: string; anchor: 'start' | 'middle' }[] = [];
  const deg = (n: number, pos: string, neg: string) => `${Math.abs(n)}°${n >= 0 ? pos : neg}`;
  const latMin = p.cLat - ry / p.s;
  const latMax = p.cLat + ry / p.s;
  for (let lat = Math.ceil(latMin / step) * step; lat <= latMax; lat += step) {
    const y = cy - (lat - p.cLat) * p.s;
    const v = (y - cy) / ry;
    if (Math.abs(v) > 0.96) continue;
    const half = rx * Math.sqrt(1 - v * v);
    parallels.push(`M${f2(cx - half)} ${f2(y)}H${f2(cx + half)}`);
    ticks.push({ x: f2(cx - half + 7), y: f2(y - 3.5), text: deg(lat, 'N', 'S'), anchor: 'start' });
  }

  const meridians: string[] = [];
  const lonMin = p.cLon - rx / p.s;
  const lonMax = p.cLon + rx / p.s;
  for (let lon = Math.ceil(lonMin / step) * step; lon <= lonMax; lon += step) {
    const delta = (lon - p.cLon) * p.s;
    const r = Math.abs(delta);
    if (r > rx - 6) continue;
    if (r < 0.75) meridians.push(`M${cx} ${f2(cy - ry)}V${f2(cy + ry)}`);
    else meridians.push(`M${cx} ${f2(cy - ry)}A${f2(r)} ${ry} 0 0 ${delta > 0 ? 1 : 0} ${cx} ${f2(cy + ry)}`);
    // label each meridian just inside the bottom edge of the globe (where it crosses v = 0.84)
    const k = Math.sqrt(1 - 0.84 * 0.84);
    ticks.push({ x: f2(cx + delta * k), y: f2(cy + ry * 0.84 + 3), text: deg(lon, 'E', 'W'), anchor: 'middle' });
  }
  return { parallels, meridians, ticks, step };
}
