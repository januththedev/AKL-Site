# Premium feel — plan

5 November 2026. Goal: the site should feel like a long-established firm writing to you personally — calm, assured, generous with space — rather than a template with effects. The opening ("Through the globe") stays the one bold moment; everything after it becomes quieter and more deliberate.

Out of scope (unchanged): the opening (`components/Intro.tsx`, `components/intro.css`, `lib/intro.ts`), client data files locked by tests, portfolio sharing pages, admin.

## What holds it back today (from desktop + phone scroll captures)

| Problem | Where | Why it reads as "not premium" |
| --- | --- | --- |
| The same two-line headline in ~8 sections: sans statement + italic serif second line | `SectionTitle`, `PageOpening`, `StoryHeading`, hero, employer band, footer | A repeated trick reads as a template, not a voice |
| Tiny tracked ALL-CAPS labels everywhere (6–10 px, ~170 rules) | `.eyebrow`, captions, "SCROLL TO EXPLORE", "CHAPTER 01", image corners | Noise; unreadable on phones; cheap-looking |
| Numbers on things that are not sequences (industries 01–07, destination tabs, FAQ) | `IndustryExplorer`, `DestinationStory`, `FaqList` | Decoration pretending to be structure |
| Heavy dark rounded header box over everything, including the hero photo | `SiteChrome` header | Feels like an app toolbar, crowds the hero |
| Small body text (13–15 px) and tight section rhythm | `globals.css` | Premium sites breathe; small text feels cramped |
| Mixed photo grading (warm/cold) | all photography | No unified art direction |
| Busy client logo wall (multi-colour logos on white tiles) | `ClientLogos` | Visual noise next to calm sections |
| Effects on everything (fade-ups, mint fills) with no single rhythm | various | Motion should answer the reader, not decorate |

## Design system (tokens)

Palette — keep the brand, change how it is used:

| Name | Hex | Use |
| --- | --- | --- |
| Ink | `#071916` | Dark sections, primary text on light |
| Forest | `#0B3D32` | Secondary dark surface, buttons on light |
| Paper | `#F5F2E9` | Light sections |
| Gold | `#C9A55C` | Signature only: hairlines, focus, the since-1980 mark, active states |
| Mint | `#88D8AE` | Interactive accents on dark only (links/hover), never large fills |
| Stone | `#5F6F67` | Secondary text on Paper (AA) |

Type — two faces, clearly different jobs:
- **Instrument Serif** (upright) is the voice: every section headline is one serif statement, set large with tight tracking. Italic is reserved for two moments only (hero line 2 and the footer question).
- **Manrope** is the interface and body: body 17 px / 1.7 on desktop, 16 px on phones, measure ≤ 64ch.
- Scale (major third from 17): 13 · 17 · 21 · 27 · 34 · 42 · 53 · 66 · 83 · 104. Nothing below 12 px anywhere.
- Labels: sentence case, 13 px, Manrope 600, normal tracking. Uppercase only for the two-letter header mark.

Space: section padding `clamp(96px, 11vw, 176px)` vertically; content max 1320 px; one 12-column grid, left-aligned editorial layout (no centred blocks except the footer question).

Surfaces: hairlines 1 px gold at 25% on dark, ink at 12% on paper; radius 2 px on buttons and inputs, 0 on photographs; no drop shadows except the chat launcher.

Photography: one grade for every photo (slightly desaturated, lifted blacks, faint green-gold tint) and a fine grain overlay, so stock and company photos read as one collection.

## Layout and components

```
HERO (transparent header floats on photo, turns solid after 80px of scroll)
┌──────────────────────────────────────────────────────────────┐
│ AKL  Al Karrim Lanka                    Story Expertise …  ◯ │  ← no box, no blur until scrolled
│                                                              │
│  The right people.                                           │  ← serif, 104px
│  A world of possibility.            (italic: 1 of 2 uses)    │
│  Short intro sentence…        [Build your next team]  Find → │
│  ────────────────────────────────────────────── photo ──────│
└──────────────────────────────────────────────────────────────┘
SECTION (every other section)
  Small sentence-case label (only if it adds information)
  One serif statement.                                    note →
  content …
```

- Header: transparent over the hero, solid Ink with gold hairline after scroll; no rounded floating box; 72 px tall (60 px on phones).
- Buttons: primary = Forest on Paper / Paper on Ink, label 15 px, arrow nudges 3 px on hover; secondary = underlined text link whose underline draws from left.
- Client logos: monochrome (greyscale, 65% opacity) on Paper, colour + full opacity on hover/focus; equal cells, more air.
- Footer: large serif wordmark "Al Karrim Lanka" as the last image of the page, contact details in calm columns.

## Motion

- Keep the opening as the one orchestrated moment.
- Add inertial smooth scrolling (Lenis) on desktop pointers only; off for touch, reduced motion and keyboard scrolling stays native. Wire it to ScrollTrigger.
- Section reveals: only headlines and photographs, a single short rise (12 px, 600 ms, shared easing `cubic-bezier(.22,1,.36,1)`); no reveals on body copy, labels or cards.
- Photographs: slow 4% scale-settle as they enter; hero keeps its bounded parallax.
- Hover/focus feedback on interactive elements only.

## Review against the generic defaults

- Two-tone serif-italic headlines → removed except two deliberate uses.
- Tracked all-caps eyebrows and meta strings → sentence case or removed.
- Numbered markers → only on the real sequence (the 4-step journey).
- Cream + serif + clay accent → not used; the brand forest/gold stays, gold is used sparingly as a signature.
- Identical rounded cards with soft shadows → not used; photographs stay square-edged, separation by space and hairlines.

## Implementation split

1. Tokens + global overrides in a new `components/premium.css` (loaded last), so `globals.css` stays as history and the change is reviewable/reversible.
2. Header, footer wordmark, smooth scroll, micro-interactions (`SiteChrome.tsx`, new `SmoothScroll.tsx`).
3. Headline/label/number markup pass across public components (`Public.tsx` `SectionTitle`/`PageOpening`, `StoryHeading`, `HomeView`, `InfoPages`, `Motion`, `ProfileStory`, `ClientLogos`, page files).
4. Desktop + phone scroll captures before/after; accessibility (contrast, focus, 200% zoom) and performance re-checked; tests, typecheck, build.

## Acceptance

- No visible text below 12 px; body ≥ 16 px on phones.
- At most two italic serif moments site-wide.
- No uppercase tracked labels except the logo mark.
- axe: no new serious violations; Lighthouse mobile performance not worse than the last report.
- Reduced motion: no smooth scroll, no reveals, no parallax.
