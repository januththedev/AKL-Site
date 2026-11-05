import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { StoryHeading } from '@/components/StoryHeading';
import { ClientRelationships } from '@/components/ClientRelationships';
import { LiveCompanyDate } from '@/components/LiveCompanyDate';
import { companyProfile, profileClients, profileReach } from '@/lib/company-profile';
import { yearsOfExperience } from '@/lib/brand';
import { publicPageMetadata } from '@/lib/structuredData';
import { getSnapshot } from '@/lib/server/content';
import '@/components/client-story.css';

export const metadata: Metadata = publicPageMetadata({
  title: 'Our clients — Lasting connections',
  description: 'Explore the companies and relationships documented in AL Karrim Lanka’s company profile. Sri Lankan workforce capability, connected to international employers.',
  path: '/clients',
});

const support = [
  { title: 'Start with the work.', description: 'The roles, skills and scale of your requirement shape the recruitment approach. From a specialised technical position to a project team, the brief comes first.' },
  { title: 'Find the capability.', description: 'Sector-focused sourcing, candidate screening and skills verification help connect the requirement with relevant Sri Lankan talent. Trade-test coordination forms part of the service scope.' },
  { title: 'Connect the next steps.', description: 'Documentation, travel coordination and mobilisation bring the practical stages together, with arrangements confirmed for the actual engagement.' },
  { title: 'Keep the conversation going.', description: 'The company profile describes post-deployment follow-up as part of the relationship. The connection extends beyond a name on a shortlist.' },
];

export default async function ClientsPage() {
  const { content } = await getSnapshot();
  return <>
    <section className="clients-opening">
      <StoryHeading as="h1" heading="The companies behind our story."/>
      <div data-story-lines><p>Behind every company name is a relationship. Behind every relationship, people moving forward.</p><a className="text-link" href="#client-directory">Explore the directory <ArrowUpRight size={16}/></a></div>
    </section>
    <ClientRelationships advanceTo="client-story"/>
    <section className="section client-story" id="client-story">
      <div className="client-story-intro"><div><StoryHeading heading="Every requirement starts with the work ahead."/></div><div data-story-lines><p className="lead">Good recruitment begins with understanding what people will help you achieve.</p><p>A hotel opening. A construction programme. A specialist workshop. Different operations call for different skills, and a practical understanding of the work ahead.</p><p>Our company profile describes recruitment for both large project teams and specialised technical staff, shaped around an employer’s operational goals and regional requirements.</p></div></div>
      <div className="client-record" aria-label="Our company record"><div><strong><LiveCompanyDate kind="experience" initialValue={yearsOfExperience()}/></strong><span>Completed years of experience<br/>Established August 1980</span></div><div><strong>125,000+</strong><span>Deployments reported<br/>November 2025 company profile</span></div><div><strong>{content.industries.length}</strong><span>Industries. Different skills.<br/>One belief in people.</span></div></div>
    </section>
    <section className="section client-support">
      <div className="client-support-heading"><StoryHeading heading="A clear path from brief to mobilisation."/><p>Professional, skilled, semi-skilled and general workforce requirements. A connected process that brings the practical details together.</p><Link className="text-link" href="/services">See our services <ArrowUpRight size={16}/></Link></div>
      <ol className="client-support-steps">{support.map((step, index) => <li key={step.title}><span className="client-step-number">{String(index + 1).padStart(2, '0')}</span><div><h3 data-story-heading>{step.title}</h3><div data-story-lines><p>{step.description}</p></div></div></li>)}</ol>
    </section>
    <section className="client-perspective">
      <figure><img src="/media/port-team.webp" alt="Illustrative logistics professionals discussing the work ahead" width="1680" height="1120" loading="lazy"/><figcaption>Illustrative photograph</figcaption></figure>
      <div className="client-perspective-copy"><StoryHeading heading="Across sectors and beyond borders."/><div data-story-lines><p>Our story began with Gulf placements in 1980. The company profile records a reach that grew across regions, connecting different kinds of work with Sri Lankan capability.</p></div><ul className="client-reach" aria-label="Reach documented in the company profile">{profileReach.map(region => <li key={region}>{region}</li>)}</ul><Link className="text-link" href="/destinations">See our international reach <ArrowUpRight size={16}/></Link></div>
    </section>
    <section className="section client-sectors"><div className="client-sectors-heading"><div><StoryHeading heading="The sectors we recruit for."/></div><p>Explore the role families and recruitment perspective behind each of our sectors.</p></div><div className="client-sector-links">{content.industries.map(industry => <Link key={industry.slug} href={`/industries/${industry.slug}`}>{industry.title}<ArrowUpRight size={19}/></Link>)}</div></section>
    <section className="section client-directory" id="client-directory">
      <div className="client-directory-heading"><div><StoryHeading heading="The full record from our company profile."/></div><p><strong>{profileClients.length}</strong> names listed<br/><span>Company profile, November 2025</span></p></div>
      <details className="client-directory-list"><summary>Explore all {profileClients.length} company names <ChevronDown size={18}/></summary><ol className="client-name-list">{profileClients.map(client => <li key={client.id}>{client.name}</li>)}</ol></details>
      <p className="profile-source-note">A record from the November 2025 profile, rather than a statement of current contracts. Transcribed from pages 8–9, preserving the printed names. One exact duplicate is omitted; similar names are retained.</p>
      <a className="text-link" href={`${companyProfile.source.documentUrl}#page=8`} target="_blank" rel="noopener noreferrer">View the original client pages <ArrowUpRight size={16}/></a>
    </section>
    <section className="client-next"><StoryHeading heading="Let’s build what comes next."/><Link href="/employers#request-workforce" className="button button-primary">Send a workforce brief <ArrowUpRight size={18}/></Link></section>
  </>;
}
