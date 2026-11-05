# Accessibility report (plan section 3)

Scope: navigation, mobile menu, Moments viewer, Talent Routes, industry explorer, employer form, chat widget, and the eleven public routes plus `/admin/sign-in`. Tested against a production build served from a scratch copy of this worktree, with the opening skipped (`sessionStorage['akl:intro:v6']='seen'`). Tools: axe-core 4.x through puppeteer-core in Chrome (headless), 1440x900 and 390x844 (touch). Not changed, per the plan's exclusions: portfolio pages and sharing, the opening's replay/decode/display-reset behaviour.

## axe-core violations (serious+critical in brackets)

Before: 221 nodes, 211 serious. After: 1 node (serious), a test artifact explained below.

| Viewport | Route | Before | After |
|---|---|---|---|
| desktop | / | color-contrast 21, label-content-name-mismatch 6 | 0 |
| desktop | /employers | contrast 10, label-in-name 2 | 0 |
| desktop | /about | contrast 4, label-in-name 2 | 0 |
| desktop | /services | contrast 4, heading-order 1, label-in-name 2 | 0 |
| desktop | /industries | contrast 8, label-in-name 9 | 0 |
| desktop | /destinations | heading-order 1, label-in-name 8 | 0 |
| desktop | /moments | label-in-name 8 | 0 |
| desktop | /clients | contrast 13, label-in-name 2 | 0 |
| desktop | /contact | label-in-name 2 | 0 |
| desktop | /recruitment | contrast 3, heading-order 1, label-in-name 2 | 0 |
| desktop | /admin/sign-in | landmark-one-main 1, region 1 | 0 |
| mobile | / | contrast 25, label-in-name 6 | contrast 1 (see note) |
| mobile | /employers, /about, /services, /industries, /clients, /contact, /recruitment, /moments, /destinations, /admin/sign-in | same classes of issue as desktop (contrast 3-13, label-in-name 2-9, heading-order 1, landmarks 1) | 0 |

Additional states checked after the change (not run before): chat dialog open (desktop, mobile), Moments viewer open (desktop, mobile), mobile menu open. All 0 violations.

Note on the one remaining node: `.side-note[data-reveal]` on the mobile home page is read by axe mid-way through its scroll-reveal fade (opacity 0.65, then 1). In the scripted run the fast programmatic scroll does not fire the reveal trigger. Scrolling to it normally settles at opacity 1 with colour #46594d (about 7:1). Not a real failure, but listed for honesty. Before numbers were taken without the scroll-through step, after numbers with it.

## Keyboard and behaviour checklist (scripted in Chrome, desktop and 390px mobile)

| Check | Result |
|---|---|
| Skip link is the first Tab stop, becomes visible, moves focus to `<main>` | Pass |
| Visible focus ring on header links (2px, >= 3:1 on both ivory and ink) | Pass |
| Mobile menu: opens, `aria-expanded`, Tab and Shift+Tab trapped, Escape closes and returns focus to the toggle, closes after navigating | Pass |
| Menu toggle and menu links >= 44px | Pass (toggle was 36px) |
| Moments viewer: `role=dialog`, `aria-modal`, labelled by the photo title, focus moves to Close, Tab trapped | Pass |
| Moments viewer: ArrowLeft/Right wrap, new Previous/Next buttons, position status announced politely, controls >= 44px | Pass |
| Moments viewer: body scroll lock while open and restored on close | Pass |
| Moments viewer: image load error shows a message (role=alert) and Close/Next still work | Pass |
| Moments viewer: Escape closes, focus returns to the photo button for the frame last viewed | Pass |
| Talent Routes: arrows move the pin, `aria-pressed`, live region, copy heading and photo alt agree on every step; single roving tab stop | Pass |
| Destination list buttons select the same destination as the map | Pass |
| Industry explorer: roving tabs, ArrowDown moves focus and selection | Pass |
| Employer form: every control labelled; empty Next focuses the first invalid field; Next moves focus to step 2, Back returns to step 1; a failed submit shows an `role=alert` error and keeps the form | Pass |
| Chat: dialog semantics, focus to input, Tab trapped, Escape closes and returns focus to launcher, controls and launcher >= 44px | Pass |
| Anchors (`/industries#sector-engineering`) land below the sticky header, desktop and mobile | Pass |
| No horizontal scroll at 720px wide (200% zoom of 1440) and 320px (400% reflow) on the ten public routes | Pass (20 of 20) |
| Touch targets >= 44px for chrome, menu, chat, viewer, footer, home industry tabs, hero scroll hint | Pass; see remaining items |
| Glass header contrast over bright photos | By calculation: the bar is 80% ink, so the worst case (pure white behind) gives about 8.5:1 for ivory text. Not sampled over real photographs. |

## What changed

- `lib/a11y.ts` (new): DOM-free `wrapIndex`, `browseTarget`, `trapTabTarget`, plus `handleTrapKey`. Tests in `tests/redesign/a11y.test.ts`.
- `components/a11y.css` (new, imported once in `app/layout.tsx`): focus ring colour, contrast fixes for about 25 muted-text rules on light sections, 44px targets, viewer controls and error state.
- `components/SiteChrome.tsx`: brand link name now contains its visible text (decorative logo alt), mobile menu is a labelled `<nav>`, uses the shared trap, number badges hidden from AT, `aria-current` on menu links.
- `components/MomentsGallery.tsx`: dialog labelled and described; trap and arrow handling no longer re-run on every frame (previously focus and scroll lock were reset on each arrow press); Previous/Next buttons and position status; image error state; focus returns to the last viewed frame; open buttons named "View frame: title".
- `components/ChatWidget.tsx`: shared trap, launcher name includes its visible text, scrollable conversation is focusable and named.
- `components/EmployerForm.tsx`: focus management between steps and on success, `aria-current` on the stepper, `country-name` autocomplete, busy submit uses `aria-disabled` so focus is not lost.
- `components/TalentRoutes.tsx`: pin names include their visible number, name, region and cluster count; real spaces in the visible label.
- `components/Motion.tsx`, `components/InfoPages.tsx`: heading levels fixed with `aria-level` (no skipped h1 to h3), one inline low-contrast colour darkened.
- `components/IndustryDirectory.tsx`: photo link name includes its visible "01 / OUR EXPERTISE" text.
- `app/admin/page.tsx`, `app/admin/sign-in/page.tsx`, `app/error.tsx`, `app/not-found.tsx`, `app/invite/[token]/page.tsx`: the `setup-page` wrapper is now `<main>` (missing landmark).

## What remains

- Real assistive technology (VoiceOver on iOS, TalkBack on Android, NVDA/JAWS) was not used. Everything above is automated or scripted keyboard testing.
- Inline text links in running copy (employer email/phone lines, "Share portfolio", "Print overview") are 17px tall. They meet WCAG 2.2 AA target size (24px or spacing) but not the 44px goal. Portfolio controls are out of scope.
- The opening's accessibility tree was not audited or changed in this pass (it is covered by `sessionStorage` skipping in the scripted runs).
- Inactive journey steps now sit at opacity 0.82 instead of 0.45 to keep text contrast; the active step is still distinguished by its border and index colour.
- Moments viewer scroll lock is `overflow:hidden` on body; iOS Safari rubber-banding behind the viewer was not tested on a device.
- Talent Routes SVG labels remain 7.5 to 9px (they are duplicates of the pin names; the list below the map carries full-size text).
- axe cannot assess text over photographs; those were judged by calculation, not measurement.
