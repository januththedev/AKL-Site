# Al Karrim Lanka — the next chapter

Photo-led international recruitment website, public employer portfolio and a server-backed staff workspace. The active application is **Next.js App Router + TypeScript**, with Neon Auth/Postgres integration and GSAP motion.

## Run

Use Node 24 and the committed npm lockfile.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run start
```

The homepage uses a **still photograph**. A separate skippable **three-second HTML intro** ends on black with **AL-Karrim Lanka**. Vacancies remain on [IntellixHR](https://alk.intellixhr.com/careers).

## Main routes

- `/` — photographic company story and industry/destination interactions.
- `/employers` — shareable workforce portfolio, company profile and inquiry flow.
- `/about`, `/services`, `/industries`, `/destinations`, `/recruitment`, `/contact`.
- `/admin` — invite-only staff workspace with Admin and Super Admin roles.

## Configuration and status

Read [setup](docs/SETUP.md) and [implementation status](docs/IMPLEMENTATION-STATUS.md) before connecting providers or publishing. Public source defaults and core assistant answers work without a model key. Staff access and persistent writes fail closed when services are not configured. The public inquiry area offers direct email/call when its backend is unavailable.

No default administrator, model key or database password is included. Apply the migration and bootstrap the verified first owner using the documented commands. Ordinary website Admins do not receive provider-wide auth administrator powers.

The current [design specification](docs/CONTEST-REDESIGN-PLAN.md) and [three-second intro specification](docs/INTRO-SPEC.md) supersede the earlier poster/local-vacancy-board and hero-video proposals.

The previous Vite application and its existing edits are preserved in `legacy-vite/`. It is archival reference, not the active Next.js entry point.
