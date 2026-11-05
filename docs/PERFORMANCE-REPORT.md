# AKL performance report (plan sections 2 and 4)

Branch `v3-experimental`. Scope: photo delivery, blur cost, payload audit. **These are headless-Chrome Lighthouse results with simulated mobile throttling on a desktop PC. They are NOT real-device results** and do not replace the Pixel 7 Pro / Galaxy S24 Ultra / iPhone / low-end Android runs the plan requires.

## Method

- Two production builds (`next build --webpack`, `next start`) in scratch copies outside the project: `before` (branch as found) and `after` (before + only the changes listed below, so other in-flight work does not affect the comparison).
- Lighthouse 13 (Chrome stable, `--headless=new`), default mobile preset: Moto-G-class emulation, 4x CPU slowdown, simulated slow-4G, DPR 1.75. 3 runs per page, **median** reported. Same machine, sequential runs, same conditions for both builds.
- Page states:
  - `/ first visit`: storage and cache cleared, the opening (intro) plays.
  - `/ no intro, cold cache`: opening suppressed through `sessionStorage` (`akl:intro:v6=seen`), HTTP cache cleared. This isolates the page itself.
  - `/ repeat, warm cache`: opening suppressed and the page already visited once.
  - `/employers`, `/moments`, `/clients`: cold cache.
- Byte figures are transferred bytes from Lighthouse's network-requests audit. JSON reports and the runner script are in the scratch folder `...\scratchpad\perf\` (`reports\before`, `reports\after`, `tools\run.mjs`). No database exists locally, so pages render the default content snapshot.
- Run-to-run spread is visible (for example `/` no-intro after: scores 77/65/55); treat differences under about 5 points as noise. The consistent movers are bytes and LCP.

## Before and after (medians of 3)

| Page / state | Perf score | LCP | CLS | TBT | Total KB | JS KB | Image KB | `/media` KB | Intro KB |
|---|---|---|---|---|---|---|---|---|---|
| `/` first visit (intro plays) | 53 → 63 | 9.1 s → 6.5 s | 0.045 → 0.043 | 913 → 475 ms | 1839 → 1341 | 228 → 229 | 1485 → 986 | 1105 → 606 | 117 → 117 |
| `/` no intro, cold | 54 → 65 | 8.1 s → 6.3 s | 0.045 → 0.045 | 827 → 414 ms | 1839 → 1341 | 228 → 229 | 1485 → 986 | 1105 → 606 | 117 → 117 |
| `/` repeat, warm cache | 82 → 95 | 2.0 s → 1.2 s | 0 → 0 | 679 → 272 ms | 19 → 19 | 0 | 0 | 0 | 0 |
| `/employers` | 73 → 80 | 5.1 s → 4.6 s | 0.033 → 0.033 | 326 → 186 ms | 990 → 907 | 232 → 233 | 642 → 558 | 518 → 433 | n/a |
| `/moments` | 89 → 96 | 1.0 s → 0.9 s | 0.026 → 0.034 | 450 → 218 ms | 1612 → 1613 | 231 → 232 | 1267 → 1267 | 1308 → 1308 | n/a |
| `/clients` | 68 → 72 | 4.4 s → 4.1 s | 0.024 → 0.021 | 582 → 410 ms | 663 → 663 | 230 → 231 | 307 → 307 | 209 → 209 | n/a |

Notes on reading this:

- Every page is inside the CLS budget (0.1). `/` has no LCP-budget pass in the cold states (6.3-6.5 s against 2.5 s); the warm repeat visit passes (1.2 s). `/employers` and `/clients` also miss 2.5 s cold. INP is not measured by Lighthouse's lab run; TBT is the proxy and is high everywhere (186-475 ms after, up to 913 ms before).
- LCP element: on first visit it is the opening's logo (`img.rv-logo`, `/brand/AKL-Official-Logo-512.png`, 165 KB PNG shown at about 346 px) because the opening covers the page. With the opening skipped it is the hero photograph. On `/employers` it is the page-opening photograph. On `/moments` it is the decorative outline text. On `/clients` it is the relationship scene picture.
- Opening (intro) payload, measured separately: 117 KB of `/intro/*.webp` plus the 165 KB logo PNG, loaded even when the opening is later skipped for the session (the intro images are still requested). Unchanged by this work (`components/Intro.tsx` was out of scope).
- JS is about 229 KB transferred on every public route, with no change from this work. Fonts: 82 KB (four Manrope weights plus Instrument Serif italic, latin subsets only), CLS stays at or below 0.045, so no font-induced shift problem was found.
- The `/moments` CLS moved 0.026 → 0.034 with no change to that page's markup; this is within run-to-run noise (all runs are under 0.1) but should be rechecked on a device.

## What changed

1. **Responsive photo variants** (`scripts/build-image-variants.mjs`). For every `public/media/*.webp` it writes 640/1024/1600 px WebP variants (only widths below the original; portrait originals get 640/1024) to `public/media/r/`, deterministic and idempotent, and a manifest `components/image-variants.json`. Originals and every existing URL are untouched; the subfolder keeps `scripts/build-intro-atlas.mjs` (which lists `public/media/*.webp`) unaffected. 37 files, 2.4 MB in the repo. Re-run `node scripts/build-image-variants.mjs` after adding or replacing a stock photo. AVIF was tried: only 2-14 % smaller than WebP at matched quality, so it was dropped to avoid doubling the files.
2. **`components/ResponsiveImage.tsx`** (+ pure helper `components/responsive-image.ts`, unit-tested in `tests/redesign/responsive-image.test.ts`). Emits `srcset` (variants plus the original at its natural width), a required `sizes`, explicit `width`/`height`, `decoding="async"`, `loading="lazy"` by default, and `fetchPriority="high"` only when `priority` is set. Any `src` not in the manifest (admin-set URLs, uploads) is rendered exactly as before with no srcset. `primeResponsiveImage()` lets JS preloads request the same variant the `<img>` will use.
3. **Where it is used**: the home hero (`priority`, the one LCP-candidate image; `sizes="100vw"`) and Colombo roots photo in `HomeView.tsx`; the About roots photo, Services photo and image-credits thumbnails in `InfoPages.tsx`.
   Beyond the originally listed files, three more image-markup-only edits were made because they directly carried the measured bytes: `components/Public.tsx` (`PageOpening` photo, the LCP element on `/employers`, `/about` etc.), `components/IndustryDirectory.tsx` (industry list photos) and `components/IndustryExplorer.tsx` (the sticky photo plus its two `new Image()` preloads, which previously downloaded the full-size original in addition to the lazy `<img>`). No behaviour, state or CSS class changed in those files.
4. **Blur reduction** (`components/perf.css`, imported once in `app/layout.tsx`, no edits to `globals.css`). On screens up to 800 px wide or touch-primary devices, the repeated or full-screen `backdrop-filter` blurs (`.moment-glass` on every gallery tile, `.moment-lightbox`, `.industry-index-photo > span`, `.glass-pill`) become more opaque tints with no backdrop sampling, and the sticky header drops from `blur(24px) saturate(135%)` to `blur(8px)`. Under `prefers-reduced-transparency: reduce` every backdrop blur (including `.intro-skip`, CSS only) becomes an opaque surface. The effect on frame rate is **not measured**: Lighthouse does not capture paint or GPU cost. Verify on device.
5. `next.config.ts` was not changed: the `images` config only affects `next/image`, which this site does not use, and the existing `/media/:path*` cache header already covers `/media/r/`.

## Large JSON audit

- `content/client-catalog.json` (47 KB, 10 KB gzip) and `content/intro-atlas.json` (97 KB) are not in any client bundle. `client-catalog`/`client-logos`/`client-scene` are also read by `next.config.ts` at build time only.
- **`content/profile-extracted.json` (43 KB raw, 8.4 KB gzip) plus `client-logos.json` ships to every public page.** The built `app/(public)/layout` client chunk (57 KB) contains the full company profile (strings such as `schemaVersion`, `reportedDeployments`, client names). Cause: `components/ChatWidget.tsx` (client) imports `directAnswer` from `lib/knowledge.ts`, which imports `lib/company-profile.ts`. Not fixed here (ChatWidget is owned by the accessibility work). Recommendation: load `lib/knowledge` with `await import('@/lib/knowledge')` the first time the chat opens/sends, or answer through the existing `/api/chat` route, so the profile leaves the initial JS.
- `content/client-scene.json` (4 KB) is bundled by the `'use client'` `ClientRelationships.tsx`; small, left alone.

## Not done / recommendations

1. **Files I was told not to touch, with the exact payoff:**
   - `components/Motion.tsx` (accessibility owner): `DestinationStory` renders and preloads (`new Image(); image.src = item.image`, line about 170) the full original, so `/media/dubai-night.webp` (337 KB) is downloaded on home and `/destinations`; the two `Journey` photos (`port-team`, `airport`) are also originals. Use `<ResponsiveImage ... sizes="(max-width: 1000px) 100vw, 60vw">` and `primeResponsiveImage(new Image(), item.image, SIZES)`. Expected home saving about 300 KB.
   - `components/MomentsGallery.tsx`: `/moments` still transfers about 1.3 MB of images. `MomentImage` renders `photo.image` (full size) in the two-column grid. Use the 160/640/1440 derivatives the upload pipeline already creates (`Moment.thumbnail` exists) with `srcset`/`sizes` for the grid, keep the full file for the lightbox only, and give every tile stable `width`/`height`/`aspect-ratio`. For stock `/media/*.webp` moments, `ResponsiveImage` works as is. This is the largest remaining image saving.
   - `app/(public)/employers/page.tsx` (industry cards, `<img src={x.image}>`, still two raw originals, about 310 KB) and `app/(public)/clients/page.tsx` line about 44 (`port-team.webp` raw, 1680 px): swap to `ResponsiveImage`. These are page files other work is editing, so they were not touched.
   - `components/Intro.tsx` (excluded by scope decision): the opening's logo is a 165 KB PNG and the first-visit LCP element. A 512 px WebP (~15 KB) would cut first-visit LCP and bytes with no behavioural change; the intro `/intro/*.webp` files are also fetched when the opening is later skipped.
2. Total JS is about 229 KB per route and TBT is 186-475 ms in the throttled lab. Next steps worth measuring: lazy-load `ChatWidget` and the Moments lightbox, check GSAP/ScrollTrigger plugin split, and look at the long tasks in a real trace.
3. `/clients` LCP (4.1 s) is the relationship scene picture (`/clients/scene/*`, ~140 KB); its `<picture>` element is outside this change.
4. Font: no shift observed (CLS ≤ 0.045), but the five font files are discovered late through CSS. A preload for the latin 400/600 Manrope files would help LCP text; not done because the files are content-hashed by the bundler.
5. **Still required:** real Pixel 7 Pro, Galaxy S24 Ultra, iPhone/Safari and a low-end Android run (fresh and repeat, portrait and landscape, throttled mobile, Save-Data, reduced motion, background-tab return), with recorded traces for the blur and GPU questions. Lighthouse here is a regression guard, not evidence of device smoothness.

## Verification

`npm run typecheck` and `npm test` (89 tests, including 4 new responsive-image tests that assert every manifest variant exists on disk and unknown or hostile `src` values get no srcset) pass in the project. The build used for the "after" numbers compiled successfully.
