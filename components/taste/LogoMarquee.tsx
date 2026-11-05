'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from './motion';
import './taste-ui.css';

export type MarqueeLogo = { id: string; name: string; src: string; width: number; height: number };

/**
 * A row of real client logos drifting slowly sideways. It fades out at both edges, pauses while pointed at,
 * runs only while on screen and has a pause button. Under reduced motion, and without script, the logos
 * stand in a wrapped row.
 */
export function LogoMarquee({ logos, speed = 34, label = 'Client logos' }: { logos: MarqueeLogo[]; speed?: number; label?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const live = mounted && !reduced && logos.length > 1;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = root.current, list = track.current;
    if (!el || !list || !live) return;
    const fit = () => {
      const width = list.scrollWidth;
      el.style.setProperty('--mq-w', `${width}px`);
      el.style.setProperty('--mq-dur', `${(width / speed).toFixed(2)}s`);
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(list);
    const visible = new IntersectionObserver(entries => setOnScreen(entries[entries.length - 1].isIntersecting));
    visible.observe(el);
    document.fonts?.ready.then(fit);
    return () => { resize.disconnect(); visible.disconnect(); };
  }, [live, speed, logos]);

  const items = (hidden: boolean) => logos.map(logo => (
    <li key={logo.id}><img src={logo.src} alt={hidden ? '' : logo.name} width={logo.width} height={logo.height} decoding="async" fetchPriority="low" /></li>
  ));

  return (
    <div ref={root} className={`tx-mq${live ? ' is-live' : ''}${paused ? ' is-paused' : ''}${onScreen ? ' is-on' : ''}`} role="group" aria-label={label}>
      <div className="tx-mq-rail">
        <ul ref={track} className="tx-mq-track">{items(false)}</ul>
        {live && <ul className="tx-mq-track tx-mq-clone" aria-hidden="true">{items(true)}</ul>}
      </div>
      {live && (
        <button type="button" className="tx-pause tx-mq-pause" aria-pressed={paused} aria-label={paused ? 'Play the logo row' : 'Pause the logo row'} onClick={() => setPaused(value => !value)}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
