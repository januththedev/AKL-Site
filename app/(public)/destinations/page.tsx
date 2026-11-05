import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Our international reach', description: 'Our company profile describes historical reach across the Gulf, Europe, Asia and Australia. Live vacancies are on the IntellixHR careers portal.', path: '/destinations'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="destinations"/>; }
