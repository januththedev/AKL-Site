/**
 * Company facts, statistics and homepage copy.
 * Every factual claim below is preserved verbatim from www.al-karrim.net
 * (see CONTENT-AUDIT.md for source mapping).
 */

export const HERO = {
  headline: ['Right talent,', 'Right time.'],
  /** Rotating supporting statements — all verbatim from the audited homepage. */
  blurbs: [
    'AL KARRIM LANKA is a leading consultancy firm that offers end-to-end international manpower recruitment services.',
    'Decades of expertise in international manpower recruitment across multiple industries.',
    'We manage documentation, visa processing, and travel arrangements efficiently.',
    'Our commitment to excellence is backed by ISO 9001:2008 certification.',
    'We are the preferred recruitment partner for leading companies worldwide.',
    'From sourcing and screening to deployment, we handle the entire process seamlessly.',
    'We connect skilled workers with top employers in the Middle East, Europe, and beyond.',
  ],
} as const;

/** Marquee phrases — derived from verified company positioning. */
export const TICKER_ITEMS = [
  'Global Recruitment',
  'Skilled Workforce',
  'Overseas Employment',
  'End-to-End Recruitment',
  'Sri Lankan Talent',
  'International Workforce Solutions',
  'Employer Solutions',
] as const;

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Render the raw number (e.g. founding year) instead of a counted-up figure. */
  isYear?: boolean;
  label: string;
  detail: string;
};

export const STATS: Stat[] = [
  {
    value: 40,
    suffix: '+',
    label: 'Years of recruitment',
    detail: 'Established August 1980',
  },
  {
    value: 125000,
    suffix: '+',
    label: 'Placements delivered',
    detail: 'Over 125,000 promises delivered',
  },
  {
    value: 4,
    label: 'Global markets',
    detail: 'Middle East, Europe, Malaysia & Australia',
  },
  {
    value: 1980,
    isYear: true,
    label: 'Founded',
    detail: 'Government approved consultancy',
  },
];

export type Reason = {
  title: string;
  description: string;
  icon: 'clock' | 'shield' | 'badge' | 'users' | 'route' | 'globe';
};

/** "Why Choose Al Karrim Lanka" — six items, verbatim from the audited homepage. */
export const WHY_CHOOSE: Reason[] = [
  {
    icon: 'clock',
    title: '40 Years Of Experience',
    description:
      'Decades of expertise in international manpower recruitment across multiple industries.',
  },
  {
    icon: 'route',
    title: 'Hassle-Free Process',
    description: 'We manage documentation, visa processing, and travel arrangements efficiently.',
  },
  {
    icon: 'badge',
    title: 'ISO 9001:2008 Certified',
    description: 'Our commitment to excellence is backed by ISO 9001:2008 certification.',
  },
  {
    icon: 'users',
    title: '125,000 Placements!',
    description: 'We are the preferred recruitment partner for leading companies worldwide.',
  },
  {
    icon: 'shield',
    title: 'End-to-End Recruitment',
    description:
      'From sourcing and screening to deployment, we handle the entire process seamlessly.',
  },
  {
    icon: 'globe',
    title: 'Global Reach',
    description:
      'We connect skilled workers with top employers in the Middle East, Europe, and beyond.',
  },
];

/** Government-approved narrative block — verbatim from the audited homepage. */
export const STORY = {
  eyebrow: 'Who we are',
  heading: 'Government approved Manpower Consultancy Company',
  paragraphs: [
    'Al Karrim Lanka Consultant (Pvt) Ltd. is well established Sri Lankan Government approved Manpower Consultancy Company that has gained reputation in the market in the placement of Sri Lankan skilled and nonskilled workers overseas.',
    "Established in August 1980, its founders believe in the resources, competencies and skills of the Sri Lankan workforce to the acceptance of the international market.",
  ],
};

export const ROLE_RANGE = {
  heading: 'From Engineer to Labourers, office-based to factory floor workers.',
  paragraph:
    'Be it individual placements or high volume. Whatever the industry, role or level, Al-Karrim Lanka will find you the best people for the job.',
} as const;

export const VALUES = {
  heading: 'Recruit and Retain passionate and engaged people',
  paragraph:
    'With ethical business practices and a cooperative spirit we aim to impact our team and community by making a positive difference to other peoples’ lives and the environment.',
} as const;

export const ABOUT = {
  intro:
    'Al Karrim Lanka Consultant (Pvt) Ltd. is well established Sri Lankan Government approved Manpower Consultancy Company that has gained reputation in the market in the placement of Sri Lankan skilled and non-skilled workers overseas.',
  who: [
    'Al Karrim Lanka Consultant (Pvt) Ltd. is a government-approved recruitment agency in Sri Lanka with over 40 years of experience. Since 1980, we’ve built a solid reputation by connecting skilled and unskilled Sri Lankan talent to international markets including the Middle East, Europe, Malaysia, and Australia.',
    'We specialize in sourcing reliable candidates across sectors like hospitality, engineering, transport, and manufacturing. Our goal is simple: to deliver workforce solutions that meet client needs while empowering Sri Lankan professionals to thrive overseas.',
  ],
  history: [
    'Founded in August 1980, Al Karrim Lanka began with a mission to unlock global opportunities for the Sri Lankan workforce. Believing in the skills and dedication of local talent, we quickly became a trusted name in international recruitment.',
    'Over the decades, we expanded from Sri Lanka to South Asia, the Gulf, Europe, and Australia—building lasting partnerships and placing thousands of professionals in meaningful careers abroad.',
  ],
  tagline: 'Shaping careers, building nations',
  vision: {
    lead:
      'To become the world’s most trusted and impactful manpower consultancy, known not just for connecting people to jobs — but for building futures, empowering communities, and reshaping global workforce dynamics through integrity and excellence.',
    body: [
      'We envision a future where every capable Sri Lankan has access to meaningful employment opportunities beyond borders — regardless of social or economic background. Our role goes beyond recruitment. We aim to be an essential part of the human resource ecosystem that uplifts lives, strengthens economies, and fosters international collaboration.',
      'With over four decades of experience, we are committed to setting the benchmark in ethical recruitment, innovation, and inclusive growth. We aspire to serve as a bridge between the untapped potential of Sri Lankan talent and the global industries that need them — ensuring that every placement contributes not just to business success, but to human dignity and social progress.',
    ],
  },
  mission: {
    lead:
      'To recruit, prepare, and deploy a highly capable and diverse workforce by aligning the aspirations of individuals with the ever-evolving needs of global employers — with unmatched professionalism, transparency, and compassion.',
    body: [
      'Our mission is to deliver end-to-end recruitment solutions that go beyond filling vacancies. We invest in building people — by identifying strengths, nurturing skills, providing career guidance, and offering training programs that empower individuals to succeed in international roles. Through a meticulous selection process, we ensure our clients receive candidates who are qualified, reliable, and culturally adaptable.',
      'We partner closely with Sri Lankan government authorities, foreign embassies, travel agents, and airlines to ensure smooth and legal deployment, while maintaining full compliance with all local and international regulations.',
      'By fostering long-term relationships with our clients and maintaining a vast talent pool of skilled, semi-skilled, and unskilled workers, we aim to be a strategic partner in their growth — and a trusted name for Sri Lankans seeking brighter futures abroad.',
    ],
  },
} as const;

export const CONTACT_INTRO =
  'We take great pride in leveraging our expertise to support your business and look forward to connecting with you. Let us know how we can help you achieve your goals.';
