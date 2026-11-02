import { LiveCompanyDate } from '@/components/LiveCompanyDate';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { companyProfile as profile, profileClients, profileReach } from '@/lib/company-profile';
import { companyYear, yearsOfExperience } from '@/lib/brand';
import { SectionTitle } from './Public';

export function ProfileMilestones() {
  return <><div className="history-horizon" aria-label="Our story continues from August 1980 to the present year"><span>AUGUST 1980</span><span className="history-horizon-line" aria-hidden="true"/><span><LiveCompanyDate kind="year" initialValue={companyYear()}/></span></div><section className="profile-milestones" aria-label="Our company in perspective">
    <div><strong><LiveCompanyDate kind="experience" initialValue={yearsOfExperience()}/><span> years</span></strong><span>Since August 1980</span></div>
    <div><strong>125,000<span>+</span></strong><span>Deployments reported in our 2025 profile</span></div>
    <div><strong>{profileClients.length}</strong><span>Client names listed in our profile</span></div>
    <div><strong>{profile.industries.names.length}</strong><span>Industries. One connected approach.</span></div>
  </section></>;
}

export function ProfileApproach() {
  const reasons = [
    { title: 'Experience with perspective.', text: 'Our recruitment story began in August 1980. The company profile records more than 125,000 overseas deployments over that history.' },
    { title: 'A recognised history.', text: 'Our profile records SLBFE Labour Licence No. 603 and recognition including the Excellence Award and Most Outstanding Recruitment Agency title.' },
    { title: 'Expertise for the work ahead.', text: 'Hospitality, construction, engineering, automotive, IT, manufacturing and logistics. Sector knowledge helps us understand the skills your operation needs.' },
    { title: 'Built around your requirement.', text: 'From a specialist role to a large project team: sourcing, screening, documentation, travel coordination and post-deployment follow-up form one connected service.' },
  ];
  return <section className="section profile-approach">
    <SectionTitle animate label="WHY AL KARRIM LANKA" heading="The right experience." accent="A personal approach." />
    <div className="profile-reasons">{reasons.map((reason, i) => <article key={reason.title} data-reveal><span className="eyebrow">0{i + 1}</span><h3>{reason.title}</h3><p>{reason.text}</p></article>)}</div>
    <p className="profile-source-note">History and recognition from the November 2025 company profile. Contact us for current licence details and engagement requirements.</p>
  </section>;
}

export function ProfileReach() {
  return <section className="section dark-section profile-reach">
    <div><span className="eyebrow">SRI LANKAN ROOTS. A WIDER REACH.</span><h2>One starting point.<br/><em>Many horizons.</em></h2><p>Our early focus on the Gulf grew into connections across South Asia, Europe, Malaysia and Australia.</p><Link href="/destinations" className="text-link">Explore our reach <ArrowUpRight size={16}/></Link></div>
    <ol>{profileReach.map((region, i) => <li key={region}><span>0{i + 1}</span>{region}<ArrowUpRight size={18}/></li>)}</ol>
  </section>;
}

export function ChairmanMessage() {
  return <section id="chairman-message" className="section chairman-message">
    <div className="chairman-heading"><span className="eyebrow">FROM THE CHAIRMAN’S MESSAGE</span><h2>Integrity meets<br/><em>impact.</em></h2><div className="chairman-signature"><strong>{profile.chairman.name}</strong><span>{profile.chairman.title} · Company profile, November 2025</span></div></div>
    <div className="chairman-copy">{profile.chairman.messageParagraphs.map(text => <p key={text.slice(0, 45)}>{text}</p>)}<a className="text-link" href={`${profile.source.documentUrl}#page=10`} target="_blank" rel="noopener noreferrer">Read the original message <ArrowUpRight size={16}/></a></div>
  </section>;
}
