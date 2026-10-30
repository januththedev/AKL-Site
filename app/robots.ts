import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots {return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/api','/invite']},sitemap:`${process.env.SITE_BASE_URL||'https://al-karrim.net'}/sitemap.xml`};}
