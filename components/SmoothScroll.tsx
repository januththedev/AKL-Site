'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/*
 * Inertial scrolling for desktop pointers only (docs/PREMIUM-FEEL-PLAN.md, Motion).
 * Off for touch, coarse pointers and prefers-reduced-motion; paused while a scroll lock is active
 * (mobile menu, Moments viewer set body overflow:hidden). Native scrolling is never replaced:
 * keyboard, anchors, find-in-page and the skip link keep working because Lenis follows the real
 * window scroll position.
 */
const PREVENT = '.chat-panel, .moment-lightbox, .mobile-navigation, [data-lenis-prevent]';

export function SmoothScroll() {
 const pathname = usePathname();
 const instance = useRef<{ resize: () => void } | null>(null);
 useEffect(() => {
  instance.current?.resize();
  const later = window.setTimeout(() => instance.current?.resize(), 500);
  return () => window.clearTimeout(later);
 }, [pathname]);
 useEffect(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  let generation = 0;
  let teardown = () => {};
  const stop = () => { generation++; teardown(); teardown = () => {}; instance.current = null; };
  const start = () => {
   const mine = ++generation;
   Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
    if (mine !== generation) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
     autoRaf: false,
     duration: 1.1,
     smoothWheel: true,
     anchors: false,
     prevent: node => !!node.closest(PREVENT),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const locked = () => document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden';
    const syncLock = () => { if (locked()) lenis.stop(); else lenis.start(); };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    syncLock();
    instance.current = lenis;
    teardown = () => {
     observer.disconnect();
     gsap.ticker.remove(tick);
     gsap.ticker.lagSmoothing(500, 33);
     lenis.off('scroll', ScrollTrigger.update);
     lenis.destroy();
    };
   }).catch(() => {});
  };
  const apply = () => { stop(); if (fine.matches && !calm.matches) start(); };
  apply();
  fine.addEventListener('change', apply);
  calm.addEventListener('change', apply);
  return () => { fine.removeEventListener('change', apply); calm.removeEventListener('change', apply); stop(); };
 }, []);
 return null;
}
