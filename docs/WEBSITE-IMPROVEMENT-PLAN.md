> HISTORICAL / SUPERSEDED: do not implement the campaign-poster or local-vacancy-board direction below. See CONTEST-REDESIGN-PLAN.md and INTRO-SPEC.md for the current brief.

> Superseded by [the contest redesign plan](CONTEST-REDESIGN-PLAN.md). The campaign poster and local vacancy-board direction was rejected by the user.

# AKL website improvement plan — 30 October 2026

## Evidence and limitations
- Correct Facebook: https://www.facebook.com/alkarrimlanka603/ (user supplied; company page visible in earlier browser inspection).
- Earlier page observation: company name; 10/1 Duplication Road, Bambalapitiya; 0112 592 551; WhatsApp +94 77 777 6456; alkarrim@slt.lk; a recent Oman heavy vehicle recruitment announcement.
- Facebook access was restored and the page and photo gallery were reviewed. Scrolled through October, July, May, April and January 2026 into 2025. The inspected material was primarily recruitment posters and promotional artwork; no new authentic office/team/interview photograph was identified in that portion. This is not an exhaustive claim about the entire page.
- Selected asset: official Oman driver campaign posted 27 October 2026, advertising a 30 October trade test. Saved locally as a 1080×1080 WebP and labelled a campaign archive, not a current vacancy. Source: https://www.facebook.com/photo.php?fbid=1737986118332367&set=pb.100063629857113.-2207520000&type=3 .
- On the resumed session the browser could list the selected tab but returned “Debugger unattached” when reading it. Continued from the earlier successful review and downloaded the already-observed public poster URL.
- Notice details were read from the official IntellixHR careers portal on 29 October 2026: Merchandiser/Oman/100 openings/closing 31 Oct; Heavy Duty Driver/Oman/50 openings/closing 31 Oct; Diesel Mechanic/Qatar/3 openings/closing 30 Oct. These are dated notices, not a synchronized feed. Salaries omitted because sources differ. Original title “Disel Mechanic” normalized.
- Sources: https://alk.intellixhr.com/careers ; https://alk.intellixhr.com/careers/submit/293?lang=en ; https://alk.intellixhr.com/application/status?lang=en .
- Existing 2025 office photos are not used. New office, staff, interview and deployment photography still needs a verified source or original files.

## Implementation
1. Home: candidate/employer navigation after hero; recruitment notices earlier in the journey.
2. Vacancies: keyword/country/sector filters, result count, reset and empty states, dated sources and expired-notice handling using Asia/Colombo dates. No false application success.
3. Candidate support: in-memory preparation checklist, accessible FAQs, application status handoff. Guidance, not eligibility or mandatory application requirements.
4. Contact: correct social profile, WhatsApp inquiry, address-based Google Maps search (not a verified map pin), phone fallback, mobile action dock with safe-area spacing.
5. Preserve branding, reduced motion and lazy 3D loading. No unverified certifications, reviews or follower counters.

## Validation
Build/TypeScript; date-boundary/filter tests; desktop 1440×900 and mobile 393×852 QA when preview is accessible; menu, filters, checklist, FAQ, form errors, route reset and legacy redirect. Do not submit a real inquiry/application.

## Next content pass
Capture original current exterior/entrance, reception, team, interviews and deployments. Record post URL/date and subject; optimize verified images to WebP with dimensions and descriptive alt text.

## Maintenance
- Update `src/data/opportunities.ts` only after reading the official portal; record the review date and exact source. Entries expire after their published closing day in Asia/Colombo, with an optional closed-notice filter.
- `RecruitmentCampaign.tsx` deliberately labels the October campaign as an archive. Its local image is a recruitment poster, not office or team photography. Do not turn it into an undated live offer.
- Replace promotional imagery only with genuine, dated company photography when available. Do not hotlink expiring Facebook CDN URLs.
- Run `node --test tests/opportunities.test.mjs` and `npm run build` after content or logic changes. No API keys or environment secrets are required for this static site.

## Verification results — 30 October 2026
- Production build and TypeScript passed. Existing model-viewer chunk remains lazy and retains its known size warning.
- Four automated tests passed: Sri Lanka midnight boundary, inclusive closing dates/expiry/archive, combined case-insensitive filters, stable display dates.
- Browser: keyword/destination no-result state, industry match, reset, archive toggle, checklist count and FAQ expansion passed. Empty inquiry shows validation errors; inputs/audience switch work. No inquiry or application was sent.
- Desktop route sweep passed for Home, About, Services, Recruitment, all three country process pages, Countries, Vacancies, Contact, legacy /about-us redirect and 404.
- Responsive frame inspection at 393×852 and 1440×900: mobile vacancies layout, mobile menu open/close, mobile filtering and contact dock verified. Mobile document width equals its scroll width (no horizontal overflow). Desktop homepage and vacancies visually inspected. This is a browser frame check, not a physical-device test.
- Browser QA used the managed Vite development preview; production output was built separately.
- Changes are local on branch improve-candidate-experience; no production deployment or GitHub push performed.
