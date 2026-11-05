import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPages";
import { getSnapshot } from "@/lib/server/content";
import { publicPageMetadata } from "@/lib/structuredData";
export async function generateMetadata(): Promise<Metadata> {
  const {content}=await getSnapshot();
  return publicPageMetadata({title:'Industries we recruit for', description:`Sector-focused recruitment for ${content.industries.map(x=>x.title.toLowerCase()).join(', ')}.`, path:'/industries'});
}
export default function Page(){ return <InfoPage kind="industries"/>; }
