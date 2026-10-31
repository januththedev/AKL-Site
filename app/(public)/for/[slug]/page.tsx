import '@/components/PortfolioFor.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { ArrowUpRight, Check, Download } from 'lucide-react';
import { getSnapshot } from '@/lib/server/content';
import { databaseConfigured } from '@/lib/server/db';
import { lookupPortfolioLink, recordPortfolioView } from '@/lib/server/portfolio';
import { orderIndustries, shouldCountView } from '@/lib/portfolioValidation';
import { journey, services } from '@/content/default';
import type { SiteContent } from '@/lib/types';
import { Action, PageOpening, SectionTitle } from '@/components/Public';
import { SharePortfolio } from '@/components/SharePortfolio';
import { PortfolioForForm } from '@/components/PortfolioForForm';

type Props = { params: Promise<{ slug: string }> };
// Private by design: never indexed, no canonical, and no caching of the personalised response.
const privateRobots: Metadata['robots'] = { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await lookupPortfolioLink((await params).slug);
  if (found.kind !== 'ok') return { title: 'Portfolio link', robots: privateRobots };
  const title = `Prepared for ${found.link.company_name}`;
  return { title, description: 'A company portfolio prepared by Al Karrim Lanka, international recruitment since 1980.', robots: privateRobots, openGraph: { title, description: 'Al Karrim Lanka, international recruitment since 1980.', images: ['/media/port-team.webp'] } };
}

function Unavailable({ settings, expired }: { settings: SiteContent['settings']; expired: boolean }) {
  return <section className="setup-page"><div className="setup-card"><span className="eyebrow">{expired ? 'THIS LINK IS NO LONGER ACTIVE' : 'TEMPORARILY UNAVAILABLE'}</span>{expired ? <h1>This link<br/>has expired.</h1> : <h1>We can’t open<br/>this page right now.</h1>}<p>{expired ? 'Please contact us and our team will be glad to help, or send you a current link.' : 'Please try again in a few minutes, or contact our team directly.'}</p><div className="pf-contact-line"><a href={`mailto:${settings.email}`}>{settings.email}<ArrowUpRight size={14}/></a><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}<ArrowUpRight size={14}/></a></div><Link className="button button-primary" href="/employers">Visit our employer page<ArrowUpRight size={17}/></Link></div></section>;
}

export default async function PortfolioFor({ params }: Props) {
  const { slug } = await params;
  const found = await lookupPortfolioLink(slug);
  if (found.kind === 'not_found') notFound();
  const { content: c } = await getSnapshot();
  if (found.kind === 'gone') return <Unavailable settings={c.settings} expired />;
  if (found.kind === 'unavailable') return <Unavailable settings={c.settings} expired={false} />;

  const { link } = found;
  // Count real browser navigations only (not prefetches, link-preview bots or HTTP tools); recorded after the response is sent.
  if (shouldCountView(await headers())) after(() => recordPortfolioView(link.id).catch(() => undefined));

  const industries = orderIndustries(c.industries, link.sectors);
  const featured = industries.filter((x) => x.selected), others = industries.filter((x) => !x.selected);
  const defaults = { company: link.company_name, country: link.country, industry: featured[0]?.title ?? '', roles: link.roles.join(', ').slice(0, 500), name: link.contact_name };
  const card = (x: (typeof industries)[number]) => <Link href={`/industries/${x.slug}`} className={`pf-industry${x.selected ? ' is-selected' : ''}`} key={x.slug}><img src={x.image} alt={`${x.title} illustration`} width="900" height="675" loading="lazy"/><div>{x.selected && <span className="pf-badge">SELECTED FOR YOU</span>}<h3>{x.title}<ArrowUpRight size={18}/></h3><p>{x.description}</p><ul>{x.roles.map((role) => <li key={role}>{role}</li>)}</ul></div></Link>;
  const page = { eyebrow: `A PORTFOLIO PREPARED FOR YOU${link.country ? ` / ${link.country.toUpperCase()}` : ''}`, heading: 'Prepared for', accent: link.company_name, intro: c.employers.intro, image: c.employers.image };

  return <>
    <div className="pf-opening"><PageOpening page={page} number="02"/></div>
    <div className="portfolio-intro-bar"><span>SRI LANKAN CAPABILITY. INTERNATIONAL POSSIBILITY.</span><SharePortfolio/></div>
    {(link.contact_name || link.intro_message) && <section className="pf-note"><div className="pf-note-card">{link.contact_name && <span className="eyebrow">FOR THE ATTENTION OF {link.contact_name.toUpperCase()}</span>}{link.intro_message && <p>{link.intro_message}</p>}</div></section>}

    <section className="section"><div className="section-header-row"><SectionTitle label={featured.length ? 'RELEVANT TO YOUR BUSINESS' : 'INDUSTRY PERSPECTIVE'} heading={featured.length ? 'The sectors' : 'Expertise across'} accent={featured.length ? 'we have highlighted for you.' : 'the work that matters.'}/><Link className="text-link" href="/industries">Explore every sector<ArrowUpRight size={16}/></Link></div>
      {featured.length > 0 && <><div className="pf-group-title">SELECTED FOR {link.company_name.toUpperCase()}</div><div className="pf-industries is-featured">{featured.map(card)}</div></>}
      {others.length > 0 && <>{featured.length > 0 && <div className="pf-group-title">MORE SECTORS WE SERVE</div>}<div className="pf-industries">{others.map(card)}</div></>}
      <p className="section-note">Specific roles, numbers and availability are confirmed through a direct conversation.</p>
    </section>

    {link.roles.length > 0 && <section className="section ivory-section"><SectionTitle label="ROLES OF INTEREST" heading="The people" accent="you have in mind."/><ul className="pf-chips">{link.roles.map((role) => <li key={role}>{role}</li>)}</ul><p className="section-note">We have noted these roles for your conversation with our team. This is not a statement of available candidates.</p></section>}

    <section className="section"><SectionTitle label="YOUR RECRUITMENT PARTNER" heading="Capability that connects." accent="People who make a difference."/><div className="capability-grid"><div className="capability-number"><span>Since</span><strong>1980</strong><p>Our story began in Sri Lanka.<br/>Our perspective is international.</p></div><div className="capability-copy"><p className="lead">Your workforce requirement deserves more than a list of candidates. It deserves an understanding of the work ahead.</p><p>Our company profile describes recruitment across professional, skilled, semi-skilled and other workforce categories, with sector-focused sourcing, screening and documentation coordination.</p><div className="capability-tags">{['Professional', 'Skilled', 'Semi-skilled', 'Project teams'].map((x) => <span key={x}><Check size={14}/>{x}</span>)}</div><Action href="#request-workforce">Tell us what you need</Action></div></div></section>

    <section className="section ivory-section"><SectionTitle label="OUR CAPABILITIES" heading="One connected approach." accent="From brief to beginning."/><div className="service-rows">{services.map((x) => <div className="service-row" key={x.number} data-reveal><span>{x.number}</span><h3>{x.title}</h3><p>{x.description}</p><ArrowUpRight size={24}/></div>)}</div></section>

    <section className="section dark-section"><SectionTitle light label="A CLEARER WAY FORWARD" heading="Four steps." accent="One shared direction."/><div className="process-grid">{journey.map((x, i) => <div key={x.label} data-reveal><span className="process-number">0{i + 1}</span><span className="eyebrow">{x.label}</span><h3>{x.title}</h3><p>{x.description}</p></div>)}</div></section>

    {link.show_clients && <section className="section"><div className="pf-clients"><SectionTitle label="CLIENT RELATIONSHIPS" heading="Employers we have" accent="worked with."/><div><p>Our company profile includes a directory of client relationships. Please open the profile to see it, and ask our team about experience in your sector or country.</p><p className="small-note">Client names in the profile are historical and company-reported. They do not indicate current availability or a particular outcome.</p><a className="button button-dark" href={c.settings.profileUrl} target="_blank" rel="noopener noreferrer">View company profile <Download size={17}/></a></div></div></section>}

    <section className="profile-section"><div><span className="eyebrow">TAKE THE CONVERSATION FURTHER</span><h2>Our company.<br/><em>At a glance.</em></h2><p>Explore our November 2025 company profile: our history, capabilities, leadership message and client directory.</p><p className="small-note">Company profile / November 2025 edition. Talk to our team about your current recruitment requirements.</p><a className="button button-dark" href={c.settings.profileUrl} target="_blank" rel="noopener noreferrer">View company profile <Download size={17}/></a></div><div className="profile-cover"><img src="/brand/AKL-Official-Logo-512.png" alt="AKL" width="110" height="110"/><span>AL-KARRIM LANKA</span><h3>People.<br/>Possibility.<br/><em>Progress.</em></h3><span>COMPANY PROFILE / NOVEMBER 2025<ArrowUpRight size={20}/></span></div></section>

    <section id="request-workforce" className="section inquiry-section"><div className="inquiry-intro"><span className="eyebrow">LET’S BUILD WHAT COMES NEXT</span><h2>Your requirement.<br/><em>Our next conversation.</em></h2><p>Tell us about the roles, the skills and the team you have in mind. We’ll have the information needed to start a useful discussion.</p><div className="direct-contact"><span>PREFER A DIRECT CONVERSATION?</span><a href={`mailto:${c.settings.email}`}>{c.settings.email}<ArrowUpRight size={16}/></a><a href={`tel:${c.settings.phone.replace(/\s/g, '')}`}>{c.settings.phone}<ArrowUpRight size={16}/></a></div></div><PortfolioForForm sectors={c.industries.map((x) => x.title)} online={databaseConfigured()} slug={slug} defaults={defaults} email={c.settings.email} phone={c.settings.phone}/></section>
  </>;
}
