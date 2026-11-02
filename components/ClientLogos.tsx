import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import logos from '@/content/client-catalog.json';
import { ClientRelationships } from './ClientRelationships';

export function ClientLogoWall({ compact = false }: { compact?: boolean }) {
  return <div className={`client-logo-wall${compact ? ' is-compact' : ''}`}>
    {logos.slice(0, compact ? 8 : 12).map(logo => <figure className="client-logo-tile" data-surface={logo.surface} key={logo.id}>
      <div><img src={logo.src} alt={logo.name} width={logo.width} height={logo.height} loading="lazy" decoding="async" /></div>
      {!compact && <figcaption>{logo.name}</figcaption>}
    </figure>)}
  </div>;
}

export function ClientSignature() {
  return <section className="client-signature" aria-labelledby="client-signature-title">
    <div className="client-signature-heading">
      <div><span className="eyebrow">RELATIONSHIPS THAT SHAPE OUR STORY</span><h2 id="client-signature-title" data-story-heading>Good companies.<br/><em>Lasting connections.</em></h2></div>
      <Link className="text-link" href="/clients">Meet our clients <ArrowUpRight size={16}/></Link>
    </div>
    <ClientRelationships variant="teaser"/>
  </section>;
}
