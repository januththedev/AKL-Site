import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type KineticTextProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
};

/**
 * Large typographic statement that fills with brightness as the user scrolls
 * (scrubbed to scroll progress, not time). Static and fully visible under
 * reduced motion.
 */
export function KineticText({ lines, className = '', lineClassName = '' }: KineticTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>('[data-char]');
    if (reducedMotion) {
      gsap.set(chars, { opacity: 1 });
      return;
    }

    gsap.set(chars, { opacity: 0.12 });

    const total = chars.length;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',
        end: 'bottom 45%',
        scrub: 0.4,
        onUpdate(self) {
          const revealed = self.progress * total * 1.08;
          chars.forEach((char, i) => {
            const target = i < revealed ? Math.min(1, (revealed - i) * 1.6) : 0.12;
            gsap.set(char, { opacity: target });
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={ref} className={className} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${lineClassName}`}>
          {line.split(' ').map((word, wi) => (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {word.split('').map((ch, ci) => (
                  <span key={ci} data-char className="inline-block will-change-[opacity]">
                    {ch}
                  </span>
                ))}
              </span>
              {wi < line.split(' ').length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
