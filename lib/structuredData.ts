import type { Metadata } from 'next';
import { COMPANY_NAME, FOUNDING_MONTH, FOUNDING_YEAR } from './brand';
import type { SiteContent } from './types';

export const DEFAULT_SITE_URL = 'https://al-karrim.net';
export const SITE_DESCRIPTION = 'Sri Lankan talent. International possibility. Recruitment and workforce solutions shaped by experience since 1980.';
const SHARE_IMAGE = { url: '/media/hero-team.webp', width: 1680, height: 1120 };

/** Public origin without a trailing slash, so joined paths never contain `//`. */
export function siteBaseUrl(env: string | undefined = process.env.SITE_BASE_URL): string {
  return (env || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

/** Must match the `names` map in app/(public)/recruitment/[country]/page.tsx (tests/redesign/seo.test.ts checks this). */
export const RECRUITMENT_COUNTRY_SLUGS = ['saudi-arabia', 'united-arab-emirates', 'kuwait', 'oman'] as const;

/** Static public routes. Dynamic routes are added from content. Excludes /admin, /api, /invite and the private /for portfolio pages. */
export const STATIC_PUBLIC_PATHS = ['', '/about', '/clients', '/moments', '/services', '/industries', '/employers', '/destinations', '/recruitment', '/contact', '/privacy', '/terms', '/image-credits'] as const;

export type SitemapRoute = { url: string; changeFrequency: 'monthly'; priority: number };

export function sitemapRoutes({ base, industrySlugs, countrySlugs = RECRUITMENT_COUNTRY_SLUGS }: { base: string; industrySlugs: readonly string[]; countrySlugs?: readonly string[] }): SitemapRoute[] {
  const paths: string[] = [
    ...STATIC_PUBLIC_PATHS,
    ...industrySlugs.map(slug => `/industries/${encodeURIComponent(slug)}`),
    ...countrySlugs.map(country => `/recruitment/${encodeURIComponent(country)}`),
  ];
  return paths.map(path => ({
    url: path === '' ? `${base}/` : `${base}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : path === '/employers' ? 0.9 : 0.7,
  }));
}

/** Shared metadata for public pages: canonical path plus matching Open Graph title and description. */
export function publicPageMetadata({ title, description, path }: { title: string | { absolute: string }; description: string; path: string }): Metadata {
  const ogTitle = typeof title === 'string' ? title : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: COMPANY_NAME, title: ogTitle, description, url: path, images: [SHARE_IMAGE] },
  };
}

/**
 * Serialises data for an inline `<script type="application/ld+json">`.
 * Every `<`, `>`, `&` and the JS line separators are emitted as JSON unicode escapes, so no interpolated value can close the script tag.
 */
export function jsonLdText(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&()]/g, ch => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

/** Organization (EmploymentAgency) data, using only company settings and the founding facts from lib/brand.ts. */
export function organizationJsonLd({ settings, base }: { settings: SiteContent['settings']; base: string }) {
  const facebook = settings.facebookUrl?.trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'EmploymentAgency',
    '@id': `${base}/#organization`,
    name: COMPANY_NAME,
    alternateName: 'Al Karrim Lanka',
    url: `${base}/`,
    logo: `${base}/brand/AKL-Official-Logo-512.png`,
    foundingDate: `${FOUNDING_YEAR}-${String(FOUNDING_MONTH).padStart(2, '0')}`,
    description: SITE_DESCRIPTION,
    telephone: settings.phone,
    email: settings.email,
    address: { '@type': 'PostalAddress', streetAddress: settings.address, addressCountry: 'LK' },
    sameAs: facebook && /^https:\/\//.test(facebook) ? [facebook] : undefined,
  };
}
