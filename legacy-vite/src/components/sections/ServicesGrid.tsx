import { ArrowRight, Target, TrendingUp, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '@/data/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SpotlightCard } from '@/components/motion/SpotlightCard';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

const ICONS = { target: Target, trending: TrendingUp, workflow: Workflow } as const;

/** Home version of the services grid — Talent Match / Team Upskill / Career Flow. */
export function ServicesGrid() {
  return (
    <section aria-labelledby="services" className="py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Tailored business solutions" title={<ScrambleText as="span" text="How we deliver" />} />
          <ScrollReveal delay={0.1}>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 font-display text-sm text-accent-400 transition-colors hover:text-accent-300"
            >
              All workforce solutions
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon];
            return (
              <ScrollReveal key={service.id} delay={i * 0.09} y={30}>
                <SpotlightCard className="card-surface group flex h-full flex-col p-8 transition-colors duration-300 hover:border-white/20">
                  <span className="font-display text-xs tracking-widest2 text-mist-700">0{i + 1}</span>
                  <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 id="services-title" className="mt-7 font-display text-2xl font-semibold text-mist-100">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mist-500">{service.short}</p>
                  <Link
                    to="/services"
                    aria-label={`Learn more about ${service.title}`}
                    className="mt-7 inline-flex items-center gap-2 font-display text-sm text-mist-500 transition-colors group-hover:text-accent-400"
                  >
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
