import { useEffect, useRef, useState, type ElementType } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Narrow-width pool keeps the animated width close to the final text (less reflow/CLS). */
const POOL = '·ax0k9r2m5e7t1c4A8';

type ScrambleTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Total decode duration in ms. */
  duration?: number;
};

/**
 * Decodes scrambled characters into the final text, left-to-right,
 * when the element enters the viewport. The real string is always present
 * for screen readers via sr-only; the animated glyphs are aria-hidden.
 * Renders final text immediately under reduced motion.
 */
export function ScrambleText({ text, as: Tag = 'span', className, duration = 900 }: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? text : text.replace(/\S/g, '·'));

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    const el = ref.current;
    let raf = 0;
    let started = false;

    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const revealed = Math.floor(p * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === ' ') {
            out += ' ';
          } else if (i < revealed) {
            out += ch;
          } else {
            out += POOL[Math.floor(Math.random() * POOL.length)];
          }
        }
        setDisplay(out);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration, reducedMotion]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
