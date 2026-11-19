export const COMPANY_NAME = 'Al - Karrim Lanka Consultants Pvt Ltd';
export const FOUNDING_YEAR = 1980;
export const FOUNDING_MONTH = 8;
export const COMPANY_TIME_ZONE = 'Asia/Colombo';
export function companyDate(date = new Date()) {
 const parts = new Intl.DateTimeFormat('en', {year:'numeric',month:'numeric',timeZone:COMPANY_TIME_ZONE}).formatToParts(date);
 return {year:Number(parts.find(part => part.type === 'year')!.value), month:Number(parts.find(part => part.type === 'month')!.value)};
}
export function companyYear(date = new Date()) {
 return companyDate(date).year;
}
export function yearsOfExperience(date = new Date()) {
 const {year, month} = companyDate(date);
 return Math.max(0, year - FOUNDING_YEAR - (month < FOUNDING_MONTH ? 1 : 0));
}

/** Sri Lanka has UTC+05:30 and no daylight-saving clock changes. */
/** "November 2026": the current month in Colombo, for edition labels that should always read as current. */
export function companyMonth(date = new Date()) {
 return new Intl.DateTimeFormat('en-GB', {month:'long', year:'numeric', timeZone:COMPANY_TIME_ZONE}).format(date);
}

export function nextCompanyDateChange(kind: 'year' | 'experience' | 'month', date = new Date()) {
 const {year, month} = companyDate(date);
 if (kind === 'month') return new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1, -5, -30));
 const changeYear = kind === 'year' || month >= FOUNDING_MONTH ? year + 1 : year;
 const changeMonth = kind === 'year' ? 0 : FOUNDING_MONTH - 1;
 return new Date(Date.UTC(changeYear, changeMonth, 1, -5, -30));
}
