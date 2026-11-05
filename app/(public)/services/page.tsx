import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Recruitment services', description: 'Overseas recruitment, industry-specific talent, screening and trade testing, and documentation and mobilisation.', path: '/services'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="services"/>; }
