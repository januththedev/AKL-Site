import { SectionTitle } from '../Public';
import { yearsOfExperience } from '@/lib/brand';
import { profileClients } from '@/lib/company-profile';
import { CounterRoll } from './CounterRoll';
import { LogoMarquee, type MarqueeLogo } from './LogoMarquee';
import logos from './marquee-logos.json';

/**
 * Four proof figures that roll once, with a slow row of client logos under them. The figures come from the
 * company profile (the same ones the About page shows), and every number is in the HTML as written.
 */
export function ExperienceNumbers({ industryCount }: { industryCount: number }) {
  const figures = [
    { value: String(yearsOfExperience()), label: 'Years of experience', note: 'Established in August 1980' },
    { value: '125,000+', label: 'Deployments reported', note: 'In our November 2025 company profile' },
    { value: String(profileClients.length), label: 'Client names listed', note: 'In the same company profile' },
    { value: String(industryCount), label: 'Industries we recruit for', note: 'Hospitality to logistics' },
  ];
  return (
    <section className="section ivory-section tx-xp">
      <div className="section-header-row">
        <SectionTitle animate heading="Experience in numbers." />
        <p className="side-note" data-reveal>Figures from our company profile. Talk to our team about your current requirement.</p>
      </div>
      <ul className="tx-figures">
        {figures.map((figure, index) => (
          <li key={figure.label}>
            <CounterRoll value={figure.value} delay={index * 90} />
            <span className="tx-fig-label">{figure.label}</span>
            <span className="tx-fig-note">{figure.note}</span>
          </li>
        ))}
      </ul>
      <LogoMarquee logos={logos as MarqueeLogo[]} label="Companies we have worked with" />
    </section>
  );
}
