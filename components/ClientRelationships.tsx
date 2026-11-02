'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, RotateCcw } from 'lucide-react';
import scene from '@/content/client-scene.json';

type Phase = 'waiting' | 'playing' | 'paused' | 'ended' | 'static';
const RUN_EVENT = 'akl:relationships-run';

/** Four small artwork layers; the camera, blur and typography are animated in code. */
export function ClientRelationships({ variant = 'primary' }: { variant?: 'primary' | 'supporting' | 'teaser' }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const replay = useRef(() => {});
  const togglePlayback = useRef(() => {});
  const [phase, setPhase] = useState<Phase>('waiting');

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (typeof element.animate !== 'function' || !('IntersectionObserver' in window)) { setPhase('static'); return; }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const portrait = matchMedia('(max-width: 700px)');
    let animations: Animation[] = [];
    let disposed = false, visible = false, prepared = false, preparing = false, started = false, ended = false;
    let userPaused = false, decodeEpoch = 0, runEpoch = 0, resumeAt = 0, resizeFrame = 0;
    const images = [...element.querySelectorAll('img')];
    const cancel = () => { runEpoch++; animations.forEach(animation => animation.cancel()); animations = []; };
    const pause = (manual = false) => {
      if (manual) userPaused = true;
      if (started && !ended) { animations.forEach(animation => animation.pause()); setPhase('paused'); }
    };
    const animate = (selector: string, frames: Keyframe[]) => {
      const target = element.querySelector<HTMLElement>(selector);
      if (!target) return;
      const animation = target.animate(frames, {duration:scene.duration,fill:'forwards',easing:'linear'});
      animations.push(animation);
      return animation;
    };
    const begin = (requested = false) => {
      if (disposed || (!visible && !requested) || !prepared || document.hidden || reduced.matches || ended || userPaused) return;
      if (started) { animations.forEach(animation => animation.play()); setPhase('playing'); return; }
      started = true;
      const run = ++runEpoch;
      setPhase('playing');
      window.dispatchEvent(new CustomEvent(RUN_EVENT, {detail:id}));
      const layout = portrait.matches ? scene.portrait : scene.landscape;
      const transform = (scale: number, centering: number) => `translate(${-(layout.centerX-.5)*100*scale*centering}%, ${-(layout.centerY-.5)*100*scale*centering}%) scale(${scale})`;
      const camera = animate('.relationship-camera', [
        {transform:transform(layout.initialScale,1),offset:0},
        {transform:transform(layout.initialScale,1),offset:.15,easing:'cubic-bezier(.3,.7,.2,1)'},
        {transform:transform(Math.max(1.6,layout.initialScale*.62),.48),offset:.32,easing:'cubic-bezier(.3,.7,.2,1)'},
        {transform:transform(1,0),offset:.52},
        {transform:transform(1,0),offset:1},
      ]);
      animate('.relationship-artwork', [
        {opacity:1,filter:'blur(0px)',offset:0}, {opacity:1,filter:'blur(0px)',offset:.52},
        {opacity:.1,filter:'blur(6px)',offset:.64}, {opacity:.1,filter:'blur(6px)',offset:1},
      ]);
      for (const [group,start,end] of [['lodige',.16,.23],['ring',.19,.31],['outer',.34,.43]] as const) {
        animate(`[data-logo-layer="${group}"]`, [{opacity:0,offset:0},{opacity:0,offset:start},{opacity:1,offset:end},{opacity:1,offset:1}]);
      }
      animate('.relationship-darkening', [{opacity:0,offset:0},{opacity:0,offset:.52},{opacity:.9,offset:.64},{opacity:.96,offset:1}]);
      animate('.relationship-message-copy', [
        {opacity:0,transform:'translateY(8px)',offset:0},{opacity:0,transform:'translateY(8px)',offset:.61},
        {opacity:1,transform:'translateY(0)',offset:.67},{opacity:1,transform:'translateY(0)',offset:.83},
        {opacity:0,transform:'translateY(-4px)',offset:.87},{opacity:0,offset:1},
      ]);
      animate('.relationship-brand-copy', [{opacity:0,transform:'translateY(6px)',offset:0},{opacity:0,transform:'translateY(6px)',offset:.86},{opacity:1,transform:'translateY(0)',offset:.94},{opacity:1,offset:1}]);
      const startTime = document.timeline.currentTime;
      if (typeof startTime === 'number') animations.forEach(animation => { animation.startTime = startTime - resumeAt; });
      resumeAt = 0;
      void camera?.finished.then(() => {
        if (!disposed && run === runEpoch) { ended = true; setPhase('ended'); }
      }).catch(() => { /* Cancellation restores the readable static composition. */ });
    };
    const prepare = async () => {
      if (disposed || prepared || preparing) return;
      const epoch = decodeEpoch;
      preparing = true;
      const decoded = await Promise.allSettled(images.map(image => image.decode()));
      if (disposed || epoch !== decodeEpoch) return;
      preparing = false;
      if (decoded.some(result => result.status === 'rejected') || images.some(image => !image.naturalWidth)) {
        setPhase('static'); return;
      }
      prepared = true;
      begin();
    };
    const onArtworkLoad = () => { void prepare(); };
    const onArtworkError = () => { if (!prepared) setPhase('static'); };
    images.forEach(image => { image.addEventListener('load',onArtworkLoad); image.addEventListener('error',onArtworkError); });
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      visible = entry.intersectionRatio >= .35;
      if (entry.isIntersecting) void prepare();
      if (visible) begin(); else pause();
    }, {threshold:[0,.35]});
    observer.observe(element);
    const onVisibility = () => { if (document.hidden) pause(); else begin(); };
    const onOther = (event: Event) => { if ((event as CustomEvent<string>).detail !== id) pause(); };
    const onPreference = () => {
      cancel(); started = false; ended = false; userPaused = false; resumeAt = 0;
      if (reduced.matches) setPhase('static'); else { setPhase('waiting'); begin(); }
    };
    const onResize = () => {
      decodeEpoch++; prepared = false; preparing = false;
      // The final camera is layout-independent; keep the end frame during rotation.
      if (!ended) {
        const time = animations[0]?.currentTime;
        if (typeof time === 'number') resumeAt = Math.max(0,Math.min(scene.duration - 1,time));
        cancel(); started = false;
        setPhase(reduced.matches ? 'static' : userPaused ? 'paused' : 'waiting');
      }
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => { void prepare(); });
    };
    replay.current = () => { cancel(); started = false; ended = false; userPaused = false; resumeAt = 0; begin(true); };
    togglePlayback.current = () => {
      if (animations.some(animation => animation.playState === 'running')) pause(true);
      else { userPaused = false; begin(true); }
    };
    if (reduced.matches) setPhase('static');
    reduced.addEventListener('change',onPreference);
    portrait.addEventListener('change',onResize);
    document.addEventListener('visibilitychange',onVisibility);
    window.addEventListener(RUN_EVENT,onOther);
    return () => {
      disposed = true; cancel(); observer.disconnect(); cancelAnimationFrame(resizeFrame);
      images.forEach(image => { image.removeEventListener('load',onArtworkLoad); image.removeEventListener('error',onArtworkError); });
      replay.current = () => {}; togglePlayback.current = () => {};
      reduced.removeEventListener('change',onPreference);
      portrait.removeEventListener('change',onResize);
      document.removeEventListener('visibilitychange',onVisibility);
      window.removeEventListener(RUN_EVENT,onOther);
    };
  }, [id]);

  return <section id={variant === 'primary' ? 'relationships' : undefined} className={`client-relationships client-relationships-${variant}`} aria-label="The companies in our story">
    <figure>
      <div ref={root} className="relationship-scene" data-phase={phase}>
        <div className="relationship-camera" aria-hidden="true"><div className="relationship-artwork">
          {scene.landscape.layers.map((layer,index) => <picture key={layer.group} data-logo-layer={layer.group}><source media="(max-width: 700px)" srcSet={scene.portrait.layers[index].src}/><img src={layer.src} alt="" width={scene.landscape.width} height={scene.landscape.height} loading="lazy" decoding="async"/></picture>)}
        </div></div>
        <div className="relationship-darkening" aria-hidden="true"/>
        <div className="relationship-scene-label" aria-hidden="true">A WORLD OF CONNECTIONS. ONE STARTING POINT.</div>
        <div className="relationship-message-copy" aria-hidden="true"><span>Sri Lankan talent.</span><em>Global connections.</em><small>Connecting people with companies like these.</small></div>
        <div className="relationship-brand-copy" aria-hidden="true"><span>AL Karrim Lanka</span><span>CONSULTANTS PVT LTD</span><small>PEOPLE. POSSIBILITY. PROGRESS.</small></div>
        {(phase === 'playing' || phase === 'paused' || phase === 'ended') && <button className="relationship-control" type="button" onClick={() => phase === 'ended' ? replay.current() : togglePlayback.current()} aria-label={phase === 'ended' ? 'Replay client animation' : phase === 'paused' ? 'Resume client animation' : 'Pause client animation'}>
          {phase === 'ended' ? <RotateCcw size={16} aria-hidden="true"/> : phase === 'paused' ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}
        </button>}
      </div>
      <figcaption><span>Connecting Sri Lankan talent with companies like these.</span><Link className="text-link" href="/clients#client-directory">Explore our clients <ArrowUpRight size={14}/></Link></figcaption>
    </figure>
  </section>;
}
