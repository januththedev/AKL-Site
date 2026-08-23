import { BadgeCheck, Clock, Globe2, Route, ShieldCheck, UsersRound } from 'lucide-react';
import { WHY_CHOOSE, type Reason } from '@/data/company';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SpotlightCard } from '@/components/motion/SpotlightCard';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

const ICONS: Record<Reason['icon'], typeof Clock> = {
  clock: Clock,
  route: Route,
  badge: BadgeCheck,
  users: UsersRound,
  shield: ShieldCheck,
  globe: Globe2,
};

/** "Why Choose Al Karrim Lanka" — six spotlight cards, verbatim copy. */
export function WhyChoose() {
  return (
    <section aria-labelledby="why-choose" className="relative py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Building success together"
            title={
              <>
                Why choose <span className="text-gradient-accent">Al Karrim Lanka</span>
              </>
            }
          />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((reason, i) => {
            const Icon = ICONS[reason.icon];
            return (
              <ScrollReveal key={reason.title} delay={(i % 3) * 0.08} y={30}>
                <SpotlightCard className="card-surface h-full p-7 transition-colors duration-300 hover:border-white/20">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-mist-100">{reason.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist-500">{reason.description}</p>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
