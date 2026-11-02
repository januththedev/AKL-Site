'use client';

import { useEffect, useState } from 'react';
import { companyYear, nextCompanyDateChange, yearsOfExperience } from '@/lib/brand';

/** Keep server-rendered text stable during hydration, then update at the next boundary. */
export function LiveCompanyDate({ kind, initialValue }: { kind: 'year' | 'experience'; initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const now = new Date();
      setValue(kind === 'year' ? companyYear(now) : yearsOfExperience(now));
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
