import { Globe } from 'lucide-react';
import { TICKER_ITEMS } from '@/data/company';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';

/** Velocity-sensitive ticker built from verified company positioning. */
export function TickerBand() {
  return (
    <section aria-label="Company capabilities" className="border-y border-white/[0.07] bg-ink-900/60 py-6">
      <VelocityMarquee>
        {TICKER_ITEMS.map((item) => (
          <span
            key={item}
            className="mx-7 flex items-center gap-7 font-display text-lg font-medium uppercase tracking-[0.14em] text-mist-500 sm:text-xl"
          >
            {item}
            <Globe className="h-4 w-4 text-accent-500/80" aria-hidden="true" />
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}
