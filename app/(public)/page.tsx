import { getSnapshot } from "@/lib/server/content";
import { HomeView } from "@/components/HomeView";
import { Intro } from "@/components/Intro";
import { publicPageMetadata, SITE_DESCRIPTION } from "@/lib/structuredData";
export const metadata = publicPageMetadata({title:{absolute:'Al - Karrim Lanka Consultants Pvt Ltd — People. Possibility. Progress.'},description:SITE_DESCRIPTION,path:'/'});
export default async function Home(){const {content}=await getSnapshot();return <><Intro moments={content.moments||[]}/><HomeView content={content}/></>;}
