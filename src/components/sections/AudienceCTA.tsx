import { Briefcase, Search } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

/** The two conversion audiences, clearly separated: job seekers vs employers. */
export function AudienceCTA() {
  return (
    <section aria-label="Start your journey" className="py-24 sm:py-28">
      <div className="container-site grid gap-4 lg:grid-cols-2">
        {/* Job seekers */}
        <ScrollReveal y={28}>
          <div className="card-surface relative flex h-full flex-col overflow-hidden p-6 sm:p-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full opacity-60 blur-[80px]"
              style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.16), transparent)' }}
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-7 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">I'm looking for a job</h3>
            <p className="mt-4 max-w-md flex-1 text-[15px] leading-relaxed text-mist-500 sm:text-base">
              Browse verified overseas opportunities across multiple industries and destinations — updated live on our
              recruitment portal.
            </p>
            <div className="mt-9">
              <ButtonLink to="/vacancies" variant="ghost">
                View vacancies
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>

        {/* Employers */}
        <ScrollReveal y={28} delay={0.08}>
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-600/[0.14] via-white/[0.03] to-transparent p-6 sm:p-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full opacity-70 blur-[90px]"
              style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.2), transparent)' }}
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-400/40 bg-accent-500/[0.12] text-accent-300">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-7 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">I need workforce</h3>
            <p className="mt-4 max-w-md flex-1 text-[15px] leading-relaxed text-mist-500 sm:text-base">
              From individual placements to high-volume hiring — let's build your workforce together with end-to-end
              recruitment support.
            </p>
            <div className="mt-9">
              <ButtonLink to="/contact">Request workforce</ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
