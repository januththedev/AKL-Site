'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import type { Destination } from '@/lib/types';
import { journey } from '@/content/default';
import { TalentRoutes } from '@/components/TalentRoutes';
import './story-motion.css';

export function MotionRoot() {
 const pathname = usePathname();
 const revealed = useRef(new WeakSet<HTMLElement>());
 useEffect(() => {
  let cancelled = false;
  let dispose = () => {};
  Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
   if (cancelled) return;
   gsap.registerPlugin(ScrollTrigger);
   const media = gsap.matchMedia();
   dispose = () => media.revert();
   media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1000px)' }, context => {
    if (!context.conditions?.motion) return;
    const accents: HTMLElement[] = [];
    const ctx = gsap.context(() => {
     gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: {
      trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true,
     }});
     // Preserve the photograph's existing motion; the opening owns every hero text transition.
     if (context.conditions?.desktop && document.querySelector('.hero-photograph')) {
      gsap.fromTo('.hero-photograph>img', { yPercent: -5, scale: 1.1 }, {
       yPercent: 5, scale: 1.1, ease: 'none', scrollTrigger: {
        trigger: '.hero-photograph', start: 'top bottom', end: 'bottom top', scrub: true,
       },
      });
     }
     const main = document.querySelector('main');
     if (!main) return;
     const headings = main.querySelectorAll<HTMLElement>([
      '.section-heading h2', '.page-opening-copy h1', '.simple-opening h1',
      '.roots-copy h2', '.profile-reach h2', '.chairman-heading h2',
      '.moments-section-heading h2', '.employer-band h2', '.inquiry-intro h2',
      '[data-story-heading]',
     ].join(','));
     headings.forEach(heading => {
      if (heading.closest('.home-hero, [data-no-story-motion]') || revealed.current.has(heading)) return;
      const phrases = heading.querySelectorAll<HTMLElement>(':scope > .story-line > .story-line-ink');
      if (phrases.length) {
       gsap.fromTo(phrases, { yPercent: 105, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: .8, stagger: .11, ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 91%', once: true, onEnter: () => revealed.current.add(heading) },
       });
       return;
      }
      const accent = heading.querySelector<HTMLElement>(':scope > em');
      if (accent) {
       accent.classList.add('story-accent');
       accents.push(accent);
      }
      const timeline = gsap.timeline({ scrollTrigger: {
       trigger: heading, start: 'top 92%', once: true,
       onEnter: () => revealed.current.add(heading),
      }});
      timeline.fromTo(heading, { y: 8, opacity: .65 }, {
       y: 0, opacity: 1, duration: .45, ease: 'power2.out',
      });
      if (accent) {
       // Use the existing semantic accent line, without splitting text or duplicating headings.
       timeline.fromTo(accent, { opacity: .65, '--story-emphasis': '0%' }, {
        opacity: 1, '--story-emphasis': '100%', duration: .35, ease: 'power2.out',
       }, .06);
      }
     });
     // Reveal intact phrases and paragraphs; the text remains semantic and selectable.
     main.querySelectorAll<HTMLElement>('[data-story-lines]').forEach(group => {
      if (group.closest('.home-hero, [data-no-story-motion]') || revealed.current.has(group)) return;
      const lines = group.querySelectorAll(':scope > p, :scope > [data-story-line]');
      if (!lines.length) return;
      gsap.fromTo(lines, { y: 14, opacity: 0 }, {
       y: 0, opacity: 1, duration: .65, stagger: .12, ease: 'power2.out',
       scrollTrigger: { trigger: group, start: 'top 91%', once: true, onEnter: () => revealed.current.add(group) },
      });
     });
     main.querySelectorAll<HTMLElement>('.client-logo-wall').forEach(wall => {
      const cards = wall.querySelectorAll('.client-logo-tile');
      if (!cards.length || revealed.current.has(wall)) return;
      gsap.fromTo(cards, { y: 6, opacity: .65 }, {
       y: 0, opacity: 1, duration: .4, stagger: .035, ease: 'power2.out',
       scrollTrigger: { trigger: wall, start: 'top 92%', once: true, onEnter: () => revealed.current.add(wall) },
      });
     });
     main.querySelectorAll<HTMLElement>('[data-reveal], [data-story-enter]').forEach(el => {
      if (el.closest('.home-hero, [data-no-story-motion]') || revealed.current.has(el)) return;
      // Heading containers and long copy stay stationary. Their headings already have a reveal.
      if (el.querySelector('h1, h2, h3, p')) return;
      const textOnly = el.matches('p, .side-note, .eyebrow');
      gsap.fromTo(el, { y: textOnly ? 0 : 8, opacity: .65 }, {
       y: 0, opacity: 1, duration: textOnly ? .25 : .45, ease: 'power2.out',
       scrollTrigger: { trigger: el, start: 'top 94%', once: true, onEnter: () => revealed.current.add(el) },
      });
     });
    });
    return () => { ctx.revert(); accents.forEach(accent => accent.classList.remove('story-accent')); };
   });
  }).catch(() => dispose());
  return () => { cancelled = true; dispose(); };
 }, [pathname]);
 return <div className="reading-progress" aria-hidden="true" />;
}
export function Journey() {
 const root=useRef<HTMLDivElement>(null);const [active,setActive]=useState(0);
 const [arrivalReady, setArrivalReady] = useState(false);
 const showArrival = active >= 2 && arrivalReady;
 useEffect(() => {
  const element = root.current;
  if (!element) return;
  const steps = Array.from(element.querySelectorAll<HTMLElement>('.journey-step'));
  const container = element.querySelector<HTMLElement>('.journey-steps');
  if (!container || !steps.length) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let disposed = false;
  const update = () => {
   frame = 0;
   const readingLine = window.innerHeight * .52;
   const bounds = container.getBoundingClientRect();
   const points = steps.map(step => {
    const marker = step.querySelector<HTMLElement>('.journey-index')!.getBoundingClientRect();
    return marker.top + marker.height / 2;
   });
   const start = points[0], end = points.at(-1)!;
   const progress = end > start ? Math.max(0, Math.min(1, (readingLine - start) / (end - start))) : 0;
   let nearest = 0;
   points.forEach((point, i) => { if (Math.abs(point - readingLine) < Math.abs(points[nearest] - readingLine)) nearest = i; });
   setActive(previous => previous === nearest ? previous : nearest);
   container.style.setProperty('--journey-rail-top', `${start - bounds.top}px`);
   container.style.setProperty('--journey-rail-height', `${Math.max(0, end - start)}px`);
   container.style.setProperty('--journey-progress', String(preference.matches ? nearest / Math.max(1, steps.length - 1) : progress));
  };
  const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
  // Track where the visitor is reading; the document keeps its natural scroll length on every device.
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  preference.addEventListener('change', schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(container);
  document.fonts.ready.then(schedule);
  return () => {
   disposed = true;
   window.removeEventListener('scroll', schedule);
   window.removeEventListener('resize', schedule);
   preference.removeEventListener('change', schedule);
   observer.disconnect();
   cancelAnimationFrame(frame);
  };
 }, []);
 return <div ref={root} className="journey story-journey"><div className="journey-visual" data-story-enter>
  <img className={`journey-photo ${!showArrival?'is-current':''}`} src="/media/port-team.webp" alt="Illustrative international recruitment journey" width="1000" height="900" loading="lazy" aria-hidden={showArrival}/>
  <img className={`journey-photo ${showArrival?'is-current':''}`} src="/media/airport.webp" alt="Illustrative travel and mobilisation" width="1000" height="900" loading="lazy" aria-hidden={!showArrival} onLoad={() => setArrivalReady(true)}/>
 </div><div className="journey-steps" role="list" aria-label="Recruitment stages"><span className="journey-progress-rail" aria-hidden="true"><span className="journey-progress-fill"/><span className="journey-progress-dot"/></span>{journey.map((x,i)=><div key={x.label} role="listitem" aria-current={i===active?'step':undefined} className={`journey-step ${i===active?'active':''}`}><span className="journey-index">{String(i+1).padStart(2,'0')}</span><div><span className="eyebrow">{x.label}</span><h3 role="heading" aria-level={2}>{x.title}</h3><p>{x.description}</p></div></div>)}</div></div>;
}
export function DestinationStory({destinations}:{destinations:Destination[]}) {
 const [selected,setSelected]=useState(0);
 const item=destinations[selected] || destinations[0];
 const [copy,setCopy]=useState(item);
 const [frames,setFrames]=useState([item]);
 useEffect(()=>{
  let cancelled=false;
  const image=new Image();
  image.src=item.image;
  const show=()=>{if(cancelled)return;setCopy(item);setFrames(previous=>previous.at(-1)?.image===item.image?[item]:[previous.at(-1)!,item]);};
  image.decode().then(show,()=>{if(!cancelled)setCopy(item);});
  return()=>{cancelled=true;};
 },[item]);
 return <div className="destination-story"><div className="destination-photo">{frames.map((frame,index)=><img className={frames.length>1&&index===frames.length-1?'destination-photo-enter':''} key={frame.image} src={frame.image} alt={`${frame.title} — illustrative photograph`} width="1600" height="1000" loading="lazy" onAnimationEnd={()=>setFrames(previous=>previous.length>1?[previous.at(-1)!]:previous)}/>)}<div className="destination-overlay"/><div className="destination-copy" key={copy.slug}><span className="eyebrow">{copy.region}</span><h3 role="heading" aria-level={2}>{copy.title}</h3><p>{copy.description}</p></div><span className="destination-photo-caption">Illustrative photograph</span></div><TalentRoutes destinations={destinations} selected={selected} onSelect={setSelected}/><div className="destination-tabs" role="group" aria-label="Explore destinations">{destinations.map((x,i)=><button key={x.slug} onClick={()=>setSelected(i)} aria-pressed={selected===i}>{x.title}<ArrowUpRight size={17}/></button>)}</div></div>;
}
