import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { SpotlightCard } from '@/components/motion/SpotlightCard';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Target, TrendingUp, Workflow } from 'lucide-react';
import { SERVICES, SERVICES_INTRO } from '@/data/services';

const ICONS = { target: Target, trending: TrendingUp, workflow: Workflow } as const;

export default function Services() {
  useSEO({
    title: 'Our Recruitment Solutions — Al Karrim Lanka',
    description:
      'Tailored workforce solutions: Talent Match hiring, Team Upskill training and Career Flow workforce planning — backed by rigorous screening and validation before every deployment.',
    path: '/services',
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Tailored business solutions"
        title={
          <>
            Our recruitment <span className="text-gradient-accent">solutions</span>
          </>
        }
        description={SERVICES_INTRO.paragraphs[0]}
      />

      {/* What sets us apart */}
      <section aria-labelledby="apart" className="py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow="What sets our workforce solutions apart?" title="Rigor at every step" />
          <ScrollReveal y={22} delay={0.08}>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-mist-500 sm:text-lg">
              {SERVICES_INTRO.paragraphs[1]}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Offerings */}
      <section aria-labelledby="offerings" className="border-y border-white/[0.07] bg-ink-900/50 py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="How we deliver exceptional workforce solutions"
            title="Three ways we build your team"
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = ICONS[service.icon];
              return (
                <ScrollReveal key={service.id} delay={i * 0.09} y={30}>
                  <SpotlightCard className="card-surface flex h-full flex-col p-9 transition-colors duration-300 hover:border-white/20">
                    <span className="font-display text-xs tracking-widest2 text-mist-700">0{i + 1}</span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-mist-100">{service.title}</h3>
                    <span className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-6 flex-1 text-[15px] leading-relaxed text-mist-500">{service.description}</p>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal y={20} delay={0.2}>
            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <p className="text-sm text-mist-500">
                Every candidate undergoes a proper validation check before deployment.
              </p>
              <ButtonLink to="/contact" className="ml-auto !px-5 !py-2.5 text-sm">
                Discuss your requirement
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
