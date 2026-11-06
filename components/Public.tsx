import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { PageCopy } from '@/lib/types';
import { StoryHeading } from './StoryHeading';
import { ResponsiveImage } from './ResponsiveImage';
import './markup.css';
import { brandify } from './Brand';

export function Action({href,children,secondary=false,external=false}:{href:string;children:React.ReactNode;secondary?:boolean;external?:boolean}) {
 const className=`button ${secondary?'button-outline':'button-primary'}`;
 return external?<a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17}/></a>:<Link href={href} className={className}>{children}<ArrowUpRight size={17}/></Link>;
}
/**
 * One serif statement per section. `accent` (if given) continues the same sentence; it is never a second styled line.
 * `kicker` is a sentence-case label, used only where it adds information the heading does not.
 * `label` is the retired eyebrow prop: still accepted so older callers compile, never rendered.
 */
export function SectionTitle({kicker,heading,accent,light=false,animate=false}:{kicker?:string;heading:string;accent?:string;light?:boolean;animate?:boolean;label?:string}) {
 return <div className={`section-heading ${light?'light':''}`} data-reveal>{kicker&&<span className="eyebrow">{kicker}</span>}{animate?<StoryHeading heading={heading} accent={accent}/>:<h2>{accent?`${heading} ${accent}`:heading}</h2>}</div>;
}
export function PageOpening({page,actions}:{page:PageCopy;number?:string;actions?:React.ReactNode}) {
 return <section className="page-opening"><div className="page-opening-copy">{page.eyebrow&&<span className="eyebrow">{page.eyebrow}</span>}<h1>{page.accent?`${page.heading} ${page.accent}`:page.heading}</h1><p>{brandify(page.intro)}</p>{actions&&<div className="page-opening-actions">{actions}</div>}</div><figure className="page-opening-image"><ResponsiveImage src={page.image} width={1200} height={1000} alt="Industry and destination illustration" sizes="(max-width: 1000px) 100vw, 75vw" priority/></figure></section>;
}
export function EditorialLink({href,children}:{href:string;children:React.ReactNode}) {return <Link href={href} className="text-link">{children}<ArrowRight size={16}/></Link>;}
export function FaqList({items}:{items:{question:string;answer:string}[]}) {return <div className="faq-list">{items.map(x=><details key={x.question}><summary><strong className="faq-question">{x.question}</strong><span className="faq-plus" aria-hidden="true">+</span></summary><p>{x.answer}</p></details>)}</div>;}
