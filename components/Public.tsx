import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { PageCopy } from '@/lib/types';

export function Action({href,children,secondary=false,external=false}:{href:string;children:React.ReactNode;secondary?:boolean;external?:boolean}) {
 const className=`button ${secondary?'button-outline':'button-primary'}`;
 return external?<a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17}/></a>:<Link href={href} className={className}>{children}<ArrowUpRight size={17}/></Link>;
}
export function SectionTitle({label,heading,accent,light=false}:{label:string;heading:string;accent?:string;light?:boolean}) {
 return <div className={`section-heading ${light?'light':''}`} data-reveal><span className="eyebrow"><span className="tiny-square"/>{label}</span><h2>{heading}{accent&&<><br/><em>{accent}</em></>}</h2></div>;
}
export function PageOpening({page,number='01'}:{page:PageCopy;number?:string}) {
 return <section className="page-opening"><div className="page-opening-copy"><span className="eyebrow"><span className="tiny-square"/>{page.eyebrow}</span><h1>{page.heading}<br/><em>{page.accent}</em></h1><p>{page.intro}</p><span className="page-index">AL KARRIM LANKA / CHAPTER {number}</span></div><figure className="page-opening-image"><img src={page.image} width="1200" height="1000" alt="Industry and destination illustration" fetchPriority="high"/><span className="image-corner">PEOPLE. POSSIBILITY. PROGRESS.</span></figure></section>;
}
export function EditorialLink({href,children}:{href:string;children:React.ReactNode}) {return <Link href={href} className="text-link">{children}<ArrowRight size={16}/></Link>;}
export function FaqList({items}:{items:{question:string;answer:string}[]}) {return <div className="faq-list">{items.map((x,i)=><details key={x.question}><summary><span>0{i+1}</span>{x.question}<span className="faq-plus">+</span></summary><p>{x.answer}</p></details>)}</div>;}
