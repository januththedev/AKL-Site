# Three-second opening — v4, 500 photo crops

The homepage hero remains a still photograph. The opening is an HTML/CSS/GSAP composition, not a video download. Exact final text: **AL-Karrim Lanka**, white on pure black.

## Asset truth and delivery

500 deterministic photographic crops are composed from the 13 credited illustrative originals in `public/media/`. These are not 500 distinct original photos, AKL employees, or confirmed placements. Existing photography credits continue to apply. `content/intro-atlas.json` maps every tile to its original and crop rectangle. Rebuild with `node scripts/build-intro-atlas.mjs`.

The browser downloads only its desktop or mobile WebP atlas. No 500-image request waterfall, canvas frame loop or 500 animated DOM nodes. Five strips and one wall animate using compositor transforms/opacity. Every crop is present in the wall; a viewport's aspect ratio and zoom determine the visible area.

## Timeline from animation start

- 0–160ms: photographic strips enter against black.
- 0–1725ms: alternate strip directions; the photographic wall pulls back from a close-up.
- 1150–1670ms: strips dissolve into the wall of 500 crops.
- 1780–2080ms: wall settles and darkens.
- 2050–2200ms: wipe to pure black.
- 2200–2380ms: exact title rises 8px and appears.
- 2380–3000ms: steady title hold; no flashing, audio or loop.

Playback starts only after atlas decode. The page stays usable during preparation. If decode takes over 1200ms, opening bypasses; this is not a mandatory loading gate. Versioned session marker plays once per tab session; reduced motion, hidden tab, Escape, Tab, touch scroll, wheel, decode failure and route cleanup all bypass/end safely. Watchdog exits at 3100ms if animation completion fails. New v4 marker allows previous visitors to see the new opening once.

## Remaining device verification

Verify first visit and reload, Skip, Escape, reduced motion, slow/dead network, hidden-tab return and route changes on real iOS/Android and desktop browsers. Check final title against black at 2380–3000ms with a frame recording. The 500-crop atlas is a delivery optimization, not 500 independently shot photos.
