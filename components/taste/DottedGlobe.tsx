'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from './motion';
import './taste-ui.css';

type Controller = { pause(): void; resume(): void; destroy(): void };
type FxModule = { mount(el: HTMLElement, id: string, options: { palette: Record<string, string>; seed: number; params: Record<string, number> }): Promise<Controller> };
type EffectModule = { configureNetwork(network: { cities: [number, number][]; origin: number; view: number } | null): void };

const BASE = '/taste/effects/';

/** Colombo first (the origin of every arc), then the places the company profile names as its reach. [longitude, latitude] */
export const AKL_NETWORK = {
  origin: 0,
  view: 62, // the longitude that faces the viewer in the still frame: shows Colombo, the Gulf and South Asia
  cities: [
    [79.86, 6.93],   // Colombo
    [55.3, 25.2],    // Dubai (the Gulf)
    [58.4, 23.6],    // Muscat (the Gulf)
    [72.9, 19.1],    // Mumbai (South Asia)
    [101.7, 3.1],    // Kuala Lumpur (Malaysia)
    [8.7, 50.1],     // Frankfurt (Europe)
    [151.2, -33.9],  // Sydney (Australia)
  ] as [number, number][],
};

const PALETTE = { bg: '#071916', surface: '#0d2a24', ink: '#f5f2e9', muted: '#8fa89d', accent: '#d9b86c', accentInk: '#071916' };
// calmX 0.5 and calmY 1 put the (absent) text below the globe, so it sits whole and centred in its box
const PARAMS = { size: 0.92, calmX: 0.5, calmY: 1, speed: 3, arcs: 2.4, tilt: 14, glow: 0.7, calm: 0, spacing: 6.5, dot: 1.1, back: 0.1, sea: 0.2 };

/**
 * The skill's dotted-globe effect, mounted once it nears the screen. The globe turns slowly and one thin arc at a
 * time lifts from Colombo to a place in the company's reach. WebGL when available, a 2D canvas otherwise; under
 * reduced motion one still frame. A pause button holds it. The globe is decorative: the places are listed as text.
 */
export function DottedGlobe({ className = '', label = 'Globe with routes from Colombo' }: { className?: string; label?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    const start = async () => {
      try {
        const fxUrl = `${BASE}fx.js`;
        const effectUrl = `${BASE}dotted-globe/effect.js`;
        const [fx, effect] = await Promise.all([import(/* webpackIgnore: true */ fxUrl), import(/* webpackIgnore: true */ effectUrl)]) as [FxModule, EffectModule];
        if (cancelled) return;
        effect.configureNetwork(AKL_NETWORK);
        const mounted = await fx.mount(el, 'dotted-globe', { palette: PALETTE, seed: 11, params: PARAMS });
        if (cancelled) { mounted.destroy(); return; }
        controller.current = mounted;
        setReady(true);
      } catch {
        /* the soft glow behind the box stays; nothing else depends on the globe */
      }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void start(); }
    }, { rootMargin: '320px 0px' });
    observer.observe(el);
    return () => { cancelled = true; observer.disconnect(); controller.current?.destroy(); controller.current = null; };
  }, []);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    if (next) controller.current?.pause(); else controller.current?.resume();
  };

  return (
    <div className={`tx-dg ${className}`.trim()}>
      <div ref={host} className="tx-dg-host" role="img" aria-label={label} />
      {ready && !reduced && (
        <button type="button" className="tx-pause tx-dg-pause" aria-pressed={paused} aria-label={paused ? 'Turn the globe' : 'Hold the globe'} onClick={toggle}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
