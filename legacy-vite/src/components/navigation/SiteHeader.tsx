import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import logo from '@/assets/brand/logo.png';
import { NAV_ITEMS } from '@/data/site';
import { Magnetic } from '@/components/motion/Magnetic';
import { MobileMenu } from './MobileMenu';

export function SiteHeader() {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  /* Auto-hide: down → hide, up or near top edge → show. */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 140) setHidden(false);
      else setHidden(y > lastY.current);
      lastY.current = y;
    };
    const onMouse = (e: MouseEvent) => {
      if (e.clientY <= 90) setHidden(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  /* Close the mobile menu on navigation. */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${
          hidden && !menuOpen ? '-translate-y-[130%]' : 'translate-y-0'
        }`}
      >
        <div className="container-site">
          <div
            className={`glass-emerald mt-3 flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-shadow duration-300 sm:mt-4 sm:px-5 ${
              scrolled ? 'shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)]' : ''
            }`}
          >
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3" aria-label="Al Karrim Lanka Consultant (Pvt) Ltd — home">
              <img src={logo} alt="AKL — Al Karrim Lanka, Estd 1980" className="h-11 w-auto sm:h-12" width={96} height={96} />
              <span className="hidden min-[480px]:inline">
                <span className="block font-display text-sm font-semibold uppercase tracking-[0.18em] text-mist-100">
                  Al Karrim <span className="text-accent-400">Lanka</span>
                </span>
                <span className="block font-display text-[9px] uppercase tracking-[0.3em] text-mist-500">
                  Consultant (Pvt) Ltd
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <div key={item.label} className="group relative">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-mist-500 transition-colors hover:text-mist-100 ${
                          isActive ? 'text-mist-100' : ''
                        }`
                      }
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
                    </NavLink>
                    {/* Dropdown */}
                    <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="glass w-64 space-y-1 rounded-xl p-2">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.06] hover:text-mist-100 ${
                                isActive ? 'bg-white/[0.05] text-accent-400' : 'text-mist-500'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `link-underline rounded-full px-3.5 py-2 text-sm transition-colors ${
                        isActive ? 'text-mist-100 [aria-current=page]:after:scale-x-100' : 'text-mist-500 hover:text-mist-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Magnetic strength={0.2} className="hidden sm:inline-block">
                <Link
                  to="/vacancies"
                  className="btn-primary !px-5 !py-2.5"
                >
                  Find Opportunities
                  <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                </Link>
              </Magnetic>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="btn-ghost !p-3 lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label="Open menu"
              >
                {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
