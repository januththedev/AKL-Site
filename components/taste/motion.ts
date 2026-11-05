'use client';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * True when the visitor asks for less motion. It is false on the server and on the first render, so the
 * markup always starts as the finished picture and only then switches to moving parts.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** True while the element is on screen (by at least `threshold` of its area). */
export function useOnScreen(ref: RefObject<Element | null>, threshold = 0.2) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => setOn(entries[entries.length - 1].isIntersecting), { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return on;
}
