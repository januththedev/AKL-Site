import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Industry } from '@/lib/types';
import './industry-experience.css';

export function IndustryDirectory({ industries }: { industries: Industry[] }) {
  return <section className="section industry-index" aria-label="All industries">
    <nav className="industry-index-nav" aria-label="Jump to an industry">{industries.map((industry, index) => <a key={industry.slug} href={`#sector-${industry.slug}`}><span>{String(index + 1).padStart(2, '0')}</span>{industry.title}</a>)}</nav>
    <div className="industry-index-grid">{industries.map((industry, index) => <article className="industry-index-card" id={`sector-${industry.slug}`} key={industry.slug}>
      <Link className="industry-index-photo" href={`/industries/${industry.slug}`} aria-label={`Explore ${industry.title.toLowerCase()}`}><img src={industry.image} alt={`${industry.title} — illustrative industry photograph`} width="1000" height="625" loading="lazy"/><span>{String(index + 1).padStart(2, '0')} / OUR EXPERTISE</span></Link>
      <div className="industry-index-copy"><h2 data-story-heading>{industry.title}</h2><div data-story-lines><p>{industry.description}</p></div><ul className="industry-role-list" aria-label={`${industry.title} role families`}>{industry.roles.map(role => <li key={role}>{role}</li>)}</ul><Link className="text-link" href={`/industries/${industry.slug}`}>Explore {industry.title.toLowerCase()}<ArrowUpRight size={16}/></Link></div>
    </article>)}</div>
    <p className="industry-index-note">These role families illustrate our recruitment scope. Discuss your sector, skills and team requirements with us to confirm the arrangements for your engagement.</p>
  </section>;
}
