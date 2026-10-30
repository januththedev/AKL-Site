import type { Opportunity } from '../data/opportunities';

/** Use the Sri Lankan calendar date, including the full closing day. */
export function colomboDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function isClosed(opportunity: Opportunity, today: string): boolean {
  return opportunity.closesOn < today;
}
export function filterOpportunities(items: Opportunity[], filters: { query: string; country: string; sector: string; includeClosed: boolean }, today: string): Opportunity[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return items.filter(item =>
    (filters.includeClosed || !isClosed(item, today)) &&
    (!filters.country || item.country === filters.country) &&
    (!filters.sector || item.sector === filters.sector) &&
    (!query || `${item.title} ${item.country} ${item.sector} ${item.summary}`.toLocaleLowerCase().includes(query)),
  );
}
export function formatClosingDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}
