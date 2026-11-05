import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ClientRelationships } from './ClientRelationships';
import { StoryHeading } from './StoryHeading';

export function ClientSignature({ advanceTo }: { advanceTo?: string }) {
  return <section className="client-signature" aria-labelledby="client-signature-title">
    <div className="client-signature-heading">
      <StoryHeading id="client-signature-title" heading="Lasting relationships with good companies."/>
      <Link className="text-link" href="/clients">See our clients <ArrowUpRight size={16}/></Link>
    </div>
    <ClientRelationships variant="teaser" advanceTo={advanceTo}/>
  </section>;
}
