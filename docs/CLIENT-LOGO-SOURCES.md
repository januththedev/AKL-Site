# Client logo sources

Verified 1 November 2026. The supplied November 2025 AKL company profile, pages 8-9, is the source for the client relationships. Corporate websites are used to identify or refresh the marks, not to independently assert an ongoing AKL contract, endorsement or recruitment destination.

The curated manifest is `content/client-logos.json`. Its eight assets are stored locally under `public/clients/`, so the intro and client page do not depend on third-party image servers. Combined asset size is approximately 85 KB. No logos were generated or reconstructed.

| Logo | AKL profile page | Identity / asset source | Treatment |
|---|---:|---|---|
| Doosan Corporation | 8 | [Official brand page](https://www.doosan.com/en/intro/brand/), corporate PNG | Keep blue wordmark on light surface and generous clear space. |
| Riyadh Cables Group | 9 | [Official website](https://riyadh-cables.com/), vector header served by its linked [RCG site](https://rcg.pencil.sa/) | This official SVG has white bilingual lettering. Use a dark tile; do not hide the lettering on ivory. |
| SATCO | 9 | [Official website](https://satco.sa/satco/), CSS header JPEG | Source image is 196 × 66; avoid enlarging far beyond its native display size. |
| KDDB | 9 | [Official website](https://ekddb.com/), full-size corporate PNG | Keep original blue/yellow/grey colours. |
| Safari | 9 | [Official website](https://safari.com.sa/), corporate PNG | Contains English and Arabic; fit the complete asset. |
| Global Emirates Services | 8 | [Official website](https://www.gesservice.com/), current GES Services PNG | The current website mark differs from the older red logo in AKL's legacy assets. Preserve it as supplied, on a dark surface for its light lettering. |
| Public Transportation Co. | 9 | [Parent company SAPTCO's official PTC page](https://www.saptco.com.sa/en/ptc), corporate PNG | Verified against the legacy mark. Use a dark surface for the gold lettering; do not substitute SAPTCO's own logo. |
| Al Miladi | 8 | Existing AKL legacy asset `client-4.png`; entity confirmed by [official Al Miladi site](https://almiladi.net/) | Official asset retrieval returned 503. Retain the authentic owner-supplied mark without claiming current logo-version verification. Native 132 × 106, suitable for small montage tiles. |

## Deliberate omissions

- **Oman Ministry of Health:** `legacy-vite/src/assets/clients/client-2.png` is an authentic ministry mark, but the entity is not named in the supplied profile's client list. Omitted from this PDF-grounded set.
- **GCC Services / Gulf Catering:** the legacy `client-5.png` displays GCC Services. The profile lists Gulf Catering Co.; several distinct companies use this name. GCC Services' parent describes its origins in Kuwait, while another Gulf Catering Company operates in Saudi Arabia. The exact entity match is not sufficiently established by the profile. Omitted rather than substituting a similarly named brand.
- **Al Jahami / Al Jalhami:** the legacy `client-8.png` reads AL JALHAMI. The supplied profile appears to list AL JAHAMI TRADING & CONTRACTING EST. The [Al Jalhami official site](https://jalhami.com/) identifies Al-Jalhami Contracting Est.; this may be a spelling variation but is not confirmed. Omitted from the curated set pending company confirmation.
- Other PDF-listed companies remain available to the client directory as text. A missing logo should not hide a company or invite a fabricated monogram.

## Use in the intro and page

Use `object-fit: contain`, stable frames, original colours and clear space. Keep the existing cinematic pacing without making the company marks unreadable with heavy bloom, distortion or aggressive perspective. Repeated intro tiles are a visual montage, not a count of unique clients. A simple logo grid plus the complete text client list is sufficient for the clients page.

Riyadh SVG was parsed and rendered for QA. It has no scripts, event handlers, external image URLs or linked font dependencies. All raster files decode successfully. Some official sources only expose modest-resolution marks; shrinking them into crisp tiles is preferable to artificially enlarging them.
