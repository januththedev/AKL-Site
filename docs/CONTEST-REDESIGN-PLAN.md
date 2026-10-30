# AKL: the next chapter

## Detailed website, employer portfolio, admin and chatbot plan

Version 3.0 | 30 October 2026 | Prepared for Januth / AKL-Site

Planning deliverable. This document specifies the proposed redesign; it does not claim that the new website, video, database, authentication or admin system has been implemented. It supersedes the earlier Supabase proposal and the rejected recruitment-poster/local-vacancy-board direction. Existing application changes are left untouched during this planning pass.

## 1. Project decisions

Build an international recruitment website that feels confident, human and distinctly connected to Sri Lanka. The visual standard is a contest entry; the operational standard is a company website that staff can maintain. Photography, typography and choreography must reinforce the same story: Sri Lankan capability connected with international opportunity.

The decisions are now explicit:

- Preserve the existing green/yellow AKL globe logo. No new logo or AI reinterpretation.
- Use editorial photography and a separate three-second HTML intro and a still photographic hero. Visitors can navigate immediately.
- Make a substantial public **For Employers** page that AKL can send as its digital company portfolio.
- Use **Neon Postgres and Neon Auth**. Authentication is separate from AKL's application permissions.
- Provide exactly two website staff roles: **Super Admin** and **Admin**.
- Only Super Admins manage staff access, role changes, privileged settings and other elevated operations.
- Keep vacancies and applications on **IntellixHR**. No local recruitment-ad feed or duplicate job board.
- Make a fast chatbot useful through reviewed knowledge, retrieval and reliable authored fallbacks.
- Design desktop, mobile, reduced-motion and low-bandwidth experiences together.

Success means memorable presentation, clear employer conversion, trustworthy candidate guidance and an admin system that actually persists changes. Winning a contest is an ambition, not an outcome we can promise.

## 2. Existing material and what it can support

The current repository is React 18, Vite, TypeScript, Tailwind, GSAP/ScrollTrigger and Lenis. It already has reusable components and a recognisable dark-green direction. It does not yet contain the persistent CMS and role system specified here. Retain useful components and motion utilities rather than rebuilding every interaction.

The supplied November 2025 company profile contains 11 raster pages. The production site and profile provide company history and services; client names and small text require manual proofreading before publication.

| Material | Proposed use | Publication rule |
| --- | --- | --- |
| Existing AKL logo and live site icon | Header, footer, PDF, social preview, modest video overlay | Keep the green/yellow mark unchanged |
| Profile pages 3-4 | Founding story and reported historical deployments | Use Since 1980; label historical totals as company-reported |
| Profile page 5 | Four core service pillars and industry scope | Rewrite into clear website copy, retain source references |
| Profile pages 6-7 | Employer benefits, mobilisation and support | Describe supported processes; do not invent guarantees |
| Profile pages 8-9 | Client directory and curated portfolio proof | Proofread and confirm permission/context for featured names/logos |
| Profile page 10 | Chairman's message and portrait | Check name, title, portrait crop and final wording |
| Profile page 11 and production contact page | Address, phone and email | Centralise and verify once before launch |
| New stock photography | Industries, travel and destination atmosphere | Never label it AKL's office, staff or placements |

The profile names labour licence number 603. That identifies the claim in the source; it does not establish current licence validity. Awards, current certification and deployment totals need dated evidence before prominent trust badges. The production site includes legacy certification wording, so copying it verbatim is not sufficient validation.

## 3. Logo recovery and usage

The same green/yellow globe identity has been recovered in two forms:

- `assets/brand/AKL-Official-Logo-200.png`: a 200px delivery derivative of the matching production icon; no recolouring or redrawing.
- `assets/brand/AKL-Official-Logo-512.png`: the live production site icon, with transparency and the same green/yellow identity.

The production header URL also exposes a white-letter variation; omit it from implementation. The two included files match the selected green/yellow identity. The image manifest records their sources. The 512px file remains a soft raster image; a larger pixel count does not make it a vector master.

Use the logo at approximately 48-60 CSS pixels in navigation, with a sufficiently large but quiet clickable area. Preserve its aspect ratio, globe, lettering, yellow fill and green outline. Retain clear space of at least one-quarter of the visible mark height as an initial layout rule. This is a proposed spacing rule, not an official historical brand guideline.

On dark surfaces, check the globe and small establishment text for contrast. If needed, place the intact mark on a small neutral backplate. Do not tint it gold or mint. For any brand layer, use the original file as a separate HTML image; never redraw the mark. The intro ends with the exact text AL-Karrim Lanka, not a generated logo. Avoid enlarging the small raster logo across the entire screen.

## 4. Colour, typography and composition

| Token | Hex | Intended use |
| --- | --- | --- |
| Deep ink | #071916 | Main dark background, strong text on ivory |
| Forest | #0B3D32 | Navigation, secondary sections, depth |
| Warm ivory | #F5F2E9 | Editorial sections, forms, admin workspace |
| Heritage gold | #D9B86C | Route lines, small highlights, selected details |
| Soft mint | #88D8AE | Primary actions against dark surfaces |
| Muted light text | #A7B7AF | Supporting copy on ink |
| Muted dark text | #50665F | Supporting copy on ivory |

These are interface colours. The logo retains its original colours. Gold is an accent, not body text on ivory. Validate actual text/background pairs at WCAG AA before release.

Use Manrope for Latin UI/body text and confident headings; use Instrument Serif sparingly for a contrasting editorial phrase. Self-host only the required font weights. Use suitable Noto Sans Sinhala and Tamil fonts, with script-specific line height and no Latin-style letter-spacing. Translate meaning, not just individual labels.

Use a 12-column desktop grid, a maximum editorial width around 1360px, generous section spacing and 20-24px mobile gutters. Begin display sizes around 72-128px desktop and 40-54px mobile, then adjust against real copy. Body text stays 16-18px. Prefer varied compositions: full-width landscape, asymmetric split, a compact factual band, a typographic section, a narrow list, then another image chapter. Avoid a homepage made entirely of identical cards.

## 5. Photo library and placement map

Thirteen photographs have been downloaded and visually reviewed. The pack includes actual image files, a numbered contact sheet, source pages, photographer names, dimensions and provenance. They are planning candidates; final responsive crops are part of implementation.

| No. | Subject | Main placement | Film use |
| --- | --- | --- | --- |
| 01 | Construction team, wide overhead view | Homepage or employer opener | Intro photo panel |
| 02 | Chef at work | Hospitality industry | Skill close-up |
| 03 | Warehouse professional | Logistics detail | Alternate portrait cut |
| 04 | Workers on a building facade | Construction / engineering | Alternate industry scene |
| 05 | Colombo coast at dusk | Sri Lankan roots / story | Opening origin frame |
| 06 | Dubai after dark | UAE destination | Global-opportunity finale |
| 07 | Welder at work | Manufacturing / skilled trades | Alternate skill close-up |
| 08 | Automotive workshop | Automotive industry | Alternate industrial scene |
| 09 | Port workers discussing plans | Employer capability / logistics | Teamwork frame |
| 10 | Container terminal | Logistics / international scale | Alternate wide frame |
| 11 | Muscat waterfront | Oman destination | Alternate destination finale |
| 12 | Airport walkway | Recruitment journey | Transition to overseas work |
| 13 | Business meeting | Employer process | Illustrative employer context |

The intro uses a focused subset of these photos in local optimised strips. The main hero defaults to photograph 01 with a separate mobile crop. The exact three-second intro sequence is specified separately.

Image handling: record desktop/mobile focal points; export 640/960/1440/1920 widths where useful; provide AVIF/WebP with a fallback; retain width/height to prevent layout shift. Only the actual above-fold poster gets high priority. Lazy-load lower sections. Never ship the whole source pack as page downloads.

All source photos are stock, travel or destination illustrations. In particular, 13 is not an AKL meeting, 12 is not a documented AKL deployment and 04 is not an AKL office. Keep that classification in the CMS. New genuine company photography can replace these later without changing the page design.

## 6. Three-second HTML intro; still-photo hero

The authoritative brief is a 3000ms HTML/CSS/GSAP intro with fast cinematic photo panels, followed by a photographic hero. The hero is a still image. There is no background hero film, eight-second film or ten-second film in this version.

The sequence ends on pure black with the exact visible text **AL-Karrim Lanka**. Its final title hold lasts from 2380ms to 3000ms. The website is rendered while the intro runs; skip, reduced motion, return visits, asset failures and route changes are explicitly handled. Read `04_INTRO_3S_SPEC.md` and `contracts/intro-timeline.json` before coding.

## 7. Intro production handoff

The executing model implements the intro directly with HTML, CSS and the existing GSAP ecosystem. Use local licensed photo derivatives, masked strips, restrained perspective, deliberate fast cuts and a clean black title card. No generative-video service, external film or paid API is needed. The executable contract, precise timeline, lifecycle pseudocode and the complete implementation prompt are included in this kit.

## 8. Public route map

| Route | Job of the page | Primary next action |
| --- | --- | --- |
| / | Brand story, capability, trust and audience choice | For Employers / Find Vacancies |
| /employers | Shareable company portfolio and employer conversion | Discuss recruitment needs |
| /portfolio | Permanent redirect to /employers, preserving tracking query | Same canonical employer page |
| /about | History, leadership, company principles | View employer capability / contact |
| /services | Four substantial recruitment service pillars | Submit employer brief |
| /industries | Photo-led industry overview | View industry / discuss team |
| /industries/[slug] | Roles and recruitment approach for a supported sector | Employer brief prefilled with sector |
| /recruitment | Inquiry, Selection, Processing, Deployment | Contact / vacancies portal |
| /recruitment/[country] | Supported country process information | Ask team / verified external guidance |
| /destinations | Geographic reach and destination chapters | Country information |
| /contact | Address, phone, email, directions and inquiry | Call / directions / send inquiry |
| /vacancies | Server redirect to IntellixHR | External careers portal |
| /privacy, /terms, /image-credits | Clear company policies and source credits | Relevant company action |
| /admin | Authenticated staff workspace | Role-appropriate dashboard |

Use For Employers as a visible top-level navigation item. Make Vacancies a direct external navigation link, not a local intermediate board. Preserve the existing portal at `https://alk.intellixhr.com/careers`. Retain legacy WordPress paths through an explicit redirect table. Verify the external destination during release testing.

## 9. Homepage: sequence and content specification

1. **Opening.** Logo, concise headline, still photographic hero, two clear audience actions. Suggested draft headline: Sri Lankan talent. Global possibility. Supporting text explains recruitment capability, not generic innovation.
2. **Credibility band.** Since 1980, verified source-backed credential details and reported historical experience only after review. No animated counters with invented live totals.
3. **Industry panorama.** A large photograph and a compact sector list that changes the supporting image on hover, focus or tap. No hover-only information. Hospitality, construction, engineering, automotive, IT, manufacturing and logistics are grounded in the profile.
4. **Sri Lankan roots.** Ivory editorial layout with Colombo imagery and the founding story. Text is real HTML, not baked into an image.
5. **Recruitment journey.** Four connected chapters showing Inquiry, Selection, Processing and Deployment. Small detailed explanations answer what happens at each stage.
6. **Global connections.** SVG route narrative from Sri Lanka, with destination images and supported market descriptions. A map is an illustration of reach, not a promise of live openings.
7. **Employer proof.** Curated, reviewed client names or permitted logos, plus a link to the fuller portfolio. No invented testimonials.
8. **Leadership.** Actual chairman portrait if quality permits, a concise reviewed message and a link to About. Do not substitute a stock portrait.
9. **Closing action.** A strong contact composition: discuss a workforce requirement or view vacancies. Finish with useful navigation, contact details, credits and legal links.

The chatbot launcher is quiet and does not compete with the first-screen actions. Avoid overlapping chat, WhatsApp, back-to-top and cookie controls in the same mobile corner.

## 10. For Employers: AKL's digital company portfolio

Canonical URL: `/employers`. Public, readable without an account and suitable for sharing by email or WhatsApp. It should stand on its own for a procurement manager who never visits the homepage.

| Section | Content | Why it matters |
| --- | --- | --- |
| Employer opening | Distinct workforce photograph, clear capability statement, Request a recruitment discussion | Immediately explains the business proposition |
| Company at a glance | Since 1980, Sri Lankan base, reviewed credentials, source-backed historical scale | Establishes identity and experience |
| Workforce coverage | Professional, skilled, semi-skilled and other supported categories | Shows scope without promising available headcount |
| Industry capability | Supported sectors, example role families and relevant photography | Helps companies recognise their requirement |
| Delivery process | Brief, sourcing, screening/trade testing, selection, documentation and mobilisation | Makes engagement concrete |
| Client portfolio | Reviewed directory selection with country/sector tags if verified | Demonstrates experience without implying fresh endorsements |
| Engagement options | Individual specialists and project-team recruitment where supported by profile | Explains how requirements can be discussed |
| Leadership and values | Actual company leadership and reviewed operating principles | Adds accountability |
| Downloads | Approved dated company profile PDF and a print-friendly web view | Supports internal circulation |
| Employer FAQ | Process, sectors, documentation coordination, contact and next steps | Removes avoidable inquiry friction |
| Recruitment brief | Short two-step form and direct contact alternatives | Converts interest into a useful inquiry |

Do not create fake project case studies from a list of client names. A future Case studies section requires a real project description, client permission, dates and reviewed outcomes. Until then, use Capabilities and selected client relationships with appropriate historical context.

The company profile download should be labelled with edition/date. Publish only an approved public copy. Avoid showing unreviewed licence validity or unsupported current certification badges. Prepare a specific social preview image and title for this page. Include Copy portfolio link and native Share where supported, with a clipboard fallback. Tracking parameters may record a campaign/source, but not a recipient's email or private identity in the URL.

The employer page keeps full polish but opens directly; it does not replay a loading film. Provide a clean print stylesheet with readable headings, URL and contact details. The launch target is that a first-time employer can understand the capability in under one minute and complete a straightforward brief in around two minutes; validate with a real trial.

## 11. Employer inquiry workflow

Step one asks company name, country, sector, role families, approximate headcount and an optional desired start period. Step two asks contact name, work email, optional phone, preferred contact method and a short requirements note. Do not require a precise salary budget before the visitor can talk to the company.

Validate in the browser for convenience and on the server for correctness. Apply a honeypot, shared rate limiting and a challenge only if actual abuse warrants it. Store the inquiry before showing success. A notification failure must not lose the record. Use an idempotency key to stop double-clicks creating duplicates. Do not promise a response within a specific number of hours unless AKL agrees to operate that service level.

Admin statuses: New, In review, Contacted, Qualified, Closed, Spam. Staff may add internal notes and assign the responsible staff member; notes never enter public search or chatbot context. Maintain a status history. Super Admins can export or permanently delete inquiries according to the approved retention policy. Ordinary Admins can work with records but cannot bulk-extract the database.

Launch without arbitrary visitor attachments unless there is a real need. If attachments are later enabled, define file limits, private storage, validation and malware handling first. Job applications and candidate CV uploads remain on IntellixHR.

## 12. Motion system and signature interactions

Use GSAP/ScrollTrigger as the primary orchestration layer and CSS for simple button, focus and hover feedback. Keep one scroll owner; retain Lenis only if native-scroll and touch tests show a benefit. Do not add a second animation library for equivalent effects.

| Interaction | Desktop design | Mobile / reduced-motion treatment |
| --- | --- | --- |
| Three-second intro + hero entrance | Photo-panel sequence, image mask, headline lines and gentle navigation appearance | Simple opacity or immediate content |
| Industry explorer | Coordinated image/list transition | Tap selection, visible labels |
| Recruitment journey | One bounded pinned sequence with progress line | Sequential blocks, no scroll trapping |
| Global route story | SVG lines and changing destination photography | Static map and accessible destination list |
| Editorial image | Slight parallax inside its own clipped frame | Still image or minimal entrance |
| Navigation | Thin readable glass/surface treatment; precise open/close | Accessible drawer, focus management, scroll restored |
| Buttons | 140-220ms feedback and visible keyboard focus | Immediate touch feedback; no magnetic cursor behaviour |
| Admin | Small state transitions only | Same functional behaviour |

Start section reveals around 450-700ms with 40-70ms staggers; tune with final content. Animate transform and opacity primarily. Do not apply scroll transforms to the entire page wrapper or the fixed chat/header layer. Avoid permanent large blur effects, scroll-linked layout changes and nested pinning. Disable or simplify decorative animation on weak devices.

Test fast scrolling, route navigation, browser back/forward, refresh midway through a page, image/font loading, orientation changes and keyboard focus. Clean up timelines/listeners on unmount. Pause offscreen and hidden-tab animation. WebGL is optional; it must earn its loading and battery cost with a visible storytelling benefit.

## 13. Admin workspace: screens and responsibilities

The staff workspace uses an ivory canvas, forest navigation and efficient forms. It is an operational tool, so public-site film sequences do not belong here. Use the existing AKL logo at a sensible size, with a clear role label and account menu.

| Screen | Required functions |
| --- | --- |
| /admin | Real publication status, recent edits, inquiries requiring attention, knowledge review queue, service status |
| /admin/pages | Edit bounded page fields, CTA actions, metadata and translations; preview by viewport |
| /admin/media | Upload, replace, crop, focal points, alt text, credits, source type, usage and optimisation status |
| /admin/portfolio | Employer page sections, approved download, selected clients, industry coverage and ordering |
| /admin/company | History, leadership, source profile, contact draft and credential evidence |
| /admin/industries | Industry text, role families, hero image, related services and order |
| /admin/destinations | Destination chapters and reviewed process content |
| /admin/inquiries | Search, assign, notes, statuses and history |
| /admin/knowledge | Facts, FAQs, aliases, sources, locales, validity and review status |
| /admin/chatbot | Test console, evidence view, fallback preview and evaluation results |
| /admin/publishing | Draft differences, validation, preview, release history and rollback |
| /admin/access | Super Admin only: staff, invitations, roles, suspension and access history |
| /admin/settings | Approved public settings; privileged subsections restricted to Super Admin |
| /admin/audit | Full audit history for Super Admin; ordinary Admin sees relevant editorial history |
| /admin/account | Own profile, sign-out and supported self-service session/password actions |

Use constrained content blocks rather than unrestricted HTML or arbitrary JavaScript. Editors can change supported content and layout choices without breaking the design system. Autosave a draft, show when it was saved, and detect concurrent edits. If two people edit the same version, surface a merge/reload choice rather than silently overwriting.

## 14. Permission matrix: exactly two staff roles

These are AKL website roles, not Neon Console organisation roles. Pending invitations, suspended accounts and ordinary public visitors are states or audiences, not additional staff roles.

| Capability | Admin | Super Admin |
| --- | --- | --- |
| Read staff dashboard and published content | Yes | Yes |
| Edit routine copy, page metadata and translations | Yes | Yes |
| Upload/crop images and edit credits | Yes | Yes |
| Edit draft portfolio, industry and destination sections | Yes | Yes |
| Publish routine editorial updates after validation | Yes | Yes |
| Edit knowledge/FAQ drafts and run bot tests | Yes | Yes |
| Approve/publish knowledge, critical numeric facts or credentials | No | Yes |
| Change official contacts, legal identity, main logo or IntellixHR destination | Draft request only | Yes |
| Work on inquiries and internal notes | Yes | Yes |
| Bulk-export inquiries or erase personal records | No | Yes |
| Add/invite staff, resend/revoke invitations | No | Yes |
| Promote/demote, suspend/reactivate or remove staff | No | Yes |
| Terminate another staff member's AKL access | No | Yes |
| Change model allowlist, bot policy, global budgets or integrations | No | Yes |
| Rotate secret references through the deployment/secret system | No | Yes, controlled operation |
| Roll back a published release or perform bulk deletion | No | Yes |
| Review full audit log and security events | No | Yes |
| Change their own privileges or remove the last Super Admin | No | No |

A publish operation checks every changed field, not just the editor's role. Admins cannot slip a privileged contact/model/credential change into an otherwise routine publication. Bulk imports, media replacements and restore operations pass through the same rules.

## 15. Staff management: complete flows

**First Super Admin.** Bootstrap once through a server-side setup procedure tied to a verified owner identity. The script must refuse to create a new first owner if an active Super Admin already exists. Do not ship a default password, public setup URL or role-editable browser seed.

**Add staff.** Super Admin opens Access, enters an email and selects Admin or Super Admin. The interface shows the consequences of the selected role. A server-side authorization check creates a time-limited, single-use invitation; store a hash of the token, not its raw value. The intended expiry is 48 hours and remains configurable by the deployment operator. No invitation is sent as part of this planning work.

**Accept invitation.** The recipient authenticates through Neon Auth and verifies the exact invited email. Acceptance checks token, expiry, state and intended email in a transaction, then links the immutable auth user ID to the membership. The role comes from the stored invitation, never from a client-supplied field. Public sign-up, if reachable at the auth layer, grants no staff membership by itself.

**Promote/demote.** Require a recent valid sign-in for elevated actions. Display current/new role and record who changed it. Lock the relevant membership/guard state inside a database transaction so simultaneous demotions cannot remove every Super Admin. Re-check the actor's current membership at commit. The last active Super Admin cannot be removed, suspended or demoted.

**Suspend/remove.** Membership suspension immediately blocks subsequent AKL API requests, previews and upload authorisations even if an upstream login cookie still exists. Increment a membership access version to invalidate application-scoped authorisations. Keep historical edits linked to the original actor. Prefer deactivating staff membership over deleting identity records that are needed for audit history.

**Session actions.** Support self-service sign-out using Neon APIs. For another user, Super Admin can immediately terminate AKL application access through the membership/access-version gate. Revoke upstream sessions only through a supported privileged provider path with verified authority; do not give ordinary staff provider-wide administrator powers to make this convenient. Keep privileged signed upload/preview tokens very short-lived and check current membership where possible.

**Recovery.** Keep at least two verified Super Admins when operationally possible. Document an out-of-band recovery procedure using controlled infrastructure access. The recovery procedure is not a third website role and must not become a publicly accessible backdoor.

## 16. Neon Auth and authorization boundaries

Use the current Neon-managed authentication service and its Next.js SDK for sign-in/session handling. Current official docs expose Next.js server methods and managed Admin plugin APIs; supported capabilities must still be checked in the actual project configuration before implementation. Do not copy instructions for the legacy Stack Auth implementation into a new integration.

Recommended design: keep staff as ordinary upstream authentication users and put AKL's two roles in an application-owned `admin_memberships` table keyed by the verified auth user ID. This prevents a normal AKL Admin from gaining powerful native user-management APIs. The app does not need to equate its friendly Admin label with Neon's privileged auth `admin` role.

Every protected request verifies authentication and then reads an active membership/permission state from the server-controlled database. Middleware improves route handling but is not the only authorization layer. Protect handlers, server actions, draft previews, media authorisations, downloads and bulk endpoints independently. Never trust a role from localStorage, a form field or a client-editable user profile.

Use HTTPS, managed secure cookies, trusted-origin checks and the framework/provider CSRF protections. Avoid caching protected responses publicly. Do not rely solely on a cached role claim for revocation. Ensure direct calls to managed user-admin APIs are denied for ordinary staff; this requires a specific negative test.

Neon's documented supported-plugin list is not a guarantee that every Better Auth plugin is available. MFA enforcement is a launch decision that must be validated against the selected Neon capability; do not display an MFA-enabled badge without a working second-factor flow. Recent authentication and strict membership checks are required regardless.

Production and previews use separate configuration and least-privilege data access. Database branching can include auth data; use sanitised demo identities/content for public contest previews. Do not expose real sessions, inquiry contacts or live production credentials in a demonstration branch.

## 17. Content, media and publishing workflow

Content states are Draft, In review, Published, Archived. Page/knowledge/source versions are immutable once released. Staff edit drafts and preview a complete proposed release. The preview is authenticated or short-lived and marked noindex; private inquiries and staff records never appear there.

Routine editorial release: validate required fields, safe links, media readiness, translations and permissions; show a human-readable diff; create an immutable release manifest; activate it transactionally; revalidate affected public routes and caches; verify public content/version; report success only when the release state is known. A failed background revalidation needs a visible status, not a false success toast.

Knowledge releases add source/reviewer/validity checks. Critical contact details, portal URLs and credentials require Super Admin approval. Website and chatbot should use a consistent released fact set. Cache keys include knowledge/release version and locale, so an old phone number does not survive a publication.

Media records include source type, photographer, source URL, licence, alt text, natural dimensions, file hash, desktop/mobile focal points and variants. Uploads initially create private staging objects; publish approved variants after validation. Do not accept executable SVG/HTML from an ordinary upload path. References prevent deleting an image still used by a live or retained release.

Rollback selects a previous approved release and creates an auditable restoration event. It must not roll back staff access, overwrite current inquiries or restore obsolete secrets. Super Admin reviews any legal/contact/knowledge material that has since become invalid before activation.

## 18. Chatbot: AKL Guide

The assistant handles company capabilities, employer engagement, process explanations and navigation. It directs candidates to IntellixHR for live vacancies and applications. It cannot confirm a live salary, available opening, visa outcome or fee unless a current approved source explicitly supports that answer.

The launcher opens a compact panel with English, Sinhala and Tamil options and useful starters: Find vacancies, Hire a team, Recruitment process, Office and contact. Do not require visitor registration. Provide links and a direct contact fallback. Explain briefly that it is an automated assistant. Do not collect passports, CVs or confidential employer documents in chat.

Use deterministic answers for navigation, approved contact details and very common questions. Retrieve relevant reviewed material for other questions, then ask a small free OpenRouter model to write a concise answer. This is retrieval-augmented generation, not a claim that we have fine-tuned the hosted model.

Keep model selection configurable for Super Admins from a verified free-model allowlist. Benchmark the actual free endpoints at implementation; do not hard-code an untested winner from a stale catalogue. The earlier Nemotron Lightning suggestion remains a candidate only if it is available, zero-priced and passes language/latency tests. No automatic paid fallback.

## 19. Chatbot dataset programme

| Dataset | Initial scope | Review and acceptance |
| --- | --- | --- |
| Company facts | 60-100 atomic, source-backed facts | Each fact has evidence, review date and status |
| Canonical FAQs | 80-120 questions across company, candidates and employers | Approved answers with allowed next actions |
| Language variants | English, Sinhala and Tamil paraphrases for supported intents | Native-language review for accuracy and naturalness |
| Employer intent set | Hiring scale, sectors, screening, documents and contact | No fabricated timelines or service commitments |
| Candidate navigation | Vacancies, application portal, process and office | Deterministic verified links |
| Unknown/outdated questions | Live jobs, prices, salaries, visas and missing evidence | Honest boundary and useful handoff |
| Evaluation set | 120 held-out questions | Separate from the aliases used to tune retrieval |

Knowledge fields: stable ID, topic, locale, approved text, source edition/URL/page, reviewed date, reviewer, validity window, status, aliases, allowed links and next-action IDs. Distinguish public material from internal records; only published public knowledge can reach the model.

The 120-question evaluation begins with 60 factual cases balanced across three languages, 20 follow-ups/ambiguities, 20 missing or stale/live-data traps and 20 injection/provider-failure cases. Keep translation coverage and refusal quality visible per language rather than hiding weak Sinhala/Tamil results in an overall average.

Sample record plan: office address from profile page 11, with approved answer, contact-page link, source version and reviewer. Sample boundary answer: current vacancies are on the IntellixHR portal; I cannot confirm live openings from this company-information dataset. These examples define structure, not an already approved translated corpus.

Start with lexical/intent retrieval and explicit multilingual aliases. English full-text stemming alone is not an adequate Sinhala/Tamil solution. Add semantic embeddings only if measured recall warrants the extra service, privacy and latency cost. Version the index and keep a fast fallback snapshot available.

## 20. Chat request path, speed and quality

1. Validate and bound input; choose locale; detect direct navigation/contact intent.
2. Return a deterministic or high-confidence reviewed FAQ answer when appropriate.
3. Retrieve roughly 4-6 concise, currently published passages for unresolved questions.
4. Send a short system policy, relevant passages and bounded conversational context to one free model.
5. Stream a short answer where supported. Attach source/action links from trusted records, not arbitrary generated URLs.
6. Validate important links and numerical claims. Use a reviewed answer or useful source excerpt when the provider fails or support is weak.
7. Record minimal timing/outcome metrics; shared caches include locale and knowledge version and exclude personal conversation content.

Set a small output budget, typically 150-300 tokens. Target a sub-second authored/cached response and first useful model output around two seconds under normal conditions, with measured p50/p95 from Sri Lanka. These are targets, not free-provider guarantees. A hard overall deadline should return a helpful reviewed fallback rather than an endless typing animation. Cancel requests when the visitor closes or replaces a question where possible.

OpenRouter free endpoints have account/model capacity limits. Switching free model IDs is not a dependable way to evade shared quota. Read current limits and the account's actual status before launch. Use shared server-side visitor/global limits and a circuit breaker; do not retry aggressively during quota exhaustion. Keep provider keys server-only and never display them in admin forms.

Evaluate the same model with and without AKL retrieval against the held-out set. Report factual correctness, source support, unknown handling, language quality, latency and fallback success. Aim for at least 95% correctness on reviewed in-scope FAQs and zero invented critical fee/visa/job promises in the critical suite. Do not advertise a 20% improvement or any other gain until the evaluation demonstrates it.

## 21. Recommended application architecture

Use Next.js App Router, TypeScript and Tailwind for the public site and admin, retaining the useful GSAP work. The migration supports server-rendered content, previews, metadata, redirects and protected APIs; it is not a prerequisite for good animation.

| Layer | Proposed responsibility |
| --- | --- |
| Public frontend | Cached/servable HTML, responsive media, navigation and progressive motion |
| Staff frontend | Content forms, previews, media editor and role-appropriate tools |
| Server handlers/actions | Auth checks, field permissions, publishing, inquiries, retrieval and provider proxy |
| Neon Auth | Verified identity and supported session operations |
| Neon Postgres | Memberships, content, releases, inquiries, knowledge and audit events |
| Object storage/CDN | Original/derived media, profile downloads and private staging uploads |
| OpenRouter | Only the unresolved, bounded language-generation step |

Recommended initial media option: an S3-compatible object store such as Cloudflare R2, with server-authorised uploads and a public delivery domain for approved assets. Neon Auth is the sign-in choice; it does not mean images should be stored as database blobs. Final object-storage account, quotas, region and costs need verification before provisioning. No storage account or provider has been created for this plan.

Public published content may be read by a narrowly scoped public service/query path. Admin writes stay behind server authorization. Do not expose an owner database connection or arbitrary SQL proxy to the browser. Use database roles and constraints as defence in depth; if RLS is added, test it through the actual connection role and do not assume owner connections enforce it.

Deployment can use the existing Vercel direction once eligibility, plan limits and service accounts are checked. Do not assume a commercial recruitment company can run indefinitely under every provider's free/hobby terms. The contest preview and production need distinct, explicit configurations.

## 22. Data model and important invariants

| Entity | Key fields / invariant |
| --- | --- |
| admin_memberships | auth user ID, role enum, active state, access version; one active membership per user |
| admin_invitations | normalised email, intended role, token hash, expiry, inviter, accepted/revoked state |
| pages / page_revisions | route, locale, structured sections, edit version, immutable published revision |
| site_settings / setting_revisions | typed fields with privileged-field classification |
| media_assets / media_variants | object key, source, credits, hash, crop, readiness and usage |
| industries / destinations / clients | stable identity, reviewed content, order and publication references |
| source_documents | versioned profile/public sources, hash, edition and access classification |
| knowledge_entries / faq_entries | evidence, locale, review state, validity and approved actions |
| releases / release_items | immutable manifest, actor, publication state and active version |
| inquiries / inquiry_events | submitted data, assignment, state, idempotency and restricted notes |
| audit_events | actor, action, resource, time, request ID and redacted difference |
| chat_metrics / evaluation_runs | aggregate outcomes, timings, model/index version and test results |

Use transactions for invitation acceptance, role mutations and release activation. Use unique/check constraints for allowed roles, single-use invitations and duplicate form submissions. Apply optimistic edit versions to drafts. Index real query paths such as inquiries by state/date, invitations by token hash and membership by auth ID. Avoid overbuilding a separate multi-tenant organisation system for one company's staff.

Audit events are append-only to the application role and redact credentials/tokens. They are not magically tamper-proof against a database owner; stronger offsite retention is an additional operational measure if required. Backups need tested restore procedures for database content and object storage, not just a button labelled Backup.

## 23. API contracts and boundary tests

| Operation | Authorization / validation requirement |
| --- | --- |
| GET public content | Published release only; locale-safe cache key |
| POST employer inquiry | Public, validated, rate-limited, idempotent |
| POST chat | Public, bounded input, published knowledge, shared quotas |
| PATCH draft section | Active staff, field-level permission, expected edit version |
| POST media upload authorisation | Active staff, type/size check, short-lived destination |
| POST release | Staff + permission for every included changed field |
| POST knowledge approval | Super Admin and source/review validation |
| POST invite / PATCH membership | Super Admin, recent auth, transaction, final-owner guard |
| POST rollback | Super Admin; compatible retained version; audit event |
| GET inquiry export | Super Admin, scoped dataset, audit event; never public cache |

For every privileged endpoint, test unauthenticated access, authenticated non-member, suspended member, Admin and Super Admin. A copied request must fail when the caller lacks permission even if they manually reveal a hidden button. Reject mass assignment of `role`, `active`, protected settings or publication state in unrelated endpoints.

## 24. Accessibility, SEO and multilingual delivery

All core content is readable before JavaScript animation. Use semantic headings, visible focus, labelled form inputs, useful alt text and keyboard-operable menus, dialogs and image selectors. Target 44px touch controls where practical. The chat dialog must manage focus and allow Escape to close; the launcher must not obscure another essential control.

Translate navigation, main conversion paths, contact, employer inquiry, core process explanations and chatbot starters first. Store locale-specific content and approval state. Do not publish an empty translation as an authoritative page. Use clear fallback labels, appropriate language attributes and hreflang/canonical handling for the chosen URL scheme. Review Sinhala/Tamil form errors, line wraps and text expansion on real screens.

Create route-specific titles/descriptions and social cards; structured organisation data only contains verified facts. Maintain sitemap, robots rules, canonical domain and redirect map. Exclude admin, private previews and internal API data from indexing. The employer page needs its own persuasive search/social metadata rather than inheriting the homepage title.

## 25. Performance budgets and failure behaviour

| Area | Initial target / requirement |
| --- | --- |
| Core Web Vitals | LCP <=2.5s, CLS <=0.1, INP <=200ms where field data exists |
| Above-fold media | Prioritised still poster; no dependency on video or WebGL readiness |
| Homepage media | Load only visible/nearby imagery; do not prefetch the whole gallery |
| JavaScript | Public routes avoid loading admin editors, chatbot UI and 3D on first paint |
| Motion | Smooth on representative hardware; no persistent unnecessary decoding/canvas work |
| Chat/provider outage | Reviewed FAQ/contact/portal fallback remains usable |
| Database/content outage | Last valid cached public release serves where infrastructure permits |
| Contact submission failure | Preserve entered form data and show a truthful retry/contact path |
| Admin mutation failure | No false success; retain draft and show actionable error |

Aim for mobile lab performance around 90+ and accessibility/SEO around 95+, measured on specified device/network profiles. Scores are development targets, not achieved evidence. If the first visual prototype exceeds the budget, reduce media/animation cost before adding optional WebGL. Be especially careful about free database cold starts and cross-region latency; measure rather than guess.

## 26. Implementation work packages and exit criteria

| Package | Concrete work | Exit criterion |
| --- | --- | --- |
| A. Reset and evidence | Remove rejected poster/board direction during implementation; map facts, logos, routes and assets | One agreed content/art-direction foundation; IntellixHR preserved |
| B. Visual prototype | Real-image hero, logo placement, industry section, employer opener, desktop/mobile | Reviewable recognisable AKL design at 390px and 1440px |
| C. Motion prototype | Hero entrance, one journey, SVG route chapter and fallbacks | Native scroll, reduced motion, fast scroll and route changes all work |
| D. Public pages | About, services, sectors, destinations/process, contact and employer portfolio | Real content, correct hierarchy, working links, translations with review state |
| E. Backend foundation | Neon schema/auth, membership gates, storage pipeline and inquiry persistence | Correct sign-in/role checks and a real stored inquiry |
| F. CMS | Editors, media crops, portfolio management, previews and versioned publishing | Admin edits and publishes real content; protected fields reject Admin |
| G. Access management | Invitations, activation, role changes, suspension, audit and recovery | Admin cannot add staff; final-Super-Admin and race tests pass |
| H. Knowledge and bot | Reviewed facts/FAQs, retrieval, free provider, cache, quotas and evaluation | Measured language quality and complete provider-failure fallback |
| I. Contest polish | Final crops, transitions, typography, mobile ergonomics, accessibility/performance | Full-site visual and functional review; no placeholder demo claims |
| J. Release | Redirects, SEO, backups, environment review, approved production cutover | Verified release with monitoring and a tested rollback path |

Sequence B and C early so the design quality is visible before all CMS work is complete. E can follow the stable content model; F-H depend on it. Content translation and image review can progress alongside engineering. Optional extras must not displace the core employer, admin and candidate flows.

No fixed delivery-date promise is attached to this plan. Estimate after the image-complete prototype and authentication/storage capability check. Track work as concrete acceptance items rather than a percentage-complete guess.

## 27. Verification and contest demonstration

Test at 360/390/768/1440 widths, desktop keyboard, representative Android hardware and iOS Safari when available. Inspect actual images and text, not just empty boxes. Test browser back/forward, touch scrolling, orientation changes, deep links and intro asset failure.

Meaningful automated coverage focuses on authorization, final-owner concurrency, invitation replay/expiry, protected-field publishing, release consistency, inquiry idempotency, retrieval/unknown handling and provider outages. Browser tests cover the main employer brief, vacancies handoff, media replacement, admin publish and role denial. Do not spend the test budget asserting every decorative CSS class.

The contest walkthrough should show: a compelling first screen; a 30-second public story; the employer portfolio; a real draft image/copy change; publication reflected publicly; an Admin denied an elevated action; and the chatbot answering a sourced question while surviving a simulated provider outage. Use labelled demo records. Keep real staff emails, keys and inquiry data off the presentation.

## 28. Production migration and operating plan

Keep the production site unchanged until the replacement is ready and reviewed. Build a complete redirect list for existing About, Services, Contact and country-process URLs. Preserve the canonical domain and external careers handoff. Verify analytics/event configuration with the actual account rather than showing fake traffic graphs in admin.

The current production homepage includes unrelated external copy and theme-demo links. Do not copy those into the replacement. Investigate and clean up the existing WordPress deployment before or during cutover; this observation alone does not establish the cause. Take an export/backup and retain the previous deploy for rollback.

Before launch: confirm legal naming, current licence/certification claims, contacts, portfolio client permissions, public profile edition, storage/deployment plan eligibility, cookie/privacy wording, inquiry retention, email delivery and owner recovery. Recheck current provider limits and SDK versions. Rotate any already-exposed credentials through the proper provider if they are used for this project; do not paste secrets into documentation.

After launch: watch inquiry failures, publication failures, broken external links, chatbot fallback rate and performance. Review critical contact/portal facts whenever changed and review time-sensitive claims on a scheduled internal process agreed by the company. Nothing in this document creates a scheduled task or sends a notification.

## 29. Deliverables and definition of done

The build is complete when the public pages are image-complete and coherent; the three signature sequences have working fallbacks; the employer portfolio is independently shareable; all vacancy actions reach IntellixHR; inquiry records persist; staff can update content/media and see a real release; the two-role boundary survives direct API tests; and the chatbot passes the documented evaluation with useful fallback behaviour.

The planning pack delivered now contains the recovered logo files, 13 photographs, a numbered photo board, the detailed master plan, execution prompts, three-second HTML intro specification, structured contracts, dataset starters, acceptance cases and the image-source manifest. It does not contain a finished production website or implemented CMS. The handoff examples are integration sketches, not production modules. The source profile, page review images and clearly labelled raw OCR are included for the executing model.

## 30. Sources and dated research

All web checks for this revision were made on 30 October 2026. Proposed architecture and acceptance targets are design decisions, not claims that the providers guarantee them.

- Company production site: https://al-karrim.net/
- Company About page: https://al-karrim.net/about-us/
- Profile: user-provided Al-Karrim lanka Profile Ver112025.pdf, 11 pages; profile pages referenced above.
- Existing code: https://github.com/januththedev/AKL-Site
- Existing portfolio references: Sofa Factory Outlet, Matheesha Tours, T2T redesign branch, Nagaro Booking System, CVForge and SMV, as supplied in the brief and reviewed in the earlier plan.
- Neon Auth overview: https://neon.com/docs/auth/overview
- Neon Next.js guide: https://neon.com/docs/auth/quick-start/nextjs-api-only
- Neon supported plugins: https://neon.com/docs/auth/guides/plugins
- Neon managed Admin APIs: https://neon.com/docs/auth/guides/plugins/admin
- Neon user management: https://neon.com/docs/auth/guides/user-management
- Neon production checklist: https://neon.com/docs/auth/production-checklist
- OpenRouter current limits: https://openrouter.ai/docs/api_reference/limits
- Unsplash licence: https://unsplash.com/license
- Individual photographs and exact logo provenance: `assets/IMAGE-SOURCES.json` in this pack.

The photo board is a selection/reference composition, not a screenshot of an implemented redesign. Photographs remain illustrative unless a future verified company source replaces them.
