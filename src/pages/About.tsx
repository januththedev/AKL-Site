import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { ABOUT, STATS } from '@/data/company';
import { InteractiveModel } from '@/components/ui/InteractiveModel';

export default function About() {
  useSEO({
    title: 'About Us — Al Karrim Lanka',
    description:
      'Founded in August 1980, Al Karrim Lanka Consultant (Pvt) Ltd is a government-approved Sri Lankan recruitment agency with over 40 years of experience placing talent across the Middle East, Europe, Malaysia and Australia.',
    path: '/about',
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Shaping careers, building nations"
        title={
          <>
            Four decades of connecting <span className="text-gradient-accent">Sri Lankan talent</span> with the world
          </>
        }
      />

      {/* Who we are */}
      <section aria-labelledby="who" className="py-20 sm:py-24">
        <div className="container-site grid items-start gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading eyebrow="Who is Al Karrim Lanka?" title="A trusted name since 1980" />
            <ScrollReveal y={22} delay={0.08}>
              {ABOUT.who.map((p) => (
                <p key={p.slice(0, 24)} className="mt-5 text-base leading-relaxed text-mist-500 sm:text-lg">
                  {p}
                </p>
              ))}
            </ScrollReveal>

            {/* Timeline */}
            <div className="mt-14">
              <SectionHeading eyebrow="Our history" title={<ScrambleText as="span" text="The journey so far" />} />
              <ol className="relative mt-10 space-y-10 border-l border-white/10 pl-8">
                {[
                  {
                    year: '1980',
                    label: 'Founded in Colombo',
                    text: ABOUT.history[0],
                  },
                  {
                    year: '1990s →',
                    label: 'International expansion',
                    text: ABOUT.history[1],
                  },
                  {
                    year: STATS[0].value + '+',
                    label: 'Years of recruitment',
                    text: 'From individual placements to high-volume deployment — over 125,000 Sri Lankan professionals placed worldwide.',
                  },
                ].map((milestone, i) => (
                  <ScrollReveal as="li" key={milestone.year} y={22} delay={i * 0.06} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 border-accent-500 bg-ink-950"
                    />
                    <p className="font-display text-3xl font-semibold text-gradient-accent">{milestone.year}</p>
                    <h3 className="mt-1.5 font-display text-lg font-medium text-mist-100">{milestone.label}</h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-mist-500">{milestone.text}</p>
                  </ScrollReveal>
                ))}
              </ol>
            </div>
          </div>

          {/* Interactive 3D sidebar — globe + pin */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <ScrollReveal y={26}>
              <figure className="card-surface overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <InteractiveModel
                    src="/models/akl-globe.glb"
                    alt="Interactive 3D globe — drag to rotate. Al Karrim Lanka has connected Sri Lankan talent to global markets since 1980."
                  />
                </div>
                <figcaption className="border-t border-white/[0.07] px-4 py-3 font-display text-[11px] uppercase tracking-widest text-mist-500">
                  Global reach since 1980
                </figcaption>
              </figure>
            </ScrollReveal>
            {/* Second WebGL context is desktop-only — keeps mobile memory light */}
            <ScrollReveal y={26} delay={0.08} className="hidden lg:block">
              <figure className="card-surface overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <InteractiveModel
                    src="/models/akl-pin.glb"
                    alt="Interactive 3D location pin — drag to rotate."
                    orbit="-20deg 80deg 115%"
                  />
                </div>
                <figcaption className="border-t border-white/[0.07] px-4 py-3 font-display text-[11px] uppercase tracking-widest text-mist-500">
                  Placed worldwide
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal y={18} delay={0.12}>
              <p className="glass rounded-2xl p-6 text-sm leading-relaxed text-mist-300">{ABOUT.intro}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section aria-labelledby="mission-vision" className="border-y border-white/[0.07] bg-ink-900/50 py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading
            eyebrow="Our mission and vision"
            align="center"
            title={
              <>
                Driven by purpose, guided by <span className="text-gradient-accent">integrity</span>
              </>
            }
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {[
              { title: 'Our Vision', lead: ABOUT.vision.lead, body: ABOUT.vision.body },
              { title: 'Our Mission', lead: ABOUT.mission.lead, body: ABOUT.mission.body },
            ].map((block, bi) => (
              <ScrollReveal key={block.title} y={26} delay={bi * 0.09}>
                <article className="card-surface h-full p-9 sm:p-11">
                  <h3 className="font-display text-xs uppercase tracking-widest2 text-accent-400">{block.title}</h3>
                  <p className="mt-6 font-display text-xl font-medium leading-snug text-mist-100 sm:text-2xl">
                    “{block.lead}”
                  </p>
                  {block.body.map((p) => (
                    <p key={p.slice(0, 24)} className="mt-5 text-[15px] leading-relaxed text-mist-500">
                      {p}
                    </p>
                  ))}
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center sm:py-24">
        <div className="container-site">
          <ScrollReveal y={22}>
            <p className="mx-auto max-w-2xl font-display text-heading font-semibold leading-snug tracking-tight">
              Ready to work with a consultancy the industry has trusted for four decades?
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink to="/contact">Book an appointment</ButtonLink>
              <ButtonLink to="/vacancies" variant="ghost">
                View vacancies
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
