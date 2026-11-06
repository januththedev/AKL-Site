# Taste components

Four new UI components built with the taste skill (`design-taste-frontend`) and added on top of the existing site. Nothing that was already there was removed, limited or restyled. All new styles are in `components/taste/taste-ui.css` and every class is prefixed `tx-`, so none of them touches an existing rule.

| Component | Where it shows | Files |
|---|---|---|
| Experience in numbers: rolling counters and a client logo row | Home, before "Lasting relationships with good companies." | `ExperienceNumbers.tsx`, `CounterRoll.tsx`, `LogoMarquee.tsx` |
| Recruitment pipeline board | Home, after the numbers and the client band | `PipelineSection.tsx`, `PipelineBoard.tsx` |
| Colombo-to-world scene | Home, after the pipeline board, before the existing "Sri Lankan talent for employers around the world" section | `ColomboPullback.tsx` |
| Dotted globe, wired to the destinations content | Inside the scene above, and as a section on `/destinations` ("Routes from Colombo.") | `DottedGlobe.tsx`, `DestinationPicker.tsx`, `useDestinationTour.ts`, `destinations.ts`, `GlobeExplorer.tsx`, `GlobeSection.tsx`, `public/taste/effects/*` |

All of these live in `components/taste/`. Pure logic (counter strips, pipeline timing, the pull-back maths, placing destinations on the globe, the tour order) is in `logic.ts` and `destinations.ts` and is unit tested.

## What each one does

**Rolling counters.** Four figures: years of experience (worked out from "Established in August 1980"), 125,000+ deployments reported, client names listed and industries recruited for. All four come from the company profile and the content files, nothing is invented. Each digit rolls once, the first time the row is seen, and lands on its real digit. The server renders the final value. The digits that roll are drawn with CSS generated content (`data-d` attributes), so the page text that screen readers, search engines, reader mode and copy-paste see holds each figure exactly once, as plain text, and the roll is decoration only. With four columns each figure is sized from its own column (container query units), so the widest one, "125,000+", always sits inside it.

**Logo row.** Eighteen real client logos from the verified catalogue, shown as 64 px high thumbnails. They drift sideways, fade out at the edges, pause while pointed at, pause while off screen and have a pause button. Regenerate the thumbnails with `node scripts/build-marquee-logos.mjs`; it reads `content/client-catalog.json`, writes `public/clients/marquee/` and `components/taste/marquee-logos.json`.

**Pipeline board.** One example requirement moving through Inquiry, Selection, Processing and Deployment, one stage at a time, then starting again. It is labelled as an example and says timing and requirements are confirmed for each case. It is not live data. It pauses on hover, on focus, when off screen and with its button. Wide containers (720 px and up) show four columns, narrow ones a vertical list.

**Colombo-to-world scene.** On screens at least 1100 px wide and 720 px tall with motion allowed, the stage sticks for about two screens of scroll. A photograph of the Colombo coast fills the screen and, as the visitor scrolls, pulls back into a small frame at the foot of a dotted globe while the heading, the destination buttons and the link to `/destinations` arrive. It uses native scroll only, with no scroll hijacking. Everywhere else (tablets, phones, reduced motion, no script) the finished composition is shown in normal flow. If the copy ever would not fit inside the held stage (a short window, or an editor adding many destinations), the scene falls back to the plain layout instead of cutting text off.

**Dotted globe, wired to the destinations.** The globe is driven by the same destinations content the "Sri Lankan talent for employers around the world" section lists (`withProfileReach(content.destinations)`), not by a hard-coded list of cities. See the next section.

## How the destinations drive the globe

- **Places.** Each destination is placed with `resolveGeo` in `lib/geo.ts`, the same table the Talent Routes map uses (the UAE is Dubai, Oman is Muscat, "The Gulf" is Doha, Europe is Frankfurt, South Asia a regional centre, Malaysia Kuala Lumpur, Australia Sydney, and so on). The "Sri Lanka" entry is Colombo itself. Destinations that land on the same spot share one node. A destination the table does not know stays off the map: its button and card still work, and the globe shows the whole network. Edit the destinations in the admin and the globe follows; nothing about it is written into the component.
- **The tour.** Once the picture has come to rest, the globe goes on a tour: Colombo first (every route from Colombo drawn at once), then each destination in the content's own order. For each one the globe turns so the middle of the route from Colombo faces the viewer (both ends stay on screen), draws the route, runs a packet along it and a ripple at its far end, and labels the place. The button, the card (the destination's own region, title and description) and the photograph in the frame (its own image) change with it.
- **Control.** The tour moves on by itself only while the picture is on screen, the tab is visible, motion is allowed, nobody has paused it, the pointer or keyboard focus is not on the list, and the visitor has not chosen anything. Choosing a destination ends the tour for good and the visitor is in charge. A pause button (labelled "Pause the tour" / "Play the tour") stops it. The tour starts only once the globe has loaded, so a slow connection never skips the Colombo opening. Scrolling back up to the start of the scene starts the tour over from Colombo.
- **Same on `/destinations`.** The "Routes from Colombo." section is the same picker and globe, using that page's destinations.
- **Honesty.** The scene says "Routes and photographs are illustrative, not current vacancies." The routes join Colombo to the places the content names; they do not claim placements, volumes or vacancies.

## Phones, reduced motion and no script

| Situation | Counters | Logo row | Pipeline board | Scene and globe |
|---|---|---|---|---|
| Phone or tablet width | Stacked, same roll | Same drift | Vertical list | Finished composition in flow; the buttons, card and tour work the same, the globe sits below the copy |
| Reduced motion | Final numbers, no roll | Wrapped row, no drift, no pause button | Still picture (Processing in progress), no pause button | Finished composition in flow; no tour; choosing a destination jumps the globe to it (one still frame with its route and label) |
| No script | Final numbers | Wrapped row | The first picture (two stages done, Processing in progress) | Finished composition: heading, the Sri Lanka card and the link; the buttons and globe need script |

## Keyboard and screen readers

- Every pause button is 40 by 40, reachable by Tab in page order, has a visible ring (ink on the ivory logo row, gold on the dark board and globe) and toggles with Space or Enter.
- The destination buttons are real buttons in a labelled group (`aria-pressed`), reachable by Tab, with a mint ring on the dark stage. Enter or Space chooses. While the tour runs by itself the card is not announced; once the visitor chooses, changes are announced politely (`aria-live`).
- The scene's heading and links are never hidden from assistive technology, even while faint at the start. They cannot be clicked by accident while faint. When keyboard focus enters the scene it settles on the finished composition, so whatever has focus is visible. A mouse click on a button does not move the scene.
- The scene link uses a mint focus ring, because the site's usual link ring (dark forest green) is almost invisible on the dark stage.
- The globe and the pipeline's moving log are decorative and `aria-hidden` or labelled as images. The places and stages are all available as real text.

## Local changes to a vendored file

`public/taste/effects/dotted-globe/effect.js` is the skill's file with two additions; `fx.js` is copied unchanged.

- `configureNetwork({ cities, names, origin, view, font })`: the globe uses those places as its nodes and draws routes from the origin (Colombo) instead of between random pairs. Each globe keeps the network it was mounted with.
- `focusHub(el, index, { instant })`: turns a mounted globe to a node and holds it (a glide, with a slow sway), draws that node's route and label, or every route for the origin. It stops the ambient arcs while a node is focused. Without these calls the effect behaves exactly as shipped.

`tests/redesign/taste-ui.test.ts` and `tests/redesign/destinations.test.ts` check that the patches are still present, so a re-copy of the skill file cannot silently drop them.

## Edits to existing files

- `components/HomeView.tsx`: three imports and three elements (`ExperienceNumbers`, `PipelineSection`, `ColomboPullback`, which is given `withProfileReach(c.destinations)`).
- `components/InfoPages.tsx`: one import and `<GlobeSection destinations={withProfileReach(c.destinations)}/>` on the destinations page.
- `next.config.ts`: long-cache headers for `/taste/*` and `/clients/marquee/*`.

The existing "Sri Lankan talent for employers around the world" section (photograph, Talent Routes map and buttons) is unchanged and still follows the scene on the home page.

## How to remove any of them

Delete its import and element from `HomeView.tsx` or `InfoPages.tsx`. Nothing else depends on the components. To remove all of it, also delete `components/taste/`, `public/taste/`, `public/clients/marquee/`, `scripts/build-marquee-logos.mjs`, `tests/redesign/taste-ui.test.ts`, `tests/redesign/destinations.test.ts` and the two header entries in `next.config.ts`.

## Checks run on the finished build

- `tsc --noEmit` clean, `next build --webpack` succeeds, 105 of 105 tests pass (16 new, in `tests/redesign/taste-ui.test.ts` and `tests/redesign/destinations.test.ts`).
- axe-core 4.x: 0 violations on the 11 public routes at 1440 and 390 wide, plus chat open, Moments viewer open (both widths) and the mobile menu, and on the destination picker states (home scene settled, a destination chosen, the same on `/destinations`, both widths).
- Scripted keyboard checks: 17 of 17 for the earlier controls and the scene's focus behaviour, and 12 of 12 for the picker (Tab reaches the buttons, mint ring, Enter chooses, the globe turns, polite announcements only after a choice, focus or pointer on the list holds the tour, the pause button stops it).
- Scripted behaviour checks of the tour: it opens on Colombo, moves through the destinations by itself, the globe node, card and photograph follow, choosing ends the tour, and Sri Lanka returns the globe to the overview. Run on the home page (desktop, phone, reduced motion) and on `/destinations`.
- The scene fits inside the held stage at every size tried (1100x720 up to 2560x1440); at 1100x720 it fell back to the plain layout, as designed.
- The page text of each counter figure is just the figure and its label, and the widest figure fits inside its column at 18 widths from 360 to 2560 px.
- Screenshots and frame-by-frame captures of the glide reviewed at 1440, 1366, 1280, 1100, 820 and 390 wide, and with reduced motion.
- Lighthouse (mobile settings, median of three runs) on the home page. The column "Branch start" is the commit before any of these components, "Components" the commit with the four components, "Now" this build:

| Run | | Branch start | Components | Now |
|---|---|---|---|---|
| Cold load, opening already seen | Score | 92 | 93 | 98 |
| | LCP | 1389 ms | 1387 ms | 1369 ms |
| | TBT | 294 ms | 273 ms | 125 ms |
| First visit, with the opening | Score | 56 | 59 | 72 |
| | LCP | 6899 ms | 7030 ms | 6771 ms |
| Both | Transferred | 1,404 KB | 1,475 KB | 1,478 KB |

The score and TBT swing from run to run on identical code (first-visit scores went from 56 to 72 here), so treat the differences as noise rather than as improvements; the point is that nothing got worse. Compared with the previous commit the page is 2 KB heavier (1.7 KB of script). The globe code (about 35 KB gzipped) is not fetched on page load. Destination photographs other than the opening one are fetched only when they are about to be shown.

## Not verified

- The globe was only run on software WebGL in headless Chrome. Frame rate on real phones and laptops with a GPU has not been measured.
- The scroll scene and the tour were checked at scripted scroll positions and with frame captures, not by hand on a trackpad or a touch screen. The tour's pace (4.8 seconds a destination, about 40 seconds a loop) is a judgement call.
- The existing link focus ring (`#0b3d32`) on the site's own dark sections, for example "See our clients" in the client band, has about 1.5 to 1 contrast against the dark background. That was already the case and was left alone, because it is outside these components. The new controls do not use it on dark backgrounds.
