import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { ClientLogoWall } from '@/components/ClientLogos';
import { companyProfile, profileClients } from '@/lib/company-profile';

export const metadata: Metadata = {
  title: 'Our clients — Lasting connections',
  description: 'Explore the companies and relationships documented in AL Karrim Lanka’s company profile. Sri Lankan workforce capability, connected to international employers.',
  alternates: { canonical: '/clients' },
};

export default function ClientsPage() {
  return <>
    <section className="clients-opening">
      <span className="eyebrow">THE COMPANIES IN OUR STORY</span>
      <h1>Built on trust.<br/><em>Remembered through people.</em></h1>
      <div><p>Behind every company name is a relationship.<br/>Behind every relationship, people moving forward.</p><a className="text-link" href="#client-directory">Explore the directory <ArrowUpRight size={16}/></a></div>
    </section>
    <section className="section clients-selected" aria-label="Selected client logos">
      <div className="clients-section-top"><span className="eyebrow">SELECTED RELATIONSHIPS</span><span>PART OF A MUCH BIGGER STORY</span></div>
      <ClientLogoWall />
      <p className="client-source-note">Selected names from our November 2025 company profile. Logos belong to their respective owners; this directory does not imply a current contract or endorsement.</p>
    </section>
    <section className="section client-directory" id="client-directory">
      <div className="client-directory-heading"><div><span className="eyebrow">THE COMPANY PROFILE / IN FULL</span><h2>Good company.<br/><em>A lasting record.</em></h2></div><p><strong>{profileClients.length}</strong> names listed<br/><span>Company profile · November 2025</span></p></div>
      <details className="client-directory-list"><summary>Explore all {profileClients.length} company names <ChevronDown size={18}/></summary><ol className="client-name-list">{profileClients.map((client, index) => <li key={client.id}><span>{String(index + 1).padStart(3, '0')}</span><span>{client.name}</span></li>)}</ol></details>
      <p className="profile-source-note">Transcribed from pages 8–9, preserving the names printed in the profile. One exact duplicate is omitted; similar printed names are retained.</p>
      <a className="text-link" href={`${companyProfile.source.documentUrl}#page=8`} target="_blank" rel="noopener noreferrer">View the original client pages <ArrowUpRight size={16}/></a>
    </section>
    <section className="client-next"><span className="eyebrow">THE NEXT RELATIONSHIP STARTS WITH A CONVERSATION</span><h2>Let’s build<br/><em>what comes next.</em></h2><Link href="/employers#request-workforce" className="button button-primary">Tell us about your team <ArrowUpRight size={18}/></Link></section>
  </>;
}
