import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { COUNTRIES } from '@/data/process';
import { REACH, SECTORS, WIDER_MARKETS } from '@/data/clients';
import { InteractiveModel } from '@/components/ui/InteractiveModel';

/** International reach — verified destinations and markets only. */
export default function Countries() {
  useSEO({
    title: 'Countries We Recruit For — Al Karrim Lanka',
    description:
      'Dedicated recruitment pipelines for Saudi Arabia, the UAE and Kuwait, with placement experience across the Middle East, Europe, Malaysia and Australia.',
    path: '/countries',
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Global reach"
        title={
          <>
            Where we <span className="text-gradient-accent">place talent</span>
          </>
        }
        description={REACH.statement}
      />

      {/* Featured destinations */}
      <section aria-label="Featured destinations" className="py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow="Dedicated pipelines" title="Countries with a managed process" />
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
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-500">{country.intro}</p>
                  <span className="mt-6 font-display text-sm text-accent-400">
                    {country.stages.length} verified stages →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive band — 3D globe echoing the AKL mark */}
      <div className="container-site">
        <ScrollReveal y={30}>
          <figure className="card-surface grain relative overflow-hidden">
            <div className="grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[minmax(0,380px)_1fr] md:p-14">
              <div className="mx-auto aspect-square w-full max-w-[380px] shrink-0">
                <InteractiveModel
                  src="/models/akl-globe.glb"
                  alt="Interactive 3D globe — drag to rotate. Al Karrim Lanka builds bridges between Sri Lankan talent and global industry."
                  orbit="18deg 65deg 105%"
                />
              </div>
              <figcaption className="max-w-xl">
                <p className="eyebrow">Since 1980</p>
                <p className="mt-5 font-display text-2xl font-medium leading-snug text-mist-100 sm:text-3xl">
                  Four decades of building bridges between Sri Lankan talent and global industry.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mist-500 sm:text-base">
                  Drag the globe to explore. Dedicated pipelines operate today for Saudi Arabia, the United Arab
                  Emirates and Kuwait.
                </p>
              </figcaption>
            </div>
          </figure>
        </ScrollReveal>
      </div>

      {/* Wider reach + sectors */}
      <section aria-label="Markets and sectors" className="border-t border-white/[0.07] bg-ink-900/50 py-20 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Beyond our core routes" title={REACH.heading} />
            <ScrollReveal y={20} delay={0.08}>
              <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Markets served">
                {WIDER_MARKETS.map((market) => (
                  <li
                    key={market}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-display text-sm text-mist-300"
                  >
                    {market}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-mist-700">
                Dedicated six-stage pipelines currently operate for Saudi Arabia, the United Arab Emirates and Kuwait.
              </p>
            </ScrollReveal>
          </div>
          <div className="lg:pt-2">
            <SectionHeading eyebrow="Industries we serve" title="Sectors & roles" />
            <ScrollReveal y={20} delay={0.08}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-mist-500 sm:text-lg">
                From Engineer to Labourers, office-based to factory floor workers — across:
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="Sectors served">
                {SECTORS.map((sector) => (
                  <li
                    key={sector}
                    className="rounded-full border border-accent-500/25 bg-accent-500/[0.06] px-4 py-2 font-display text-sm text-accent-300"
                  >
                    {sector}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
