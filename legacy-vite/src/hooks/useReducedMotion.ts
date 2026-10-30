import { useEffect, useState } from 'react';
import { REDUCED_MOTION_QUERY } from '@/lib/animations';

/** Tracks the user's `prefers-reduced-motion` setting, reacting to changes. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
