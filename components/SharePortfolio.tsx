'use client';
import { useState } from 'react';
import { Share2, Printer } from 'lucide-react';
export function SharePortfolio(){const [copied,setCopied]=useState(false);async function share(){const url=new URL('/employers',location.origin).href;try{if(navigator.share)await navigator.share({title:'Al Karrim Lanka — Recruitment capabilities',url});else{await navigator.clipboard.writeText(url);setCopied(true);}}catch{setCopied(false);}}return <div className="portfolio-tools"><button onClick={share}><Share2 size={15}/>{copied?'Link copied':'Share portfolio'}</button><button onClick={()=>window.print()}><Printer size={15}/>Print overview</button></div>;}
