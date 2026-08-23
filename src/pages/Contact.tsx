import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { ContactBand } from '@/components/sections/ContactBand';

export default function Contact() {
  useSEO({
    title: 'Contact Us — Al Karrim Lanka',
    description:
      'Contact Al Karrim Lanka Consultant (Pvt) Ltd — No 10/1, Duplication Rd, Colombo 05, Sri Lanka. +94 112 592551 / 2501675 · alkarrim@slt.lk. Book an appointment or request workforce.',
    path: '/contact',
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Colombo, Sri Lanka"
        title={
          <>
            Let's grow your business <span className="text-gradient-accent">together</span>
          </>
        }
        description="Book an appointment, request workforce, or simply ask us anything about overseas recruitment — we look forward to connecting with you."
      />
      <ContactBand />
    </PageShell>
  );
}
