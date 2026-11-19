'use client';

import { useEffect, useState } from 'react';
import { companyMonth, companyYear, nextCompanyDateChange, yearsOfExperience } from '@/lib/brand';

type Kind = 'year' | 'experience' | 'month';
const valueFor = (kind: Kind, now: Date): string | number =>
  kind === 'year' ? companyYear(now) : kind === 'month' ? companyMonth(now) : yearsOfExperience(now);

/** Keep server-rendered text stable during hydration, then update at the next boundary. */
export function LiveCompanyDate({ kind, initialValue }: { kind: Kind; initialValue: string | number }) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const now = new Date();
      setValue(valueFor(kind, now));
      // Long annual timeouts overflow browser limits; a daily checkpoint is sufficient.
      const delay = Math.min(86_400_000, nextCompanyDateChange(kind, now).getTime() - now.getTime() + 50);
      timer = setTimeout(refresh, Math.max(50, delay));
    };
    const visible = () => { if (document.visibilityState === 'visible') refresh(); };
    refresh();
    document.addEventListener('visibilitychange', visible);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', visible); };
  }, [kind]);
  return <span data-company-date={kind} style={{fontSize:'inherit', color:'inherit', letterSpacing:'inherit'}}>{value}</span>;
}

/** The current month and year ("November 2026"), rendered on the server and kept current in the browser. */
export function CurrentMonth() {
  return <LiveCompanyDate kind="month" initialValue={companyMonth()} />;
}
