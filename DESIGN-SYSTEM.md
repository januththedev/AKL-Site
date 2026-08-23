# Design System — Al Karrim Lanka Website

The visual language of the rebuild: a dark, editorial, motion-forward system built on
Tailwind CSS 3.4 tokens (`tailwind.config.ts`). Everything below is defined there or in
`src/styles/globals.css` — no ad-hoc colors in components.

## Palette

Three token families; all components use `text-mist-*`, `bg-ink-*`, `text-accent-*` etc.

### Ink (surfaces — near-black with a blue cast)

| Token    | Hex       | Use |
| -------- | --------- | --- |
| `ink-950` | `#050607` | Page background, deepest wells |
| `ink-900` | `#090B0E` | Section alternation |
| `ink-850` | `#0B0E12` | Cards, glass panels |
| `ink-800` | `#0D1115` | Raised cards, inputs |
| `ink-700` | `#131920` | Borders-adjacent fills, hovers |

### Mist (content — cool greys)

| Token     | Hex       | Use |
| --------- | --------- | --- |
| `mist-100` | `#F2F5F7` | Primary text, headings |
| `mist-300` | `#D7DDE2` | Secondary text |
| `mist-500` | `#9AA3AB` | Body copy, captions |
| `mist-700` | `#646D75` | Tertiary/meta text |

### Accent (brand green — one hue, six steps)

| Token      | Hex       | Use |
| ---------- | --------- | --- |
| `accent-200` | `#A4EFC8` | Highlights on dark, gradients |
| `accent-300` | `#7CE8AE` | Gradient stops |
| `accent-400` | `#4EDD92` | Icons, links on dark |
| `accent-500` | `#34C978` | **Primary brand** — CTAs, progress bars, focus rings |
| `accent-600` | `#1FA45B` | Hover states |
| `accent-700` | `#157A47` | Pressed/borders |

Signature treatments: `.text-gradient-accent` (green gradient text), `.glass` (translucent
panel + border), `.grain` (film-grain overlay), radial accent glows at low opacity.

## Typography

Self-hosted variable fonts via Fontsource — no external font requests.

| Role      | Family | Token |
| --------- | ------ | ----- |
| Display   | Space Grotesk Variable | `font-display` |
| Body      | Inter Variable | `font-body` |

Fluid sizes (clamp-based, scale smoothly 320 px → 4K):

| Token          | Value |
| -------------- | ----- |
| `text-display-xl` | `clamp(2.6rem, 8.5vw, 8.5rem)` — hero statements |
| `text-display-lg` | `clamp(2.75rem, 6vw, 6rem)` |
| `text-display`    | `clamp(2.25rem, 4.5vw, 4.25rem)` — section headlines |
| `text-heading`    | `clamp(1.75rem, 3vw, 2.75rem)` |
| `text-title`      | `clamp(1.35rem, 2vw, 1.75rem)` |

Eyebrow labels: uppercase, `tracking-widest2` (`0.28em`), accent-colored, with a leading rule.

## Motion

Lenis smooth scrolling (`hooks/useLenis`) drives the page; all reveal work respects
`prefers-reduced-motion` via `hooks/useReducedMotion`.

Custom easing (tokens): `ease-out` → `cubic-bezier(0.22, 1, 0.36, 1)`,
`ease-soft` → `cubic-bezier(0.65, 0, 0.35, 1)`.

Motion primitives (`src/components/motion/`):

| Component       | Purpose |
| --------------- | ------- |
| `ScrollReveal`  | IntersectionObserver-driven entrance (fade/slide, staggered delays) |
| `Magnetic`      | Cursor-attracted buttons/CTAs (pointer devices only) |
| `ScrambleText`  | Decode/scramble effect on key words |
| `KineticText`   | Per-character kinetic type (e.g. the "WE CONNECT TALENT…" wall) |
| `VelocityMarquee` | Scroll-velocity-reactive ticker bands |
| `CountUp`       | Animated statistics (40+, 125,000+) |
| `SpotlightCard` | Pointer-tracking spotlight highlight on cards |

## 3D — `<model-viewer>` globes

`components/ui/InteractiveModel.tsx` wraps `@google/model-viewer`:

- Chunk (~300 KB gzip) is dynamically imported only when the wrapper nears the viewport
  (`IntersectionObserver`, 200 px margin); a labelled accessible fallback renders if it fails.
- Auto-rotate pauses under reduced motion; drag/zoom remain user-driven.
- `camera-orbit` framing, neutral environment, soft shadow; progress bar tinted `accent-500`.
- JSX typing for the custom element lives in `src/types/model-viewer.d.ts`.
- Models: `public/models/akl-globe.glb`, `akl-pin.glb` — regenerated with `npm run generate:models`.

## Components inventory

- **Navigation**: `SiteHeader` (glass bar, desktop hover dropdown for Recruitment, mobile
  full-screen menu), `Footer` (brand, four link columns, contact, credits, back-to-top).
- **UI**: `ButtonLink` (primary/ghost/external variants), `PageHero`, `SectionHeading`,
  `InteractiveModel`.
- **Forms**: `ContactForm` — inquiry-type toggle (Employer/Job seeker), validated fields,
  honest `mailto:` submission with an explicit explanation line.
- **Sections**: `Hero`, `TickerBand`, `WhyChoose`, `StoryBlock`, `StatsBand`,
  `KineticStatement`, `ServicesGrid`, `ProcessJourney`, `DestinationsStrip`,
  `ClientsMarquee`, `AudienceCTA`, `VacanciesCTA`, `ValuesBlock`, `ContactBand`.

## Accessibility

- Skip-to-content link; single `<h1>` per page; semantic landmarks (`banner`, `main`,
  `contentinfo`, labelled regions).
- Decorative icons `aria-hidden`; figures get descriptive labels ("Global reach — drag to explore").
- Visible focus states; `:hover` styles gated by `hoverOnlyWhenSupported` (no sticky tap-hover).
- Reduced motion honored across reveals, marquees, counters and model auto-rotate.
- Contrast: body text `mist-500`+ on `ink-950/900` meets AA; accent reserved for emphasis/CTAs.
