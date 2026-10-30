/** Dated official-portal notices, reviewed 29 Oct 2026. Not a live feed. */
export type Opportunity = {
  id: string; title: string; country: string; sector: string; openings: number;
  closesOn: string; summary: string; source: string;
};
export const OPPORTUNITIES_REVIEWED = '29 October 2026';
export const OPPORTUNITIES: Opportunity[] = [
  { id: 'merchandiser-oman', title: 'Merchandiser', country: 'Oman', sector: 'Retail', openings: 100, closesOn: '2026-10-31', summary: 'Product presentation, stock availability and retail operations.', source: 'https://alk.intellixhr.com/careers/submit/293?lang=en' },
  { id: 'heavy-duty-driver-oman', title: 'Heavy Duty Driver', country: 'Oman', sector: 'Transport', openings: 50, closesOn: '2026-10-31', summary: 'Trailer driving and the safe transport of goods and equipment.', source: 'https://alk.intellixhr.com/careers' },
  { id: 'diesel-mechanic-qatar', title: 'Diesel Mechanic', country: 'Qatar', sector: 'Technical', openings: 3, closesOn: '2026-10-30', summary: 'Diagnosis, repair and maintenance of diesel-powered equipment.', source: 'https://alk.intellixhr.com/careers' },
];
