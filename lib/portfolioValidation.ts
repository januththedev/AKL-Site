import { z } from 'zod';
import type { PortfolioStatus } from './types';

/* Pure helpers for private portfolio links (/for/<slug>). No server-only or Node imports,
   so this file is safe in client components and in the node:test suite. */

// ---------------------------------------------------------------- slugs
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
export const SLUG_SUFFIX_LENGTH = 10;
export const SLUG_BASE_MAX = 40;
export const PORTFOLIO_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{10}$/;
export const isPortfolioSlug = (value: unknown): value is string => typeof value === 'string' && value.length <= 80 && PORTFOLIO_SLUG_PATTERN.test(value);
export const portfolioSlugSchema = z.string().max(80).refine(isPortfolioSlug, 'Invalid portfolio link.');

export type RandomBytes = (length: number) => Uint8Array;
const secureRandomBytes: RandomBytes = (length) => globalThis.crypto.getRandomValues(new Uint8Array(length));

/** Lower-case ASCII slug of a company name. Never empty (falls back to "company"). */
export function slugifyCompany(name: string, max = SLUG_BASE_MAX) {
  const base = name.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, max).replace(/-+$/g, '');
  return base || 'company';
}
/** Unbiased random [a-z0-9] string (rejection sampling over secure random bytes). */
export function randomSuffix(random: RandomBytes = secureRandomBytes, length = SLUG_SUFFIX_LENGTH) {
  let out = '';
  for (let round = 0; out.length < length; round++) {
    if (round > 64) throw new Error('RANDOM_SOURCE_FAILED');
    for (const byte of random(length * 2)) if (byte < 252 && out.length < length) out += ALPHABET[byte % ALPHABET.length];
  }
  return out;
}
export const buildSlug = (companyName: string, random?: RandomBytes) => `${slugifyCompany(companyName)}-${randomSuffix(random)}`;
/** Allocates a slug the caller can claim atomically: `attempt` returns a value when the slug was free, or null on a collision. */
export async function allocateSlug<T>(companyName: string, attempt: (slug: string) => Promise<T | null>, random?: RandomBytes, maxAttempts = 6) {
  for (let i = 0; i < maxAttempts; i++) {
    const slug = buildSlug(companyName, random);
    const value = await attempt(slug);
    if (value !== null) return { slug, value };
  }
  throw new Error('CONFLICT');
}

// ---------------------------------------------------------------- status
export function portfolioStatus(link: { is_active: boolean; expires_at: string | Date | null }, now: Date = new Date()): PortfolioStatus {
  if (!link.is_active) return 'disabled';
  if (link.expires_at === null) return 'active';
  const stamp = new Date(link.expires_at).getTime();
  return Number.isFinite(stamp) && stamp > now.getTime() ? 'active' : 'expired'; // an unreadable expiry fails closed
}

// ---------------------------------------------------------------- input validation
const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).default('');
function shape(allowedSectors: readonly string[]) {
  const allowed = new Set(allowedSectors);
  return {
    company_name: text(160),
    contact_name: optionalText(120),
    country: optionalText(100),
    sectors: z.array(z.string().max(60)).max(12).default([]).refine((list) => list.every((slug) => allowed.has(slug)), 'Choose sectors from the site’s industries.').transform((list) => [...new Set(list)]),
    roles: z.array(text(100)).max(20).default([]),
    intro_message: optionalText(1200),
    show_clients: z.boolean().default(true),
    expires_at: z.iso.datetime().nullable().default(null),
  };
}
/** Unknown keys are stripped (never copied into SQL); fields are picked explicitly by the server. */
export function portfolioCreateSchema(allowedSectors: readonly string[], now: () => Date = () => new Date()) {
  return z.object(shape(allowedSectors)).refine((v) => v.expires_at === null || new Date(v.expires_at).getTime() > now().getTime(), { message: 'Choose an expiry in the future.', path: ['expires_at'] });
}
export function portfolioUpdateSchema(allowedSectors: readonly string[]) {
  return z.object({ id: z.uuid(), ...shape(allowedSectors) });
}
export const portfolioStatusSchema = z.object({ id: z.uuid(), active: z.boolean() }).strict();
export const portfolioDeleteSchema = z.object({ id: z.uuid() }).strict();
export type PortfolioInput = z.output<ReturnType<typeof portfolioCreateSchema>>;

// ---------------------------------------------------------------- public page helpers
/** Selected industries first (in the order chosen), then the rest in their original order. */
export function orderIndustries<T extends { slug: string }>(industries: readonly T[], selected: readonly string[]): (T & { selected: boolean })[] {
  const chosen = new Set(selected);
  const bySlug = new Map(industries.map((item) => [item.slug, item]));
  const first = [...chosen].flatMap((slug) => bySlug.get(slug) ?? []).map((item) => ({ ...item, selected: true }));
  const rest = industries.filter((item) => !chosen.has(item.slug)).map((item) => ({ ...item, selected: false }));
  return [...first, ...rest];
}
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|skype|curl|wget|python|node-fetch|axios|go-http|java\/|headless|lighthouse|monitor|uptime/i;
/** A view counts only for a real browser navigation: not prefetches, link-preview bots, HTTP tools or iframes.
    (Server components cannot see the HTTP method, so HEAD checks from tools without browser headers are excluded here.) */
export function shouldCountView(headers: { get(name: string): string | null }) {
  const lowered = (name: string) => (headers.get(name) || '').toLowerCase();
  if (lowered('next-router-prefetch') || lowered('x-middleware-prefetch') || /prefetch|prerender/.test(`${lowered('purpose')} ${lowered('sec-purpose')}`)) return false;
  const agent = headers.get('user-agent') || '';
  if (!agent || BOT_PATTERN.test(agent)) return false;
  const dest = lowered('sec-fetch-dest');
  if (dest) return dest === 'document';
  return agent.startsWith('Mozilla/');
}

// ---------------------------------------------------------------- sharing text (no claims beyond the public site)
export type ShareTarget = { company_name: string; contact_name?: string };
export const portfolioWhatsAppText = (link: ShareTarget, url: string) => `Hello${link.contact_name ? ` ${link.contact_name}` : ''}, this is Al Karrim Lanka, a Sri Lankan overseas recruitment company. We have prepared a short company portfolio for ${link.company_name}: ${url}`;
export const portfolioWhatsAppUrl = (link: ShareTarget, url: string) => `https://wa.me/?text=${encodeURIComponent(portfolioWhatsAppText(link, url))}`;
export function portfolioEmailText(link: ShareTarget, url: string) {
  return `Subject: Al Karrim Lanka company portfolio, prepared for ${link.company_name}

Dear ${link.contact_name || 'Sir or Madam'},

Al Karrim Lanka is a Sri Lankan overseas recruitment company that has been operating since 1980. We have prepared a short portfolio for ${link.company_name}, covering our services, the sectors we recruit for and how we work with employers.

View the portfolio: ${url}

If you would like to discuss a workforce requirement, you can reply to this email or use the short form at the end of the page.

Kind regards,
Al Karrim Lanka`;
}
