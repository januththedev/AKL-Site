export const COMPANY_NAME = 'AL Karrim Lanka Consultants PVT LTD';
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
export function nextCompanyDateChange(kind: 'year' | 'experience', date = new Date()) {
 const {year, month} = companyDate(date);
 const changeYear = kind === 'year' || month >= FOUNDING_MONTH ? year + 1 : year;
 const changeMonth = kind === 'year' ? 0 : FOUNDING_MONTH - 1;
 return new Date(Date.UTC(changeYear, changeMonth, 1, -5, -30));
}
