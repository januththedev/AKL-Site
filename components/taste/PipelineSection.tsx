import { EditorialLink, SectionTitle } from '../Public';
import { PipelineBoard } from './PipelineBoard';

/** The recruitment pipeline board with its heading, on the site's sage ground. */
export function PipelineSection() {
  return (
    <section className="section tx-pbs">
      <div className="section-header-row">
        <SectionTitle animate heading="A requirement, stage by stage." />
        <EditorialLink href="/recruitment">See the full process</EditorialLink>
      </div>
      <PipelineBoard />
    </section>
  );
}
