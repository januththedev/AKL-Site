import { useEffect, useState } from 'react';
import { ArrowUpRight, MapPin, Search } from 'lucide-react';
import { OPPORTUNITIES, OPPORTUNITIES_REVIEWED } from '@/data/opportunities';
import { colomboDate, filterOpportunities, formatClosingDate, isClosed } from '@/lib/opportunities';
import { VACANCIES_PORTAL } from '@/data/site';
import { ButtonLink } from '@/components/ui/ButtonLink';

const EMPTY_FILTERS = { query: '', country: '', sector: '', includeClosed: false };
const countries = [...new Set(OPPORTUNITIES.map(item => item.country))];
const sectors = [...new Set(OPPORTUNITIES.map(item => item.sector))];

export function OpportunityBoard({ compact = false }: { compact?: boolean }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [today, setToday] = useState(colomboDate);
  useEffect(() => {
    const update = () => setToday(colomboDate());
    const timer = window.setInterval(update, 60000);
    window.addEventListener('focus', update);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update); };
  }, []);
  const results = filterOpportunities(OPPORTUNITIES, filters, today);
  return (
    <section aria-labelledby="opportunity-heading" className="py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">A world of possibilities</p>
            <h2 id="opportunity-heading" className="mt-4 font-display text-heading font-semibold">Find a role. Take your next step.</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-500">Selected portal notices · Reviewed {OPPORTUNITIES_REVIEWED}. Availability may change; confirm full details on the official portal.</p>
          </div>
          <ButtonLink href={VACANCIES_PORTAL.href} external variant="ghost">All portal vacancies</ButtonLink>
        </div>
        {!compact && <div className="card-surface mt-8 p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
            <div><label htmlFor="role-search" className="field-label">Search opportunities</label><div className="relative"><Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-mist-500" aria-hidden="true" /><input id="role-search" type="search" className="field-input !pl-12" placeholder="Job title or keyword" value={filters.query} onChange={e => setFilters({ ...filters, query: e.target.value })} /></div></div>
            <div><label htmlFor="role-country" className="field-label">Destination</label><select id="role-country" className="field-input" value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })}><option value="">All destinations</option>{countries.map(country => <option key={country}>{country}</option>)}</select></div>
            <div><label htmlFor="role-sector" className="field-label">Industry</label><select id="role-sector" className="field-input" value={filters.sector} onChange={e => setFilters({ ...filters, sector: e.target.value })}><option value="">All industries</option>{sectors.map(sector => <option key={sector}>{sector}</option>)}</select></div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
            <label className="flex cursor-pointer items-center gap-3 text-mist-300"><input type="checkbox" className="h-5 w-5 accent-accent-500" checked={filters.includeClosed} onChange={e => setFilters({ ...filters, includeClosed: e.target.checked })} />Include closed notices</label>
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="min-h-11 px-3 text-accent-400 underline-offset-4 hover:underline">Reset filters</button>
          </div>
        </div>}
        <p className="mt-6 text-sm text-mist-500" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'notice' : 'notices'}{filters.includeClosed ? ', including closed notices' : ' within the published closing date'}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {results.map(item => {
            const closed = isClosed(item, today);
            return <article key={item.id} className="card-surface flex flex-col p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 text-xs"><span className="rounded-full border border-white/10 px-3 py-1.5 text-mist-300">{item.sector}</span><span className={closed ? 'text-mist-500' : 'text-accent-400'}>{closed ? 'Closed notice' : `${item.openings} advertised openings`}</span></div>
              <h3 className="mt-7 font-display text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-accent-400"><MapPin className="h-4 w-4" aria-hidden="true" />{item.country}</p>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-mist-500">{item.summary}</p>
              <p className="mt-7 border-t border-white/10 pt-5 text-xs text-mist-500">{closed ? 'Closed' : 'Closing date'} · <time dateTime={item.closesOn}>{formatClosingDate(item.closesOn)}</time></p>
              <a href={closed ? VACANCIES_PORTAL.href : item.source} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-11 items-center justify-between gap-3 text-sm font-medium text-mist-100 hover:text-accent-400">{closed ? 'Find other portal roles' : 'Check role on portal'}<ArrowUpRight className="h-5 w-5" aria-hidden="true" /></a>
            </article>;
          })}
        </div>
        {results.length === 0 && <div className="card-surface mt-5 px-6 py-12 text-center"><h3 className="font-display text-xl">No matching notices</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist-500">Try another search or check the official portal for current openings. Our dated highlights do not include every vacancy.</p><div className="mt-6"><ButtonLink href={VACANCIES_PORTAL.href} external>Check the live portal</ButtonLink></div></div>}
        {compact && <div className="mt-8"><ButtonLink to="/vacancies" variant="ghost">Search notices & prepare to apply</ButtonLink></div>}
      </div>
    </section>
  );
}
