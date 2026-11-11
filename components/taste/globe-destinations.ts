import type { Destination } from '../../lib/types';

/**
 * The places the globe shows, in tour order, set by Januth (2026-11-11). Sri Lanka is the start: Colombo, where
 * every route begins. Photographs are illustrative and none claims to show the country named.
 */
export const GLOBE_DESTINATIONS: Destination[] = [
  { slug: 'sri-lanka', title: 'Sri Lanka', region: 'Our home', description: 'Our roots, our people, our point of connection with the world.', image: '/media/colombo-dusk.webp' },
  { slug: 'saudi-arabia', title: 'Saudi Arabia', region: 'The Gulf', description: 'Sri Lankan professionals and workforce teams for employers in Saudi Arabia. Tell our team the roles, numbers and timing you need.', image: '/media/construction-facade.webp' },
  { slug: 'kuwait', title: 'Kuwait', region: 'The Gulf', description: 'Skilled, semi-skilled and general workforce for employers in Kuwait, sourced and screened for the role.', image: '/media/welding.webp' },
  { slug: 'oman', title: 'Oman', region: 'The Gulf', description: 'A new perspective on opportunity. Contact our team about the scope of your recruitment requirements.', image: '/media/muscat.webp' },
  { slug: 'bahrain', title: 'Bahrain', region: 'The Gulf', description: 'Workforce recruitment for employers in Bahrain, from the first conversation to mobilisation.', image: '/media/hospitality.webp' },
  { slug: 'qatar', title: 'Qatar', region: 'The Gulf', description: 'Teams for employers in Doha and across Qatar. Share your requirement and our team will take it from there.', image: '/media/container-port.webp' },
  { slug: 'malaysia', title: 'Malaysia', region: 'Southeast Asia', description: 'Specialist talent and wider workforce requirements for employers in Malaysia.', image: '/media/logistics.webp' },
  { slug: 'papua-new-guinea', title: 'Papua New Guinea', region: 'The Pacific', description: 'Sri Lankan capability for employers in Papua New Guinea. Tell us about the work ahead.', image: '/media/airport.webp' },
  { slug: 'australia', title: 'Australia', region: 'A wider horizon', description: 'The right team starts with a clear understanding of the work ahead. Discuss your requirement with our team.', image: '/media/port-team.webp' },
];
