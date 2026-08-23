import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations';
import { useSEO } from '@/hooks/useSEO';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { COUNTRIES, getCountry } from '@/data/process';

/** Six-stage country recruitment process page (Saudi Arabia / UAE / Kuwait). */
export default function CountryProcess() {
  const { slug } = useParams<{ slug: string }>();
  const country = getCountry(slug);

  useSEO({
    title: country ? `${country.name} Recruitment Process — Al Karrim Lanka` : 'Recruitment Process — Al Karrim Lanka',
    description: country
      ? `${country.intro} Six verified stages from inquiry to deployment by Al Karrim Lanka Consultant (Pvt) Ltd.`
      : 'Recruitment process at Al Karrim Lanka.',
    path: country ? `/recruitment/${country.slug}` : '/recruitment',
  });

  const stagesRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !stagesRef.current) return;
    // Per-item triggers — a single container trigger fires immediately on
    // tall-content phones, animating off-screen stages before they're seen.
    const items = stagesRef.current.querySelectorAll('li');
    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%', once: true },
          },
        );
      });
    }, stagesRef);
    return () => ctx.revert();
  }, [slug, reducedMotion]);

  /* Unknown slug → soft redirect to the hub */
  if (!country) return <Navigate to="/recruitment" replace />;

  const index = COUNTRIES.findIndex((c) => c.slug === country.slug);
  const prev = COUNTRIES[(index + COUNTRIES.length - 1) % COUNTRIES.length];
  const next = COUNTRIES[(index + 1) % COUNTRIES.length];

  return (
    <PageShell>
      <PageHero
        eyebrow={`Recruitment process · ${country.region}`}
        title={
          <>
            {country.name} <span className="text-gradient-accent">recruitment process</span>
          </>
        }
        description={country.intro}
      />

      <section aria-label={`${country.name} process stages`} className="py-20 sm:py-24">
        <div className="container-site max-w-4xl">
          {/* Stage timeline */}
          <div className="relative" ref={stagesRef}>
            <div aria-hidden="true" className="absolute bottom-6 left-[19px] top-2 w-px bg-gradient-to-b from-accent-500/60 via-white/10 to-transparent sm:left-[23px]" />
            <ol className="space-y-5 sm:space-y-8">
              {country.stages.map((stage, i) => (
                <li key={stage.title} className="relative flex gap-4 pl-0 sm:gap-7">
                  <span className="relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-500/35 bg-ink-850 font-display text-sm font-semibold text-accent-400 sm:h-12 sm:w-12">
                    {i + 1}
                  </span>
                  <div className="card-surface flex-1 p-5 sm:p-7">
                    <h2 className="font-display text-xl font-semibold text-mist-100">{stage.title}</h2>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-mist-500">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Prev / next */}
          <nav aria-label="Other destinations" className="mt-16 grid gap-3 sm:grid-cols-2">
            <Link
              to={`/recruitment/${prev.slug}`}
              className="card-surface group flex items-center gap-4 p-5 transition-colors hover:border-accent-500/40"
            >
              <ArrowLeft className="h-4 w-4 text-mist-700 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-mist-700">Previous</span>
                <span className="font-display text-base text-mist-100">{prev.name}</span>
              </span>
            </Link>
            <Link
              to={`/recruitment/${next.slug}`}
              className="card-surface group flex items-center justify-end gap-4 p-5 text-right transition-colors hover:border-accent-500/40"
            >
              <span>
                <span className="block text-xs uppercase tracking-widest text-mist-700">Next</span>
                <span className="font-display text-base text-mist-100">{next.name}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-mist-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </nav>

          <ScrollReveal y={20}>
            <div className="glass mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl p-7">
              <p className="max-w-md text-sm leading-relaxed text-mist-300">
                Need workforce for {country.name}? Our team manages the entire pipeline for you.
              </p>
              <ButtonLink to="/contact">Request workforce</ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
