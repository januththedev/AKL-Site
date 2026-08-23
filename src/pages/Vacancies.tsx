import { BellRing, ExternalLink, Languages, ShieldCheck } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { CONTACT, VACANCIES_PORTAL } from '@/data/site';

const FEATURES = [
  {
    icon: ExternalLink,
    title: 'Live external portal',
    text: VACANCIES_PORTAL.note,
  },
  {
    icon: Languages,
    title: 'Trilingual',
    text: 'The portal is available in English, සිංහල and தமிழ்.',
  },
  {
    icon: BellRing,
    title: 'Get notified',
    text: 'Subscribe on the portal to be notified about future openings.',
  },
];

/** Honest handoff to the external IntellixHR vacancies portal. */
export default function Vacancies() {
  useSEO({
    title: 'Vacancies — Al Karrim Lanka',
    description:
      'Browse verified overseas job openings on the Al Karrim Lanka recruitment portal — live listings across multiple industries and destinations.',
    path: '/vacancies',
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Current opportunities"
        title={
          <>
            Find your next role <span className="text-gradient-accent">abroad</span>
          </>
        }
        description="Verified overseas vacancies across multiple industries and destinations — hosted on our dedicated recruitment portal."
      />

      <section aria-label="Vacancies portal" className="py-20 sm:py-24">
        <div className="container-site max-w-5xl">
          <ScrollReveal y={26}>
            <div className="glass grain relative overflow-hidden rounded-3xl p-9 text-center sm:p-14">
              <ShieldCheck className="mx-auto h-10 w-10 text-accent-400" aria-hidden="true" />
              <h2 className="mt-7 font-display text-heading font-semibold leading-tight tracking-tight">
                You're entering the recruitment portal
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mist-500">
                Live listings open in a new tab on the Al Karrim Lanka recruitment portal (IntellixHR). Applications,
                notifications and profile management all happen there.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4">
                <Magnetic strength={0.22} className="w-full max-w-sm sm:max-w-none">
                  <ButtonLink
                    href={VACANCIES_PORTAL.href}
                    external
                    className="btn-primary w-full !px-6 !py-4 text-sm sm:w-auto sm:!px-9 sm:text-base"
                  >
                    Open the vacancies portal
                  </ButtonLink>
                </Magnetic>
              </div>
              <div className="mt-12 grid gap-4 border-t border-white/[0.08] pt-10 text-left md:grid-cols-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                      <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
                      <h3 className="mt-4 font-display text-base font-semibold text-mist-100">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist-500">{f.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal y={18} delay={0.15}>
            <p className="mt-8 text-center text-sm leading-relaxed text-mist-500">
              Portal unavailable right now? Call us at{' '}
              <a href={`tel:${CONTACT.telPrimary}`} className="text-accent-400 underline-offset-2 hover:underline">
                {CONTACT.phoneDisplay}
              </a>{' '}
              or{' '}
              <ButtonLink to="/contact" variant="ghost" className="!px-4 !py-2.5 text-sm">
                send an inquiry
              </ButtonLink>{' '}
              and our team will share current openings.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
