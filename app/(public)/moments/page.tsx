import { getSnapshot } from '@/lib/server/content';
import { MomentsGallery } from '@/components/MomentsGallery';
export const metadata=publicPageMetadata({title:'Moments — Our story in frames',description:'People, places and perspectives from AL Karrim Lanka Consultants PVT LTD.',path:'/moments'});
import { publicPageMetadata } from '@/lib/structuredData';
export default async function MomentsPage(){const {content}=await getSnapshot();return <><section className="moments-opening"><h1 data-story-heading data-story-phrases><span className="story-line"><span className="story-line-ink">Some stories are better felt.</span></span></h1><div data-story-lines><p>People, places and the moments in between.</p><a href="#moments-gallery" className="glass-pill">View the collection</a></div></section><MomentsGallery moments={content.moments||[]}/></>;}
