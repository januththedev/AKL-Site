import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Privacy and your information', description: 'How we use the information you send with an employer inquiry, and what the public website assistant does with your questions.', path: '/privacy'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="privacy"/>; }
