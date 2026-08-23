import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/app/PageShell';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export default function NotFound() {
  useSEO({
    title: 'Page Not Found — Al Karrim Lanka',
    description: 'The page you are looking for does not exist. Explore our services, recruitment process and vacancies.',
  });

  return (
    <PageShell>
      <section className="relative flex min-h-[80svh] items-center overflow-hidden py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[320px] w-[620px] -translate-x-1/2 rounded-full opacity-50 blur-[130px]"
          style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.12), transparent)' }}
        />
        <div className="container-site text-center">
          <ScrollReveal y={24}>
            <Compass className="mx-auto h-12 w-12 text-accent-400" aria-hidden="true" />
            <p className="mt-8 font-display text-display-xl font-semibold leading-none tracking-tight text-gradient-accent">
              404
            </p>
            <h1 className="mt-6 font-display text-heading font-semibold tracking-tight">
              This route doesn't exist
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-mist-500">
              The page you're looking for may have moved. Here are the places most people are heading.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/">Back to home</ButtonLink>
              <ButtonLink to="/vacancies" variant="ghost">
                View vacancies
              </ButtonLink>
              <ButtonLink to="/contact" variant="ghost">
                Contact us
              </ButtonLink>
            </div>
            <p className="mt-10 text-sm text-mist-700">
              Or explore our{' '}
              <Link to="/services" className="text-mist-500 underline-offset-2 hover:text-accent-400 hover:underline">
                services
              </Link>{' '}
              and{' '}
              <Link to="/recruitment" className="text-mist-500 underline-offset-2 hover:text-accent-400 hover:underline">
                recruitment process
              </Link>
              .
            </p>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
