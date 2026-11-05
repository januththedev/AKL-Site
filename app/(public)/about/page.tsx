import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Our story since 1980', description: 'Founded in August 1980, Al Karrim Lanka has connected Sri Lankan capability with international opportunity for more than four decades.', path: '/about'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="about"/>; }
