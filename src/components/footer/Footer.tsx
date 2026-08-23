import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import logo from '@/assets/brand/logo.png';
import { CONTACT, SOCIALS } from '@/data/site';
import { NAV_ITEMS } from '@/data/site';
import { COUNTRIES } from '@/data/process';
import { SERVICES } from '@/data/services';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useLenis } from '@/hooks/useLenis';

export function Footer() {
  const year = CONTACT.copyright;
  const { lenis } = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink-900">
      {/* Ambient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(52,201,120,0.14), transparent)' }}
      />

      <div className="container-site relative">
        {/* Final statement */}
        <ScrollReveal className="pt-20 pb-14 sm:pt-28" y={40}>
          <p className="eyebrow">{SOCIALS[0] ? 'Al Karrim Lanka' : ''}</p>
          <p className="mt-6 font-display text-display-lg font-semibold leading-[0.98] tracking-tight">
            Building global workforces.
            <br />
            <span className="text-gradient-accent">Since 1980.</span>
          </p>
        </ScrollReveal>

        <div className="grid gap-12 border-t border-white/[0.07] py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Al Karrim Lanka Consultant (Pvt) Ltd — home">
              <img src={logo} alt="AKL — Al Karrim Lanka, Estd 1980" className="h-14 w-auto" width={112} height={112} />
              <span>
                <span className="block font-display text-sm font-semibold uppercase tracking-[0.18em] text-mist-100">
                  Al Karrim <span className="text-accent-400">Lanka</span>
                </span>
                <span className="block font-display text-[10px] uppercase tracking-[0.25em] text-mist-500">
                  Consultant (Pvt) Ltd
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist-500">
              End-to-end international manpower recruitment from Sri Lanka — government approved,
              ISO 9001:2008 certified, trusted for over four decades.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Al Karrim Lanka on ${s.label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-mist-500 transition-colors hover:border-accent-500/50 hover:text-accent-400"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h3 className="font-display text-xs uppercase tracking-widest2 text-mist-700">Explore</h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-block py-1.5 text-sm text-mist-500 transition-colors hover:text-mist-100">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://alk.intellixhr.com/careers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-mist-500 transition-colors hover:text-accent-400"
                >
                  Open vacancies
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>

          {/* Services & destinations */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-widest2 text-mist-700">Services</h3>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link to="/services" className="inline-block py-1.5 text-sm text-mist-500 transition-colors hover:text-mist-100">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-display text-xs uppercase tracking-widest2 text-mist-700">Destinations</h3>
            <ul className="mt-5 space-y-2.5">
              {COUNTRIES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/recruitment/${c.slug}`} className="inline-block py-1.5 text-sm text-mist-500 transition-colors hover:text-mist-100">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-widest2 text-mist-700">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-mist-500">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                <span>
                  {CONTACT.addressLines[0]}
                  <br />
                  {CONTACT.addressLines[1]}
                </span>
              </li>
              <li>
                <a href={`tel:${CONTACT.telPrimary}`} className="flex items-center gap-3 transition-colors hover:text-mist-100">
                  <Phone className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 transition-colors hover:text-mist-100">
                  <Mail className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
            <Link to="/contact" className="btn-ghost mt-7 !px-5 !py-2.5 text-sm">
              Book an appointment
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] py-7 sm:flex-row sm:items-center">
          <p className="text-xs text-mist-700">{year}</p>
          <p className="text-xs text-mist-700">
            Developed by{' '}
            <span className="text-mist-500 transition-colors hover:text-accent-400">Januth Nimnal</span>
          </p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex min-h-[44px] items-center gap-2 text-xs text-mist-700 transition-colors hover:text-mist-100"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
