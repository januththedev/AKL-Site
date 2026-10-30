/**
 * Site-wide constants — contact details, socials and navigation.
 * Original values: www.al-karrim.net (CONTENT-AUDIT.md).
 * Facebook/WhatsApp: official Facebook page reviewed October 2026 (docs/WEBSITE-IMPROVEMENT-PLAN.md).
 */

export const SITE = {
  name: 'Al Karrim Lanka',
  legalName: 'Al Karrim Lanka Consultant (Pvt) Ltd.',
  tagline: 'Right talent, Right time.',
  motto: 'Shaping careers, building nations',
  established: 'August 1980',
  originUrl: 'https://www.al-karrim.net',
} as const;

export const CONTACT = {
  addressLines: ['No 10/1, Duplication Rd', 'Colombo 05, Sri Lanka'],
  addressFull: 'No 10/1, Duplication Rd, Colombo 05, Sri Lanka',
  city: 'Colombo, Sri Lanka',
  phoneDisplay: '+94 112 592551 / 2501675',
  /** Original site used a malformed tel: URI with a slash — normalized here. */
  telPrimary: '+94112592551',
  email: 'alkarrim@slt.lk',
  whatsappDisplay: '+94 77 777 6456',
  whatsappHref: 'https://wa.me/94777776456',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Al+Karrim+Lanka+10%2F1+Duplication+Road+Bambalapitiya+Sri+Lanka',
  copyright: `© ${new Date().getFullYear()} Al Karrim Lanka Consultant (Pvt) Ltd.`,
} as const;

/** Official Facebook profile confirmed from the user-supplied company page. */
export const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/alkarrimlanka603/',
  },
] as const;

/** External recruitment portal (IntellixHR). Destination preserved from the audited site. */
export const VACANCIES_PORTAL = {
  label: 'Vacancies portal',
  statusHref: 'https://alk.intellixhr.com/application/status?lang=en',
  href: 'https://alk.intellixhr.com/careers',
  note: 'Live listings are hosted on the external IntellixHR recruitment portal.',
} as const;

export type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  {
    label: 'Recruitment',
    to: '/recruitment',
    children: [
      { label: 'Saudi Arabia', to: '/recruitment/saudi-arabia' },
      { label: 'United Arab Emirates', to: '/recruitment/united-arab-emirates' },
      { label: 'Kuwait', to: '/recruitment/kuwait' },
    ],
  },
  { label: 'Countries', to: '/countries' },
  { label: 'Vacancies', to: '/vacancies' },
  { label: 'Contact', to: '/contact' },
];

/** Legacy WordPress paths → new routes (deep-link preservation). */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/about-us': '/about',
  '/our-services': '/services',
  '/our-process-saudi-arabia': '/recruitment/saudi-arabia',
  '/our-process-uae': '/recruitment/united-arab-emirates',
  '/our-process-kuwait': '/recruitment/kuwait',
  '/contact-us': '/contact',
};
