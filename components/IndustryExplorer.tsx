'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Industry } from '@/lib/types';
import { industryAtScroll, industryChapterOffset } from '@/lib/industry-scroll';
import './industry-experience.css';
import { ResponsiveImage, primeResponsiveImage } from './ResponsiveImage';

// One value for the rendered <img> and the preloads, so the browser downloads each photo once.
const EXPLORER_PHOTO_SIZES = '(max-width: 1000px) 100vw, 50vw';

type Display = { index: number; frames: Industry[]; failed: boolean };

export function IndustryExplorer({ industries, scrollDriven = false }: { industries: Industry[]; scrollDriven?: boolean }) {
  const [requested, setRequested] = useState(0);
  const [display, setDisplay] = useState<Display>({ index: 0, frames: industries[0] ? [industries[0]] : [], failed: false });
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const seek = useRef<(index: number) => void>(() => {});
  const panelId = useId();
  const item = industries[display.index] || industries[0];

  useEffect(() => {
    const next = industries[requested];
    if (!next) return;
    let cancelled = false;
    const image = new Image();
    primeResponsiveImage(image, next.image, EXPLORER_PHOTO_SIZES);
    const commit = (failed: boolean) => {
      if (cancelled) return;
      // Copy, photograph, selected tab and counter change as one readable frame.
      setDisplay(previous => ({ index: requested, failed, frames: failed ? [] : previous.frames.at(-1)?.image === next.image ? [next] : [...previous.frames.slice(-1), next] }));
    };
    image.decode().then(() => commit(false), () => commit(!image.naturalWidth));
    return () => { cancelled = true; };
  }, [requested, industries]);

  useEffect(() => {
    if (display.frames.length < 2) return;
    const timer = setTimeout(() => setDisplay(previous => ({ ...previous, frames: previous.frames.slice(-1) })), 450);
    return () => clearTimeout(timer);
  }, [display.frames]);

  useEffect(() => {
    const track = root.current, panel = stage.current;
    if (!scrollDriven || !track || !panel || industries.length < 2) return;
    let disposed = false, frame = 0, ready = false, step = 1, top = 112;
    let target: number | null = null;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      frame = 0;
      if (!ready) return;
      const offset = top - track.getBoundingClientRect().top;
      if (target !== null) {
        if (Math.abs(offset - target) > 3) return;
        target = null;
      }
      const index = industryAtScroll(offset, step, industries.length);
      setRequested(previous => previous === index ? previous : index);
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      top = parseFloat(getComputedStyle(track).getPropertyValue('--industry-sticky-top')) || 112;
      const height = panel.getBoundingClientRect().height;
      // Short viewports keep the same controls, without pinning content off screen.
      ready = height <= window.innerHeight - top - 12;
      step = Math.max(220, window.innerHeight * .52);
      track.style.minHeight = ready ? `${height + industries.length * step}px` : '';
      track.dataset.scrollReady = String(ready);
      target = null;
      schedule();
    };
    seek.current = index => {
      setRequested(index);
      if (!ready) return;
      target = industryChapterOffset(index, step, industries.length);
      const destination = window.scrollY + track.getBoundingClientRect().top - top + target;
      window.scrollTo({ top: destination, behavior: preference.matches ? 'instant' : 'smooth' });
      schedule();
    };
    const interrupt = () => { target = null; schedule(); };
    const interruptKey = (event: KeyboardEvent) => {
      if (['PageDown', 'PageUp', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && !(event.target instanceof Element && event.target.closest('[role=tablist]'))) interrupt();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interruptKey);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', interruptKey);
      track.style.minHeight = '';
      delete track.dataset.scrollReady;
      seek.current = () => {};
    };
  }, [scrollDriven, industries.length]);

  // Warm the next photo near the panel, without putting seven images on the opening's network path.
  useEffect(() => {
    const track = root.current;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!track || connection?.saveData) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      for (const index of [display.index - 1, display.index + 1]) {
        if (industries[index]) { primeResponsiveImage(new Image(), industries[index].image, EXPLORER_PHOTO_SIZES); }
      }
    }, { rootMargin: '300px' });
    observer.observe(track);
    return () => observer.disconnect();
  }, [display.index, industries]);

  if (!item) return null;
  const select = (index: number) => { setRequested(index); seek.current(index); };
  return <div ref={root} className={`industry-scroll-track ${scrollDriven ? 'is-scroll-driven' : ''}`}>
    <div ref={stage} className="industry-scroll-stage">
      <div className="industry-explorer">
        <figure className="industry-image story-industry-image">
          {display.frames.map((photo, index) => <ResponsiveImage key={photo.image} className={display.frames.length > 1 && index === display.frames.length - 1 ? 'industry-photo-enter' : undefined} src={photo.image} alt={`${photo.title} — illustrative industry photograph`} aria-hidden={index !== display.frames.length - 1} width={1000} height={1100} sizes={EXPLORER_PHOTO_SIZES}/>)}
          {display.failed && <div className="industry-photo-fallback"><strong>{item.title}</strong></div>}
        </figure>
        <div className="industry-list">
          <div className="industry-tabs" role="tablist" aria-label="Our industry expertise">
            {industries.map((industry, index) => <button ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`${panelId}-tab-${index}`} key={industry.slug} className={`industry-item ${display.index === index ? 'active' : ''}`} aria-selected={display.index === index} aria-controls={panelId} tabIndex={display.index === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => {
              let next = index;
              if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % industries.length;
              else if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index - 1 + industries.length) % industries.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = industries.length - 1;
              else return;
              event.preventDefault();
              tabs.current[next]?.focus({ preventScroll: true });
              select(next);
            }}><span className="industry-title">{industry.title}</span><ArrowUpRight size={19} aria-hidden="true"/></button>)}
          </div>
          <div className="industry-detail" id={panelId} role="tabpanel" aria-labelledby={`${panelId}-tab-${display.index}`} aria-busy={requested !== display.index} tabIndex={0}>
            <div key={item.slug} className="industry-copy" aria-live="polite" aria-atomic="true"><p>{item.description}</p><Link className="text-link" href={`/industries/${item.slug}`}>Explore {item.title.toLowerCase()} <ArrowUpRight size={16}/></Link></div>
          </div>
        </div>
      </div>
      <div className="industry-scroll-caption"><div className="industry-scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(display.index + 1) / industries.length})` }}/></div></div>
    </div>
  </div>;
}
