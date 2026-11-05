import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultContent } from '../../content/default';
import {
  RECRUITMENT_COUNTRY_SLUGS,
  jsonLdText,
  organizationJsonLd,
  siteBaseUrl,
  sitemapRoutes,
} from '../../lib/structuredData';
import robots from '../../app/robots';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const PUBLIC_ROOT = join(ROOT, 'app', '(public)');
const FORBIDDEN_TOP_LEVEL = new Set(['for', 'admin', 'api', 'invite']);

function walkPages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walkPages(full);
    return entry.name === 'page.tsx' ? [full] : [];
  });
}

/** Route for a page file, e.g. app/(public)/industries/[slug]/page.tsx -> /industries/[slug]. */
function routeOf(file: string): string {
  const segments = relative(PUBLIC_ROOT, dirname(file)).split(sep).filter(Boolean);
  return '/' + segments.join('/');
}

const allPages = walkPages(PUBLIC_ROOT).map(file => ({ file, route: routeOf(file) }));
const publicPages = allPages.filter(page => !FORBIDDEN_TOP_LEVEL.has(page.route.split('/')[1] ?? ''));
const staticRoutes = publicPages.map(page => page.route).filter(route => !route.includes('['));

const SITE = 'https://example.test';

test('sitemap lists every static public page plus each industry and recruitment country', () => {
  const routes = sitemapRoutes({ base: siteBaseUrl(`${SITE}/`), industrySlugs: defaultContent.industries.map(item => item.slug) });
  const paths = new Set(routes.map(route => new URL(route.url).pathname));

  for (const route of staticRoutes) assert.ok(paths.has(route), `sitemap is missing ${route}`);
  for (const industry of defaultContent.industries) assert.ok(paths.has(`/industries/${industry.slug}`), `missing industry ${industry.slug}`);
  for (const country of RECRUITMENT_COUNTRY_SLUGS) assert.ok(paths.has(`/recruitment/${country}`), `missing country ${country}`);
  assert.equal(routes.length, staticRoutes.length + defaultContent.industries.length + RECRUITMENT_COUNTRY_SLUGS.length);
});

test('sitemap never contains admin, api, invite or private portfolio (/for) routes', () => {
  const routes = sitemapRoutes({ base: SITE, industrySlugs: defaultContent.industries.map(item => item.slug) });
  for (const route of routes) {
    const url = new URL(route.url);
    assert.equal(url.origin, SITE);
    assert.equal(FORBIDDEN_TOP_LEVEL.has(url.pathname.split('/')[1]), false, `forbidden route in sitemap: ${url.pathname}`);
  }
});

test('sitemap base URL is normalised and falls back to the production host', () => {
  assert.equal(siteBaseUrl('https://example.test///'), SITE);
  assert.equal(siteBaseUrl(''), 'https://al-karrim.net');
  const home = sitemapRoutes({ base: SITE, industrySlugs: [] })[0];
  assert.equal(home.url, `${SITE}/`);
  assert.equal(home.priority, 1);
});

test('recruitment country slugs match the names map used by the country page', () => {
  const source = readFileSync(join(PUBLIC_ROOT, 'recruitment', '[country]', 'page.tsx'), 'utf8');
  const names = source.match(/const names:Record<string,string>=\{([^}]*)\}/)?.[1];
  assert.ok(names, 'country page names map not found');
  const keys = [...names.matchAll(/(?:^|,)\s*(?:'([a-z-]+)'|([a-z-]+))\s*:\s*'/g)].map(match => match[1] ?? match[2]).sort();
  assert.deepEqual(keys, [...RECRUITMENT_COUNTRY_SLUGS].sort());
});

test('robots keeps the AI and private-area disallows and points at the normalised sitemap', () => {
  const previous = process.env.SITE_BASE_URL;
  process.env.SITE_BASE_URL = `${SITE}/`;
  try {
    const result = robots() as unknown as { rules: { userAgent: string | string[]; allow?: string; disallow?: string | string[] }[]; sitemap: string };
    assert.equal(result.sitemap, `${SITE}/sitemap.xml`);
    const general = result.rules.find(rule => rule.userAgent === '*');
    assert.ok(general, 'general rule missing');
    assert.deepEqual(general.disallow, ['/admin', '/api', '/invite', '/for/']);
    assert.equal(general.allow, '/');
    const ai = result.rules.find(rule => Array.isArray(rule.userAgent) && rule.userAgent.includes('GPTBot'));
    assert.equal(ai?.disallow, '/');
  } finally {
    if (previous === undefined) delete process.env.SITE_BASE_URL;
    else process.env.SITE_BASE_URL = previous;
  }
});

test('JSON-LD serialisation cannot close the script element or break out of it', () => {
  const hostile = { name: 'x</script><script>alert(1)</script>', note: 'a & b > c ( d )' };
  const text = jsonLdText(hostile);
  assert.doesNotMatch(text, /[<>&()]/);
  assert.doesNotMatch(text.toLowerCase(), /<\/script/);
  assert.deepEqual(JSON.parse(text), hostile);
});

test('organization JSON-LD uses the company facts and escapes hostile settings', () => {
  const data = organizationJsonLd({ settings: defaultContent.settings, base: SITE }) as Record<string, unknown>;
  assert.equal(data['@type'], 'EmploymentAgency');
  assert.equal(data.name, 'AL Karrim Lanka Consultants PVT LTD');
  assert.equal(data.foundingDate, '1980-08');
  assert.equal(data.logo, `${SITE}/brand/AKL-Official-Logo-512.png`);
  assert.equal(data.telephone, defaultContent.settings.phone);
  assert.equal(data.email, defaultContent.settings.email);
  assert.deepEqual(data.sameAs, [defaultContent.settings.facebookUrl]);
  assert.deepEqual(data.address, { '@type': 'PostalAddress', streetAddress: defaultContent.settings.address, addressCountry: 'LK' });

  const hostile = structuredClone(defaultContent.settings);
  hostile.phone = '</script><script>alert(1)</script>';
  hostile.facebookUrl = 'javascript:alert(1)';
  const hostileData = organizationJsonLd({ settings: hostile, base: SITE });
  const text = jsonLdText(hostileData);
  assert.doesNotMatch(text, /[<>&]/);
  assert.equal(hostileData.sameAs, undefined, 'non-HTTPS social link must not be emitted');
});

test('the public layout emits the organization JSON-LD as a single script element', () => {
  const layout = readFileSync(join(PUBLIC_ROOT, 'layout.tsx'), 'utf8');
  assert.equal(layout.match(/type="application\/ld\+json"/g)?.length, 1);
});

/** Metadata literals are read straight from the source so no page module (with its CSS imports) is loaded. */
function metadataWindow(file: string): { text: string } | null {
  const source = readFileSync(file, 'utf8');
  const anchor = source.search(/export (?:const metadata|async function generateMetadata|function generateMetadata)\b/);
  if (anchor < 0) return null;
  const next = source.indexOf('export default', anchor);
  return { text: source.slice(anchor, next > anchor ? next : source.length) };
}

test('every public page declares metadata with a canonical path matching its route', () => {
  for (const page of publicPages) {
    const metadata = metadataWindow(page.file);
    assert.ok(metadata, `${page.route} has no metadata or generateMetadata export`);
    assert.match(metadata.text, /title:/, `${page.route} metadata has no title`);
    assert.match(metadata.text, /description|SITE_DESCRIPTION/, `${page.route} metadata has no description`);
    const literalPath = metadata.text.match(/(?:path|canonical):\s*'([^']+)'/)?.[1];
    if (literalPath !== undefined) assert.equal(literalPath, page.route, `${page.route} canonical mismatch`);
    else assert.match(metadata.text, /path:\s*`/, `${page.route} has no canonical path`);
  }
});

test('literal page titles are unique across the public site', () => {
  const titles = new Map<string, string>();
  for (const page of publicPages) {
    const metadata = metadataWindow(page.file);
    const literal = metadata?.text.match(/title:\s*(?:\{\s*absolute:\s*)?'([^']+)'/)?.[1];
    if (!literal) continue;
    const previous = titles.get(literal);
    assert.equal(previous, undefined, `title "${literal}" used by ${previous} and ${page.route}`);
    titles.set(literal, page.route);
  }
  assert.ok(titles.size >= 12, 'expected most public pages to have literal titles');
});
