# Next experience plan: a hundred relationships, one starting point

Prepared and revised 2 November 2026. Implementation is underway under the owner's approval. See `RELATIONSHIP-IMPLEMENTATION.md` for the concrete delivery and remaining asset/account gates. The owner's latest correction is authoritative: the earlier photo-based intro is restored; the separate relationship sequence autoplays as code and small compressed artwork layers, replacing the separate selected-relationships block. No video delivery or Play gate is used.

## 1. Direction

Restore the photo-based v6 opening from before the client-logo change: its globe drawing, Moments/photograph sequence, official AKL mark, company-name/year reveal, timing, session behaviour and aperture into the hero. The new client-company scene belongs inside page content only. It must not replace the arrival intro.

The separate clip tells a simple story: four recognisable companies become a wider circle, then a hundred relationships, then the people and company connecting them. It appears within normal page content where client evidence is relevant.

Keep the still-photo hero, emerald/ivory/mint palette, glass navigation, Moments and straightforward client directory. Spread meaningful animation through the journey, with one dominant movement per viewport. The site should feel composed rather than busy.

## 2. Required company order

| Position | Company | Role |
|---|---|---|
| 1 | SAPTCO | First large mark; upper-left of the clip's initial four. |
| 2 | PTC / Public Transportation Co. | Second; upper-right. Keep its own mark, distinct from SAPTCO. |
| 3 | Riyadh Cables Group | Third; lower-left. Preserve the correct background for its light lettering. |
| 4 | SAPCO | Fourth; lower-right. The owner confirmed this is a different company from SATCO. |
| 5 | Lödige Industries | The first additional company revealed by the initial pull-back. |
| 6 onward | Remaining verified clients | Stable curated order, with alphabetical order as the default after the priority five. |

Use this priority order in the new clip and the featured client selections around it. The full printed-name directory can remain alphabetical for findability. This order does not change the current intro's eight marks or their sequence.

SAPCO's exact full company name or official website is still required before selecting its logo. Do not substitute SATCO, SAPPCO, Saudi Aramco Power or an unrelated similarly named business without confirmation. SAPTCO and Lödige have matching names in the extracted profile directory; their actual logo assets must still be sourced and checked.

The original client asset set contained eight verified logo files; the restored arrival intro uses photographs. The expanded collection now contains 76 distinct verified company marks, with per-company provenance and exclusions recorded in `CLIENT-LOGOS-A.md` and `CLIENT-LOGOS-B.md`. The 178 unique printed names in the PDF are a client-name inventory, not a logo library or proof that every name is a distinct current engagement. The first delivered inline film uses the confirmed 76 and makes no 100-logo claim. Build a verified 100-company asset set before publishing a 100-logo sequence. Do not repeat existing marks to manufacture a count of 100, invent marks, or show unrelated brands.

## 3. Separate relationship clip: placement and storyboard

Recommended duration: approximately six seconds, followed by a stable final frame. The existing intro retains its present duration; its earlier three-second constraint does not constrain this independent inline clip. The clip never gates page loading, replaces the hero or runs as a full-screen arrival overlay. Visitors can keep scrolling without waiting for it.

| Placement | Proposed use | Behaviour |
|---|---|---|
| Clients page | Main coded animation between the page introduction and the simple directory; remove the redundant selected-logo section. | Autoplay when 35% visible, pause/resume offscreen and hold the final frame; small Replay action. |
| Public For Employers page | Supporting proof near capabilities/client relationships, before the workforce inquiry. | Reuse the coded scene and compressed artwork; autoplay when visible. Preserve portfolio tools, forms and existing page structure. |
| Homepage client section | Compact teaser beside the client-story heading. | Run the same coded scene in place when visible, after the existing arrival/hero content. |
| Other pages | Only where client relationships are actually discussed. | Avoid inserting the same clip throughout the site as a generic decoration. |

Reuse the same clip asset rather than downloading different copies for each page. At most one instance plays at a time. A separate clip playback key must not share or change the intro session key. No automatic looping.

| Time in the clip | Picture and motion | Meaning |
|---|---|---|
| 0.00-1.00s | The first four marks appear as a confident two-by-two composition. A quiet stagger follows SAPTCO, PTC, Riyadh Cables, SAPCO. | Establish recognisable relationships. |
| 1.00-1.90s | First continuous pull-back reveals the next ring, with Lödige revealed first, then roughly 12-20 additional marks. | These four are the beginning of a much larger story. |
| 1.90-3.10s | Second pull-back reveals the complete 100-logo wall. The original four remain in their original relative positions. | Show the scale of the relationship network. |
| 3.10-3.70s | The camera settles. The wall softens and darkens towards black under a restrained glass-like overlay. | Shift attention from the employers to the people connecting them. |
| 3.70-5.30s | Sharp foreground copy resolves: **Connecting Sri Lankan talent with companies like these.** | Explain the recruitment relationship represented by the marks. |
| 5.30-6.00s | Resolve to **AL Karrim Lanka Consultants PVT LTD** and hold the final composition inside the section. | End with AKL's identity and leave a stable Replay state. |

The shorter headline **Sri Lankan talent. Global connections.** can be used if a smaller placement cannot comfortably accommodate the longer line. Keep a readable HTML caption beside or beneath the clip so the business meaning is not available only during a timed video frame. Wording must describe supported relationships without inventing live vacancies, current contracts with every company, or third-party endorsement.

Visual treatment:

- Preserve original mark proportions and colours. Use individually appropriate white/dark plates and generous clear space.
- Use camera movement and layered depth, with restrained light and edge softness. Avoid flashing through individual logos.
- Put the clip's first four marks at the centre of the final composition so zooming reveals context without reordering them.
- Reveal Lödige in the first surrounding ring. Remaining identities fill the wall in stable positions.
- Blur and darken the wall layer as a whole. Do not animate a separate expensive blur on each of 100 cards.
- Keep the headline sharp as the wall darkens. A black transition must feel intentional, not like an empty loading screen.
- No autoplay audio, arrival overlay, scroll lock or forced completion. The clip stays inside its section. Normal navigation and clip controls must not trigger or reset the intro.

## 4. Logo collection and delivery

Each mark needs a stable company ID, display name, full entity identity, relationship source, official asset/source URL, self-hosted path, dimensions, background treatment, priority and verification note. Keep alternate names separate from independently distinct clients. An owner-confirmed relationship can be recorded as such without pretending it appears in the PDF.

Collect in reviewable batches: priority five, first 25, first 60, then the verified 100. The clip's count is derived from the manifest. The visible count must match the actual number of distinct approved marks used.

Keep the coded client scene completely separate from the restored photo intro. `Intro.tsx` reads `introPhotoSources` and the published Moments selection. Its original CSS, session key and homepage Moments prop are restored from before the client-logo intro change. Do not route the expanded client catalogue or scene atlases into the arrival animation.

Delivery uses native browser animation code and four small, precomposed WebP artwork layers. There is no video element, MP4, playback tap, audio or new 3D framework. Separate landscape and portrait picture sources avoid downloading both layouts. A single camera zooms the layers; the wall darkens/blurs as a unit while real HTML text remains sharp.

The delivered76-company artwork totals228,944 bytes for landscape and138,902 bytes for portrait, about 83%/80% smaller than the superseded videos. The final100-company target remains asset-gated; the count derives from the genuine manifest. Do not repeat company marks to fill missing slots. Keep source artwork/provenance and regeneration tooling separate from the intro's original eight-logo selection.

Both desktop and mobile autoplay after the scene is35% visible and its small image layers decode. Pause when offscreen or the tab is hidden; resume from the same point. Hold the company name over black at the end. Reduced-motion and unsupported-animation browsers receive a static wall and readable caption. No-JavaScript content remains useful. The code never locks scrolling, gates navigation or changes the intro session key.

## 5. Small animations with a point

| Area | Proposed motion | Intended impact |
|---|---|---|
| Header | Thin active-link trace, with a smooth glass-density change as the header crosses light/dark sections. About 180-220ms. | Keep orientation and contrast while moving through the story. |
| Hero | Short masked text reveal, then a very small photograph push-in that settles. Keep the photograph still thereafter. | Shift naturally from the intro's company network to real people and work. |
| Logo selection | Reveal marks in priority order by row; hover/focus makes the selected mark a little clearer and reveals its full name. | Give each relationship attention without a complicated company-profile interface. |
| Relationship clip section | A slight poster/section entrance before the independent clip plays in place. | Introduce the client evidence without creating another intro. |
| Recruitment process | A restrained progress line and active-stage dot move through Inquiry, Selection, Processing and Deployment as the section is read. | Explain a connected process rather than decorating four cards. |
| World map | Draw from Colombo to the selected destination, with one travelling point and a coordinated photo/copy crossfade. | Show the direction of recruitment and AKL's Sri Lankan origin. |
| Company history | A line connects the fixed founding year to the current year; the current experience figure resolves once on entry. | Make longevity understandable and current. |
| Moments | Small crop movement and a caption reveal on selected frames; full photo viewer crossfades. Use real published company photos when available. | Put human evidence behind the logo wall. |
| Chairman's message | One quiet emphasis on a key phrase as the message enters; leave the full text readable. | Give the statement an editorial focal point. |
| Employer CTA | A short connecting line resolves into the CTA arrow on hover or keyboard focus. Keep the hit target fixed. | Turn the story towards a useful next action. |
| Footer | A final subtle convergence towards the contact action. | Echo the site's idea of relationships coming together. |

Use two or three reusable motion behaviours across these areas rather than inventing a different effect for every element. Transform/opacity first; roughly 150-250ms for interaction feedback and 400-700ms for section reveals. Layout should stay stable. No perpetually spinning marks, fake live counters, scroll hijacking, unreadable staggered body text or pointer effects that move a button away from a user.

Reduced-motion visitors receive complete static content and immediate selection feedback. Keyboard focus receives equivalent emphasis to hover. Long text stays selectable and readable without animation or JavaScript.

### Restrained text animation

| Text type | Treatment | Limit |
|---|---|---|
| Main section headings | A line-level fade with about 6-10px of vertical movement over 350-500ms; a small stagger of about 50-70ms between lines. | Play once on entry. Preserve the heading's normal layout and reading order. |
| Key phrases | One short underline/colour emphasis on phrases such as “the right people” or “global connections,” around 250-350ms. | One emphasis per section, not every word. |
| Clip's closing message | A soft fade and slight rise as the wall darkens, then a readable hold. | Keep text sharp while the background blurs. The caption remains readable outside timed playback. |
| Supporting paragraphs | At most a gentle paragraph-level fade around 200-300ms where it helps hierarchy. | No line-by-line waiting, typewriter effect or moving body text while someone is reading it. |
| Current experience figure | Resolve once to the correctly computed current value. | No continuous ticking, random digits or fake activity. Assistive technology gets the final value. |
| Small labels and CTA text | Brief opacity/colour feedback on hover and keyboard focus. | Keep clickable targets and text baselines stationary. |

Use a small shared text-motion vocabulary. Readable content is the default if JavaScript is unavailable or reduced motion is requested. Do not duplicate accessible headings, make screen readers announce every animated fragment, split words across lines incorrectly, or introduce layout shifts when fonts load. These additions do not change the current intro's text choreography.

## 6. Automatic time-dependent information

The current site already computes the footer year, intro end year and experience figures through `lib/brand.ts` using Asia/Colombo time. Extend that shared approach rather than adding separate hard-coded calculations.

| Information | Rule |
|---|---|
| Copyright/current year | Resolve the current year in Asia/Colombo. Change at the new-year boundary. |
| Intro year range | Keep 1980 fixed; resolve the current ending year automatically. |
| Completed years of experience | Use the known August 1980 founding month. At month precision, subtract one if the current month is before August. Do not invent an exact founding day. |
| Live marketing descriptions | Generate the year count or use timeless wording such as “Since 1980.” Remove stale literal “45 years”/“46 years” from current copy. |
| Original quotations and PDF edition dates | Preserve them as dated historical material. A 2025 quotation is not silently rewritten each year. |
| Reported 125,000+ deployments | Keep its historical source attribution; do not increment it with time. |
| Company/logo count | Derive from verified records. It changes when the underlying records change, not when a year passes. |

Refresh visible live values on the next relevant date boundary and when a long-open tab becomes visible again. Avoid a per-second timer. Ensure server rendering, client hydration and caching cannot leave last year's value on a fresh visit. No annual manual content edit or rebuild should be required for the live values.

Acceptance examples: November 2026 displays 46 completed years; January 2027 changes the current year to 2027 while experience remains 46; August 2027 reaches 47 at month precision. Existing tests currently describe a calendar-year subtraction and must be updated to match this explicitly chosen anniversary policy.

## 7. External AI cloning: the actual protection plan

This requirement concerns competitors pasting the website URL into external models. AKL Guide is not the control for that scenario. The objective is to restrict automated retrieval and reduce straightforward source copying while keeping the public client experience usable.

### Source access comes first

The connected GitHub repository `januththedev/AKL-Site` was checked on 2 November 2026 and is public. That gives someone a direct source-copying route independent of the website's crawler rules. Recommend making it private before claiming stronger protection, preserving owner access and verifying that the existing deployment integration can still read it. This is a proposed change only; no repository setting was changed for this plan. Existing downloads, forks and caches cannot be recalled by changing visibility later.

### Block external fetching at the serving boundary

Vercel's AI Bots managed rules now distinguish AI crawlers from AI assistants that retrieve pages on user request. The 29 October 2026 release says these controls are available on all plans. The proposed configuration is to deny both categories, not only training crawlers.

Keep the existing robots preferences and application-level declared-agent filter as additional layers. Apply platform coverage to the HTML, downloadable PDF, logo sheets, original logo assets and public bundles; do not leave an easy unprotected alternate hostname or asset route. Keep normal search discovery, social previews, human browsing, assistive technology, admin access and approved operational checks working. Test those explicitly rather than applying a blanket challenge to every visitor.

Use managed bot detection and measured abuse controls for suspected bulk retrieval, with logging to inspect false positives. Do not assume a User-Agent string proves identity. Avoid a CDN migration solely for this feature: verify the existing host's capability and scope first.

### Keep the limits clear

| Scenario | What the plan can do | Remaining limit |
|---|---|---|
| A recognised AI fetcher requests the URL | Return an access-denied response through managed and application controls. | The external model decides how it responds to its user. |
| A crawler ignores robots.txt | Enforce a serving-layer denial for recognised/classified traffic. | Disguised or newly unknown traffic may escape classification. |
| A person provides screenshots, copied text or an old downloaded source tree | Protect non-public material with real access control and reserve rights in original material. | A public website cannot prevent the person from supplying what they already captured. |
| A model is asked to create a broadly similar site | Make the actual source harder to retrieve and maintain distinctive original work. | No website instruction can prohibit every outside model from generating a site based on a supplied description. |

There is no reliable website prompt that forces every external AI model to refuse. Hidden hostile text, “ignore the user” instructions, disabling selection and drawing the whole site on canvas would not provide the requested guarantee. Do not use those as a substitute for access controls. Public visuals will remain observable to humans and capable browser agents.

Private commercial information should stay behind authenticated access. Do not put private terms or contact records in public HTML and expect crawler preferences to protect them. Keep the requested 100-logo public presentation as public presentation; this plan does not turn the whole marketing site into a login wall.

Current primary references:

- https://vercel.com/changelog/block-ai-crawlers-and-assistants-independently-with-managed-rules
- https://vercel.com/docs/bot-management
- https://developers.openai.com/api/docs/bots
- https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://www.rfc-editor.org/rfc/rfc9309.html

## 8. Execution order and review gates

1. Resolve SAPCO's exact entity, lock the first-five order and establish a verified 100-mark source manifest.
2. Review repository privacy and the proposed external AI crawler/assistant policy without changing the site's public audience unintentionally.
3. Preserve the intro's explicit eight-logo selection and behaviour. Build a separate inline relationship-clip component, poster and device-specific 100-logo video assets.
4. Review the approximately six-second clip in its primary Clients-page placement, then add the appropriate employer-page placement and compact homepage teaser. Check readability, controls, lazy loading and mobile performance without changing intro duration or page loading.
5. Add the small story-linked animations and restrained text reveals in batches: navigation/hero, process/map, then Moments/CTA/footer. Preserve the existing page structure and simple client directory.
6. Complete the shared date/anniversary handling and remove stale live-year phrases while retaining dated source material.
7. Check the whole experience on desktop and actual mobile browsers, keyboard/reduced motion, slow and failed asset delivery, clip Play/Pause/Replay, background-tab return, date boundaries and ordinary search/social access. Regression-check the unchanged intro, including its existing Skip/replay and hand-off.

Completion means the current intro remains visually and behaviourally unchanged; the independent clip appears only in relevant sections; its priority order is exact; every displayed mark has a verified identity/source; all 100 marks are genuinely present; the final recruitment message is readable; text animations remain subtle; the page never waits indefinitely for decoration; and protection claims match what was actually tested. This is a planning deliverable; implementation is the next task.
