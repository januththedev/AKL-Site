export const COMPANY_NAME = 'AL Karrim Lanka Consultants PVT LTD';
export const FOUNDING_YEAR = 1980;
export function companyYear(date = new Date()) {
 return Number(new Intl.DateTimeFormat('en', {year:'numeric',timeZone:'Asia/Colombo'}).format(date));
}
export function yearsOfExperience(date = new Date()) { return Math.max(0, companyYear(date) - FOUNDING_YEAR); }
