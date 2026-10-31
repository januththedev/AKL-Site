'use client';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { Destination } from '@/lib/types';
import { GLOBE, ORIGIN, arcBetween, graticule, isOrigin, makeProjection, resolveGeo } from '@/lib/geo';
import './talent-routes.css';

/*
 * Talent Routes: the AKL logo-globe (same ellipse ratio as the official mark and the opening)
 * brought to life as an illustrative map of the destinations in AKL's story.
 * Pure SVG + CSS; GSAP (lazy) only choreographs the one-time draw-in on scroll.
 * Routes are illustrative: nothing here claims placements, volumes or live vacancies.
 */

type Side = 'e' | 'w' | 'n' | 's';
type Marker = { index: number; x: number; y: number; side: Side; isOrigin: boolean; d?: string };

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const pct = (v: number, total: number) => `${Math.round((v / total) * 10000) / 100}%`;
const num = (i: number) => String(i + 1).padStart(2, '0');

export function TalentRoutes({
  destinations,
  selected,
  onSelect,
}: {
  destinations: Destination[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const hoverTimer = useRef<number | undefined>(undefined);
  const [motionOk, setMotionOk] = useState(false);
  const [tiltOk, setTiltOk] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [inView, setInView] = useState(false);

  const model = useMemo(() => {
    const resolved = destinations.map((dest, index) => ({ dest, index, geo: resolveGeo(dest.slug, dest.title) }));
    const routes = resolved.filter(r => r.geo && !isOrigin(r.geo));
    const home = resolved.find(r => r.geo && isOrigin(r.geo));
    const proj = makeProjection([ORIGIN, ...routes.map(r => r.geo!)]);
    const o = proj.project(ORIGIN.lon, ORIGIN.lat);
    const grid = graticule(proj);

    const raw = [
      ...(home ? [{ index: home.index, ...o, d: undefined as string | undefined, isOrigin: true }] : []),
      ...routes.map(r => {
        const p = proj.project(r.geo!.lon, r.geo!.lat);
        return { index: r.index, ...p, d: arcBetween(o, p).d, isOrigin: false };
      }),
    ].sort((a, b) => a.index - b.index);

    // Label side: away from the nearest other marker (Colombo counts even when it is not a pin).
    const anchors = [{ x: o.x, y: o.y }, ...raw.map(m => ({ x: m.x, y: m.y }))];
    const markers: Marker[] = raw.map(m => {
      let near: { x: number; y: number } | null = null;
      let best = Infinity;
      for (const a of anchors) {
        const dist = Math.hypot(a.x - m.x, a.y - m.y);
        if (dist > 1 && dist < best) { best = dist; near = a; }
      }
      let side: Side = 'e';
      if (near) {
        const dx = near.x - m.x;
        const dy = near.y - m.y;
        side = Math.abs(dx) < 4 ? (dy > 0 ? 'n' : 's') : dx > 0 ? 'w' : best < 45 && Math.abs(dy) > 6 ? (dy > 0 ? 'n' : 's') : 'e'; // keep clear of arcs, which bend up and to the right
      }
      if (side === 'e' && m.x > GLOBE.w * 0.6) side = 'w';
      if (side === 'w' && m.x < GLOBE.w * 0.26) side = 'e';
      return { ...m, side };
    });
    return { markers, origin: o, grid, homeIndex: home?.index ?? -1 };
  }, [destinations]);

  const { markers, origin, grid, homeIndex } = model;
  const current = destinations[selected];
  const onMap = markers.some(m => m.index === selected);
  const tabStop = onMap ? selected : markers[0]?.index;
  const routes = markers.filter(m => !m.isOrigin);
  const selectedRoute = routes.find(m => m.index === selected);
  const allLit = selected === homeIndex && homeIndex >= 0;

  /* One-time draw-in, triggered when the map scrolls into view. */
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMotionOk(!reduced);
    setTiltOk(!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches);
    if (!root) return;
    if (reduced) { setDrawn(true); return; }

    root.classList.add('tr-armed');
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    const reveal = () => { root.classList.remove('tr-armed'); setDrawn(true); };
    const failsafe = window.setTimeout(() => { if (!ctx) reveal(); }, 7000);

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        window.clearTimeout(failsafe);
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          const q = (sel: string) => Array.from(root.querySelectorAll<SVGElement | HTMLElement>(sel));
          const grid = q('.tr-outline, .tr-grid-line');
          const arcs = q('.tr-arc');
          const pins = q('.tr-pinwrap');
          const tl = gsap.timeline({
            paused: true,
            onComplete: () => {
              // Clear only what the tweens wrote (pins keep their inline left/top).
              gsap.set([...grid, ...arcs], { clearProps: 'strokeDashoffset' });
              gsap.set(pins, { clearProps: 'transform,scale,opacity,visibility' });
              gsap.set(q('.tr-caption'), { clearProps: 'opacity' });
              reveal();
            },
          });
          tl.fromTo(q('.tr-outline'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0)
            .fromTo(q('.tr-grid-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.05 }, 0.25)
            .fromTo(q('.tr-caption'), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.9);
          const t0 = 1.25;
          let r = 0;
          pins.forEach(pin => {
            const isHome = pin.classList.contains('tr-origin');
            const at = isHome ? t0 - 0.15 : t0 + 0.8 + r++ * 0.32;
            tl.fromTo(pin, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, at);
          });
          arcs.forEach((arc, i) => {
            tl.fromTo(arc, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.05, ease: 'power2.out' }, t0 + i * 0.32);
          });
          ScrollTrigger.create({ trigger: root, start: 'top 82%', once: true, onEnter: () => tl.play() });
        }, root);
      })
      .catch(reveal);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      ctx?.revert();
      root.classList.remove('tr-armed');
    };
  }, [destinations]);

  /* Pause the infinite animations (pulse, travelling packet) while the map is off-screen. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  /* Subtle pointer parallax (max 4 degrees); fine pointers only, never with reduced motion. */
  const raf = useRef(0);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tiltOk || e.pointerType !== 'mouse') return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const stage = stageRef.current;
      const root = rootRef.current;
      if (!stage || !root) return;
      const r = root.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width - 0.5;
      const ny = (clientY - r.top) / r.height - 0.5;
      stage.style.setProperty('--tr-ry', `${(nx * 8).toFixed(2)}deg`);
      stage.style.setProperty('--tr-rx', `${(-ny * 8).toFixed(2)}deg`);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    stageRef.current?.style.setProperty('--tr-ry', '0deg');
    stageRef.current?.style.setProperty('--tr-rx', '0deg');
  };

  const pinKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const order = markers.filter(m => !m.isOrigin || homeIndex >= 0).map(m => m.index);
    const at = order.findIndex(i => pinRefs.current[i] === document.activeElement);
    if (at < 0) return;
    let next = at;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (at + 1) % order.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (at - 1 + order.length) % order.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = order.length - 1;
    else return;
    e.preventDefault();
    pinRefs.current[order[next]]?.focus();
  };

  const style = (m: { x: number; y: number }) => ({ left: pct(m.x, GLOBE.w), top: pct(m.y, GLOBE.h) });
  const gid = `${uid}-lens`;
  const packetOn = motionOk && drawn && inView && !!selectedRoute?.d;

  return (
    <div
      ref={rootRef}
      className="talent-routes"
      role="group"
      aria-label="Map of the destinations in Al Karrim Lanka's story, with illustrative routes from Colombo"
      data-inview={inView ? 'true' : 'false'}
      onKeyDown={pinKeys}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="tr-stage" ref={stageRef} data-tilt={tiltOk ? 'true' : 'false'}>
        <svg className="tr-svg" viewBox={`0 0 ${GLOBE.w} ${GLOBE.h}`} fill="none" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id={gid} cx="50%" cy="46%" r="62%">
              <stop offset="0" stopColor="#0e3a2e" stopOpacity="0.7" />
              <stop offset="0.7" stopColor="#071916" stopOpacity="0.74" />
              <stop offset="1" stopColor="#071916" stopOpacity="0.84" />
            </radialGradient>
          </defs>
          <ellipse className="tr-lens" cx={GLOBE.cx} cy={GLOBE.cy} rx={GLOBE.rx} ry={GLOBE.ry} fill={`url(#${gid})`} />
          {grid.parallels.map(d => <path key={d} className="tr-grid-line" pathLength={1} d={d} />)}
          {grid.meridians.map(d => <path key={d} className="tr-grid-line" pathLength={1} d={d} />)}
          {grid.ticks.map(t => <text key={t.text} className="tr-tick" x={t.x} y={t.y} textAnchor={t.anchor}>{t.text}</text>)}
          <ellipse className="tr-outline" pathLength={1} cx={GLOBE.cx} cy={GLOBE.cy} rx={GLOBE.rx} ry={GLOBE.ry} />

          {routes.map(m => {
            const on = m.index === selected;
            return (
              <g key={m.index} className="tr-route" data-state={on ? 'on' : allLit ? 'all' : 'off'}>
                <path className="tr-arc" pathLength={1} d={m.d} />
                <path className="tr-glow" pathLength={1} d={m.d} />
                <path className="tr-hot" pathLength={1} d={m.d} />
              </g>
            );
          })}

          {packetOn && (
            <g key={selectedRoute!.index} className="tr-packets">
              {[0, 0.11, 0.22].map((delay, i) => (
                <circle key={delay} r={2.6 - i * 0.7} fill={i === 0 ? '#f5f2e9' : '#d9b86c'} opacity="0">
                  <animateMotion dur="3s" begin={`${delay}s`} repeatCount="indefinite" path={selectedRoute!.d} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".5 0 .5 1" />
                  <animate attributeName="opacity" values={`0;${1 - i * 0.3};${1 - i * 0.3};0`} keyTimes="0;.12;.86;1" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {homeIndex < 0 && (
          <div className="tr-pinwrap tr-origin" style={style(origin)} aria-hidden="true">
            <span className="tr-pulse" />
            <span className="tr-dot" />
            <span className="tr-label" data-side="e">Colombo<small>Origin</small></span>
          </div>
        )}

        {markers.map(m => {
          const dest = destinations[m.index];
          const on = m.index === selected;
          return (
            <div key={m.index} className={`tr-pinwrap${m.isOrigin ? ' tr-origin' : ''}`} style={style(m)} data-sel={on}>
              {m.isOrigin && <span className="tr-pulse" aria-hidden="true" />}
              <button
                type="button"
                ref={el => { pinRefs.current[m.index] = el; }}
                className="tr-pin"
                aria-label={`${dest.title} — select route`}
                aria-pressed={on}
                tabIndex={m.index === tabStop ? 0 : -1}
                onFocus={() => onSelect(m.index)}
                onClick={() => onSelect(m.index)}
                onPointerEnter={e => {
                  if (e.pointerType !== 'mouse') return;
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => onSelect(m.index), 90);
                }}
                onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
              >
                <span className="tr-dot" aria-hidden="true" />
                <span className="tr-label" data-side={m.side} aria-hidden="true">
                  <i>{num(m.index)}</i>{dest.title}
                  <small>{m.isOrigin ? 'Colombo · origin' : dest.region}</small>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <p className="tr-caption">
        <span>A world of connections</span>
        <span>Illustrative routes from Colombo · not live vacancies</span>
      </p>
      <p className="tr-sr" role="status" aria-live="polite">
        {current ? `Selected: ${current.title}, ${current.region}.` : ''}
      </p>
    </div>
  );
}
