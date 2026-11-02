# Integrated client motion and purposeful typography

## Goal

Make the existing client sequence feel like part of the page, with a clear idea behind its motion. Remove the separate AL Karrim Lanka name card. Keep the original arrival intro and hero handoff byte-for-byte unchanged.

## Placement and composition

- Keep the current relationship placements on Home, Clients, About and Employers. Their role is to connect company history with employer capability, rather than interrupt the opening.
- Use the entire section width, with one continuous forest background, an ambient glow and soft edges. Remove the inset frame, border, corner radius, shadow and fixed video aspect ratio.
- Keep the four existing transparent artwork layers and their internal proportions. Size the camera to the available viewport so the complete network fits when it expands.
- Keep the heading and links aligned with the page's editorial grid. Place quiet text pause/replay controls in this reading area, outside the artwork.

## Two-second sequence

| Time | Action | Point |
| --- | --- | --- |
| 0–0.24 s | Hold the verified priority logos close | Recognisable employers establish context |
| 0.24–0.65 s | Bring in Lödige and the inner network | Expand beyond the first names |
| 0.65–1.25 s | Ease out to the complete verified collection | Show the breadth of the company story |
| 1.25–1.80 s | Soften the network; reveal the two message phrases in order | Connect the names to Sri Lankan talent and international work |
| 1.80–2.00 s | Hold “Sri Lankan talent. Global connections.” | Land one readable idea, with no extra brand ending |
| At 2.00 s | Retain the existing smooth next-section handoff | Continue into the relevant supporting content |

The sequence remains code-driven. Reuse the current lightweight local assets; do not generate or download another video. Preserve pause/resume, visibility handling, portrait switching and replay without repeated automatic jumps.

## Text motion

- Introduce semantic phrase wrappers on selected existing headings: the client relationship heading, section titles, Clients storytelling headings, and the Moments opening.
- Reveal each phrase upward through a soft mask, with a short stagger. Keep the existing serif accent and readable natural line wrapping; never animate characters separately.
- Supporting paragraphs follow with a smaller movement and stagger. Avoid applying both heading and paragraph animations to the same node.
- Preserve all heading text, links, selection, reading order and server-rendered content. No additional animation libraries or per-scroll React state.
- Exclude the original opening, home hero and private portfolio experience. Honour reduced motion and restore normal content for printing.

## Verification

1. Check the first-intro file hashes and existing date/role/content tests.
2. Run TypeScript and the production build.
3. In the browser, verify full-width layout, correct composition proportions, the absence of the brand card and player frame, and the automatic next-section handoff.
4. Verify pause, resume and replay remain keyboard-operable with stable focus.
5. Inspect phrase transforms/opacity after entering the viewport, and confirm headings retain their accessible text.
6. Publish the reviewed source to the existing GitHub main branch; leave unrelated files and hosting settings untouched.
