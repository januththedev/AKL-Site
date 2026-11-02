# Client relationships and story motion: implementation record

Implemented 2 November 2026 for AL Karrim Lanka Consultants PVT LTD. Latest owner correction: the relationship sequence must autoplay as code, use less data, and replace the separate selected-relationships block. The photo-based v6 opening is restored exactly from the version before the client-logo change (parent of 3fee7b0). Its Moments image input is restored too.

## The coded animation

There is no video element, MP4, autoplay audio, new 3D library or Play gate. The six-second camera, two pull-backs, whole-wall softening, black resolve and sharp foreground typography use the browser Web Animations API. Four transparent WebP artwork layers per layout preserve the actual company marks. The page animates four layers, not76 independent cards. Responsive artwork loading ignores obsolete decode requests; switching portrait/landscape preserves the current animation time, and the end frame remains settled when the screen rotates.

The complete artwork download is228,944 bytes on desktop and138,902 bytes on mobile. This is about 83% and 80% smaller than the superseded MP4 files. The active layout is selected with native picture/source media queries, so mobile does not also download the desktop layers. No logo is generated, redrawn or recoloured. Fonts and final text remain real HTML, which stays crisp during movement.

The artwork layers are core companies, Lödige, the first surrounding ring and the wider wall. Lödige resolves first outside the opening companies. The shared camera retains company positions while revealing the wider group. A single composited wall receives the blur/darkening, and the final text is held inside the section.

## Placement and playback

| Surface | Behaviour |
| --- | --- |
| `/clients#relationships` | Autoplays once after 35% of the scene is visible and its four small artwork layers decode. It replaces the separate selected-relationships/logo-grid section. The directory remains a simple native disclosure. |
| `/employers` | The same coded scene autoplays in the client-proof position. Portfolio tools, private portfolio routes and the workforce inquiry remain intact. |
| Homepage client section | The existing client-story heading now leads directly into the same autoplaying animation. No separate logo grid or video teaser. |
| Mobile | Native portrait artwork, the same automatic sequence and no playback tap. |
| Reduced motion or unsupported animation API | Readable static company wall and the persistent business caption. |
| Offscreen or hidden tab | The animations pause and resume at the same point when visible again. |
| End | Full AKL name holds over black. One persistent control offers Pause, Resume and Replay without moving keyboard focus or scroll. The camera frame uses non-scrolling overflow clipping so focus cannot silently pan the zoomed artwork inside its border. A manual pause is retained when scrolling away or returning to the tab. |
| No JavaScript or failed image decode | The unanimated wall, HTML caption and directory link remain useful. No blank media player. |

The scene uses lazy, self-hosted images, requests no video and adds no network dependency for motion itself. One page event prevents two relationship scenes from running simultaneously. It has no shared session key with the original intro and never gates navigation or locks scrolling. Automatic playback is scoped to this content animation; the intro's existing behaviour is preserved.

## Verified artwork and the requested order

There are **76 distinct verified company marks**: the original 8 plus 34 in set A and34 in set B. `content/client-catalog.json` is the combined ordered catalogue. `content/client-scene.json` records every rendered ID, source-layer hashes, dimensions, layout camera origins, actual bytes and readiness. All68 new individual marks remain below 150 KB. There are no repeated cards to manufacture a count.

The delivered opening order is SAPTCO, PTC and Riyadh Cables; Lödige is the first wider mark revealed. The fourth priority company **SAPCO is still unidentified**. It is not silently replaced by SATCO. SATCO is a separate company elsewhere in the wall. This cut uses a deliberate three-mark opening rather than a fictitious fourth logo or public missing-logo placeholder.

The exact100-company / first-four composition remains **asset-gated**. It needs SAPCO plus 23 further distinct verified marks, or equivalent verified owner-supplied artwork. The 178 printed names in the profile remain in the company directory. Public wording describes documented company relationships; it does not claim current contracts, live vacancies or third-party endorsement.

See `CLIENT-LOGOS-A.md` and `CLIENT-LOGOS-B.md` for official sources, entity matching, parent/group marks, rebrands and every ambiguous or failed-source omission. White marks use dark plates, and original proportions are retained.

## Regeneration

From the repository root:

```sh
node scripts/build-client-scene.mjs
npm test
npm run typecheck
npm run build
```

Only the existing Node/Sharp dependencies are required for artwork preparation. There is no Python or FFmpeg dependency. Production receives static layers and animation code; it does not composite source logos on request.

The three source manifests merge without duplicate IDs/identities, sort by the five priority IDs then company name, and cap the scene at 100 genuine marks. SVG/raster inputs are decoded through Sharp. The builder composes the core, Lödige, inner ring and outer-wall layers for separate landscape and portrait layouts. Every regenerated file is versioned from its artwork/content hash, so stale cached layers do not mix with new geometry.

For each new company, provide the stable ID, display name, exact profile name, self-hosted artwork path, actual official source/asset URL or explicit owner provenance, profile page, dimensions, light/dark surface and entity/relationship note. Check aliases and shared marks before increasing the count. Add SAPCO only after confirmation. Rebuild; do not hand-edit the displayed count or reuse an unrelated mark.

## Small story animations

- The restored photo intro keeps its original globe, Moments photographs, official mark, company name/year, timing, v6 session key and hero handoff. The new client layers never feed into it.
- Section headings enter by 8px over 0.45s with quiet semantic accent emphasis. Text is not split into duplicated characters.
- The active navigation trace remains; its glass becomes denser after scrolling. CTA arrows respond to pointer and keyboard focus.
- Industry numbers stay fixed. Mouse selection has 180ms intent; click/focus is immediate. Incoming photos decode before their crossfade.
- The process uses a reading-position rail/dot and protected two-photo fade in normal flow, replacing the old 1000px pinned hold.
- The existing Colombo route/map story and coordinated destination copy remain intact.
- History connects August 1980 to the live calendar year.
- Moments use smaller crop movement, caption entrance and a short full-photo viewer fade. Published admin content/permissions still drive the gallery.
- Motion preference changes clean up GSAP contexts and restore static readable content.

## Automatic dates

Copyright uses the current calendar year in `Asia/Colombo`. Experience counts completed years since the known founding month, August 1980:46 during January–July2027,47 from August 2027. The profile gives a month rather than a day, so August1 is the month-precision rollover boundary.

Live values preserve the server seed during hydration, refresh at the next boundary with a daily timer cap, and refresh when a tab becomes visible. Historical profile dates, fixed1980 founding copy and the125,000+ deployments reported in2025 do not auto-increment.

## External AI access and repository privacy

Application crawler preferences, the policy and uncached 403 responses remain in place. The connected Vercel project `akl_site` has an **active** managed `ai_bots` rule with `action:deny`, confirmed by reading the active configuration after updating it. It was previously unconfigured. No blanket visitor challenge or marketing-site login wall was added. The API exposes an aggregate AI Bots setting; separate category overrides were not independently read back.

This restricts recognised AI requests to that project, including static files at the platform layer. It cannot compel an external model to refuse screenshots, copied text or already-downloaded content. Ordinary browser access is not intentionally blocked.

GitHub repository visibility is still public. The GitHub connector can read/publish source but cannot mutate visibility, and the browser settings page requires sign-in. Repository privacy remains an account gate. Existing downloads/forks cannot be recalled; the deployment integration's repository access must be retained when visibility changes.

No hosting domain or project pause state was changed. Source publication and a ready build do not prove a paused production project is publicly serving the new version.

## Verification

Tests cover Sri Lankan year/anniversary boundaries, restored photo-intro bytes, unique genuine artwork/provenance, layer hashes, camera geometry and actual catalogue count/order. Existing admin, portfolio, media and profile checks remain in the suite. Final production preview checks cover automatic playback, offscreen pause/resume, final hold/replay and the simplified client page. Actual mobile-device, signed-in database/admin and paused-production checks are not claimed.
