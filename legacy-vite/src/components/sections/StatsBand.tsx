import { STATS } from '@/data/company';
import { CountUp } from '@/components/motion/CountUp';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

/** "40 years in the industry. Over 125,000 promises delivered." — animated statistics. */
export function StatsBand() {
  return (
    <section aria-label="Company track record" className="relative py-20 sm:py-24">
      <div className="container-site">
        <ScrollReveal y={24}>
          <h2 className="max-w-3xl font-display text-heading font-semibold leading-tight tracking-tight sm:text-display">
            40 years in the industry.
            <br />
            <span className="text-gradient-accent">Over 125,000 promises delivered.</span>
          </h2>
        </ScrollReveal>

        <dl className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.09} y={26}>
              <div className="border-l border-white/10 pl-6">
                <dt className="order-2 mt-3 text-sm text-mist-500">{stat.label}</dt>
                <dd className="order-1 font-display text-5xl font-semibold tracking-tight text-mist-100 sm:text-6xl">
                  <CountUp value={stat.value} isYear={stat.isYear} suffix={stat.suffix ?? ''} />
                </dd>
                <dd className="order-3 mt-2 text-xs leading-relaxed text-mist-700">{stat.detail}</dd>
              </div>
            </ScrollReveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
