import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { Hero } from '@/components/sections/Hero';
import { TickerBand } from '@/components/sections/TickerBand';
import { WhyChoose } from '@/components/sections/WhyChoose';
import { StoryBlock } from '@/components/sections/StoryBlock';
import { StatsBand } from '@/components/sections/StatsBand';
import { KineticStatement } from '@/components/sections/KineticStatement';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { ProcessJourney } from '@/components/sections/ProcessJourney';
import { DestinationsStrip } from '@/components/sections/DestinationsStrip';
import { ClientsMarquee } from '@/components/sections/ClientsMarquee';
import { AudienceCTA } from '@/components/sections/AudienceCTA';
import { RecruitmentCampaign } from '@/components/sections/RecruitmentCampaign';
import { OpportunityBoard } from '@/components/sections/OpportunityBoard';
import { ValuesBlock } from '@/components/sections/ValuesBlock';
import { ContactBand } from '@/components/sections/ContactBand';

export default function Home() {
  return (
    <>
      <PageHead />
      <PageShell>
        <Hero />
        <TickerBand />
        <AudienceCTA />
        <OpportunityBoard compact />
        <RecruitmentCampaign />
        <WhyChoose />
        <StoryBlock />
        <StatsBand />
        <KineticStatement />
        <ServicesGrid />
        <ProcessJourney />
        <DestinationsStrip />
        <ClientsMarquee />
        <ValuesBlock />
        <ContactBand />
      </PageShell>
    </>
  );
}

function PageHead() {
  useSEO({
    title: 'Al Karrim Lanka — International Manpower Recruitment Since 1980',
    description:
      'Al Karrim Lanka Consultant (Pvt) Ltd is a Sri Lankan Government approved manpower consultancy with 40+ years of experience and over 125,000 placements across the Middle East, Europe, Malaysia and Australia.',
    path: '/',
  });
  return null;
}
