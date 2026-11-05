import type { MetadataRoute } from 'next';
import { getSnapshot } from '@/lib/server/content';
import { siteBaseUrl, sitemapRoutes } from '@/lib/structuredData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { content } = await getSnapshot();
  return sitemapRoutes({ base: siteBaseUrl(), industrySlugs: content.industries.map(industry => industry.slug) });
}
