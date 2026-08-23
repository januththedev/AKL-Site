import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type InteractiveModelProps = {
  src: string;
  alt: string;
  className?: string;
  /** Initial camera orbit, e.g. "25deg 72deg 105%" (theta phi radius). */
  orbit?: string;
};

/**
 * Interactive GLB viewer built on <model-viewer> (@google/model-viewer).
 * The ~300KB three.js-based module is imported lazily only when the viewer
 * scrolls near the viewport, keeping it off the critical path on mobile.
 * Auto-rotation is disabled under reduced motion; drag/zoom stay available
 * as user-driven controls. If the chunk fails to load, a labeled fallback
 * keeps the content accessible instead of rendering a blank box.
 */
export function InteractiveModel({ src, alt, className = '', orbit = '25deg 75deg 108%' }: InteractiveModelProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const holder = holderRef.current;
    let cancelled = false;

    const load = () => {
      import('@google/model-viewer')
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    if (!holder || typeof IntersectionObserver === 'undefined') {
      load();
      return () => {
        cancelled = true;
      };
    }

    // Start loading slightly before the model enters the viewport
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(holder);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  if (failed) {
    return (
      <div
        ref={holderRef}
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm leading-relaxed text-mist-500 ${className}`}
      >
        Interactive 3D model unavailable — {alt}
      </div>
    );
  }

  return (
    <div ref={holderRef} className={`h-full w-full ${className}`}>
      <model-viewer
        src={src}
        alt={alt}
        loading="lazy"
        camera-controls
        touch-action="pan-y"
        auto-rotate={ready && !reducedMotion ? '' : undefined}
        rotation-per-second="16deg"
        interaction-prompt="none"
        camera-orbit={orbit}
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto 160%"
        shadow-intensity="1.1"
        shadow-softness="0.9"
        exposure="1.12"
        environment-image="neutral"
        style={
          {
            '--poster-color': 'transparent',
            '--progress-bar-color': '#34c978',
            '--progress-bar-height': '3px',
          } as CSSProperties
        }
        className="block h-full w-full"
      />
    </div>
  );
}
