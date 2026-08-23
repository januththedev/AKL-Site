# Al Karrim Lanka — Website

Premium single-page application rebuild of the Al Karrim Lanka Consultant (Pvt) Ltd public website
(`www.al-karrim.net`), modernised as a fast, accessible, motion-rich React experience while preserving
every factual detail of the original content.

**Right talent, Right time.** — Shaping careers, building nations since 1980.

## Tech stack

| Layer      | Choice                                                       |
| ---------- | ------------------------------------------------------------ |
| Build      | Vite 5 + TypeScript 5.6 (strict)                              |
| UI         | React 18 + React Router 6 (SPA, `BrowserRouter`)              |
| Styling    | Tailwind CSS 3.4 (custom `ink` / `mist` / `accent` palette)   |
| Motion     | GSAP 3 + Lenis smooth scroll + custom reveal primitives       |
| 3D         | `@google/model-viewer` (lazy-loaded, WebGL GLB globes)        |
| Fonts      | Inter Variable + Space Grotesk Variable (self-hosted)         |

No CMS, no backend — all content lives in `src/data/site.ts` and the page components.

## Getting started

```bash
npm install
npm run dev        # dev server
npm run build      # tsc --noEmit + vite build → dist/
npm run preview    # serve the production build (http://localhost:4173/)
npm run typecheck  # strict TypeScript check only
npm run generate:models   # regenerate public/models/*.glb (scripts/generate-glb.mjs)
```

Requires Node 18+. On Windows, make sure `node`/`npm` are on `PATH`.

## Project structure

```
public/
  models/            akl-globe.glb, akl-pin.glb (generated)
  ...                logo, client logos, favicon
scripts/
  generate-glb.mjs   procedural GLB generator (three.js + gltf-transform)
src/
  app/               router, page shell (route reset, SEO wiring)
  components/
    footer/          Footer
    forms/           ContactForm (honest mailto handoff)
    motion/          CountUp, KineticText, Magnetic, ScrambleText,
                     ScrollReveal, SpotlightCard, VelocityMarquee
    navigation/      SiteHeader (desktop dropdown + mobile menu)
    sections/        Hero, TickerBand, WhyChoose, StoryBlock, StatsBand,
                     KineticStatement, ServicesGrid, ProcessJourney,
                     DestinationsStrip, ClientsMarquee, AudienceCTA,
                     VacanciesCTA, ValuesBlock, ContactBand
    ui/              ButtonLink, InteractiveModel, PageHero, SectionHeading
  data/site.ts       all site constants, nav, legacy redirect map
  hooks/             useSEO, useLenis, useReducedMotion, …
  pages/             Home, About, Services, Recruitment, CountryProcess,
                     Countries, Vacancies, Contact, NotFound
  types/             model-viewer.d.ts (JSX typing for <model-viewer>)
  styles/globals.css Tailwind layers, glass/grain utilities
```

## Routes

`/` · `/about` · `/services` · `/recruitment` · `/recruitment/:slug` (saudi-arabia,
united-arab-emirates, kuwait) · `/countries` · `/vacancies` · `/contact` · 404 catch-all.

Legacy WordPress deep links (`/about-us`, `/our-services`, `/our-process-saudi-arabia`,
`/our-process-uae`, `/our-process-kuwait`, `/contact-us`) are redirected client-side via
`LEGACY_REDIRECTS` in `src/data/site.ts`, and at the edge for hosts that support
`_redirects` (see `public/_redirects`).

## Quality notes

- **Accessibility**: skip-to-content link, semantic landmarks, `aria` labelling, focus-visible
  styles, reduced-motion support (`useReducedMotion` disables auto-rotate/reveals), hover
  styles gated behind `hoverOnlyWhenSupported`.
- **Performance**: route-level code splitting, model-viewer chunk (~300 KB gzip) loaded lazily
  on viewport approach via `IntersectionObserver`, self-hosted variable fonts, compressed
  GLB assets.
- **Honest content**: no fabricated job listings — the vacancies page hands off to the real
  external IntellixHR recruitment portal; the contact form composes a pre-filled email via
  `mailto:` and says so.

## Deployment

Static hosting (Netlify, Cloudflare Pages, Vercel, …):

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback + legacy redirects are included in `public/_redirects` (copied to `dist` on build).

## Credits

Developed by Januth Nimnal. Content © 2025 Al Karrim Lanka Consultant (Pvt) Ltd.
