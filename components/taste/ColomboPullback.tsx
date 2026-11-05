'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ResponsiveImage } from '../ResponsiveImage';
import { DottedGlobe } from './DottedGlobe';
import { ease, holdProgress, pullbackAt, seg, type PullbackGeo } from './logic';
import './taste-ui.css';

// The held scene runs on screens that are at least tablet wide and not asking for less motion.
// Everywhere else (and with no script) the finished composition shows in normal flow.
const LIVE = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

/**
 * The camera pulls back from Colombo. The stage opens on a photograph of the Colombo coast filling the screen; as
 * the visitor scrolls, the scale eases in log space until the photograph is a small frame at the foot of a dotted
 * globe, and the heading and the way on arrive at the left. Native scroll only: the stage sticks for two screens.
 */
export function ColomboPullback() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const globe = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(LIVE);
    const update = () => setLive(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const host = section.current, st = stage.current, fr = frame.current, text = copy.current, ground = globe.current;
    if (!host || !st || !fr) return;
    const reset = () => {
      fr.style.transform = '';
      fr.style.removeProperty('--tx-s');
      if (text) text.style.cssText = '';
      if (ground) ground.style.cssText = '';
    };
    if (!live) { reset(); return; }

    let geo: PullbackGeo | null = null;
    let frameId = 0;
    // Someone moving through the page by keyboard gets the finished composition, so whatever has focus is on screen.
    let settled = false;
    const measure = () => {
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
      const p = settled ? 1 : holdProgress(box.top, box.height, window.innerHeight);
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
    };
    const schedule = () => { if (!frameId) frameId = requestAnimationFrame(update); };
    const remeasure = () => { measure(); schedule(); };
    // Keyboard focus only (a mouse click on the pause button must not make the scene jump).
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches(':focus-visible')) { settled = true; schedule(); }
    };
    const onFocusOut = (event: FocusEvent) => {
      if (settled && !(event.relatedTarget instanceof Node && host.contains(event.relatedTarget))) { settled = false; schedule(); }
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
      reset();
    };
  }, [live]);

  return (
    <section ref={section} className={`tx-cp${live ? ' is-live' : ''}`} aria-labelledby="cp-title">
      <div ref={stage} className="tx-cp-stage">
        <div ref={copy} className="tx-cp-copy">
          <span className="eyebrow">Our reach</span>
          <h2 id="cp-title">From Colombo to the world.</h2>
          <p>We recruit in Sri Lanka for employers in the Gulf, Europe, Asia and Australia. The routes on the globe are illustrative.</p>
          <Link className="text-link" href="/destinations">See our destinations <ArrowRight size={16} /></Link>
        </div>
        <div className="tx-cp-world">
          <div ref={globe} className="tx-cp-globe"><DottedGlobe /></div>
          <div ref={frame} className="tx-cp-frame">
            <ResponsiveImage src="/media/colombo-dusk.webp" alt="Office towers on the Colombo coast at dusk" width={1680} height={1120} sizes="100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
