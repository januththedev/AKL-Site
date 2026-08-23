# Content Audit — Al Karrim Lanka Website

All factual content in this rebuild was verified against the live source site
(`https://www.al-karrim.net`) during the rebuild. This document records what was
carried over, what was corrected, and what was intentionally changed.

Single source of truth for facts in code: `src/data/site.ts`.

## Identity

| Field        | Value                                        | Status  |
| ------------ | -------------------------------------------- | ------- |
| Legal name   | Al Karrim Lanka Consultant (Pvt) Ltd.        | Verbatim |
| Trade name   | Al Karrim Lanka                              | Verbatim |
| Tagline      | Right talent, Right time.                    | Verbatim |
| Motto        | Shaping careers, building nations            | Verbatim |
| Established  | August 1980                                  | Verbatim |
| Approvals    | Sri Lankan Government approved · ISO 9001:2008 certified | Verbatim |
| Placements   | 125,000+ (40+ years in the industry)         | Verbatim |

## Contact details

| Field    | Value | Note |
| -------- | ----- | ---- |
| Address  | No 10/1, Duplication Rd, Colombo 05, Sri Lanka | Verbatim |
| Phone    | +94 112 592551 / 2501675 | Display verbatim |
| `tel:`   | `+94112592551` | **Corrected** — original page used a malformed `tel:` URI containing a slash; normalized to a valid RFC `tel:` URI |
| Email    | alkarrim@slt.lk | Verbatim |
| Facebook | `https://web.facebook.com/alkarrim603` | The only real company social profile found on the audited site — no invented socials |

## Vacancies / recruitment portal

- Portal: **IntellixHR** — `https://alk.intellixhr.com/careers` (destination preserved from the audited site).
- **Editorial decision:** no job listings are fabricated on this site. The vacancies page is an
  honest handoff: it explains that live listings, applications and notifications live on the
  external portal, and links to it (new tab). Portal is trilingual (English / සිංහල / தமிழ்).
- A phone + inquiry fallback is offered when the portal is unreachable.

## Page content provenance

| Page | Content source |
| ---- | -------------- |
| Home | Hero tagline, trust bullets, ticker phrases, "Why choose" six pillars, who-we-are copy, stats (40+ years / 125,000+ / global markets / 1980), promise statement, process stages, destinations, clients strip, audience CTAs, values, contact band — all from the audited site |
| About | "A trusted name since 1980" story copy, company history timeline (1980 founding, 1990s expansion, 40+ years), Vision and Mission statements (full verbatim text), "well established … Manpower Consultancy Company" description |
| Services | "Our recruitment solutions" intro copy; three service cards (Talent Match, Team Upskill, Career Flow) with original descriptions |
| Recruitment hub | Four-stage pipeline (Inquiry → Selection → Processing → Deployment) and trust markers (SLBFE-guided, Fully authenticated, Medical & visa handled) |
| Country processes | Six-step pipelines for Saudi Arabia, UAE, Kuwait (SLBFE-guided job orders, authenticated demand documents, medicals, visa handling) |
| Countries | Destination overview, sectors & roles |
| Contact | Contact band copy, address, phone, email, Facebook |

## URL preservation (legacy WordPress deep links)

Mapped in `LEGACY_REDIRECTS` (`src/data/site.ts`) and mirrored in `public/_redirects`:

| Old path | New path |
| -------- | -------- |
| `/about-us` | `/about` |
| `/our-services` | `/services` |
| `/our-process-saudi-arabia` | `/recruitment/saudi-arabia` |
| `/our-process-uae` | `/recruitment/united-arab-emirates` |
| `/our-process-kuwait` | `/recruitment/kuwait` |
| `/contact-us` | `/contact` |

## Intentional changes (non-content)

- Copy is re-typeset for the new design system; no facts were altered.
- SEO titles/descriptions rewritten per page (`useSEO`), referencing verified facts only.
- The original site's malformed `tel:` link was fixed (see above).
- Stock-photo-free rebuild: imagery limited to the company logo, client marks and
  procedurally generated 3D globes (`public/models/*.glb`).
