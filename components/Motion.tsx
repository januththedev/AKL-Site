'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Industry, Destination } from '@/lib/types';
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
export function IndustryExplorer({industries}:{industries:Industry[]}) {
 const [active,setActive]=useState(0);
 const index = Math.min(active, Math.max(0, industries.length - 1));
 const item = industries[index];
 const [frames,setFrames]=useState<Industry[]>(() => industries[0] ? [industries[0]] : []);
 const currentPhoto = useRef(industries[0]?.image);
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const detailId = useId();
 const clearHover = () => {
  if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
  hoverTimer.current = null;
 };
 const select = (next: number) => { clearHover(); setActive(next); };
 useEffect(() => () => { if (hoverTimer.current !== null) clearTimeout(hoverTimer.current); }, []);
 useEffect(() => {
  if (!item || currentPhoto.current === item.image) return;
  let cancelled = false;
  const image = new Image();
  image.src = item.image;
  // Keep the previous photograph in place until its replacement can actually be painted.
  const show = () => {
   if (cancelled) return;
   currentPhoto.current = item.image;
   setFrames(previous => previous.at(-1)?.image === item.image ? previous : [...previous.slice(-1), item]);
  };
  image.decode().then(show, () => { if (image.naturalWidth > 0) show(); });
  return () => { cancelled = true; };
 }, [item]);
 useEffect(() => {
  if (frames.length < 2) return;
  // Also retire the old layer if animations are disabled or interrupted by a preference change.
  const timer = setTimeout(() => setFrames(previous => previous.length > 1 ? previous.slice(-1) : previous), 500);
  return () => clearTimeout(timer);
 }, [frames]);
 if (!item) return null;
 return <div className="industry-explorer"><figure className="industry-image story-industry-image" data-story-enter>
  {frames.map((frame, i) => <img key={frame.image} className={frames.length > 1 && i === frames.length - 1 ? 'industry-photo-enter' : undefined} src={frame.image} alt={`${frame.title} industry illustration`} aria-hidden={i !== frames.length - 1} width="1000" height="1100" loading="lazy" onAnimationEnd={event => {
   if (event.animationName === 'industry-photo-enter') setFrames(previous => previous.at(-1)?.image === frame.image ? previous.slice(-1) : previous);
  }}/>)}
  <figcaption><span>THE PEOPLE BEHIND THE PROGRESS</span><span>{String(index+1).padStart(2,'0')} / {String(industries.length).padStart(2,'0')}</span></figcaption>
 </figure><div className="industry-list"><p className="section-note">Different industries.<br/>The same belief in people.</p>{industries.map((x,i)=><button type="button" className={index===i?'industry-item active':'industry-item'} key={x.slug} onPointerEnter={event => {
  if (event.pointerType !== 'mouse') return;
  clearHover();
  hoverTimer.current = setTimeout(() => { hoverTimer.current = null; setActive(i); }, 180);
 }} onPointerLeave={clearHover} onFocus={()=>select(i)} onClick={()=>select(i)} aria-pressed={index===i} aria-controls={detailId}><span className="industry-number">{String(i+1).padStart(2,'0')}</span><span className="industry-title">{x.title}</span><ArrowUpRight size={22}/></button>)}<div className="industry-detail" id={detailId} aria-live="polite" aria-atomic="true"><p>{item.description}</p><Link className="text-link" href={`/industries/${item.slug}`}>Explore {item.title.toLowerCase()} <ArrowUpRight size={16}/></Link></div></div></div>;
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
  <div className="journey-visual-label"><span>FROM FIRST CONTACT</span><span>TO A NEW CHAPTER.</span></div>
 </div><div className="journey-steps" role="list" aria-label="Recruitment stages"><span className="journey-progress-rail" aria-hidden="true"><span className="journey-progress-fill"/><span className="journey-progress-dot"/></span>{journey.map((x,i)=><div key={x.label} role="listitem" aria-current={i===active?'step':undefined} className={`journey-step ${i===active?'active':''}`}><span className="journey-index">{String(i+1).padStart(2,'0')}</span><div><span className="eyebrow">{x.label}</span><h3>{x.title}</h3><p>{x.description}</p></div></div>)}</div></div>;
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
 return <div className="destination-story"><div className="destination-photo">{frames.map((frame,index)=><img className={frames.length>1&&index===frames.length-1?'destination-photo-enter':''} key={frame.image} src={frame.image} alt={`${frame.title} — illustrative photograph`} width="1600" height="1000" loading="lazy" onAnimationEnd={()=>setFrames(previous=>previous.length>1?[previous.at(-1)!]:previous)}/>)}<div className="destination-overlay"/><div className="destination-copy" key={copy.slug}><span className="eyebrow">{copy.region}</span><h3>{copy.title}</h3><p>{copy.description}</p></div><span className="destination-photo-caption">ILLUSTRATIVE PHOTOGRAPH / OUR INTERNATIONAL REACH</span></div><TalentRoutes destinations={destinations} selected={selected} onSelect={setSelected}/><div className="destination-tabs" role="group" aria-label="Explore destinations">{destinations.map((x,i)=><button key={x.slug} onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>{String(i+1).padStart(2,'0')}</span>{x.title}<ArrowUpRight size={17}/></button>)}</div></div>;
}
