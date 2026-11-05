import { Header, Footer } from '@/components/SiteChrome';
import { MotionRoot } from '@/components/Motion';
import { ChatWidget } from '@/components/ChatWidget';
import { getSnapshot } from '@/lib/server/content';
import { jsonLdText, organizationJsonLd, siteBaseUrl } from '@/lib/structuredData';

export const dynamic='force-dynamic';
export default async function PublicLayout({children}:{children:React.ReactNode}) {
 const {content}=await getSnapshot();
 return <><a className="skip-link" href="#main-content">Skip to content</a><Header settings={content.settings}/><main id="main-content" tabIndex={-1}>{children}</main><Footer settings={content.settings}/><ChatWidget content={{settings:content.settings,industries:content.industries.map(({title})=>({title}))}}/><MotionRoot/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdText(organizationJsonLd({settings:content.settings,base:siteBaseUrl()}))}}/></>;
}
