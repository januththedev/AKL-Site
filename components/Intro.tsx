'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const INTRO_VERSION = 'akl:intro:v4';
const DURATION = 3;

export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun(value => value + 1);
    window.addEventListener('akl:replay-intro', replay);
    return () => window.removeEventListener('akl:replay-intro', replay);
  }, []);

  useLayoutEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let done = false;
    let timeline: gsap.core.Timeline | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let readyTimeout: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let image: HTMLImageElement | undefined;
    try {
      if (reduced.matches || document.hidden || (run === 0 && sessionStorage.getItem(INTRO_VERSION) === 'seen')) return;
    } catch { return; }

    const complete = () => {
      if (done || disposed) return;
      done = true;
      timeline?.kill();
      clearTimeout(watchdog);
      clearTimeout(readyTimeout);
      cancelAnimationFrame(frame);
      setPlaying(false);
      try { sessionStorage.setItem(INTRO_VERSION, 'seen'); } catch {}
    };
    finishRef.current = complete;
    const interaction = (event: Event) => {
      if (event instanceof KeyboardEvent && !['Escape', 'Tab'].includes(event.key)) return;
      complete();
    };
    const visibility = () => { if (document.hidden) complete(); };
    const mediaChange = () => { if (reduced.matches) complete(); };

    async function prepare() {
      image = new Image();
      image.decoding = 'async';
      image.src = matchMedia('(max-width: 600px)').matches
        ? '/intro/atlas-mobile.webp' : '/intro/atlas-desktop.webp';
      // Decode one atlas, rather than requesting or animating 500 individual images.
      try { await image.decode(); } catch { complete(); return; }
      if (disposed || done || document.hidden || reduced.matches) return;
      clearTimeout(readyTimeout);
      setPlaying(true);
      frame = requestAnimationFrame(() => {
        if (!root.current || disposed || done) return;
        const wall = root.current.querySelector<HTMLElement>('.intro-wall')!;
        const lanes = root.current.querySelectorAll<HTMLElement>('.intro-lane');
        const black = root.current.querySelector('.intro-black');
        const title = root.current.querySelector('.intro-title');
        wall.style.backgroundImage = `url("${image!.src}")`;
        lanes.forEach(lane => { lane.style.backgroundImage = `url("${image!.src}")`; });
        timeline = gsap.timeline({ onComplete: complete });
        timeline.set(black, { opacity: 0 }).set(title, { opacity: 0, y: 8 });
        timeline.set(wall, { scale: 7, rotation: -9, opacity: .75 });
        timeline.set(lanes, { yPercent: i => i % 2 ? -65 : 65, scale: 1.15, opacity: 0 });
        timeline.to(lanes, { opacity: 1, duration: .16, stagger: .025 }, 0);
        lanes.forEach((lane, i) => {
          timeline!.to(lane, { yPercent: i % 2 ? 55 : -55, duration: 1.55, ease: 'power2.inOut' }, i * .035);
        });
        timeline.to(wall, { scale: 1, rotation: 0, opacity: 1, duration: 1.65, ease: 'power3.inOut' }, .22);
        timeline.to(lanes, { opacity: 0, duration: .42, stagger: .025 }, 1.15);
        timeline.to(wall, { scale: .92, opacity: .35, duration: .3, ease: 'power2.in' }, 1.78);
        timeline.to(black, { opacity: 1, duration: .15 }, 2.05);
        timeline.to(title, { opacity: 1, y: 0, duration: .18, ease: 'power2.out' }, 2.2);
        timeline.to(title, { opacity: 1, duration: .62 }, 2.38);
        watchdog = setTimeout(complete, DURATION * 1000 + 100);
      });
    }

    // Page remains usable while decoding; a slow network bypasses the opening.
    readyTimeout = setTimeout(complete, 1200);
    document.addEventListener('keydown', interaction, true);
    document.addEventListener('wheel', interaction, { passive: true });
    document.addEventListener('touchmove', interaction, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', mediaChange);
    void prepare();
    return () => {
      disposed = true;
      timeline?.kill();
      clearTimeout(readyTimeout);
      clearTimeout(watchdog);
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', interaction, true);
      document.removeEventListener('wheel', interaction);
      document.removeEventListener('touchmove', interaction);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', mediaChange);
    };
  }, [run]);

  return <div ref={root} className={`intro intro-mosaic ${playing ? 'is-playing' : ''}`}
    aria-hidden={!playing} data-intro-state={playing ? 'playing' : 'bypassed'} data-photo-tiles="500">
    <div className="intro-stage" aria-hidden="true">
      <div className="intro-wall" />
      <div className="intro-lanes">{Array.from({ length: 5 }, (_, i) =>
        <div key={i} className="intro-lane" style={{ backgroundPosition: `${i * 25}% 50%` }} />)}</div>
      <div className="intro-vignette" />
    </div>
    <div className="intro-black" />
    <p className="intro-title">AL-Karrim Lanka</p>
    {playing && <button className="intro-skip" onClick={() => finishRef.current()}>Skip intro ↗</button>}
  </div>;
}
