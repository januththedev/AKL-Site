import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Contact Al Karrim Lanka', description: 'Call, write or visit our team in Colombo, Sri Lanka, or tell us about your recruitment requirement.', path: '/contact'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="contact"/>; }
