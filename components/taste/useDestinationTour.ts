'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { nextStop, tourOrder, TOUR_DWELL_MS } from './destinations';
import { useReducedMotion } from './motion';

/**
 * Which destination is on show, and the tour that moves through them. The tour runs by itself only while the
 * picture is on screen (`active`), the tab is visible, motion is allowed, nobody has paused it, the pointer or
 * focus is not on the destination list, and the visitor has not chosen a destination. Choosing one ends the
 * tour for good: from then on the visitor is in charge.
 */
export function useDestinationTour({ count, home, start, active }: { count: number; home: number; start: number; active: boolean }) {
  const reduced = useReducedMotion();
  const order = useMemo(() => tourOrder(count, home), [count, home]);
  const [chosen, setChosen] = useState(start);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);
  const selected = chosen < count ? chosen : start;

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!active || !visible || paused || engaged || held || reduced || order.length < 2) return;
    const timer = window.setTimeout(() => setChosen(nextStop(order, selected)), TOUR_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [active, visible, paused, engaged, held, reduced, order, selected]);

  const choose = useCallback((index: number) => { setEngaged(true); setChosen(index); }, []);
  const reset = useCallback(() => setChosen(start), [start]);
  const togglePause = useCallback(() => setPaused(value => !value), []);
  return { selected, choose, reset, paused, togglePause, engaged, setHeld };
}
