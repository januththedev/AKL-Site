import extracted from '@/content/profile-extracted.json';
import clientLogos from '@/content/client-logos.json';
import type { Destination } from './types';

/** Source-reviewed company material; every record retains its PDF page reference. */
export const companyProfile = extracted;
export const profileClients = [...extracted.clients].sort((a, b) => a.name.localeCompare(b.name, 'en'));
export const profileReach = ['The Gulf & Middle East', 'South Asia', 'Europe', 'Malaysia', 'Australia'];

export const profileDestinations: Destination[] = [
  { slug: 'gulf-region', title: 'The Gulf', region: 'MIDDLE EAST', description: 'Where our international recruitment story began. From our early Gulf placements, we have built long-standing employer relationships across the region.', image: '/media/dubai-night.webp' },
  { slug: 'europe', title: 'Europe', region: 'EUROPEAN REACH', description: 'Our recruitment story extends into Europe, connecting Sri Lankan capability with international employers. Discuss your country, sector and workforce requirements with our team.', image: '/media/welding.webp' },
  { slug: 'south-asia', title: 'South Asia', region: 'REGIONAL CONNECTIONS', description: 'Our company history describes expansion across South Asia. A regional perspective, shaped around the people, skills and requirements of each engagement.', image: '/media/container-port.webp' },
  { slug: 'malaysia', title: 'Malaysia', region: 'SOUTHEAST ASIA', description: 'Malaysia is named in our company history as part of our international reach. We support conversations about specialist talent and wider workforce requirements.', image: '/media/logistics.webp' },
  { slug: 'australia', title: 'Australia', region: 'A WIDER HORIZON', description: 'Australia forms part of the international reach described in our company profile. The right team starts with a clear understanding of the work ahead.', image: '/media/port-team.webp' },
];

/** Add the documented reach without replacing a published destination's edited copy or image. */
export function withProfileReach(destinations: Destination[]) {
  const slugs = new Set(destinations.map(x => x.slug));
  return [...destinations, ...profileDestinations.filter(x => !slugs.has(x.slug))];
}

const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const indexedClients = profileClients.map(client => ({ client, normalised: normalise(client.name) }));
export function clientNameMatch(question: string) {
  const q = ` ${normalise(question)} `;
  const logoNames = clientLogos.filter(logo => [logo.id, logo.name].some(alias => q.includes(` ${normalise(alias)} `))).map(logo => normalise(logo.profileName));
  return indexedClients.filter(({normalised}) => q.includes(` ${normalised} `) || logoNames.includes(normalised)).slice(0, 3).map(x => x.client);
}
