import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animations';
import { useReducedMotion } from './useReducedMotion';

type LenisContextValue = {
  lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export const useLenis = () => useContext(LenisContext);

/**
 * Initializes Lenis smooth scrolling and keeps it synchronized with the
 * GSAP ticker and ScrollTrigger. Disabled entirely under reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<(time: number) => void>();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    instance.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    rafRef.current = tick;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>;
}
