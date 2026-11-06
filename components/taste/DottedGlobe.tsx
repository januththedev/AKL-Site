'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from './motion';
import type { GlobeNetwork } from './destinations';
import './taste-ui.css';

type Controller = { pause(): void; resume(): void; destroy(): void };
type FxModule = { mount(el: HTMLElement, id: string, options: { palette: Record<string, string>; seed: number; params: Record<string, number> }): Promise<Controller> };
type EffectModule = {
  configureNetwork(network: (GlobeNetwork & { font?: string }) | null): void;
  focusHub(el: HTMLElement, index: number, options?: { instant?: boolean; force?: boolean }): boolean;
};

const BASE = '/taste/effects/';

const PALETTE = { bg: '#071916', surface: '#0d2a24', ink: '#f5f2e9', muted: '#8fa89d', accent: '#d9b86c', accentInk: '#071916' };
// calmX 0.5 and calmY 1 put the (absent) text below the globe, so it sits whole and centred in its box
const PARAMS = { size: 0.92, calmX: 0.5, calmY: 1, speed: 3, arcs: 2.4, tilt: 14, glow: 0.7, calm: 0, spacing: 6.5, dot: 1.1, back: 0.1, sea: 0.2 };

/**
 * The skill's dotted-globe effect, mounted once it nears the screen, and driven by the page: `network` is the set of
 * places the site's destinations content names (Colombo first), and `focus` is the node it should face. The globe
 * glides to the node, holds it, keeps its route from Colombo drawn and labels it. Node 0 (Colombo) shows every
 * route at once. WebGL when available, a 2D canvas otherwise; under reduced motion it jumps instead of gliding.
 * The globe is decorative: the same places are listed as text beside it.
 */
export function DottedGlobe({
  network,
  focus = 0,
  paused = false,
  onTogglePause,
  onReady,
  className = '',
  label = 'Globe with routes from Colombo',
}: {
  network: GlobeNetwork | null;
  focus?: number;
  paused?: boolean;
  onTogglePause?: () => void;
  /** Called with true once the globe is on screen and facing its first place, and with false if it is torn down. */
  onReady?: (ready: boolean) => void;
  className?: string;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const effectModule = useRef<EffectModule | null>(null);
  const focusNow = useRef(focus);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => { focusNow.current = focus; }, [focus]); // what a globe that finishes loading later should face
  useEffect(() => { onReady?.(ready); }, [ready, onReady]);

  // a new set of places builds a new globe
  const networkKey = network ? JSON.stringify([network.cities, network.names, network.view]) : '';
  useEffect(() => {
    const el = host.current;
    if (!el || !network) return;
    let cancelled = false;
    setReady(false);
    const start = async () => {
      try {
        const fxUrl = `${BASE}fx.js`;
        const effectUrl = `${BASE}dotted-globe/effect.js`;
        const [fx, effect] = await Promise.all([import(/* webpackIgnore: true */ fxUrl), import(/* webpackIgnore: true */ effectUrl)]) as [FxModule, EffectModule];
        if (cancelled) return;
        effect.configureNetwork({ ...network, font: getComputedStyle(document.body).fontFamily });
        const mounted = await fx.mount(el, 'dotted-globe', { palette: PALETTE, seed: 11, params: PARAMS });
        if (cancelled) { mounted.destroy(); return; }
        controller.current = mounted;
        effectModule.current = effect;
        effect.focusHub(el, focusNow.current, { instant: true }); // it opens already facing the first place
        setReady(true);
      } catch {
        /* the soft glow behind the box stays; nothing else depends on the globe */
      }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void start(); }
    }, { rootMargin: '320px 0px' });
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
      controller.current?.destroy();
      controller.current = null;
      effectModule.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `network` is represented by its key
  }, [networkKey]);

  useEffect(() => {
    const el = host.current;
    if (ready && el) effectModule.current?.focusHub(el, focus);
  }, [focus, ready]);

  useEffect(() => {
    if (!ready) return;
    if (paused) controller.current?.pause(); else controller.current?.resume();
  }, [paused, ready]);

  return (
    <div className={`tx-dg ${className}`.trim()}>
      <div ref={host} className="tx-dg-host" role="img" aria-label={label} />
      {ready && !reduced && onTogglePause && (
        <button type="button" className="tx-pause tx-dg-pause" aria-pressed={paused} aria-label={paused ? 'Play the tour' : 'Pause the tour'} onClick={onTogglePause}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
