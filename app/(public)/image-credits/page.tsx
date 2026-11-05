import { InfoPage } from "@/components/InfoPages";
export const metadata = publicPageMetadata({title: 'Photography and image credits', description: 'Selected photographs illustrate industries, skills and destinations. They are not AKL offices, staff, client projects or placements.', path: '/image-credits'});
import { publicPageMetadata } from '@/lib/structuredData';
export default function Page(){ return <InfoPage kind="image-credits"/>; }
