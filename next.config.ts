import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
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
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};
export default nextConfig;
