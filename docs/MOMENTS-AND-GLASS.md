# Moments, brand and cinematic glass upgrade

Official current brand: **AL Karrim Lanka Consultants PVT LTD**. Legacy source documents retain their historical wording. Founding year 1980 remains fixed. Copyright/current year and homepage years of experience calculate using Asia/Colombo, without manual annual edits. The years counter is current calendar year minus 1980, rather than claiming an exact anniversary date.

## Staff workflow

1. Configure Neon Auth/database and object storage as described in SETUP.md. No credentials are bundled; absent services keep staff access closed.
2. Admin or Super Admin uploads in Media library. New uploads produce 160, 640 and 1440px WebP variants after server byte/pixel/type verification.
3. Open Moments gallery. Choose a verified ready upload; add caption, date, location; confirm publication rights and consent; choose inclusion in the opening.
4. Reorder/remove moments or edit captions. Save the draft. Concurrent saves use the existing optimistic version check and reject stale edits.
5. Publish from Publishing. Only published release content reaches /moments, the homepage photo section and the opening. Removing an item from a draft does not delete the original asset.
6. The first eight intro-enabled moments in gallery order supply the opening. Existing uploads without a 160px variant fall back to 640px; reupload for smaller thumbnails.

The public gallery supports up to 100 moments. Date, credit, caption, alt text, allowed image host and explicit publication permission are validated server-side in the strict site schema. Existing releases gain an empty moments array automatically; no database migration is needed. Published snapshots remain immutable and rollback-compatible. Moments are routine editorial content; staff-access operations remain Super Admin only.

## Public experience

Staggered photo layouts, bounded scroll parallax, translucent view-frame panels and an accessible full-screen photo viewer. Escape closes; arrow keys browse; focus returns to the opening button. Reduced motion disables the scroll transforms. With no published company photos, the existing credited stock collection is explicitly labelled illustrative, never passed off as company events.

## Opening v5

Keeps the 3-second timeline and black title hold. Corrected title: AL Karrim Lanka / Consultants PVT LTD. Smooth pullback uses 2.4x scale and 3-degree rotation instead of 7x scale and 9-degree rotation. Strips travel only 36% total rather than 120%; no strobe, audio or flashing cuts. Glass strips, edge shading and understated cinematic labels provide depth.

With published selections: a static 500-tile grid reuses up to eight small photo downloads; five parent strips animate. These are 500 placements, not 500 distinct source photographs. With no selections: the 397KB desktop / 357KB mobile stock atlas remains. Media must decode within 1.2s or the opening bypasses. Public gallery photos load lazily. Skip, Escape/Tab, scrolling, hidden-tab handling, watchdog and reduced-motion exits remain. Footer replay is available on the homepage.

## Verification limits

Automated checks cover rights, dates, safe media, old-release compatibility, intro cap/order and Sri Lankan year rollover. Production build and desktop browser QA must pass before publication. Live staff upload/save/publish integration requires the configured provider environment; do not describe it as verified until exercised with real credentials. Real mobile GPU/frame-rate and assistive-technology audits remain required before awards submission.
