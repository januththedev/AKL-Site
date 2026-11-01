import type { MetadataRoute } from 'next';
import { AI_ROBOTS_AGENTS } from '@/lib/ai-access';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...AI_ROBOTS_AGENTS], disallow: '/' },
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/invite', '/for/'] },
    ],
    sitemap: `${process.env.SITE_BASE_URL || 'https://al-karrim.net'}/sitemap.xml`,
  };
}
