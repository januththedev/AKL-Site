# Photographic motion upgrade

- Opening: 500 precomposited crops; see `INTRO-SPEC.md` for timing, sourcing and bypass behavior.
- Homepage: small desktop-only photo parallax, bounded to 10% extra scale to avoid exposing image edges.
- Site: two-pixel reading progress, active navigation underlines, quieter sector-card zoom and mint CTA elevation.
- Reduced motion: intro and progress hidden; parallax and scroll reveals do not initialize.
- Route cleanup: each GSAP context and match-media registration is reverted before the next route.

Existing Neon/auth/storage setup is still required. No provider credentials are introduced by this visual change.
