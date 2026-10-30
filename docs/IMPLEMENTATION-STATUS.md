# Initial implementation status - 30 October 2026

Branch: `feat/contest-redesign`. Local changes; no GitHub push or production-domain deployment.

## Implemented in source

- Next.js App Router migration, compatible locked React packages and local self-hosted fonts. The previous Vite source/edits are preserved under `legacy-vite/`.
- Public homepage, employer portfolio, company story, services, industry/detail pages, geographic story, process/country pages, contact, image credits and basic policy pages.
- Thirteen local photographic delivery assets, original green/yellow AKL identity and an independent three-second HTML/GSAP intro ending on black with AL-Karrim Lanka. The hero remains a still photograph. Intro derivatives total about 135KB.
- Industry selection, destination selection, scroll-triggered reveals, desktop recruitment-journey pin and reduced-motion/mobile CSS fallbacks.
- Employer portfolio with share/print controls, profile download and two-step inquiry component. When no database is configured, the public page provides a direct email/call fallback instead of pretending to save a brief.
- Neon Auth SDK integration, server-checked two-role membership, invite acceptance, role/suspension operations, recent-sign-in checks and transaction guard for the last active Super Admin.
- Staff workspace source for page drafts, media upload/optimisation, inquiries, source-backed knowledge review, publications/releases/rollback and access/audit management.
- Explicit migration, verified first-owner bootstrap and source-FAQ import commands. Knowledge imports remain drafts.
- Public deterministic FAQ/navigation/contact answers, published-knowledge retrieval, bounded free-model adapter, zero-price verification, database quota/cache and provider-failure fallback.

## Verified during this pass

- Production compilation and TypeScript validation passed.
- 20 meaningful core tests passed: capability denials, last-owner policy, mixed protected-field detection, schema/mass-assignment rules, media/public URL policy, reverse-proxy origin policy, multilingual Unicode preservation, direct answers and unpublished/expired retrieval exclusion.
- Browser: public page render/navigation, production hydration, industry selection and the assistant's real API-backed IntellixHR answer.
- Browser: employer form first-to-second-step interaction; the missing-backend submission path exposed a need for a bounded request and an upfront direct-contact fallback, both added.
- Browser: unconfigured admin area remains closed, shows actual missing connections and provides no default login or fake administrator.
- The managed development preview exhibited a client-startup problem. The optimized production preview was used to verify functioning client controls. This distinction is intentional; development-preview parity remains a follow-up check.

## Still requires configuration or follow-up

- This project has no live Neon database/Auth, media-storage or OpenRouter settings in the workspace. No hosted provider connection, credential validity or live authentication was verified.
- Real database invitation/role-concurrency, inquiry persistence, draft/publication/rollback and storage-upload flows need integration tests in the configured AKL test branch. Pure policy tests do not prove transaction concurrency by themselves.
- Model-backed response quality/latency and the full held-out language evaluation have not run. Current public core answers use source-derived authored responses.
- Real-device/mobile browser QA, performance measurements and full accessibility audit remain. Responsive CSS exists; do not present it as real Android/iOS verification.
- Complete the remaining advanced CMS features from the plan, including a visual focal-point/crop editor, inquiry export/erasure controls, richer per-page previews and a polished native-language editorial workflow.
- The three-second intro is implemented with the specified timing and terminal text; deterministic frame-by-frame visual QA and final choreography refinement remain part of contest polish.
- Company confirmation of current credentials, exact legal name, contact/link freshness, client permissions, privacy/retention text and source-profile publication is required before production release.

## Run and connect

See `docs/SETUP.md`. The source includes no real provider credentials and does not replace the current production site. The companion handoff ZIP is a specification/asset package with repository links, not a copy of this Git checkout.
