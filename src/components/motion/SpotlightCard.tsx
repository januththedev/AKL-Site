import { useRef, type ReactNode, type PointerEvent } from 'react';
import { gsap } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees — kept restrained on purpose. */
  maxTilt?: number;
};

/**
 * Interactive card with a cursor-following spotlight and subtle 3D tilt.
 * Heavy pointer effects are disabled for touch devices and reduced motion.
 */
export function SpotlightCard({ children, className = '', maxTilt = 4 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reducedMotion || e.pointerType === 'touch') return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const rx = ((py / rect.height) * 2 - 1) * -maxTilt;
    const ry = ((px / rect.width) * 2 - 1) * maxTilt;

    gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 1000, duration: 0.5, ease: 'power2.out' });

    if (glowRef.current) {
      glowRef.current.style.setProperty('--mx', `${px}px`);
      glowRef.current.style.setProperty('--my', `${py}px`);
      glowRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' });
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`group relative overflow-hidden will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(52, 201, 120, 0.13), transparent 70%)',
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
