import { Globe2 } from 'lucide-react';
import { VACANCIES_PORTAL } from '@/data/site';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

/** Premium handoff to the external IntellixHR vacancies portal — no fake listings. */
export function VacanciesCTA() {
  return (
    <section aria-labelledby="vacancies" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[680px] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.12), transparent)' }}
      />
      <div className="container-site">
        <ScrollReveal y={26} className="glass grain relative overflow-hidden rounded-3xl p-6 text-center sm:p-16">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
            <Globe2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="eyebrow mt-8 justify-center [&::before]:hidden">Current openings</p>
          <h2 id="vacancies" className="mt-4 break-words font-display text-display font-semibold leading-[1.04] tracking-tight">
            Explore <ScrambleText text="opportunities" />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mist-500 sm:text-lg">
            Find verified overseas opportunities across multiple industries and destinations. Live listings are hosted on
            our external recruitment portal — available in English, සිංහල and தமிழ்.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic strength={0.22} className="w-full sm:w-auto">
              <ButtonLink
                href={VACANCIES_PORTAL.href}
                external
                className="btn-primary w-full !px-6 !py-4 text-sm sm:w-auto sm:!px-9 sm:text-base"
              >
                View live vacancies
              </ButtonLink>
            </Magnetic>
            <p className="text-xs leading-relaxed text-mist-700">
              Opens the Al Karrim Lanka recruitment portal
              <br className="hidden sm:block" /> in a new tab.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
