import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCapability, can } from '../../lib/policy';
import {
  PORTFOLIO_SLUG_PATTERN, allocateSlug, buildSlug, isPortfolioSlug, orderIndustries, portfolioCreateSchema, portfolioDeleteSchema, portfolioEmailText,
  portfolioStatus, portfolioStatusSchema, portfolioUpdateSchema, portfolioWhatsAppUrl, randomSuffix, shouldCountView, slugifyCompany,
} from '../../lib/portfolioValidation';
import type { Member } from '../../lib/types';

const sectors = ['hospitality', 'construction', 'engineering', 'logistics'];
const member = (role: Member['role'], active = true): Member => ({ id: 'a', auth_user_id: 'u', email: 'x@example.invalid', display_name: '', role, active, access_version: 1 });
const fixedBytes = (...values: number[]) => () => Uint8Array.from(values);

// ---------------------------------------------------------------- slugs
test('slugs are the slugified company name plus six random lower-case alphanumerics', () => {
  const slug = buildSlug('Al Noor Hospitality & Catering L.L.C.');
  assert.match(slug, PORTFOLIO_SLUG_PATTERN);
  assert.match(slug, /^al-noor-hospitality-and-catering-l-l-c-[a-z0-9]{10}$/);
  assert.equal(isPortfolioSlug(slug), true);
});
test('slugifying strips accents and symbols, truncates cleanly and never returns an empty base', () => {
  assert.equal(slugifyCompany('  Café  Île — Müller GmbH '), 'cafe-ile-muller-gmbh');
  assert.equal(slugifyCompany('شركة النور'), 'company');
  assert.equal(slugifyCompany('---'), 'company');
  const long = slugifyCompany('word '.repeat(30));
  assert.ok(long.length <= 40 && !long.endsWith('-') && !long.startsWith('-'));
});
test('the random suffix is unbiased over 36 symbols and uses rejection sampling', () => {
  // bytes >= 252 are discarded; 0->a, 25->z, 26->0, 35->9, 36 wraps to a, 251 -> 35 -> 9
  assert.equal(randomSuffix(fixedBytes(255, 253, 0, 25, 26, 35, 36, 251, 252, 1, 2, 3), 6), 'az09a9');
  const many = randomSuffix(undefined, 6);
  assert.match(many, /^[a-z0-9]{6}$/);
  assert.throws(() => randomSuffix(fixedBytes(255, 255, 255, 255), 6), /RANDOM_SOURCE_FAILED/);
});
test('generated slugs are unique in practice and never contain the company name unsafely', () => {
  const seen = new Set<string>();
  for (let i = 0; i < 300; i++) seen.add(buildSlug('Same Company'));
  assert.equal(seen.size, 300);
});
test('slug allocation retries on a collision and gives up with CONFLICT', async () => {
  const taken = new Set<string>();
  const calls: string[] = [];
  const claim = async (slug: string) => { calls.push(slug); if (taken.has(slug)) return null; taken.add(slug); return { slug }; };
  // A stuck random source always yields the same suffix, so the second allocation collides every time.
  const stuck = fixedBytes(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19);
  const first = await allocateSlug('Acme', claim, stuck);
  assert.equal(first.slug, 'acme-abcdefghij');
  await assert.rejects(() => allocateSlug('Acme', claim, stuck, 3), /CONFLICT/);
  assert.equal(calls.length, 4);
  // A real source succeeds on the first try even after a prior collision.
  assert.ok((await allocateSlug('Acme', claim)).slug.startsWith('acme-'));
});
test('only well-formed slugs are accepted by the public lookup', () => {
  for (const good of ['acme-abc123defg', 'a-b-c-d-zzzzzzzzzz']) assert.equal(isPortfolioSlug(good), true);
  for (const bad of ['', 'acme', 'acme-abc123', 'acme-abc123def', 'acme-ABC123DEFG', 'acme_abc123defg', '../etc/passwd', 'acme-abc123defg/', 'acme-abc123defg ', `${'a'.repeat(80)}-abc123defg`, 'acme--abc123defg', undefined, 42]) assert.equal(isPortfolioSlug(bad), false, String(bad));
});

// ---------------------------------------------------------------- status
test('status is computed from is_active and expiry with an injected clock', () => {
  const now = new Date('2026-11-01T00:00:00Z');
  assert.equal(portfolioStatus({ is_active: true, expires_at: null }, now), 'active');
  assert.equal(portfolioStatus({ is_active: true, expires_at: '2026-11-01T00:00:01Z' }, now), 'active');
  assert.equal(portfolioStatus({ is_active: true, expires_at: '2026-11-01T00:00:00Z' }, now), 'expired');
  assert.equal(portfolioStatus({ is_active: true, expires_at: new Date('2026-10-31T23:59:59Z') }, now), 'expired');
  assert.equal(portfolioStatus({ is_active: false, expires_at: null }, now), 'disabled');
  assert.equal(portfolioStatus({ is_active: false, expires_at: '2020-01-01T00:00:00Z' }, now), 'disabled');
  assert.equal(portfolioStatus({ is_active: true, expires_at: 'not a date' }, now), 'expired');
});

// ---------------------------------------------------------------- permissions
test('both roles can list, create, edit and disable links but only a Super Admin can delete', () => {
  assert.equal(can('admin', 'portfolio'), true);
  assert.equal(can('super_admin', 'portfolio'), true);
  assert.equal(can('admin', 'portfolio.delete'), false);
  assert.equal(can('super_admin', 'portfolio.delete'), true);
});
test('delete is enforced by assertCapability, including for suspended members', () => {
  assert.throws(() => assertCapability(member('admin'), 'portfolio.delete'), /FORBIDDEN/);
  assert.doesNotThrow(() => assertCapability(member('super_admin'), 'portfolio.delete'));
  assert.doesNotThrow(() => assertCapability(member('admin'), 'portfolio'));
  assert.throws(() => assertCapability(member('super_admin', false), 'portfolio'), /FORBIDDEN/);
  assert.equal(can('admin', 'portfolio.destroy.everything'), false);
});

// ---------------------------------------------------------------- validation
const valid = { company_name: 'Al Noor Catering', contact_name: 'Fatima', country: 'Oman', sectors: ['hospitality', 'logistics'], roles: ['Assistant chef'], intro_message: 'Hello', show_clients: false, expires_at: '2027-01-01T00:00:00.000Z' };
const now = () => new Date('2026-11-01T00:00:00Z');
test('a valid link input parses and applies defaults', () => {
  const schema = portfolioCreateSchema(sectors, now);
  assert.deepEqual(schema.parse(valid), valid);
  assert.deepEqual(schema.parse({ company_name: 'Only a name' }), { company_name: 'Only a name', contact_name: '', country: '', sectors: [], roles: [], intro_message: '', show_clients: true, expires_at: null });
});
test('unknown sectors, empty names and over-long fields are rejected', () => {
  const schema = portfolioCreateSchema(sectors, now);
  const bad: Record<string, unknown>[] = [
    { ...valid, sectors: ['hospitality', 'space-tourism'] },
    { ...valid, sectors: ['Hospitality'] },
    { ...valid, sectors: Array(13).fill('hospitality') },
    { ...valid, company_name: '   ' },
    { ...valid, company_name: 'x'.repeat(161) },
    { ...valid, contact_name: 'x'.repeat(121) },
    { ...valid, country: 'x'.repeat(101) },
    { ...valid, intro_message: 'x'.repeat(1201) },
    { ...valid, roles: ['x'.repeat(101)] },
    { ...valid, roles: [''] },
    { ...valid, roles: Array(21).fill('Welder') },
    { ...valid, show_clients: 'yes' },
    { ...valid, expires_at: 'tomorrow' },
    { ...valid, expires_at: '2026-10-31T00:00:00.000Z' },
  ];
  for (const input of bad) assert.equal(schema.safeParse(input).success, false, JSON.stringify(input).slice(0, 80));
});
test('unknown keys are stripped so they can never reach the database', () => {
  const parsed = portfolioCreateSchema(sectors, now).parse({ ...valid, view_count: 9999, is_active: false, slug: 'evil-aaaaaa', created_by: 'x', role: 'super_admin' });
  assert.deepEqual(Object.keys(parsed).sort(), Object.keys(valid).sort());
  assert.equal('view_count' in parsed, false);
});
test('duplicate sectors collapse and text is trimmed', () => {
  const parsed = portfolioCreateSchema(sectors, now).parse({ ...valid, company_name: '  Padded  ', sectors: ['logistics', 'logistics', 'hospitality'] });
  assert.equal(parsed.company_name, 'Padded');
  assert.deepEqual(parsed.sectors, ['logistics', 'hospitality']);
});
test('editing allows any expiry and requires a real id; status and delete payloads are strict', () => {
  const update = portfolioUpdateSchema(sectors);
  const id = '7f5ceec5-132a-4210-83d5-58eb50bd02b6';
  assert.equal(update.safeParse({ ...valid, id, expires_at: '2020-01-01T00:00:00.000Z' }).success, true);
  assert.equal(update.safeParse({ ...valid, id: 'nope' }).success, false);
  assert.equal(update.safeParse({ ...valid }).success, false);
  assert.equal(portfolioStatusSchema.safeParse({ id, active: false }).success, true);
  assert.equal(portfolioStatusSchema.safeParse({ id, active: 'false' }).success, false);
  assert.equal(portfolioStatusSchema.safeParse({ id, active: true, slug: 'x' }).success, false);
  assert.equal(portfolioDeleteSchema.safeParse({ id }).success, true);
  assert.equal(portfolioDeleteSchema.safeParse({ id, force: true }).success, false);
});

// ---------------------------------------------------------------- public page helpers
test('selected industries come first in the order chosen and are flagged; the rest keep their order', () => {
  const industries = ['hospitality', 'construction', 'engineering', 'logistics'].map((slug) => ({ slug, title: slug }));
  const ordered = orderIndustries(industries, ['logistics', 'hospitality', 'unknown']);
  assert.deepEqual(ordered.map((x) => x.slug), ['logistics', 'hospitality', 'construction', 'engineering']);
  assert.deepEqual(ordered.map((x) => x.selected), [true, true, false, false]);
  assert.deepEqual(orderIndustries(industries, []).map((x) => x.slug), industries.map((x) => x.slug));
});
const headers = (values: Record<string, string>) => ({ get: (name: string) => values[name.toLowerCase()] ?? null });
const chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
test('views count real browser navigations only', () => {
  assert.equal(shouldCountView(headers({ 'user-agent': chrome, 'sec-fetch-dest': 'document' })), true);
  assert.equal(shouldCountView(headers({ 'user-agent': chrome })), true); // older browsers without Sec-Fetch-*
  assert.equal(shouldCountView(headers({ 'user-agent': chrome, 'next-router-prefetch': '1' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': chrome, purpose: 'prefetch' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': chrome, 'sec-purpose': 'prefetch;prerender' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': chrome, 'sec-fetch-dest': 'iframe' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': 'WhatsApp/2.24.1' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': 'facebookexternalhit/1.1' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' })), false);
  assert.equal(shouldCountView(headers({ 'user-agent': 'curl/8.5.0' })), false); // e.g. curl -I (HEAD)
  assert.equal(shouldCountView(headers({})), false);
});

// ---------------------------------------------------------------- sharing text
test('share text names the company, includes the link and makes no unsupported claims', () => {
  const link = { company_name: 'Al Noor & Sons', contact_name: 'Fatima' };
  const url = 'https://example.invalid/for/al-noor-sons-abc123';
  const wa = portfolioWhatsAppUrl(link, url);
  assert.ok(wa.startsWith('https://wa.me/?text='));
  const decoded = decodeURIComponent(wa.slice('https://wa.me/?text='.length));
  assert.match(decoded, /Hello Fatima/);
  assert.ok(decoded.includes(url) && decoded.includes('Al Noor & Sons'));
  const mail = portfolioEmailText(link, url);
  assert.match(mail, /^Subject: .*Al Noor & Sons/);
  assert.ok(mail.includes(url) && mail.includes('Dear Fatima'));
  assert.match(portfolioEmailText({ company_name: 'Acme' }, url), /Dear Sir or Madam/);
  assert.doesNotMatch(mail, /guarantee|thank you for your time|as discussed|best price|licen[cs]e/i);
});
