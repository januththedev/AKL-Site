# Company profile extraction notes

Source: the supplied 11-page November 2025 company profile, published in the repository at `public/documents/company-profile-nov2025.pdf`.

Extraction date: 1 November 2026. SHA-256: `42959c40c4c7aedd821de174045b65985bb558bfc510be135a97b5279f6154c7`.

Structured content: `content/profile-extracted.json`.

## What was checked

All 11 pages were rendered and visually reviewed. Pages 8-9 were additionally rendered at 4000px width, split into their three columns, processed with a green-channel contrast threshold, OCRed and proofread against the rendered columns. This recovers the green-background names missed by the earlier full-page OCR. Client entries retain their source page, column and row.

| Pages | Extracted material |
|---|---|
| 1 | Company brand and recruitment tagline |
| 2 | Contents and section/page mapping |
| 3 | August 1980 founding, Sri Lankan origin, licence claim and award-name claims |
| 4 | Company history, geographic expansion and more than 125,000 reported deployments |
| 5 | Four service categories, seven industry sectors and four workforce categories |
| 6 | Four reasons to choose AKL, documentation/travel coordination and post-deployment follow-up |
| 7 | Employer relationships, transparency, mobilisation, large project teams, specialised staff and partnership values |
| 8-9 | Complete printed client-name inventory |
| 10 | Chairman identity, title and three-paragraph message |
| 11 | Address, phone, email, website, social handle and employer inquiry scope |

## Client inventory

The profile has 179 printed client-name rows across pages 8-9. An exact duplicate of `WOODEN BAKERY COMPANY LTD(MKHABZ ALHATAB CO. LTD)` appears twice on page 9; the structured directory keeps one row and records the duplicate in extraction metadata. The result is **178 unique exact names**. This is a name count, not an independently verified count of distinct legal entities or active contracts.

| Source page | Left column | Middle column | Right column | Printed rows |
|---|---:|---:|---:|---:|
| 8 | 34 | 35 | 32 | 101 |
| 9 | 32 | 32 | 14 | 78 |

No client logos appear in this PDF. Pages 8-9 contain text names only. Any logo used in the site or intro must be matched to the correct named company through a separate reliable asset source. An unrelated parent company's mark should not silently replace a specifically listed subsidiary or local branch.

Spellings and apparent typographical errors from the source are retained. Wrapped lines are joined, but names are not silently rewritten to a presumed legal identity. Examples include `JEDDAH CABALE COMPANY LTD`, `DESERT WALL MANPOWER & RECRUTMENT AGENCY`, `ENGINEERING MAINTANANCE COMPANY (EMCO QATAR)`, `SURF N TURF RESTAURENT`, and the `LAVNDRY` parenthetical. `NATIONAL CATERING COMPANY LIMITED SOLE PROPRI` and `RAL INTERNATIONAL COMPANY...` are visibly incomplete in the printed document.

Two probable name-variant pairs were preserved because the PDF does not prove they are identical entities:

- `AL EWAN MEDICAL COMPANY` and `ALEWAN MEDICAL COMPANY`.
- `AL MEER SAUDI TECHNICAL SERVICES CO.,` and `ALMEER SAUDI TECHNICAL SERVICES CO.,W.L.L.`.

These should not be merged by an automated fuzzy-match pass without company confirmation.

## Publication treatment

- Founding is explicitly **August 1980**. Compute elapsed experience from that date; do not preserve the PDF's static "45 years" wording as a permanently current site fact.
- **More than 125,000** is a company-reported historical figure in the November 2025 profile, not a live counter. Attribute it to the profile.
- **Licence 603** is printed on pages 3 and 6. The profile alone does not establish its current validity.
- The profile names the **Excellence Award** and **Most Outstanding Recruitment Agency** recognition but supplies no award years or awarding-body detail. Do not add dates, trophies or fresh/current certification claims.
- The Chairman's name is visibly **C.Mohamed Nassar**, title **Chairman /MD**. The structured editorial form is **C. Mohamed Nassar**, **Chairman / MD**.
- The cover uses **Consultants**, while body text uses **Consultant**. Keep the user-approved website name, **AL Karrim Lanka Consultants PVT LTD**.
- The PDF explicitly names **Malaysia** and **Australia**. Other reach descriptions are regional: **Gulf Region, Middle East, South Asia, Asia and Europe**. A complete country-by-country deployment list cannot be recovered from these descriptions. A country word in a client name is useful for company-record reconciliation but does not alone establish a current destination or an exact pin.
- The page 11 address is **# 10/1, Duplication Road, Colombo 5, Sri Lanka**; phone **+94-112-592551**; email **alkarrim@slt.lk**; website **www.al-karrim.net**. These agree with the existing site's principal contact details.
- The handle **alkarrimlanka603** appears beside Facebook, Instagram and LinkedIn icons. The document does not supply three verified URLs. Retain the already confirmed Facebook link and verify other social destinations independently before adding them.
- Services include contract drafting support and visa/documentation processing. Editorial descriptions should explain coordination and assistance, avoiding a blanket guarantee of legal compliance, visa approval, placement or timeline.
- Clients are introduced as relationships listed in the company profile. The PDF does not establish engagement dates, current contract status, exclusivity, logo-use rights or public endorsements.

The structured file includes every substantive section of the PDF while keeping these evidence limits in metadata, so the site can use concise, confident copy without turning dated source claims into unqualified current facts.
