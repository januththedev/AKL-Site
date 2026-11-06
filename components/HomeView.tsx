import { StoryHeading } from '@/components/StoryHeading';
import { LiveCompanyDate } from '@/components/LiveCompanyDate';
import { yearsOfExperience } from '@/lib/brand';
import { ClientSignature } from '@/components/ClientLogos';
import { withProfileReach } from '@/lib/company-profile';
import { MomentsGallery } from '@/components/MomentsGallery';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import { Action, EditorialLink, SectionTitle } from '@/components/Public';
import { Journey, DestinationStory } from '@/components/Motion';
import { IndustryExplorer } from '@/components/IndustryExplorer';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { ExperienceNumbers } from '@/components/taste/ExperienceNumbers';
import { PipelineSection } from '@/components/taste/PipelineSection';
import { ColomboPullback } from '@/components/taste/ColomboPullback';

// The roots photo fills half the row on desktop and the full width once the section stacks.
const ROOTS_SIZES = '(max-width: 1000px) 100vw, 85vw'; // the slot is portrait: a 3:2 photo needs ~1.7x its width

export function HomeView({content:c}:{content:SiteContent}) {
 return <><section className="home-hero"><div className="hero-copy"><span className="eyebrow">{c.home.eyebrow}</span><h1>{c.home.heading}<br/><em>{c.home.accent}</em></h1><div className="hero-copy-bottom"><p>{c.home.intro}</p><div className="hero-actions"><Action href="/employers#request-workforce">Send a workforce brief</Action><a className="hero-job-link" href={c.settings.careersUrl} target="_blank" rel="noopener noreferrer">Browse current vacancies <ArrowUpRight size={17}/></a></div></div></div><figure className="hero-photograph"><ResponsiveImage src={c.home.image} alt="Construction professionals at work — illustrative industry photograph" width={1680} height={1120} sizes="100vw" priority/><div className="hero-image-shade"/><div className="hero-caption"><a href="#expertise" aria-label="Explore our expertise"><ArrowDown size={24}/></a></div></figure></section>
 <section className="credibility-band"><div><span className="big-fact"><LiveCompanyDate kind="experience" initialValue={yearsOfExperience()}/><span>+</span></span><span>Years of experience.<br/>Since 1980.</span></div><div><span className="fact-title">Sri Lankan roots.</span><span>A global perspective<br/>on people and progress.</span></div><div><span className="fact-title">One connected process.</span><span>From your first conversation<br/>to the next chapter.</span></div><Link href="/about" aria-label="Read our story"><MoveUpRight size={28}/></Link></section>
 <ExperienceNumbers industryCount={c.industries.length}/>
 <ClientSignature advanceTo="expertise"/>
 <section id="expertise" className="section ivory-section"><div className="section-header-row"><SectionTitle animate heading="The industries we recruit for."/><p className="side-note" data-reveal>Hospitality to logistics: sector-focused recruitment for the skills each operation needs.</p></div><IndustryExplorer industries={c.industries}/></section>
 <section className="roots-section"><div className="roots-image" data-reveal><ResponsiveImage src="/media/colombo-dusk.webp" alt="Colombo coastline at dusk — Sri Lankan geographic context" width={1200} height={800} sizes={ROOTS_SIZES}/></div><div className="roots-copy" data-reveal data-story-lines><StoryHeading heading="A small island with an extraordinary workforce."/><p>{c.story.body}</p><p className="roots-closing">{c.story.closing}</p><EditorialLink href="/about">Read our story</EditorialLink><div className="roots-signature"><span>Established August 1980</span></div></div></section>
 <section className="section journey-section"><div className="section-header-row"><SectionTitle animate heading="Every great journey starts with a conversation."/><EditorialLink href="/recruitment">See the full process</EditorialLink></div><Journey/></section>
 <PipelineSection/>
 <ColomboPullback destinations={withProfileReach(c.destinations)}/>
 <section className="section world-section"><div className="section-header-row"><SectionTitle animate light heading="Sri Lankan talent for employers around the world."/><p className="side-note">Our company story spans the Gulf, Europe, Asia and Australia.</p></div><DestinationStory destinations={withProfileReach(c.destinations)}/></section>
 <MomentsGallery moments={c.moments||[]} preview/>
 <section className="employer-band"><StoryHeading heading="Your next chapter needs the right people."/><div><p>Explore our recruitment capabilities, the industries we serve, and how we can support your workforce requirements.</p><Action href="/employers">See employer services</Action></div></section></>;
}
