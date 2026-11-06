import { SectionTitle } from '../Public';
import type { Destination } from '../../lib/types';
import { GlobeExplorer } from './GlobeExplorer';

/** The dotted globe tied to the destinations content (for the Destinations page). */
export function GlobeSection({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="section dark-section">
      <GlobeExplorer
        destinations={destinations}
        intro={(
          <>
            <SectionTitle light animate heading="Routes from Colombo." />
            <p>Our company profile describes reach across the Gulf, Europe, Asia and Australia. Choose a destination to turn the globe to it. The routes are illustrative, not current vacancies.</p>
          </>
        )}
      />
    </section>
  );
}
