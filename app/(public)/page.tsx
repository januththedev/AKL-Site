import { getSnapshot } from "@/lib/server/content";
import { HomeView } from "@/components/HomeView";
import { Intro } from "@/components/Intro";
export default async function Home(){const {content}=await getSnapshot();return <><Intro moments={content.moments||[]}/><HomeView content={content}/></>;}
