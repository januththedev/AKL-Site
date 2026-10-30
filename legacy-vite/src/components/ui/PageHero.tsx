import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
};

/** Compact editorial header used by every inner page. */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <header className="relative overflow-hidden bg-ink-950 pb-16 pt-40 sm:pb-20 sm:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[12%] h-[300px] w-[520px] rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.1), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(70% 90% at 50% 10%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(70% 90% at 50% 10%, black, transparent)',
        }}
      />
      <div className="container-site relative">
        <ScrollReveal y={22}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-display-lg font-semibold leading-[1.02] tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist-500 sm:text-lg">{description}</p>
          ) : null}
        </ScrollReveal>
      </div>
    </header>
  );
}
