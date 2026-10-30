# Three-second HTML intro: executable design specification

This is the authoritative intro brief. The executing model must implement it as DOM/CSS/GSAP animation. **The main hero is a still photograph. No MP4 or generative-video service is required.**

## Required final result

Fast, cinematic photo-panel energy reminiscent of a compressed studio introduction: layered photographic strips, subtle perspective, rapid but readable cuts, a brief compression/wipe and a clean black title card. Use AKL's original identity and the supplied industry photos. The final visible text must be exactly:

**AL-Karrim Lanka**

Use the exact hyphen/case and a single space. No Marvel lettering, studio mark, slogans, salary text, client badges, fake lens flare explosion or additional ending logo. The final background is pure **#000000**. The concluding type is crisp white/off-white, centred, with controlled tracking. No generated lettering.

## Clock and timeline

The normal visible sequence lasts exactly 3000ms, inclusive of the title hold. `contracts/intro-timeline.json` is the machine-readable timing contract. The timing below is measured from sequence activation, not from the start of a network request.

| Time | Picture / transition | Technical intent |
| --- | --- | --- |
| 0-120ms | Ink/black field opens into thin image strips | First frame can render immediately; no spinner |
| 120-520ms | Construction / skill panels | 2-3 clipped photo strips move across a stable root |
| 520-920ms | Chef / welder detail | Short overlap, restrained perspective; no full-screen white flash |
| 920-1320ms | Port team / workshop | Coordinated panel replacement; real images remain intact |
| 1320-1720ms | Colombo / Dubai panels | Brief geographic shift; no implied office/placement evidence |
| 1720-2050ms | Panels compress and exit | One direction, strong easing, no chaotic spin |
| 2050-2200ms | Clean wipe to pure black | Background reaches #000000 before title reveal |
| 2200-2380ms | AL-Karrim Lanka enters | Opacity 0->1 and <=6px vertical settle; live HTML text |
| 2380-3000ms | Black title-card hold | Steady, readable type; no new action or flicker |
| 3000ms | Sequence completes and reveals static hero | Callback once, overlay removed, listeners cleaned |

Do not append another fade/hold after 3000ms. The title card is visible for about 800ms including reveal and 620ms at full opacity. At completion, cut cleanly to the photo-led site. A separate reference renderer may keep the terminal frame for inspection; the integrated site removes the overlay through the completion callback.

## Local photo derivative set

Use photos 01, 02, 07, 09, 08, 05 and 06, at most seven derivatives. A derivative around 480-640px wide is sufficient for rapidly moving strips. Aim for a combined compressed intro-photo budget around 120-200KB, then verify actual quality. Reuse the hero derivative if useful. Do not preload all 13 originals. Avoid simultaneous full-resolution textures or a WebGL dependency.

Create each panel with an image element or CSS background contained by an overflow-hidden wrapper. Animate wrappers primarily with transform/opacity; keep imagery inside stable. Clip-path is permitted for a few fixed simple masks, but do not animate dozens of expensive polygons or giant filters. Use CSS gradients for restrained edge light, not an extra large animated video.

## DOM and CSS contract

Suggested structure: an IntroGate controller owns an IntroScene root. Within it: a decorative black/ink background, a PanelStage with a bounded number of photo panels, a BlackOutro layer and an h1/p text layer containing the exact outro title. The skip button sits outside any aria-hidden decorative subtree.

The intro uses fixed positioning and its own stacking context. It must not transform the entire body/main wrapper, change document height or shift the header. The root uses `contain` where safe and avoids rendering offscreen panels. The final title should be responsive: approximately 36-72px desktop and 28-42px mobile, weight 500-650 and modest letter spacing. Use a system fallback if the custom font is late; never wait on a font to finish the intro.

Keep essential page HTML and the static hero rendering in parallel. Do not attach the intro to application auth, database health, model-provider state or an image-fetching loading screen. It is a presentation enhancement, not a resource loader.

## Eligibility and lifecycle state machine

States: checking, bypassed, playing, completed, disposed. Outcomes: finished, skipped, reduced_motion, repeat_visit, route_ineligible, assets_late, hidden_tab, interaction, error, route_change.

Only a fresh session's eligible homepage entry can play. /employers, /admin, deep links, browser history restores and internal navigation bypass it. Store a versioned session marker such as `akl:intro:v3` after playing or intentional bypass. If storage is unavailable, prefer bypass to an intro that repeatedly reappears. The Replay intro action may exist only in a review/demo control, not as an intrusive public prompt.

Use a small bounded readiness check, at most about 200ms before activation. If required panel assets are not ready, bypass rather than showing empty frames or starting the intro long after the page appears. The visible animation itself is 3000ms, with no additional waiting. Respect `prefers-reduced-motion` immediately and recheck if the preference changes. For data-saving or constrained connection signals, use the still site; do not depend on every browser exposing those APIs.

Use one GSAP timeline with absolute positions. Keep a single idempotent `complete(reason)` function. It kills the timeline, clears the watchdog, releases references, removes listeners and calls the parent once. All competing exits go through it. Use an absolute time watchdog so an error cannot leave a permanent overlay. If the tab becomes hidden, finish rather than forcing the user to watch a paused intro on return.

The integration sketch is in implementation-examples/intro-controller.pseudocode.ts. Adapt to the actual React lifecycle. React Strict Mode may mount/clean up twice in development; cleanup must not accidentally consume the session marker before a real run, invoke state updates after unmount or call the completion callback twice.

## Skip and access behaviour

Show Skip intro from the first active frame. Escape, Tab, scroll intent or route navigation must reveal the site immediately. Do not trap keyboard focus or autoplay audio. If the skip button held focus when removed, restore focus to a sensible visible main/header target. Decorative panel images are hidden from assistive technology; the public page remains semantic.

If the overlay visually covers navigation during its three seconds, the skip control must be immediately usable. Do not let a hidden underlying control receive focus while remaining obscured. Capture initial keyboard navigation to bypass the intro before normal page focus proceeds. Do not leave body overflow disabled after an exception, skip or route change. Prefer avoiding body scroll locking entirely; scroll intent can simply skip.

## Rendering constraints

- No soundtrack or surprise browser audio.
- No high-contrast flashing, strobing or rapid alternating full-screen light/dark frames.
- No fake percentage indicator or simulated network progress.
- No permanent requestAnimationFrame loop after completion.
- No `<video>` in the still hero and no hidden 10MB movie download.
- No heavy 3D engine just for a three-second strip sequence.
- No animation of unsupported script letters in Sinhala/Tamil; the exact intro wordmark stays as specified.

## Review frames and automated assertions

Expose a development-only deterministic seek/progress adapter so QA can inspect around 120, 520, 920, 1320, 1720, 2200, 2380 and 2999ms without fragile real-time screenshot waits. Exclude this control from production public UI. Seeking must not accidentally emit completion or mutate session markers.

Assert: title content exact; black outro background; timeline duration 3.0s; callback at most once; normal finish; immediate skip; reduced-motion bypass; repeat-session bypass; route-change cleanup; hidden-tab bypass; asset-readiness timeout; no unhandled errors or retained overlay; no blocked page after Strict Mode remount; no intro replay on /employers. Test at 390px and 1440px. Inspect the terminal frame and immediately revealed still hero.
