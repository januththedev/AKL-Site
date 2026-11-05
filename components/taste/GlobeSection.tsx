import { SectionTitle } from '../Public';
import { profileReach } from '@/lib/company-profile';
import { DottedGlobe } from './DottedGlobe';

/** The dotted globe beside the regions named in the company profile (for the Destinations page). */
export function GlobeSection() {
  return (
    <section className="section dark-section">
      <div className="tx-gs">
        <div className="tx-gs-copy">
          <SectionTitle light animate heading="Routes from Colombo." />
          <p>Our company profile describes reach across these regions. The routes on the globe are illustrative, not current vacancies.</p>
          <ul className="tx-gs-list">{profileReach.map(region => <li key={region}>{region}</li>)}</ul>
        </div>
        <DottedGlobe />
      </div>
    </section>
  );
}
