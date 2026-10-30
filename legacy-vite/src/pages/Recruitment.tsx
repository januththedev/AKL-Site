import { Link } from 'react-router-dom';
import { ArrowUpRight, FileCheck2, ShieldCheck, Stamp } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { COUNTRIES, PROCESS_OVERVIEW } from '@/data/process';

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: 'SLBFE-guided',
    text: 'Salary and terms are confirmed per Sri Lanka Bureau of Foreign Employment guidelines on every job order.',
  },
  {
    icon: Stamp,
    title: 'Fully authenticated',
    text: 'Demand letters, contracts and clearances are authenticated through MOFA, embassies and chambers of commerce.',
  },
  {
    icon: FileCheck2,
    title: 'Medical & visa handled',
    text: 'GAMCA medicals, police clearance and embassy visa processing are coordinated end-to-end by our team.',
  },
];

/** Recruitment process hub — overview + the three verified country pipelines. */
export default function Recruitment() {
  useSEO({
    title: 'Recruitment Process — Al Karrim Lanka',
    description:
      'From inquiry to deployment: our end-to-end recruitment process, with dedicated six-stage pipelines for Saudi Arabia, the United Arab Emirates and Kuwait.',
    path: '/recruitment',
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="End-to-end recruitment"
        title={
          <>
            From inquiry to <span className="text-gradient-accent">deployment</span>
          </>
        }
        description="Every requirement follows a disciplined, compliant pipeline. Here is how a job order becomes a worker arriving ready on site."
      />

      {/* Four-stage overview */}
      <section aria-label="Process overview" className="py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow="The core journey" title="Four stages, one accountable partner" />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_OVERVIEW.map((stage, i) => (
              <ScrollReveal as="li" key={stage.step} delay={i * 0.07} y={26} className="card-surface h-full p-7">
                <p className="font-display text-sm tracking-widest2 text-accent-400">{stage.step}</p>
                <h3 className="mt-4 font-display text-xl font-semibold text-mist-100">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-500">{stage.description}</p>
              </ScrollReveal>
            ))}
          </ol>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {ASSURANCES.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 0.08} y={22}>
                  <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-mist-100">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-mist-500">{item.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Country pipelines */}
      <section aria-labelledby="pipelines" className="border-t border-white/[0.07] bg-ink-900/50 py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Country pipelines"
            title={
              <>
                Dedicated processes for our <span className="text-gradient-accent">core destinations</span>
              </>
            }
            description="Each destination has its own compliance route — authentication bodies, medical requirements and visa channels differ by country."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {COUNTRIES.map((country, i) => (
              <ScrollReveal key={country.slug} delay={i * 0.09} y={28}>
                <Link
                  to={`/recruitment/${country.slug}`}
                  className="card-surface group flex h-full flex-col p-8 transition-colors duration-300 hover:border-accent-500/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-mist-700">{country.region}</span>
                    <ArrowUpRight
                      className="h-5 w-5 text-mist-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-semibold text-mist-100">{country.name}</h3>
                  <ol className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                    {country.stages.map((stage, si) => (
                      <li key={stage.title} className="text-xs text-mist-500">
                        {si + 1}. {stage.title}
                      </li>
                    ))}
                  </ol>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
