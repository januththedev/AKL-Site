import { KineticText } from '@/components/motion/KineticText';
import { ROLE_RANGE } from '@/data/company';

/** Scroll-scrubbed typographic statement + verified role-range copy. */
export function KineticStatement() {
  return (
    <section aria-label="Our promise" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.1), transparent)' }}
      />
      <div className="container-site">
        <KineticText
          lines={['WE CONNECT', 'TALENT WITH', 'OPPORTUNITY']}
          className="font-display text-display-lg font-semibold leading-[1.02] tracking-tight text-mist-100"
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <p className="max-w-md font-display text-xl font-medium leading-snug text-mist-300 sm:text-2xl">
            {ROLE_RANGE.heading}
          </p>
          <p className="max-w-md self-end text-base leading-relaxed text-mist-500 sm:text-lg">
            {ROLE_RANGE.paragraph}
          </p>
        </div>
      </div>
    </section>
  );
}
