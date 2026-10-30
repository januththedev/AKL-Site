import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenis } from '@/hooks/useLenis';

/** Resets scroll to top on route change and refreshes ScrollTrigger measurements. */
export function useRouteReset() {
  const { pathname } = useLocation();
  const { lenis } = useLenis();

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [pathname, lenis]);
}

/**
 * Wraps each page: subtle enter transition on mount.
 * Deliberately lightweight — the site should feel fast, never blocked.
 */
export function PageShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'all' },
      );
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion]);

  return <div ref={ref}>{children}</div>;
}
