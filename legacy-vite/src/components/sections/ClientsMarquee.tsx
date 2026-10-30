import { CLIENT_LOGOS } from '@/data/clients';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

/**
 * "Our esteemed clients" — authentic logo images from the audited site,
 * shown without invented brand names or links (see CONTENT-AUDIT.md).
 */
export function ClientsMarquee() {
  return (
    <section aria-label="Our esteemed clients" className="border-y border-white/[0.07] bg-ink-900/50 py-16 sm:py-20">
      <div className="container-site">
        <ScrollReveal y={18}>
          <p className="eyebrow justify-center text-center [&::before]:hidden">Our esteemed clients</p>
        </ScrollReveal>
      </div>
      <VelocityMarquee baseSpeed={42} className="mt-10">
        {CLIENT_LOGOS.map((logo) => (
          <img
            key={logo}
            src={logo}
            alt=""
            loading="lazy"
            className="mx-8 h-12 w-auto opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:mx-11 sm:h-14"
          />
        ))}
      </VelocityMarquee>
    </section>
  );
}
