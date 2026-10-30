import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { MobileActions } from '@/components/navigation/MobileActions';
import { Footer } from '@/components/footer/Footer';
import { useRouteReset } from './PageShell';
import { LEGACY_REDIRECTS } from '@/data/site';

import Home from '@/pages/Home';
import About from '@/pages/About';
import ServicesPage from '@/pages/Services';
import RecruitmentHub from '@/pages/Recruitment';
import CountryProcess from '@/pages/CountryProcess';
import CountriesPage from '@/pages/Countries';
import VacanciesPage from '@/pages/Vacancies';
import ContactPage from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

function Layout() {
  useRouteReset();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <div className="pb-[calc(72px+env(safe-area-inset-bottom))] sm:pb-0"><Footer /></div>
      <MobileActions />
    </>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/recruitment" element={<RecruitmentHub />} />
        <Route path="/recruitment/:slug" element={<CountryProcess />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Legacy WordPress deep links → new routes */}
        {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
