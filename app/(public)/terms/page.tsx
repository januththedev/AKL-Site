import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Website information and terms', description: 'Boundaries for the company information, vacancy links and photography on this website. Live vacancies and applications are hosted on IntellixHR.', path: '/terms'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="terms"/>; }
