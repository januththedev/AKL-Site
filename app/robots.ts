import type { MetadataRoute } from 'next';
import { AI_ROBOTS_AGENTS } from '@/lib/ai-access';
import { siteBaseUrl } from '@/lib/structuredData';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...AI_ROBOTS_AGENTS], disallow: '/' },
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/invite', '/for/'] },
    ],
    sitemap: `${siteBaseUrl()}/sitemap.xml`,
  };
}
