'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ResponsiveImage, primeResponsiveImage } from '../ResponsiveImage';
import type { Destination } from '../../lib/types';
import { DestinationPicker } from './DestinationPicker';
import { DottedGlobe } from './DottedGlobe';
import { buildNetwork, nodeFor, tourStart } from './destinations';
import { ease, holdProgress, pullbackAt, seg, type PullbackGeo } from './logic';
import { useOnScreen, useReducedMotion } from './motion';
import { useDestinationTour } from './useDestinationTour';
import './taste-ui.css';

// The held scene runs on screens big enough to hold its copy (wide, tall, with motion allowed). Everywhere else
// (and with no script) the finished composition shows in normal flow.
const LIVE = '(min-width: 1100px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)';
const SMALL = '(max-width: 900px) 42vw, 26vw'; // the slot a destination's photograph fills once the scene has settled
const FALLBACK_IMAGE = '/media/colombo-dusk.webp';

type Frame = { src: string; alt: string };

/**
 * The photograph in the frame. The first one fills the screen at the start of the scene, so the home picture asks
 * for the full width; the others only ever fill the small frame. A new photograph is decoded first, then fades in
 * over the old one.
 */
function FrameImages({ src, alt, home }: { src: string; alt: string; home: string }) {
  const reduced = useReducedMotion();
  const [frames, setFrames] = useState<Frame[]>([{ src, alt }]);
  const first = useRef(true);
  const sizesFor = (path: string) => (path === home ? '100vw' : SMALL);
  useEffect(() => {
    // the opening photograph loads lazily with the page; only a change of photograph is fetched ahead of showing it
    if (first.current) { first.current = false; return; }
    let cancelled = false;
    const probe = new Image();
    primeResponsiveImage(probe, src, src === home ? '100vw' : SMALL);
    const show = () => {
      if (cancelled) return;
      setFrames(previous => {
        const last = previous[previous.length - 1];
        if (last.src === src) return last.alt === alt ? previous : [{ src, alt }];
        return reduced ? [{ src, alt }] : [last, { src, alt }];
      });
    };
    probe.decode().then(show, show);
    return () => { cancelled = true; };
  }, [src, alt, home, reduced]);
  return (
    <>
      {frames.map((item, index) => (
        <ResponsiveImage
          key={item.src}
          src={item.src}
          alt={item.alt}
          width={1680}
          height={1120}
          sizes={sizesFor(item.src)}
          className={frames.length > 1 && index === frames.length - 1 ? 'tx-cp-enter' : undefined}
          onAnimationEnd={() => setFrames(previous => (previous.length > 1 ? [previous[previous.length - 1]] : previous))}
        />
      ))}
    </>
  );
}

/**
 * The camera pulls back from Colombo. The stage opens on a photograph of the Colombo coast filling the screen; as
 * the visitor scrolls, the scale eases in log space until the photograph is a small frame at the foot of a dotted
 * globe, and the heading and the destinations arrive at the left. Native scroll only: the stage sticks for two
 * screens. Once it has settled the globe goes on a tour of the site's own destinations (the same list the page
 * shows lower down): it turns to each one in turn, draws the route from Colombo, and the frame and the card
 * change to that destination's photograph and words. The visitor can pause the tour or take over by choosing.
 */
export function ColomboPullback({ destinations }: { destinations: Destination[] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const globe = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const [wide, setWide] = useState(false);   // the screen could hold the scene
  const [roomy, setRoomy] = useState(true);  // and the copy fits inside the held stage
  const [settled, setSettled] = useState(false);
  const [globeReady, setGlobeReady] = useState(false); // the tour starts once the globe is there to follow it
  const live = wide && roomy;
  const hubs = useMemo(() => buildNetwork(destinations), [destinations]);
  const onScreen = useOnScreen(section, 0.3);
  const tour = useDestinationTour({ count: destinations.length, home: hubs.home, start: tourStart(hubs), active: (live ? settled : onScreen) && globeReady });
  const { reset: backToStart } = tour;

  useEffect(() => {
    const query = window.matchMedia(LIVE);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    // a window that has just changed size gets another chance to hold the scene
    let timer = 0;
    const retry = () => { window.clearTimeout(timer); timer = window.setTimeout(() => setRoomy(true), 250); };
    window.addEventListener('resize', retry);
    return () => { query.removeEventListener('change', update); window.removeEventListener('resize', retry); window.clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const host = section.current, st = stage.current, fr = frame.current, text = copy.current, ground = globe.current;
    if (!host || !st || !fr) return;
    const clear = () => {
      fr.style.transform = '';
      fr.style.removeProperty('--tx-s');
      if (text) text.style.cssText = '';
      if (ground) ground.style.cssText = '';
      finished.current = false;
      setSettled(false);
    };
    if (!live) { clear(); return; }

    let geo: PullbackGeo | null = null;
    let frameId = 0;
    // Someone moving through the page by keyboard gets the finished composition, so whatever has focus is on screen.
    let focusHeld = false;
    // the copy has to fit inside the held stage, or it would be cut off: if it does not, the plain layout is used
    const fits = () => {
      if (!text) return true;
      const style = getComputedStyle(st);
      const room = st.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      return text.offsetHeight <= room + 2;
    };
    const measure = () => {
      if (!fits()) { setRoomy(false); return; }
      fr.style.transform = '';
      const s = st.getBoundingClientRect();
      const f = fr.getBoundingClientRect();
      if (!f.width || !f.height) return;
      geo = {
        S0: Math.max(s.width / f.width, s.height / f.height) * 1.03,
        dx: s.left + s.width / 2 - (f.left + f.width / 2),
        dy: s.top + s.height / 2 - (f.top + f.height / 2),
      };
    };
    const update = () => {
      frameId = 0;
      if (!geo) return;
      const box = host.getBoundingClientRect();
      const p = focusHeld ? 1 : holdProgress(box.top, box.height, window.innerHeight);
      const { s, tx, ty } = pullbackAt(p, geo);
      fr.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      fr.style.setProperty('--tx-s', s.toFixed(4)); // keeps the frame's corner radius the same size at every scale
      if (text) {
        const k = seg(p, 0.66, 0.96, ease.out);
        text.style.opacity = k.toFixed(3);
        text.style.transform = `translate3d(0, ${((1 - k) * 20).toFixed(1)}px, 0)`;
        // Never hidden from assistive technology or the tab order; while it is faint it just cannot be clicked by accident.
        text.style.pointerEvents = k < 0.5 ? 'none' : '';
      }
      if (ground) ground.style.opacity = seg(p, 0.2, 0.6, ease.inOut).toFixed(3);
      // the tour starts once the picture has come to rest, and starts over from Colombo whenever it is left
      const done = p >= 0.96;
      if (done !== finished.current) { finished.current = done; setSettled(done); }
    };
    const schedule = () => { if (!frameId) frameId = requestAnimationFrame(update); };
    const remeasure = () => { measure(); schedule(); };
    // Keyboard focus only (a mouse click on a button must not make the scene jump).
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches(':focus-visible')) { focusHeld = true; schedule(); }
    };
    const onFocusOut = (event: FocusEvent) => {
      if (focusHeld && !(event.relatedTarget instanceof Node && host.contains(event.relatedTarget))) { focusHeld = false; schedule(); }
    };

    measure();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    host.addEventListener('focusin', onFocusIn);
    host.addEventListener('focusout', onFocusOut);
    const resize = new ResizeObserver(remeasure);
    resize.observe(st);
    document.fonts?.ready.then(remeasure);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      host.removeEventListener('focusin', onFocusIn);
      host.removeEventListener('focusout', onFocusOut);
      resize.disconnect();
      clear();
    };
  }, [live]);

  // leaving the finished picture (scrolling back up) starts the tour over from Colombo
  useEffect(() => { if (live && !settled) backToStart(); }, [live, settled, backToStart]);

  const current = destinations[tour.selected] ?? destinations[0];
  if (!current) return null;
  const homeImage = (destinations[hubs.home] ?? destinations[0]).image || FALLBACK_IMAGE;

  return (
    <section ref={section} className={`tx-cp${live ? ' is-live' : ''}`} aria-labelledby="cp-title">
      <div ref={stage} className="tx-cp-stage">
        <div ref={copy} className="tx-cp-copy">
          <span className="eyebrow">Our reach</span>
          <h2 id="cp-title">From Colombo to the world.</h2>
          <p className="tx-cp-intro">We recruit in Sri Lanka for employers in the Gulf, Europe, Asia and Australia.</p>
          <DestinationPicker destinations={destinations} selected={tour.selected} onChoose={tour.choose} onHold={tour.setHeld} announce={tour.engaged} />
          <p className="tx-cp-note">Routes and photographs are illustrative, not current vacancies.</p>
          <Link className="text-link" href="/destinations">See our destinations <ArrowRight size={16} /></Link>
        </div>
        <div className="tx-cp-world">
          <div ref={globe} className="tx-cp-globe">
            <DottedGlobe network={hubs.network} focus={nodeFor(hubs, tour.selected)} paused={tour.paused} onTogglePause={tour.togglePause} onReady={setGlobeReady} />
          </div>
          <div ref={frame} className="tx-cp-frame">
            <FrameImages src={current.image} alt={`${current.title}: illustrative photograph`} home={homeImage} />
          </div>
        </div>
      </div>
    </section>
  );
}
