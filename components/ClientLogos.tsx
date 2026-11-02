import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ClientRelationships } from './ClientRelationships';

export function ClientSignature() {
  return <section className="client-signature" aria-labelledby="client-signature-title">
    <div className="client-signature-heading">
      <div><span className="eyebrow">RELATIONSHIPS THAT SHAPE OUR STORY</span><h2 id="client-signature-title" data-story-heading>Good companies.<br/><em>Lasting connections.</em></h2></div>
      <Link className="text-link" href="/clients">Meet our clients <ArrowUpRight size={16}/></Link>
    </div>
    <ClientRelationships variant="teaser"/>
  </section>;
}
