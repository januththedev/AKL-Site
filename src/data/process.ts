/**
 * Recruitment process data — per-country six-stage processes.
 * All stage descriptions are verbatim from the audited country pages.
 */

export type ProcessStage = {
  title: string;
  description: string;
};

export type Country = {
  slug: string;
  name: string;
  shortName: string;
  region: string;
  intro: string;
  stages: ProcessStage[];
};

export const COUNTRIES: Country[] = [
  {
    slug: 'saudi-arabia',
    name: 'Saudi Arabia',
    shortName: 'Saudi Arabia',
    region: 'Middle East',
    intro:
      'Our six-step recruitment pipeline for the Kingdom of Saudi Arabia — from SLBFE-guided job orders to fully supported deployment.',
    stages: [
      {
        title: 'Inquiry',
        description:
          'Client confirms salary and terms per SLBFE guidelines. Job order is submitted with all required details and authenticated documents.',
      },
      {
        title: 'Sourcing',
        description:
          'We identify and collect profiles of potential candidates based on the job order. This takes around 7–10 days.',
      },
      {
        title: 'Selection',
        description:
          'Candidates are shortlisted, interviewed, and finalized. Employment offers are issued and accepted quickly to move forward.',
      },
      {
        title: 'Screening',
        description:
          'Selected candidates undergo GAMCA medical tests and obtain police clearance, verified by MOFA.',
      },
      {
        title: 'Visa',
        description:
          'Visa stamping is processed through the Saudi Embassy in Colombo — fast and efficient, usually within a day.',
      },
      {
        title: 'Deployment',
        description:
          'Final orientation is done, and candidates are sent off with full coordination and support for a smooth journey.',
      },
    ],
  },
  {
    slug: 'united-arab-emirates',
    name: 'United Arab Emirates',
    shortName: 'UAE',
    region: 'Middle East',
    intro:
      'From authenticated demand documents to final SLBFE approval — our end-to-end recruitment process for the UAE.',
    stages: [
      {
        title: 'Inquiry',
        description:
          'Client confirms salary, terms, and job requirements. Documents including Demand Letter, POA, and Employment Contracts are prepared and authenticated by the Chamber of Commerce, MOFA, and the UAE Embassy.',
      },
      {
        title: 'Sourcing',
        description:
          'Candidate sourcing begins based on job roles and categories. This typically takes 7–10 days depending on the quantity and required skill levels.',
      },
      {
        title: 'Selection',
        description:
          'Candidates are shortlisted, interviewed, and finalized. Employment offers are made, and acceptances are secured within 2 days to keep the timeline efficient.',
      },
      {
        title: 'Medical',
        description:
          'Pre-departure medical tests (GAMCA approved) are conducted in 3 days. Medical reports are authenticated by the Medical Council, MOFA, and UAE Embassy.',
      },
      {
        title: 'Approval',
        description:
          'Candidates undergo pre-departure training and receive final SLBFE approval. This step is completed within 3 days, ensuring readiness for deployment.',
      },
      {
        title: 'Deployment',
        description:
          'A final orientation is conducted before departure. Travel and logistics are managed end-to-end for a smooth transition to the UAE.',
      },
    ],
  },
  {
    slug: 'kuwait',
    name: 'Kuwait',
    shortName: 'Kuwait',
    region: 'Middle East',
    intro:
      'A compliant, coordinated route to Kuwait — authenticated contracts, medical clearance and visa handling handled end-to-end.',
    stages: [
      {
        title: 'Inquiry',
        description:
          'Client provides required job details including salary, position, and terms. Documents like Demand Letter and Employment Contract are prepared and authenticated by relevant authorities.',
      },
      {
        title: 'Sourcing',
        description:
          'We source suitable candidates based on the job requirements. This typically takes 7–10 days, depending on the quantity and categories involved.',
      },
      {
        title: 'Selection',
        description:
          'Candidates are shortlisted, interviewed, and given job offers. Final selection and acceptance are completed swiftly to keep the process moving.',
      },
      {
        title: 'Medical',
        description:
          "Selected candidates undergo pre-departure medical tests within 2 days to ensure fitness and compliance with Kuwait's regulations.",
      },
      {
        title: 'Visa',
        description:
          'Police clearance reports are obtained and authenticated by MOFA. The company arranges the visa, which is submitted to the agent by courier.',
      },
      {
        title: 'Deployment',
        description:
          'Candidates receive pre-departure training and final SLBFE approval. After orientation, they are deployed to Kuwait with full coordination and support.',
      },
    ],
  },
];

/** Simplified four-stage overview shown on the audited homepage. */
export const PROCESS_OVERVIEW = [
  { step: '01', title: 'Inquiry', description: 'Your requirement reaches us with clear terms and authenticated documents.' },
  { step: '02', title: 'Selection', description: 'Candidates are sourced, shortlisted and interviewed against the job order.' },
  { step: '03', title: 'Processing', description: 'Medicals, clearances, authentication and visa work are handled by us.' },
  { step: '04', title: 'Deployment', description: 'Orientation complete, travel coordinated — talent arrives ready to work.' },
] as const;

export const getCountry = (slug: string | undefined): Country | undefined =>
  COUNTRIES.find((c) => c.slug === slug);
