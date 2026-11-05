'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Moment } from '@/lib/types';
import { browseTarget, handleTrapKey } from '@/lib/a11y';
import './moments-gallery.css';
const studies=[['hero-team','The work ahead.'],['hospitality','The art of a welcome.'],['colombo-dusk','Where our story begins.'],['welding','Made with skill.'],['port-team','A world in motion.'],['dubai-night','Beyond the horizon.']];
const studyDimensions: Record<string, [number, number]> = {
 '/media/hero-team.webp': [1680,1120], '/media/hospitality.webp': [1680,1113],
 '/media/colombo-dusk.webp': [1680,1120], '/media/welding.webp': [1680,945],
 '/media/port-team.webp': [1680,1120], '/media/dubai-night.webp': [1120,1680],
};

function MomentImage({photo}:{photo:Moment}) {
 const dimensions = studyDimensions[photo.image];
 // Native image proportions also work for any new admin upload, without a layout preset.
 return <img src={photo.image} alt={photo.alt} width={dimensions?.[0]} height={dimensions?.[1]} loading="lazy" decoding="async"/>;
}
export function MomentsGallery({moments,preview=false}:{moments:Moment[];preview?:boolean}){
 const root=useRef<HTMLElement>(null),close=useRef<HTMLButtonElement>(null),openers=useRef<Array<HTMLButtonElement|null>>([]),viewer=useRef<HTMLDivElement>(null),lastShown=useRef(0),count=useRef(0);
 const [selected,setSelected]=useState<number|null>(null);const [failed,setFailed]=useState<string|null>(null);
 const photos=moments.length?moments:studies.map(([image,title],i)=>({id:String(i),title,image:`/media/${image}.webp`,thumbnail:`/intro/${image}.webp`,alt:`Illustrative photograph: ${title}`,credit:'Illustrative stock photography — see image credits',location:'',date:'',useInIntro:false,permissionConfirmed:true as const}));
 const visible=preview?photos.slice(0,4):photos;
 useEffect(()=>{
  let cancelled=false,dispose=()=>{},refreshFrame=0;
  Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
   if(cancelled)return;
   gsap.registerPlugin(ScrollTrigger);
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    const ctx=gsap.context(()=>{
     gsap.utils.toArray<HTMLElement>('.moment-photo').forEach((el,i)=>{
      // Move the complete frame slightly into view; never scale or crop the photograph.
      gsap.from(el,{y:16,opacity:.65,duration:.5,delay:(i%2)*.06,scrollTrigger:{trigger:el,start:'top 94%',once:true}});
      const caption=el.parentElement?.querySelector('figcaption');
      if(caption)gsap.from(caption,{y:8,opacity:.65,duration:.4,scrollTrigger:{trigger:caption,start:'top 96%',once:true}});
     });
    },root);
    return()=>ctx.revert();
   });
   const gallery=root.current;
   const loaded=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());};
   gallery?.addEventListener('load',loaded,true);
   dispose=()=>{media.revert();gallery?.removeEventListener('load',loaded,true);};
  }).catch(()=>dispose());
  return()=>{cancelled=true;dispose();cancelAnimationFrame(refreshFrame);};
 },[moments]);
 count.current=visible.length;
 if(selected!==null)lastShown.current=selected;
 const isOpen=selected!==null;
 // Depends only on open/closed so arrow-browsing never resets focus or the scroll lock.
 useEffect(()=>{if(!isOpen)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';close.current?.focus();const keys=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setSelected(null);return;}if(e.key==='Tab'){handleTrapKey(e,viewer.current);return;}const to=e.key==='ArrowRight'||e.key==='ArrowLeft'?browseTarget(lastShown.current,count.current,e.key):null;if(to!==null){e.preventDefault();setSelected(to);}};document.addEventListener('keydown',keys);return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',keys);openers.current[Math.min(lastShown.current,count.current-1)]?.focus();};},[isOpen]);
 const step=(by:number)=>setSelected(x=>x===null?null:(x+by+visible.length)%visible.length);
 const active=selected===null?null:visible[selected];
 return <section ref={root} id="moments-gallery" className={`moments-collection ${preview?'moments-preview':''}`}><div className="moments-section-heading"><div><span className="eyebrow">OUR STORY / IN FRAMES</span><h2>Life, <em>in motion.</em></h2></div>{preview?<Link href="/moments" className="glass-pill">All moments ↗</Link>:<span className="moments-count">{String(photos.length).padStart(2,'0')} / FRAMES</span>}</div>{!moments.length&&<p className="moments-source-note">An illustrative industry collection. Company moments will appear here as they are published. <Link href="/image-credits">Photography credits ↗</Link></p>}<div className="moments-grid">{visible.map((m,i)=><figure className={`moment moment-${i%4}`} key={m.id}><button className="moment-photo" ref={el=>{openers.current[i]=el;}} onClick={()=>{setFailed(null);setSelected(i);}} aria-label={`View frame: ${m.title}`} aria-haspopup="dialog"><MomentImage photo={m}/><span className="moment-glass"><span>VIEW FRAME</span><span aria-hidden="true">↗</span></span></button><figcaption><span className="moment-index">{String(i+1).padStart(2,'0')}</span><div><h3>{m.title}</h3><span>{m.location}{m.date&&` / ${new Intl.DateTimeFormat('en',{year:'numeric',month:'short',timeZone:'UTC'}).format(new Date(m.date))}`}</span></div></figcaption></figure>)}</div>{active&&<div ref={viewer} className="moment-lightbox" role="dialog" aria-modal="true" aria-labelledby="moment-viewer-title" aria-describedby="moment-viewer-help" onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}><button ref={close} onClick={()=>setSelected(null)} className="glass-pill">Close <span aria-hidden="true">×</span></button><figure key={active.id}>{failed===active.id?<div className="moment-viewer-error" role="alert"><p>This photograph could not be loaded.</p><p>You can close the viewer, or move to another frame.</p></div>:<img src={active.image} alt={active.alt} onError={()=>setFailed(active.id)}/>}<figcaption><h3 id="moment-viewer-title">{active.title}</h3><span>{active.credit}</span><p id="moment-viewer-help">Use the arrow keys or the buttons to browse. Escape closes the viewer.</p></figcaption></figure>{visible.length>1&&<div className="moment-viewer-nav"><button type="button" className="glass-pill" onClick={()=>step(-1)} aria-label="Previous photograph"><span aria-hidden="true">←</span></button><span role="status" aria-live="polite" aria-atomic="true">Photograph {selected!+1} of {visible.length}</span><button type="button" className="glass-pill" onClick={()=>step(1)} aria-label="Next photograph"><span aria-hidden="true">→</span></button></div>}</div>}</section>;
}
