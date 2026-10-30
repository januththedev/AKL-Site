import type { Metadata } from 'next';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';
import { HydrationProbe } from '@/components/HydrationProbe';

export const metadata: Metadata = {
 metadataBase: new URL(process.env.SITE_BASE_URL || 'https://al-karrim.net'),
 title: {default:'AL Karrim Lanka Consultants PVT LTD — People. Possibility. Progress.',template:'%s · AL Karrim Lanka Consultants PVT LTD'},
 description:'Sri Lankan talent. International possibility. Recruitment and workforce solutions shaped by experience since 1980.',
 openGraph:{type:'website',siteName:'AL Karrim Lanka Consultants PVT LTD',images:[{url:'/media/hero-team.webp',width:1680,height:1120}]},
 icons:{icon:'/brand/AKL-Official-Logo-200.png'},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}<HydrationProbe/></body></html>;
}
