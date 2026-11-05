import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Industry } from '@/lib/types';
import './industry-experience.css';
import { StoryHeading } from './StoryHeading';
import { ResponsiveImage } from './ResponsiveImage';

export function IndustryDirectory({ industries }: { industries: Industry[] }) {
  return <section className="section industry-index" aria-label="All industries">
    <nav className="industry-index-nav" aria-label="Jump to an industry">{industries.map(industry => <a key={industry.slug} href={`#sector-${industry.slug}`}>{industry.title}</a>)}</nav>
    <div className="industry-index-grid">{industries.map(industry => <article className="industry-index-card" id={`sector-${industry.slug}`} key={industry.slug}>
      <Link className="industry-index-photo" href={`/industries/${industry.slug}`} aria-label={`Explore ${industry.title.toLowerCase()}`}><ResponsiveImage src={industry.image} alt={`${industry.title} — illustrative industry photograph`} width={1000} height={625} sizes="(max-width: 700px) 100vw, 46vw"/></Link>
      <div className="industry-index-copy"><StoryHeading heading={industry.title}/><div data-story-lines><p>{industry.description}</p></div><ul className="industry-role-list" aria-label={`${industry.title} role families`}>{industry.roles.map(role => <li key={role}>{role}</li>)}</ul><Link className="text-link" href={`/industries/${industry.slug}`}>Explore {industry.title.toLowerCase()}<ArrowUpRight size={16}/></Link></div>
    </article>)}</div>
    <p className="industry-index-note">These role families illustrate our recruitment scope. Discuss your sector, skills and team requirements with us to confirm the arrangements for your engagement.</p>
  </section>;
}
