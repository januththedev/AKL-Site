import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type ScrollRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Vertical offset in px (negative = from below). */
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
};

/**
 * Fades/slides content in when it enters the viewport.
 * Renders content immediately under reduced motion.
 */
export function ScrollReveal({
  children,
  as: Tag = 'div',
  className,
  y = 36,
  delay = 0,
  duration = 0.9,
  start = 'top 86%',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  /* Hidden state is applied from JS before paint, not via JSX — if the
     animation layer ever fails, content degrades to visible instead of
     staying stuck at opacity 0. */
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !reducedMotion && !('IntersectionObserver' in window)) {
      // Very old browsers: never hide content we can't reveal
      return;
    }
    if (el) el.style.opacity = '0';
  }, [reducedMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reducedMotion, y, delay, duration, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
