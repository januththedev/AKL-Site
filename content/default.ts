import type { SiteContent } from '@/lib/types';

export const defaultContent: SiteContent = {
  home: { eyebrow: 'SRI LANKAN ROOTS. INTERNATIONAL REACH.', heading: 'The right people.', accent: 'A world of possibility.', intro: 'Connecting the skill and ambition of Sri Lanka with the companies moving the world forward. International recruitment, shaped by experience since 1980.', image: '/media/hero-team.webp' },
  employers: { eyebrow: 'YOUR NEXT TEAM STARTS HERE', heading: 'Great work begins', accent: 'with the right people.', intro: 'A recruitment partner for your next chapter. Discover our capabilities, explore the industries we serve, and tell us what your business needs.', image: '/media/port-team.webp' },
  about: { eyebrow: 'OUR STORY / SINCE 1980', heading: 'Rooted in Sri Lanka.', accent: 'Looking to the world.', intro: 'For more than four decades, Al Karrim Lanka has connected Sri Lankan capability with international opportunity. Our story begins in August 1980, with a belief in the people who make progress possible.', image: '/media/colombo-dusk.webp' },
  settings: { brand: 'Al Karrim Lanka', phone: '+94 112 592551', email: 'alkarrim@slt.lk', address: 'No 10/1, Duplication Road, Colombo 05, Sri Lanka', careersUrl: 'https://alk.intellixhr.com/careers', facebookUrl: 'https://www.facebook.com/alkarrimlanka603/', profileUrl: '/documents/company-profile-nov2025.pdf' },
  story: { heading: 'A small island.\nAn extraordinary workforce.', body: 'Founded in August 1980, Al Karrim Lanka began with a simple belief: Sri Lankan skill deserves a global stage. From these roots, our recruitment story has reached the Gulf, Europe, Asia and Australia.', closing: 'From a first conversation to a new beginning, we bring people and opportunity closer.' },
  industries: [
    { slug: 'hospitality', title: 'Hospitality', description: 'The people behind a remarkable welcome. Recruitment for the kitchens, service teams and operations that bring hospitality to life.', image: '/media/hospitality.webp', roles: ['Culinary teams', 'Guest services', 'Hospitality operations'] },
    { slug: 'construction', title: 'Construction', description: 'Building the teams behind tomorrow’s places. Workforce sourcing and screening coordination for construction requirements.', image: '/media/construction-facade.webp', roles: ['Skilled trades', 'Site teams', 'Project support'] },
    { slug: 'engineering', title: 'Engineering', description: 'Technical capability with practical purpose. Tell us about the expertise your project needs.', image: '/media/welding.webp', roles: ['Technical specialists', 'Maintenance teams', 'Engineering support'] },
    { slug: 'automotive', title: 'Automotive', description: 'Keeping essential work moving, with sector-focused recruitment and trade-test coordination.', image: '/media/automotive.webp', roles: ['Workshop teams', 'Technical trades', 'Service operations'] },
    { slug: 'it', title: 'Information technology', description: 'People who help businesses adapt and grow. Discuss your professional and technical recruitment requirements.', image: '/media/employer-meeting.webp', roles: ['Technical professionals', 'Business support', 'Specialist roles'] },
    { slug: 'manufacturing', title: 'Manufacturing', description: 'The skill behind every process. Workforce solutions for production, fabrication and industrial operations.', image: '/media/welding.webp', roles: ['Production teams', 'Fabrication trades', 'Industrial support'] },
    { slug: 'logistics', title: 'Logistics', description: 'Connecting the people behind the supply chain, from warehouse operations to global movement.', image: '/media/port-team.webp', roles: ['Warehouse teams', 'Transport operations', 'Supply-chain support'] },
  ],
  destinations: [
    { slug: 'united-arab-emirates', title: 'United Arab Emirates', region: 'THE GULF', description: 'A meeting point of industries, people and ambition. Explore recruitment requirements with our team.', image: '/media/dubai-night.webp' },
    { slug: 'oman', title: 'Oman', region: 'THE GULF', description: 'A new perspective on opportunity. Contact our team about the scope of your recruitment requirements.', image: '/media/muscat.webp' },
    { slug: 'sri-lanka', title: 'Sri Lanka', region: 'OUR HOME', description: 'Our roots, our people, our point of connection with the world.', image: '/media/colombo-dusk.webp' },
  ],
};

export const services = [
  { number: '01', title: 'Overseas recruitment', description: 'Connecting Sri Lankan professionals and workforce teams with international employers, across professional, skilled and semi-skilled workforce categories.' },
  { number: '02', title: 'Industry-specific talent', description: 'A sector-focused approach to understanding your requirements and coordinating relevant candidate sourcing.' },
  { number: '03', title: 'Screening & trade testing', description: 'Candidate screening, skill verification and trade-test coordination, tailored to the actual role and engagement.' },
  { number: '04', title: 'Documentation & mobilisation', description: 'Coordination of recruitment documentation and visa-processing assistance. Specific requirements and outcomes need case-by-case confirmation.' },
];
export const journey = [
  { title: 'A conversation.', label: 'Inquiry', description: 'We start with the people you need, the work ahead, and the requirements that matter to your business.' },
  { title: 'The right match.', label: 'Selection', description: 'Sourcing, screening and trade-test coordination help bring the right candidates into the conversation.' },
  { title: 'Every detail.', label: 'Processing', description: 'Documentation and recruitment coordination keep the next steps clear, with requirements confirmed for each case.' },
  { title: 'A new beginning.', label: 'Deployment', description: 'Mobilisation connects the process with its purpose: people ready for the next chapter of their working lives.' },
];
