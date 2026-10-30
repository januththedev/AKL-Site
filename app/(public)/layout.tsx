import { Header, Footer } from '@/components/SiteChrome';
import { MotionRoot } from '@/components/Motion';
import { ChatWidget } from '@/components/ChatWidget';
import { getSnapshot } from '@/lib/server/content';

export const dynamic='force-dynamic';
export default async function PublicLayout({children}:{children:React.ReactNode}) {
 const {content}=await getSnapshot();
 return <><a className="skip-link" href="#main-content">Skip to content</a><Header settings={content.settings}/><main id="main-content" tabIndex={-1}>{children}</main><Footer settings={content.settings}/><ChatWidget/><MotionRoot/></>;
}
