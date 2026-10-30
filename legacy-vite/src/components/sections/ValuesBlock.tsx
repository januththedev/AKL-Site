import { HeartHandshake } from 'lucide-react';
import { VALUES } from '@/data/company';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

/** Closing values statement — verbatim from the audited site. */
export function ValuesBlock() {
  return (
    <section aria-label="Our values" className="py-20 sm:py-24">
      <div className="container-site">
        <ScrollReveal y={24}>
          <div className="flex flex-col items-start gap-7 border-l-2 border-accent-500/40 pl-7 sm:pl-10">
            <HeartHandshake className="h-7 w-7 text-accent-400" aria-hidden="true" />
            <h2 className="max-w-2xl font-display text-heading font-semibold leading-snug tracking-tight">
              {VALUES.heading}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-mist-500">{VALUES.paragraph}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
