import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** 0–1 fraction of the cursor offset applied to the element. */
  strength?: number;
};

/**
 * Subtly attracts its child toward the cursor with spring-like easing.
 * Inactive on touch devices and under reduced motion.
 */
export function Magnetic({ children, className, strength = 0.28 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    // Skip pure touch devices AND touch-laptops where tap-emulated mousemove
    // would translate the button mid-gesture.
    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
    };

    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      gsap.killTweensOf(el);
    };
  }, [reducedMotion, strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className ?? ''}`}>
      {children}
    </div>
  );
}
