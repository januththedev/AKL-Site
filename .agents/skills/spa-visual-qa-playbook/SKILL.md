---
name: spa-visual-qa-playbook
description: Debug and visually QA Vite+React SPAs that use web components (<model-viewer>), Lenis smooth scroll, magnetic hover buttons, and styled form controls. Use when browser-testing a locally served site, when in-app-browser screenshots fail, when scroll/click automation hangs or times out, when a custom element ignores className or renders unsized, or when polishing 3D model cards. Also use before committing UI changes to this repo.
---

# SPA Visual QA & Web-Component Debugging Playbook

Hard-won patterns from QA-ing the Al Karrim Lanka site (Vite 5 + React 18 + TS + Tailwind,
`@google/model-viewer`, GSAP + Lenis, lucide-react). Apply them to any similar stack.

## Environment basics

- Serve the production build, not dev: `npm run build` then `npm run preview` (http://localhost:4173/).
  On this Windows machine prefix shell commands with
  `cd /d "C:\Users\chath\Downloads\AKL_Website" && set "PATH=%PATH%;C:\Program Files\nodejs"`.
- `npm run build` = `tsc --noEmit && vite build`. Run it after every fix; the bundle hash in
  `dist/assets/index-*.js` must change before re-testing, or you are testing stale output.
- QA both viewports: mobile **393×852** and desktop **1440×900** (`tab.setViewportSize`).
  Sweep every route plus the 404 route and one legacy redirect (e.g. `/about-us` → `/about`).

## React + custom elements: the className trap

**Symptom:** a `<model-viewer>` (or any custom element containing a dash) renders tiny or
unsized inside its aspect-ratio wrapper; DOM shows a dead `classname="..."` attribute.

**Why:** React maps `className` → `class` only for known HTML elements. On custom elements it
renders attributes verbatim, so `className` becomes a useless lowercase `classname` attribute.

**Fix (do both):**
1. Put critical box styling in the inline `style` prop — inline styles always reach custom elements:
   ```tsx
   style={{ display: 'block', width: '100%', height: '100%', /* ...css vars */ } as CSSProperties}
   ```
2. Add an element rule in `globals.css` as defense in depth:
   ```css
   model-viewer { display: block; width: 100%; height: 100%; }
   ```
Never rely on `className` for sizing/positioning a custom element in this repo.

### model-viewer specifics
- The chunk (~300 KB gzip) must stay lazy: dynamic `import('@google/model-viewer')` triggered by
  an `IntersectionObserver` with `rootMargin: '200px'`, plus a labelled accessible fallback on load
  failure. Keep it that way — the build intentionally shows a >500 kB chunk warning for it.
- Frame models with `camera-orbit` ("theta phi radius", radius in %), clamp with
  `min/max-camera-orbit`, disable auto-rotate under `prefers-reduced-motion`.
- Card treatment that already works (copy from `About.tsx` / `StoryBlock.tsx`): aspect-ratio
  wrapper → radial emerald glow div behind the viewer → viewer in a relative full-size div →
  `360°` corner badge → caption row with label + Rotate3D "Drag to explore" hint.
- JSX typing for the element lives in `src/types/model-viewer.d.ts`; add missing attributes
  there (e.g. `loading`) instead of casting in components.

## In-app-browser automation quirks (IAB)

Work through `mcp__node_repl__js` with the browser-use bootstrap. These failures are tooling
quirks, not site bugs — diagnose before "fixing" the site.

- **`browser screenshot activity capture failed for guest`** — transient capture race, frequent
  right after `goto`. Retry once in a fresh cell; if it persists, get the `visibility` capability
  and toggle `set(false)` → `set(true)`, then capture. One of the two always clears it.
- **No `fullPage` screenshots on Lenis sites** — the stitched capture repeats fixed/transformed
  sections (a page looks duplicated). That's a capture artifact, not a rendering bug; verify
  structure with `domSnapshot()` and use scrolled viewport screenshots for visuals.
- **`cua.scroll` (wheel) times out** — Lenis owns the wheel and the wheel-wait never settles.
  Use keyboard instead: `cua.keypress({ keys: ["PageDown"] | ["PageUp"] | ["End"] })`.
  If keys do nothing, something stole focus (e.g. a loaded model-viewer): click a neutral empty
  spot with `cua.click({x,y})` first, then page again.
- **Magnetic-wrapped buttons never clickable** — Playwright's actionability wait requires a
  stable bounding box, but the Magnetic component moves the button as the cursor approaches, so
  `locator.click()` (even `force: true`) times out. Click by coordinates from a fresh screenshot
  (`cua.click`), or click the inner text span via `getByText`.
- **Styled toggle pills (visually-hidden radio/checkbox inputs)** — `check()` times out because
  the native input isn't visible. Click the visible label text: `getByText("Job seeker", { exact: true })`.
- **Form testing without side effects:** submit with required fields empty to confirm native
  validation blocks navigation (URL unchanged); fill fields to confirm inputs accept text; do NOT
  submit a valid form that hands off via `mailto:` — it would open a mail composer.
- **Popup/tab checks after link clicks:** observe with `Promise.all([browser.tabs.list(), browser.user.openTabs()])`
  in the same cell and match by URL/title.

## QA checklist per route (all must pass before commit)

1. Top-of-page screenshot at both viewports — layout, typography, no overflow.
2. `domSnapshot()` — every expected section/heading present exactly once.
3. Interactive components exercised: mobile menu open/close, desktop nav dropdown hover,
   form validation + fill, back-to-top, external links have correct `href`.
4. Both GLB models render (home story card, About sidebar) and auto-rotate.
5. Legacy redirects and 404 page behave.
6. `npm run build` green, then commit.
