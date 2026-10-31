'use client';
/**
 * Opening v6 — "Through the globe".
 *
 * 1. The AKL globe draws itself in thin lines on black (geometry measured from the official logo).
 * 2. Real photographs flicker inside the globe; the official logo lands exactly on the drawn lines.
 * 3. Company name rises, the year counter runs 1980 → this year.
 * 4. The globe becomes an aperture: the live homepage appears inside it, then the aperture
 *    opens to full screen while the hero copy animates in. Total ≈ 2.9 s.
 *
 * No video, no loading gate: only the 40–170 KB logo plus small photos that are used if
 * already decoded. A tiny inline script (lib/intro.ts, in the root layout <head>) raises the curtain before first paint
 * so the page never flashes, and a CSS failsafe removes the curtain if JavaScript never runs.
 * Bypassed for: reduced motion, Save-Data/2G, crawlers, repeat visits in the same tab session.
 * Skip button, Escape/Tab, wheel/touch scroll, hidden tab and a watchdog all end it safely.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { introMoments } from '@/lib/moments';
import { companyYear, FOUNDING_YEAR } from '@/lib/brand';
import type { Moment } from '@/lib/types';
import { INTRO_KEY } from '@/lib/intro';
import './intro.css';

const STOCK = ['/intro/hero-team.webp', '/intro/port-team.webp', '/intro/welding.webp', '/intro/hospitality.webp', '/intro/dubai-night.webp', '/intro/colombo-dusk.webp'];
const LOGO = '/brand/AKL-Official-Logo-512.png';

/* Globe geometry in the 512×512 logo coordinate space (measured from AKL-Official-Logo-512.png). */
const G = { cx: 256, cy: 245, rx: 220.5, ry: 138 };
const MERIDIANS = [20, 42, 62, 78].map(d => G.rx * Math.sin((d * Math.PI) / 180));
const PARALLELS = [-0.8, -0.5, -0.2, 0.2, 0.5, 0.8].map(t => {
  const y = G.cy + G.ry * t;
  const half = G.rx * Math.sqrt(1 - t * t);
  return { y, x1: G.cx - half, x2: G.cx + half };
});

export function Intro({ moments = [] }: { moments?: Moment[] }) {
  const photos = introMoments(moments).map(m => m.thumbnail);
  const sources = (photos.length >= 3 ? photos : STOCK).slice(0, 6);
  const sourceKey = sources.join('|');
  const root = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [active, setActive] = useState(false);
  const [run, setRun] = useState(0);
  const year = companyYear();

  useEffect(() => {
    const replay = () => {
      document.documentElement.setAttribute('data-intro', 'pending');
      setRun(v => v + 1);
    };
    window.addEventListener('akl:replay-intro', replay);
    return () => window.removeEventListener('akl:replay-intro', replay);
  }, []);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const node = root.current;
    if (html.getAttribute('data-intro') !== 'pending' || !node) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) { html.removeAttribute('data-intro'); return; }

    let disposed = false;
    let done = false;
    let tl: gsap.core.Timeline | undefined;
    const q = gsap.utils.selector(node);

    // Use photos only if they decode quickly; the reveal never waits for them.
    const decoded = new Set<string>();
    sources.forEach(src => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.decode().then(() => decoded.add(src), () => {});
    });

    const finish = () => {
      if (done || disposed) return;
      done = true;
      tl?.kill();
      html.removeAttribute('data-intro');
      setActive(false);
      try { sessionStorage.setItem(INTRO_KEY, 'seen'); } catch { /* storage blocked: fine */ }
    };
    finishRef.current = finish;

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Tab') finish(); };
    const onScroll = () => finish();
    const onVisibility = () => { if (document.hidden) finish(); };
    const onReduced = () => { if (reduced.matches) finish(); };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('wheel', onScroll, { passive: true });
    document.addEventListener('touchmove', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', onReduced);

    // While waiting for JavaScript, CSS already started drawing the outline — continue from there.
    const cssOutline = node.querySelector<SVGEllipseElement>('.rv-outline');
    const drawn = cssOutline ? parseFloat(getComputedStyle(cssOutline).strokeDashoffset) : 1;
    html.setAttribute('data-intro', 'playing'); // cancels the CSS cover/failsafe, holds hero copy
    setActive(true);

    const ctx = gsap.context(() => {
      const curtain = q('.rv-curtain')[0] as HTMLElement;
      const globe = node.querySelector<SVGSVGElement>('.rv-globe')!;
      const outline = node.querySelector<SVGEllipseElement>('.rv-outline')!;
      const lines = q('.rv-line');
      const frames = q('.rv-frame') as HTMLElement[];
      const counter = q('.rv-year')[0] as HTMLElement;

      // Aperture = the globe ellipse, measured on screen so the hole matches the drawing exactly.
      const box = outline.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const far = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * 1.6;
      curtain.style.setProperty('--cx', `${cx}px`);
      curtain.style.setProperty('--cy', `${cy}px`);
      gsap.set(curtain, { '--rx': '0px', '--ry': '0px' });

      gsap.set(outline, { strokeDasharray: 1, strokeDashoffset: Number.isFinite(drawn) ? Math.min(1, Math.max(0, drawn)) : 1 });
      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q('.rv-photos'), { opacity: 0 });
      gsap.set(frames, { opacity: 0, scale: 1.18 });
      gsap.set(q('.rv-logo'), { opacity: 0, scale: 0.94 });
      gsap.set(q('.rv-word'), { y: 0, yPercent: 110 }); // y:0 drops the CSS pre-paint offset
      gsap.set(q('.rv-meta'), { opacity: 0, y: 10 });

      tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });
      // 1 — draw the globe
      tl.to(outline, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(lines, { strokeDashoffset: 0, duration: 0.55, stagger: 0.035, ease: 'power2.out' }, 0.14);
      // 2 — photographs inside the globe (only those already decoded)
      tl.to(q('.rv-photos'), { opacity: 1, duration: 0.25 }, 0.3);
      frames.forEach((frame, i) => {
        const at = 0.3 + i * 0.16;
        tl!.call(() => { if (!decoded.has(frame.dataset.src || '')) frame.style.display = 'none'; }, [], at - 0.01)
          .to(frame, { opacity: 0.85, scale: 1, duration: 0.32, ease: 'power2.out' }, at)
          .to(frame, { opacity: 0, duration: 0.2 }, at + 0.26);
      });
      // 3 — official logo lands on the drawing, name rises, years count
      tl.to(q('.rv-logo'), { opacity: 1, scale: 1, duration: 0.45 }, 1.02)
        .to(q('.rv-photos'), { opacity: 0, duration: 0.3 }, 1.15)
        .to(q('.rv-word'), { yPercent: 0, duration: 0.55, stagger: 0.06 }, 1.08)
        .to(q('.rv-meta'), { opacity: 1, y: 0, duration: 0.4 }, 1.25)
        .fromTo({ v: FOUNDING_YEAR }, { v: FOUNDING_YEAR }, {
          v: year, duration: 0.6, ease: 'power2.out',
          onUpdate() { counter.textContent = String(Math.round(this.targets()[0].v)); },
        }, 1.25);
      // 4 — the globe becomes an aperture onto the live page, then opens to full screen
      tl.to(q('.rv-logo, .rv-name, .rv-meta'), { opacity: 0, duration: 0.22, ease: 'power2.in' }, 1.95)
        .to(curtain, { '--rx': `${box.width / 2}px`, '--ry': `${box.height / 2}px`, duration: 0.3, ease: 'power2.out' }, 2.0)
        .call(() => html.setAttribute('data-intro', 'revealing'), [], 2.15)
        .to(curtain, { '--rx': `${far}px`, '--ry': `${far * (box.height / box.width)}px`, duration: 0.65, ease: 'power3.in' }, 2.25)
        .to(globe, { scale: 3.2, opacity: 0, duration: 0.65, ease: 'power3.in' }, 2.25)
        .to(q('.rv-skip'), { opacity: 0, duration: 0.2 }, 2.25);
    }, node);

    const watchdog = setTimeout(finish, 3400);
    return () => {
      disposed = true;
      clearTimeout(watchdog);
      ctx.revert();
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('wheel', onScroll);
      document.removeEventListener('touchmove', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onReduced);
      if (!done) html.removeAttribute('data-intro');
    };
    // sources are captured by key; year is stable for the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, sourceKey]);

  return (
    <div ref={root} className={`rv ${active ? 'is-active' : ''}`} aria-hidden="true" data-intro-version="v6">
      <div className="rv-curtain" />
      <div className="rv-stage">
        <div className="rv-mark">
          <div className="rv-photos">
            {sources.map(src => <div key={src} className="rv-frame" data-src={src} style={{ backgroundImage: `url("${src}")` }} />)}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rv-logo" src={LOGO} alt="" width={512} height={512} decoding="async" />
          <svg className="rv-globe" viewBox="0 0 512 512" fill="none">
            <ellipse className="rv-outline" pathLength={1} cx={G.cx} cy={G.cy} rx={G.rx} ry={G.ry} />
            <line className="rv-line" pathLength={1} x1={G.cx - G.rx} y1={G.cy} x2={G.cx + G.rx} y2={G.cy} />
            {PARALLELS.map(p => <line key={p.y} className="rv-line" pathLength={1} x1={p.x1} y1={p.y} x2={p.x2} y2={p.y} />)}
            <line className="rv-line" pathLength={1} x1={G.cx} y1={G.cy - G.ry} x2={G.cx} y2={G.cy + G.ry} />
            {MERIDIANS.map(rx => <ellipse key={rx} className="rv-line" pathLength={1} cx={G.cx} cy={G.cy} rx={rx} ry={G.ry} />)}
          </svg>
        </div>
        <p className="rv-name">
          <span className="rv-clip"><span className="rv-word">AL&nbsp;Karrim</span></span>{' '}
          <span className="rv-clip"><span className="rv-word">Lanka</span></span>
        </p>
        <p className="rv-meta">
          <span>Consultants PVT LTD</span>
          <span className="rv-dot" aria-hidden="true" />
          <span>Since 1980 — <span className="rv-year">{FOUNDING_YEAR}</span></span>
        </p>
      </div>
      {active && <button type="button" className="rv-skip" aria-hidden="false" onClick={() => finishRef.current()}>Skip intro ↗</button>}
    </div>
  );
}
