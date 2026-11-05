# Taste components

Four new UI components built with the taste skill (`design-taste-frontend`) and added on top of the existing site. Nothing that was already there was removed, limited or restyled. All new styles are in `components/taste/taste-ui.css` and every class is prefixed `tx-`, so none of them touches an existing rule.

| Component | Where it shows | Files |
|---|---|---|
| Experience in numbers: rolling counters and a client logo row | Home, before "Lasting relationships with good companies." | `ExperienceNumbers.tsx`, `CounterRoll.tsx`, `LogoMarquee.tsx` |
| Recruitment pipeline board | Home, after the numbers and the client band | `PipelineSection.tsx`, `PipelineBoard.tsx` |
| Colombo-to-world scene | Home, after the pipeline board, before the existing world section | `ColomboPullback.tsx` |
| Dotted globe from Colombo | Inside the scene above, and as a section on `/destinations` ("Routes from Colombo.") | `DottedGlobe.tsx`, `GlobeSection.tsx`, `public/taste/effects/*` |

All of these live in `components/taste/`. Pure logic (counter strips, pipeline timing, the pull-back maths) is in `logic.ts` and is unit tested.

## What each one does

**Rolling counters.** Four figures: years of experience (worked out from "Established in August 1980"), 125,000+ deployments reported, client names listed and industries recruited for. All four come from the company profile and the content files, nothing is invented. Each digit rolls once, the first time the row is seen, and lands on its real digit. The server renders the final value. The digits that roll are drawn with CSS generated content (`data-d` attributes), so the page text that screen readers, search engines, reader mode and copy-paste see holds each figure exactly once, as plain text, and the roll is decoration only. With four columns each figure is sized from its own column (container query units), so the widest one, "125,000+", always sits inside it.

**Logo row.** Eighteen real client logos from the verified catalogue, shown as 64 px high thumbnails. They drift sideways, fade out at the edges, pause while pointed at, pause while off screen and have a pause button. Regenerate the thumbnails with `node scripts/build-marquee-logos.mjs`; it reads `content/client-catalog.json`, writes `public/clients/marquee/` and `components/taste/marquee-logos.json`.

**Pipeline board.** One example requirement moving through Inquiry, Selection, Processing and Deployment, one stage at a time, then starting again. It is labelled as an example and says timing and requirements are confirmed for each case. It is not live data. It pauses on hover, on focus, when off screen and with its button. Wide containers (720 px and up) show four columns, narrow ones a vertical list.

**Colombo-to-world scene.** On screens at least 768 px wide with motion allowed, the stage sticks for about two screens of scroll. A photograph of the Colombo coast fills the screen and, as the visitor scrolls, pulls back into a small frame at the foot of a dotted globe while the heading and the link to `/destinations` arrive. It uses native scroll only, with no scroll hijacking. Everywhere else (phones, reduced motion, no script) the finished composition is shown in normal flow.

**Dotted globe.** The skill's `dotted-globe` effect, mounted lazily when it comes within a screen of the viewport. A slow turn and one thin route at a time from Colombo to Dubai, Muscat, Mumbai, Kuala Lumpur, Frankfurt and Sydney. The routes are illustrative, and the page says so. WebGL with the effect's own 2D fallback, pixel ratio capped at 2, one still frame under reduced motion, and a pause button.

## Phones, reduced motion and no script

| Situation | Counters | Logo row | Pipeline board | Scene | Globe |
|---|---|---|---|---|---|
| Phone width | Stacked, same roll | Same drift | Vertical list | Finished composition in flow | Same, smaller |
| Reduced motion | Final numbers, no roll | Wrapped row, no drift, no pause button | Still picture (Processing in progress), no pause button | Finished composition in flow | One still frame |
| No script | Final numbers | Wrapped row | The first picture (two stages done, Processing in progress) | Finished composition in flow | An empty box with a soft glow; the regions are named in the text beside it |

## Keyboard and screen readers

- Every pause button is 40 by 40, reachable by Tab in page order, has a visible ring (ink on the ivory logo row, gold on the dark board and globe) and toggles with Space or Enter.
- The scene's heading and link are never hidden from assistive technology, even while faint at the start. They cannot be clicked by accident while faint. When keyboard focus enters the scene it settles on the finished composition, so whatever has focus is visible. A mouse click on the globe's pause button does not move the scene.
- The scene link uses a mint focus ring, because the site's usual link ring (dark forest green) is almost invisible on the dark stage.
- The globe and the pipeline's moving log are decorative and `aria-hidden` or labelled as images. The places and stages are all available as real text.

## Local change to a vendored file

`public/taste/effects/dotted-globe/effect.js` is the skill's file with one addition: `configureNetwork({ cities, origin, view })`. When it is called, the globe uses those cities as its hubs and draws every route from the origin (Colombo) instead of between random pairs. Without the call the effect behaves exactly as shipped. `tests/redesign/taste-ui.test.ts` checks that the patch is still present, so a re-copy of the skill file cannot silently drop it. `fx.js` is copied unchanged.

## Edits to existing files

- `components/HomeView.tsx`: three imports and three elements (`ExperienceNumbers`, `PipelineSection`, `ColomboPullback`).
- `components/InfoPages.tsx`: one import and `<GlobeSection/>` on the destinations page.
- `next.config.ts`: long-cache headers for `/taste/*` and `/clients/marquee/*`.

## How to remove any of them

Delete its import and element from `HomeView.tsx` or `InfoPages.tsx`. Nothing else depends on the components. To remove all of it, also delete `components/taste/`, `public/taste/`, `public/clients/marquee/`, `scripts/build-marquee-logos.mjs`, `tests/redesign/taste-ui.test.ts` and the two header entries in `next.config.ts`.

## Checks run on the finished build

- `tsc --noEmit` clean, `next build --webpack` succeeds, 97 of 97 tests pass (8 new, in `tests/redesign/taste-ui.test.ts`).
- axe-core 4.x: 0 violations on the 11 public routes at 1440 and 390 wide, plus chat open, Moments viewer open (both widths) and the mobile menu. An earlier run found two serious colour-contrast nodes on the pipeline board's "Next" step (text faded with `opacity`). They are fixed with explicit colours.
- Scripted keyboard checks, 17 of 17: tab order, target size, focus rings, Space on each pause button, the logo row really stopping, and the scene's focus behaviour.
- The page text of each figure is just the figure and its label (checked in the browser and in the server HTML), and the widest figure fits inside its column at 18 widths from 360 to 2560 px.
- Screenshots reviewed at 1440, 1024, 1000, 920, 820 and 390 wide, and with reduced motion.
- Lighthouse (mobile settings, median of three runs) on the home page against the commit this branch started from, both built and served the same way:

| Run | | Before | After |
|---|---|---|---|
| Cold load, opening already seen | Score | 92 | 93 |
| | LCP | 1389 ms | 1387 ms |
| | TBT | 294 ms | 273 ms |
| | CLS | 0.042 | 0.042 |
| First visit, with the opening | Score | 56 | 59 |
| | LCP | 6899 ms | 7030 ms |
| | TBT | 600 ms | 607 ms |
| Both | Transferred | 1,404 KB | 1,475 KB (+71 KB: about 61 KB logo thumbnails, 4 KB script, 7 KB styles and markup) |

The first-visit run is dominated by the opening animation (the LCP element is its mark) and swung between 56 and 66 across runs of identical code, so the differences in that row are noise. The globe code (about 35 KB gzipped) is not fetched on page load. The logo thumbnails are marked low priority so they do not compete with the hero.

## Not verified

- The globe was only run on software WebGL in headless Chrome. Frame rate on real phones and laptops with a GPU has not been measured.
- The scroll scene was checked at scripted scroll positions (start, 35%, 65%, end), not by hand on a trackpad or a touch screen.
- The existing link focus ring (`#0b3d32`) on the site's own dark sections, for example "See our clients" in the client band, has about 1.5 to 1 contrast against the dark background. That was already the case and was left alone, because it is outside these four components. The new controls do not use it on dark backgrounds.
