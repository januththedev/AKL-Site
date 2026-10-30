import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenis } from '@/hooks/useLenis';

type VelocityMarqueeProps = {
  children: ReactNode;
  /** Base speed in px/s (before scroll-velocity boost). */
  baseSpeed?: number;
  className?: string;
};

/**
 * Infinite horizontal ticker that accelerates and skews with scroll velocity.
 * Loops seamlessly; renders a static row under reduced motion and pauses
 * when off-screen or when the tab is hidden.
 */
export function VelocityMarquee({ children, baseSpeed = 55, className = '' }: VelocityMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { lenis } = useLenis();

  useEffect(() => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner || reducedMotion) return;

    let pos = 0;
    let halfWidth = inner.scrollWidth / 2;
    let visible = true;
    let last = performance.now();
    let skew = 0;
    let raf = 0;

    const measure = () => {
      halfWidth = inner.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(track);

    let lastScrollY = window.scrollY;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!visible || document.hidden) return;

      const lenisVelocity = lenis ? Math.abs(lenis.velocity) : 0;
      const y = window.scrollY;
      const fallbackVelocity = Math.abs(y - lastScrollY) / Math.max(dt, 0.001);
      lastScrollY = y;

      const velocity = lenis ? lenisVelocity : fallbackVelocity / 60;
      const boost = Math.min(velocity * 14, 420);
      const direction = -1; // always leftward; speed varies

      pos += direction * (baseSpeed + boost) * dt;
      if (-pos >= halfWidth) pos += halfWidth;
      if (pos > 0) pos -= halfWidth;

      // Skew proportional to velocity, eased back to neutral
      const targetSkew = Math.max(-8, Math.min(8, velocity * 0.22));
      skew += (targetSkew - skew) * 0.08;

      inner.style.transform = `translate3d(${pos}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [reducedMotion, baseSpeed, lenis]);

  if (reducedMotion) {
    return (
      <div ref={trackRef} className={`overflow-hidden marquee-mask ${className}`}>
        <div ref={innerRef} className="flex w-max items-center">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className={`overflow-hidden marquee-mask ${className}`}>
      {/* Content is duplicated for the seamless loop */}
      <div ref={innerRef} className="flex w-max items-center will-change-transform" aria-hidden="false">
        {children}
        {children}
      </div>
    </div>
  );
}
