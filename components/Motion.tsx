'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Industry, Destination } from '@/lib/types';
import { journey } from '@/content/default';

export function MotionRoot() {
 const pathname=usePathname();
 useEffect(()=>{let dispose=()=>{};let cancelled=false;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{if(cancelled)return;gsap.registerPlugin(ScrollTrigger);const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>{gsap.from(el,{y:28,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});});});dispose=()=>ctx.revert();});return()=>{cancelled=true;dispose();};},[pathname]);return null;
}
export function IndustryExplorer({industries}:{industries:Industry[]}) {
 const [active,setActive]=useState(0);const item=industries[active];
 return <div className="industry-explorer"><figure className="industry-image" key={item.slug}><img src={item.image} alt={`${item.title} industry illustration`} width="1000" height="1100" loading="lazy"/><figcaption><span>THE PEOPLE BEHIND THE PROGRESS</span><span>0{active+1} / 0{industries.length}</span></figcaption></figure><div className="industry-list"><p className="section-note">Different industries.<br/>The same belief in people.</p>{industries.map((x,i)=><button className={active===i?'industry-item active':'industry-item'} key={x.slug} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-pressed={active===i}><span className="industry-number">0{i+1}</span><span>{x.title}</span><ArrowUpRight size={22}/></button>)}<div className="industry-detail" aria-live="polite"><p>{item.description}</p><Link className="text-link" href={`/industries/${item.slug}`}>Explore {item.title.toLowerCase()} <ArrowUpRight size={16}/></Link></div></div></div>;
}
export function Journey() {
 const root=useRef<HTMLDivElement>(null);const [active,setActive]=useState(0);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let cancelled=false;let dispose=()=>{};Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{if(cancelled||!root.current)return;gsap.registerPlugin(ScrollTrigger);const mm=gsap.matchMedia();mm.add('(min-width: 1000px)',()=>{const ctx=gsap.context(()=>{ScrollTrigger.create({trigger:root.current,start:'top 110px',end:'+=1000',pin:true,scrub:true,onUpdate:self=>setActive(Math.min(3,Math.floor(self.progress*4)))});},root);return()=>ctx.revert();});dispose=()=>mm.revert();});return()=>{cancelled=true;dispose();};},[]);
 return <div ref={root} className="journey"><div className="journey-visual"><img src={active>1?'/media/airport.webp':'/media/port-team.webp'} alt="Illustrative international recruitment journey" width="1000" height="900" loading="lazy"/><div className="journey-visual-label"><span>FROM FIRST CONTACT</span><span>TO A NEW CHAPTER.</span></div></div><div className="journey-steps">{journey.map((x,i)=><div key={x.label} className={`journey-step ${i===active?'active':''}`}><span className="journey-index">0{i+1}</span><div><span className="eyebrow">{x.label}</span><h3>{x.title}</h3><p>{x.description}</p></div></div>)}</div></div>;
}
export function DestinationStory({destinations}:{destinations:Destination[]}) {
 const [selected,setSelected]=useState(0);const item=destinations[selected];
 return <div className="destination-story"><div className="destination-photo" key={item.slug}><img src={item.image} alt={`${item.title} destination illustration`} width="1600" height="1000" loading="lazy"/><div className="destination-overlay"/><div className="destination-copy"><span className="eyebrow">{item.region}</span><h3>{item.title}</h3><p>{item.description}</p></div></div><div className="route-map" aria-hidden="true"><svg viewBox="0 0 550 250" fill="none"><path d="M15 185C98 160 90 70 188 93S258 180 327 130S419 21 530 57" stroke="currentColor" strokeWidth="1" opacity=".25"/><path d="M15 185Q225 30 342 138" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 5"/><circle cx="342" cy="138" r="5" fill="currentColor"/><circle cx="15" cy="185" r="4" fill="currentColor"/><text x="355" y="145" fill="currentColor" fontSize="12">SRI LANKA</text><text x="20" y="215" fill="currentColor" fontSize="10">A WORLD OF CONNECTIONS</text></svg></div><div className="destination-tabs" role="group" aria-label="Explore destinations">{destinations.map((x,i)=><button key={x.slug} onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>0{i+1}</span>{x.title}<ArrowUpRight size={17}/></button>)}</div></div>;
}
