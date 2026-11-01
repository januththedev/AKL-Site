# AKL — next improvements plan

Baseline: imported GitHub main `553c7a3`. This plan follows the review and the user's November 1, 2026 scope decision. The goal is an expressive, fast recruitment site that can withstand an awards review and remain practical for staff.

## Scope decisions

Implemented in this change:
- Preserve a verified upload as ready even if deleting its staging object fails.
- Use published intro-selected Moments photos when there are only one or two selections. Stock is a fallback for zero selections; the six-frame limit remains.

Explicitly unchanged at the user's request:
- Portfolio sharing, portfolio pages and their existing behaviour.
- Review finding 4: photo frames hidden by a slow decode can remain hidden on replay. Do not change decode/display-reset behaviour as part of this plan's execution without new user direction.

No redesign, provider migration, production database change, bulk content publication or live staff invitation is part of this maintenance change. Later steps below are proposed work, not completed features or measured results.

## Order of work

| Priority | Work package | Why this comes next | Completion evidence |
|---|---|---|---|
| P0 | Verify the real staff-to-public photo workflow | The gallery/intro depends on Auth, Postgres and object storage | A real staging upload, draft, preview, release and rollback succeed under both roles |
| P0 | Measure phone performance | Awards-style motion must work on the devices visitors use | Reproducible recordings, performance traces and published budget results |
| P1 | Navigation and gallery accessibility | Visual polish must retain keyboard and assistive-technology access | Keyboard and screen-reader acceptance checklist with recorded failures resolved |
| P1 | Photo delivery and storage lifecycle | Fast galleries need bounded downloads and predictable cleanup | Responsive-image network comparison; staging retention verified on storage |
| P1 | Editorial workflow polish | Staff need clear save/publish status and safe conflict handling | Two-staff editing scenario preserves both users' work through explicit conflict recovery |
| P2 | Motion and composition refinement | Choreography should connect the company story, rather than add effects indiscriminately | Reviewed desktop/mobile sequence with reduced-motion counterpart |
| P2 | Content, search and launch evidence | A beautiful site needs accurate copy and observable failures | Content sign-off, metadata checks and operational verification report |

## 1. Verify the staff-to-public photo workflow

### Implementation sequence
1. Inspect only configuration presence and service state; keep database URLs, signing secrets and provider keys out of logs, screenshots and Git. Use the AKL project environment, not credentials from another project.
2. Run existing migrations against a dedicated test branch/database before any production migration. Confirm the portfolio migration is already applied without modifying portfolio functionality.
3. Use existing invite and membership rules. Admin and Super Admin may manage routine editorial content; only Super Admin may grant staff access and perform elevated tasks.
4. Exercise upload authorisation, browser PUT, server verification, three image derivatives, Moments assignment, draft save, preview and publication. Verify that public gallery and intro only read the active release.
5. Test slow storage, invalid image bytes, interrupted browser PUT, derivative-write failure, failed staging deletion and expired upload signatures. A verified, committed upload must remain ready after cleanup failure.
6. Run two concurrent draft edits and deliberately submit a stale version. Preserve inputs, show a clear conflict, and offer reload/review rather than silently overwriting the newer version.
7. Test rollback, then publish again. Verify that restoring content resets the draft and does not change roles, inquiries or provider secrets.

### Acceptance
- An Admin cannot add staff, approve protected knowledge or change official settings.
- A suspended staff member is rejected on the next protected request.
- Unpublished photos cannot appear in public release content.
- Zero selected Moments uses stock; one and two selections use those selections; six is the rendered maximum.
- Failed image processing returns failure; failed staging cleanup after successful processing returns success.
- Record provider versions and actual test results. Do not replace integration tests with screenshots of a configured dashboard.

## 2. Measure phone performance before adding heavier effects

### Target devices and conditions
Use the user's Pixel 7 Pro and Galaxy S24 Ultra where available, plus an iPhone/Safari device and a lower-end Android phone. Test fresh and repeat visits, portrait/landscape, Wi-Fi and throttled mobile connections, Save-Data, background-tab return and reduced motion.

### Measurement and proposed budgets
These are targets to validate, not current scores:
- LCP at or below 2.5s, CLS at or below 0.1 and INP at or below 200ms under a documented representative condition.
- No layout shift when fonts, header, gallery images or the intro settle.
- No persistent animation while the map is off-screen or the document is hidden.
- Prefer a stable frame rate over extra blur or tilt. Record long tasks and GPU-sensitive sequences on real devices, not only Lighthouse desktop.
- Record intro payload, gallery payload and main-route JavaScript separately. Compare cold/repeat runs; preserve before/after traces for each optimisation.

### Changes to consider after measurement
Reduce overlapping backdrop blurs on small screens; bound parallax transforms; reserve image geometry; keep full-resolution viewer photos out of the initial download; avoid eager requests for off-screen gallery content. Do not introduce a canvas/WebGL layer unless the measured experience justifies its payload, fallback and GPU cost.

## 3. Navigation and gallery accessibility

Review the glass navigation over both bright and dark photographs. Check readable contrast, visible focus, touch target size, mobile menu focus return, anchor offsets under the sticky bar, zoom to 200%, and long labels.

For the gallery, verify meaningful alt text, captions and credits; dialog announcements; focus containment and return; keyboard browsing; touch-friendly previous/next controls; and image-loading errors with a useful exit. Ensure the main page cannot be accidentally scrolled behind a viewer.

Inspect the v6 intro's accessibility-tree exposure and decorative content semantics without changing the specifically excluded replay/decode issue. Preserve Escape/Tab, skip and reduced-motion exits. Any later accessibility fixes should have their own small, reviewable change.

For Talent Routes, test destination selection with keyboard, pointer and touch; verify that the selected photograph and text agree with the active map pin. Check unmapped destination labels, crowded nearby pins and fallback behaviour when lazy animation imports fail. Geography is illustrative; do not imply live jobs or deployment counts.

## 4. Photo delivery and storage lifecycle

Plan a thumbnail backfill for existing assets that lack the new 160px derivative. Make it resumable, idempotent and limited to this project's assets. Review a dry-run list before writing large batches. Keep existing immutable URLs valid.

Generate responsive public-gallery variants and use measured `srcset`/`sizes` rules for the two-column layout. Full-resolution viewer files should load on demand, with a small preview and stable dimensions. Test actual network requests on mobile; an image's HTML width alone does not reduce download size.

Use a storage lifecycle rule for abandoned `staging/` objects, with a retention window comfortably longer than upload signature validity and the maximum processing/retry period. Inspect the bucket configuration first; never apply an expiry rule to `originals/` or public `media/` prefixes. Cleanup should be observable without logging personal data or signed URLs. This plan does not claim that a lifecycle rule is currently installed.

Keep an asset-to-release reference model before implementing permanent image deletion. A draft removal must not delete a photo still referenced by an older release or another page. Prefer reversible archive/unpublish operations.

## 5. Editorial workflow polish

Add an unsaved-changes indicator and a concise summary of what will be published. Keep publication an explicit staff action. Show which Moments are selected for the intro, their order and the six-frame limit actually used by v6.

Add a preview of the public gallery using the current draft, alongside the existing homepage preview. A preview must remain authenticated and noindex, with no public cache of draft data. Staff should see the exact same gallery component used by visitors.

Validate photo captions, dates, credits and permission confirmation at save time. Present server field errors next to the relevant fields. Add clear progress for upload/verification/ready states, preserving the selected file and text when a recoverable request fails.

Make conflicts actionable: distinguish expired session, permission denied, stale draft, unconfigured storage and network timeout. Never display a success receipt unless the database confirms the action. Leave all portfolio controls and share URLs untouched.

## 6. Refine the visual sequence

Keep the official AKL logo, full company name, photo-led hero and restrained emerald/ivory/mint palette. Give each section a clear role: introduction, capability, origin, process, destinations, lived moments and employer conversation.

Create one choreography specification for entry, settle and scroll behaviour. Use shared durations/easing and cancel/revert animation contexts on route changes. The most experimental moment can remain the globe reveal; adjacent sections should provide breathing room.

Possible small experiments to prototype and compare:
- A photo-led section transition between company roots and Moments, with an equally coherent reduced-motion version.
- A clearer active-destination transition that changes map, caption and photo together.
- More intentional gallery crops and varied spacing using real company photography.
- Glass surfaces only where a layer relationship or interaction benefits from them; avoid stacking blur across every card.

Pick experiments from recorded prototypes, not assumptions about awards scores. Keep a before/after comparison and remove experiments that impair reading, navigation or phone responsiveness. No change to the excluded replay behaviour is authorised by this roadmap.

## 7. Content, search and operational readiness

Audit current brand wording, contacts, destinations and source-backed claims. Historical PDFs retain their original wording/date. Verify current licence/certification claims before publication; no fabricated clients, vacancy availability, deployment statistics or live counters.

Keep 1980 fixed. Current copyright and calendar-year experience values use Asia/Colombo; test rollover. Confirm page titles, descriptions, canonical host, sitemap and structured data against public content. Respect existing private-page indexing rules without changing portfolio behaviour in this work package.

Add operational checks for unavailable database, auth, media and free-model provider. Monitor redacted error rates and failed uploads. Authored company answers must still work when generation is unavailable; do not claim a quality improvement without running the held-out evaluation set.

## Definition of done for each later change

- One bounded objective and reviewed diff.
- Tests for material failure modes, not merely duplicated implementation.
- Build/type checks and browser verification appropriate to the change.
- Desktop and phone evidence for visual/performance changes; state any untested environment.
- Check for accidental credentials and personal test records before Git publication.
- Verify the exact Git commit and deployment result. Do not call a queued build live.
- Update this plan with measured results, remaining issues and the next concrete task.
