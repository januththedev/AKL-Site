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
 title: {default:'Al Karrim Lanka — People. Possibility. Progress.',template:'%s · Al Karrim Lanka'},
 description:'Sri Lankan talent. International possibility. Recruitment and workforce solutions shaped by experience since 1980.',
 openGraph:{type:'website',siteName:'Al Karrim Lanka',images:[{url:'/media/hero-team.webp',width:1680,height:1120}]},
 icons:{icon:'/brand/AKL-Official-Logo-200.png'},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}<HydrationProbe/></body></html>;
}
