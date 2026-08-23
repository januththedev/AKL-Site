import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations';
import { PROCESS_OVERVIEW } from '@/data/process';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Four-stage recruitment journey with a scroll-animated connecting line. */
export function ProcessJourney() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !lineRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: 0.5,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process"
      className="relative overflow-hidden border-y border-white/[0.07] bg-ink-900/50 py-24 sm:py-32"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow="How we work"
          title="Our recruitment process"
          description="Four clear stages take every requirement from first inquiry to a worker arriving ready on site. Country-specific pipelines add medicals, authentication and visa handling."
        />

        <ol className="relative mx-auto mt-16 max-w-2xl space-y-12 lg:space-y-0">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-[27px] top-8 hidden w-px bg-white/[0.08] lg:block"
          >
            <div
              ref={lineRef}
              className="h-full w-full origin-top bg-gradient-to-b from-accent-400 to-accent-600"
              style={{ transform: reducedMotion ? 'scaleY(1)' : undefined }}
            />
          </div>

          {PROCESS_OVERVIEW.map((stage, i) => (
            <li key={stage.step} className="lg:relative lg:flex lg:gap-10 lg:pb-14 lg:last:pb-0">
              <ScrollReveal y={26} delay={0.05} className="flex items-start gap-6 lg:block">
                <span
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-display text-sm font-semibold ${
                    reducedMotion ? 'border-accent-500/40 text-accent-400' : 'border-white/15 bg-ink-850 text-mist-300'
                  }`}
                >
                  {stage.step}
                </span>
                <div className="lg:mt-7 lg:max-w-md">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-mist-100">
                    <span className="sr-only">{`Stage ${i + 1}: `}</span>
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist-500">{stage.description}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
