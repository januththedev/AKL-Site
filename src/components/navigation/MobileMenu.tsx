import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, X } from 'lucide-react';
import { gsap } from '@/lib/animations';
import { CONTACT, NAV_ITEMS, VACANCIES_PORTAL } from '@/data/site';
import logo from '@/assets/brand/logo.png';
import { useLenis } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Full-screen glass drawer with scroll locking, focus trapping, Escape
 * handling, safe-area padding and a staggered reveal. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const { lenis } = useLenis();
  const reducedMotion = useReducedMotion();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    const panel = panelRef.current;
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      /* Focus trap: keep Tab cycling inside the dialog */
      if (e.key === 'Tab' && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !panel.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    let ctx: gsap.Context | undefined;
    if (!panel || reducedMotion) {
      if (panel) {
        gsap.set(panel, { opacity: 1 });
        gsap.set(panel.querySelectorAll('[data-menu-item]'), { opacity: 1, y: 0 });
      }
    } else {
      ctx = gsap.context(() => {
        gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        gsap.fromTo(
          '[data-menu-item]',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.055, ease: 'power3.out', delay: 0.08 },
        );
      }, panel);
    }

    return () => {
      ctx?.revert();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenis?.start();
      /* Restore focus to the opener (header menu button) */
      const opener = document.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]');
      opener?.focus();
    };
  }, [open, lenis, reducedMotion]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[60] flex flex-col bg-ink-950/95 backdrop-blur-xl lg:hidden"
    >
      <div className="container-site flex items-center justify-between py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <img src={logo} alt="" className="h-11 w-auto" width={96} height={96} />
        <button ref={closeRef} type="button" onClick={onClose} className="btn-ghost !p-3" aria-label="Close menu">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav
        aria-label="Mobile"
        className="container-site mt-2 flex-1 overflow-y-auto pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
      >
        <ul className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} data-menu-item>
              <Link
                to={item.to}
                onClick={onClose}
                className="flex min-h-[44px] items-center justify-between border-b border-white/[0.07] py-3 font-display text-3xl font-semibold text-mist-100 transition-colors hover:text-accent-400"
              >
                {item.label}
                <ArrowUpRight className="h-5 w-5 text-mist-700" aria-hidden="true" />
              </Link>
              {item.children ? (
                <ul className="mt-1 mb-2 space-y-0.5 pl-1">
                  {item.children.map((child) => (
                    <li key={child.to}>
                      <Link
                        to={child.to}
                        onClick={onClose}
                        className="block min-h-[44px] py-2.5 text-sm text-mist-500 transition-colors hover:text-accent-400"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>

        <div data-menu-item className="mt-8 grid gap-3">
          <a href={VACANCIES_PORTAL.href} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
            Find Opportunities
            <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </a>
          {/* Stacked full-width rows — two pills side-by-side wrap at 320px */}
          <div className="grid grid-cols-1 gap-3">
            <a href={`tel:${CONTACT.telPrimary}`} className="btn-ghost justify-center">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="btn-ghost justify-center">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
          </div>
        </div>

        <p data-menu-item className="mt-8 text-sm leading-relaxed text-mist-700">
          {CONTACT.addressFull}
        </p>
      </nav>
    </div>
  );
}
