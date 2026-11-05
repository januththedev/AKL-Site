import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Our recruitment process', description: 'The four stages from first conversation to mobilisation: Inquiry, Selection, Processing and Deployment.', path: '/recruitment'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="recruitment"/>; }
