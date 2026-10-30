import { Languages } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { OpportunityBoard } from '@/components/sections/OpportunityBoard';
import { CandidateGuide } from '@/components/sections/CandidateGuide';
import { VACANCIES_PORTAL } from '@/data/site';

export default function Vacancies() {
  useSEO({ title: 'Overseas vacancies & application guide — Al Karrim Lanka', description: 'Explore dated overseas recruitment notices, prepare your application and find current vacancies on the official Al Karrim Lanka portal.', path: '/vacancies' });
  return <PageShell>
    <PageHero eyebrow="Your career, beyond borders" title={<>Find your next role <span className="text-gradient-accent">abroad.</span></>} description="Explore opportunities, prepare with confidence and take the next step with Al Karrim Lanka." />
    <div className="container-site">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-accent-500/25 bg-accent-500/[0.06] p-6 sm:p-8">
        <div><p className="font-display text-lg font-semibold">Your application starts on our official portal.</p><p className="mt-2 text-sm text-mist-500">Full role details, applications and status tracking are managed by IntellixHR.</p><p className="mt-3 flex items-center gap-2 text-sm text-accent-400"><Languages className="h-4 w-4" aria-hidden="true" />English · සිංහල · தமிழ்</p></div>
        <ButtonLink href={VACANCIES_PORTAL.href} external>Open recruitment portal</ButtonLink>
      </div>
    </div>
    <OpportunityBoard />
    <CandidateGuide />
  </PageShell>;
}
