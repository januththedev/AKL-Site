import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT_INTRO } from '@/data/company';
import { CONTACT, SOCIALS } from '@/data/site';
import { ContactForm } from '@/components/forms/ContactForm';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

const CARDS = [
  {
    icon: MapPin,
    label: 'Visit us',
    lines: [CONTACT.addressLines[0], CONTACT.addressLines[1]],
    href: undefined as string | undefined,
  },
  {
    icon: Phone,
    label: 'Call us',
    lines: [CONTACT.phoneDisplay],
    href: `tel:${CONTACT.telPrimary}`,
  },
  {
    icon: Mail,
    label: 'Email us',
    lines: [CONTACT.email],
    href: `mailto:${CONTACT.email}`,
  },
];

/** Shared contact experience — used on Home and the dedicated Contact page. */
export function ContactBand({ withForm = true }: { withForm?: boolean }) {
  return (
    <section aria-labelledby="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 h-[360px] w-[560px] rounded-full opacity-40 blur-[130px]"
        style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.1), transparent)' }}
      />
      <div className="container-site">
        <div className={withForm ? 'grid items-start gap-14 lg:grid-cols-2' : ''}>
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title={
                <>
                  Let's grow your business <span className="text-gradient-accent">together</span>
                </>
              }
              description={CONTACT_INTRO}
            />

            <div className="mt-10 space-y-4">
              {CARDS.map((card, i) => {
                const Icon = card.icon;
                const inner = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-500/25 bg-accent-500/[0.08] text-accent-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-widest text-mist-700">{card.label}</span>
                      {card.lines.map((line) => (
                        <span key={line} className="block text-[15px] text-mist-300">
                          {line}
                        </span>
                      ))}
                    </span>
                  </>
                );
                return (
                  <ScrollReveal key={card.label} delay={i * 0.07} y={20}>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-200 hover:border-accent-500/30"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                        {inner}
                      </div>
                    )}
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal y={16} delay={0.2}>
              <a
                href={SOCIALS[0]?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2.5 text-sm text-mist-500 transition-colors hover:text-accent-400"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
                Follow us on Facebook — @alkarrim603
              </a>
            </ScrollReveal>
          </div>

          {withForm ? (
            <ScrollReveal y={30} delay={0.1}>
              <ContactForm />
            </ScrollReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
