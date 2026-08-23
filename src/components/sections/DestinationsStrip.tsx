import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { COUNTRIES } from '@/data/process';
import { WIDER_MARKETS } from '@/data/clients';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

/** Destinations with verified recruitment pipelines + verified wider reach. */
export function DestinationsStrip() {
  return (
    <section aria-labelledby="destinations" className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          eyebrow="Where we place"
          title={
            <>
              Sri Lankan talent, <span className="text-gradient-accent">international impact</span>
            </>
          }
          description="Dedicated, compliant recruitment pipelines for our core destinations — backed by four decades of placement experience across the Middle East, Europe, Malaysia and Australia."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {COUNTRIES.map((country, i) => (
            <ScrollReveal key={country.slug} delay={i * 0.09} y={30}>
              <Link
                to={`/recruitment/${country.slug}`}
                className="card-surface group relative flex h-full flex-col overflow-hidden p-8 transition-colors duration-300 hover:border-accent-500/40"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.22), transparent)' }}
                />
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-mist-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-400"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold text-mist-100">{country.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-mist-700">{country.region}</p>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-mist-500">{country.intro}</p>
                <span className="mt-7 font-display text-sm text-accent-400 opacity-90 transition-opacity group-hover:opacity-100">
                  View the {country.shortName} process →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal y={18} delay={0.15}>
          <p className="mt-10 text-sm text-mist-700">
            Also placing across:{' '}
            <span className="font-medium text-mist-500">{WIDER_MARKETS.join(' · ')}</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
