import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Shared easing tokens (kept in sync with globals.css). */
export const EASE = {
  outExpo: 'expo.out',
  power3: 'power3.out',
  soft: 'power2.inOut',
} as const;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export { gsap, ScrollTrigger };
