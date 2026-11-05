'use client';
import { useEffect, useMemo, useRef } from 'react';
import { digitStrips } from './logic';
import './taste-ui.css';

/**
 * A figure that rolls like an odometer once, the first time it is on screen, and stops on the real value.
 * The figure is in the HTML as written, and each digit strip starts and ends on its own digit, so the
 * figure reads correctly without script, before the roll, after it and under reduced motion (no roll).
 * The digits that roll are drawn with generated content (data-d), so the page text holds the figure once
 * (the visually hidden copy) and search engines, reader mode and copy-paste do not see the strips.
 */
export function CounterRoll({ value, delay = 0, duration = 1400 }: { value: string; delay?: number; duration?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const strips = useMemo(() => digitStrips(value), [value]);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const animations: Animation[] = [];
    const run = () => {
      el.querySelectorAll<HTMLElement>('[data-strip]').forEach(strip => {
        const turns = Number(strip.dataset.turns || 1);
        const col = Number(strip.dataset.col || 0);
        const animation = strip.animate(
          [{ transform: 'translateY(0)' }, { transform: `translateY(${-turns * 10}em)` }],
          { duration: duration + col * 140, delay, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'forwards' },
        );
        // the last cell is the first digit again: cancelling at the end leaves the strip at rest with no change on screen
        animation.finished.then(() => { try { animation.cancel(); } catch { /* already gone */ } }, () => {});
        animations.push(animation);
      });
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); run(); }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); animations.forEach(a => { try { a.cancel(); } catch { /* done */ } }); };
  }, [value, delay, duration]);

  return (
    <span ref={root} className="tx-roll">
      <span className="tx-sr">{value}</span>
      <span className="tx-roll-vis" aria-hidden="true">
        {strips.map((strip, index) => strip.kind === 'char'
          ? <span key={index} className="tx-roll-ch" data-d={strip.ch} />
          : <span key={index} className="tx-roll-col"><span className="tx-roll-strip" data-strip data-turns={strip.turns} data-col={strip.col}>{strip.cells.map((digit, i) => <span key={i} data-d={digit} />)}</span></span>)}
      </span>
    </span>
  );
}
