import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CountUpProps = {
  value: number;
  isYear?: boolean;
  suffix?: string;
  className?: string;
};

/** Animated count-up triggered when the element enters the viewport. */
export function CountUp({ value, isYear = false, suffix = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(isYear || reducedMotion ? format(value) : format(0));

  function format(n: number) {
    // Years render without separators (e.g. "1980", never "1,980")
    return isYear ? String(n) : n.toLocaleString('en-US');
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isYear || reducedMotion) {
      setDisplay(format(value));
      return;
    }

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: value,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => setDisplay(format(Math.round(obj.v))),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isYear, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
