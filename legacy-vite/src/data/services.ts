/**
 * Recruitment services — verbatim from the audited /our-services page.
 */

export const SERVICES_INTRO = {
  heading: 'What Sets Our Workforce Solutions Apart?',
  paragraphs: [
    'At AL KARRIM LANKA, we go beyond recruitment—we provide tailored workforce solutions that ensure businesses get the right talent, every time. As a leading consultancy firm specializing in end-to-end international manpower recruitment, we have built a strong network of highly skilled professionals across multiple industries. Our expertise spans from top management roles to skilled and unskilled labor, ensuring that every candidate we place is rigorously screened, interviewed, and assessed by our expert teams.',
    'With a proven track record of successful placements—from experienced Project Managers to specialized labor—we guarantee that our clients receive a workforce that is qualified, validated, and ready to deliver. By prioritizing quality, efficiency, and reliability, we ensure that every candidate undergoes a proper validation check before deployment, giving our clients confidence in their hiring decisions.',
  ],
} as const;

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  icon: 'target' | 'trending' | 'workflow';
};

/** "How We Deliver Exceptional Workforce Solutions" — three offerings, verbatim. */
export const SERVICES: Service[] = [
  {
    id: 'talent-match',
    title: 'Talent Match',
    short: 'Proven hiring methods that find candidates with the right skills and mindset.',
    description:
      'We use proven hiring methods to find candidates with the right skills and mindset. Whether you’re scaling fast or filling key roles, we help you build a team that truly fits and adds long-term value.',
    icon: 'target',
  },
  {
    id: 'team-upskill',
    title: 'Team Upskill',
    short: 'Custom training programs aligned with your business goals.',
    description:
      'From startups to enterprises, we design training that actually sticks. Our custom programs boost your team’s skills, confidence, and performance — all aligned with your business goals.',
    icon: 'trending',
  },
  {
    id: 'career-flow',
    title: 'Career Flow',
    short: 'Smart workforce moves — from resizing to redeploying.',
    description:
      'We help you stay agile by guiding smart workforce moves — from resizing to redeploying. The result? Lower turnover, higher productivity, and a team that evolves with your market.',
    icon: 'workflow',
  },
];
