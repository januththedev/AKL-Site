import type { NextConfig } from 'next';

const production = process.env.NODE_ENV === 'production';
const origin = (value?: string) => { try { return value ? new URL(value).origin : ''; } catch { return ''; } };
// Approved public media (Moments, uploads) and the S3-compatible endpoint used for presigned uploads.
const assetOrigin = origin(process.env.PUBLIC_ASSET_BASE_URL);
const storageOrigin = origin(process.env.STORAGE_ENDPOINT);

// Next.js injects inline bootstrap scripts and the opening's boot script is inline, so scripts need
// 'unsafe-inline' (a nonce-based CSP would force every page dynamic). Everything else is locked to self.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${assetOrigin}`.trim(),
  "font-src 'self'",
  `connect-src 'self' ${storageOrigin}`.trim(),
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  ...(production
    ? [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      ]
    : []),
];
// Public assets have stable names (not content-hashed): cache for a week, refresh in the background.
const assetCache = [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      // One canonical host: same-origin checks on forms/admin compare against SITE_BASE_URL.
      { source: '/:path*', has: [{ type: 'host', value: 'www.al-karrim.net' }], destination: 'https://al-karrim.net/:path*', permanent: true },
      { source: '/vacancies', destination: 'https://alk.intellixhr.com/careers', permanent: false },
      { source: '/portfolio', destination: '/employers', permanent: true },
      { source: '/for-employers', destination: '/employers', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/countries', destination: '/destinations', permanent: true },
      { source: '/our-process-saudi-arabia', destination: '/recruitment/saudi-arabia', permanent: true },
      { source: '/our-process-uae', destination: '/recruitment/united-arab-emirates', permanent: true },
      { source: '/our-process-kuwait', destination: '/recruitment/kuwait', permanent: true },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/media/:path*', headers: assetCache },
      { source: '/brand/:path*', headers: assetCache },
      { source: '/intro/:path*', headers: assetCache },
      { source: '/documents/:path*', headers: assetCache },
    ];
  },
};
export default nextConfig;
