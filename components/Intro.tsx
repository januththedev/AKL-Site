'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const files=['hero-team','hospitality','welding','port-team','automotive','colombo-dusk','dubai-night'];
export function Intro() {
 const root=useRef<HTMLDivElement>(null);const [playing,setPlaying]=useState(false);const finishRef=useRef<()=>void>(()=>{});
 useLayoutEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');const start=performance.now();let disposed=false,done=false;let timeline:gsap.core.Timeline|undefined;let watchdog:ReturnType<typeof setTimeout>|undefined;let readyTimeout:ReturnType<typeof setTimeout>|undefined;
  const seen=()=>{try{return sessionStorage.getItem('akl:intro:v3')==='seen';}catch{return true;}};
  if(reduced.matches||seen()||document.hidden)return;
  const complete=()=>{if(done||disposed)return;done=true;timeline?.kill();clearTimeout(watchdog);setPlaying(false);try{sessionStorage.setItem('akl:intro:v3','seen');}catch{};};finishRef.current=complete;
  const interaction=(e:Event)=>{if(e instanceof KeyboardEvent&&!['Escape','Tab'].includes(e.key))return;complete();};
  const visibility=()=>{if(document.hidden)complete();};
  const mediaChange=()=>{if(reduced.matches)complete();};
  const ready=Promise.all(files.map(file=>new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve();image.onerror=()=>reject();image.src=`/intro/${file}.webp`;})));
  readyTimeout=setTimeout(()=>{if(!timeline)complete();},200);
  ready.then(()=>{if(disposed||done||performance.now()-start>220)return;clearTimeout(readyTimeout);setPlaying(true);
    requestAnimationFrame(()=>{if(!root.current||disposed||done)return;const panels=root.current.querySelectorAll<HTMLElement>('.intro-panel');const title=root.current.querySelector('.intro-title');const black=root.current.querySelector('.intro-black');
      timeline=gsap.timeline({onComplete:complete});timeline.set(panels,{opacity:0,scale:1.12,rotationY:-7,xPercent:-18});
      panels.forEach((panel,i)=>{const t=i<2?.12:i<3?.52:i<5?.92:1.32;timeline!.to(panel,{opacity:1,xPercent:0,rotationY:0,duration:.3,ease:'power3.out'},t+(i%2)*.04).to(panel,{xPercent:14,scale:1,duration:.5,ease:'none'},t+.15).to(panel,{opacity:0,xPercent:30,duration:.15},i<2?.57:i<3?.97:i<5?1.37:1.85);});
      timeline.to('.intro-stage',{scale:.85,rotation:-3,opacity:0,duration:.33,ease:'power3.in'},1.72).to(black,{opacity:1,duration:.15},2.05).fromTo(title,{opacity:0,y:6},{opacity:1,y:0,duration:.18,ease:'power2.out'},2.2).to(title,{opacity:1,duration:.62},2.38);
      watchdog=setTimeout(complete,3000);document.addEventListener('keydown',interaction,true);document.addEventListener('wheel',interaction,{passive:true});document.addEventListener('touchmove',interaction,{passive:true});document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',mediaChange);
    });
  }).catch(complete);
  return()=>{disposed=true;timeline?.kill();clearTimeout(readyTimeout);clearTimeout(watchdog);document.removeEventListener('keydown',interaction,true);document.removeEventListener('wheel',interaction);document.removeEventListener('touchmove',interaction);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',mediaChange);};
 },[]);
 return <div ref={root} className={`intro ${playing?'is-playing':''}`} aria-hidden={!playing} data-intro-state={playing?'playing':'bypassed'}><div className="intro-stage" aria-hidden="true">{files.map((x,i)=><div key={x} className={`intro-panel panel-${i}`}><img src={`/intro/${x}.webp`} alt="" width="560" height="400"/></div>)}</div><div className="intro-black"/><p className="intro-title">AL-Karrim Lanka</p>{playing&&<button className="intro-skip" onClick={()=>finishRef.current()}>Skip intro ↗</button>}</div>;
}
