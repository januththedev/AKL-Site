# AKL successor website setup

The active application is Next.js App Router. The previous Vite source and all existing edits were preserved in `legacy-vite/`. Public photography is local under `public/media/`; the three-second DOM intro uses small derivatives under `public/intro/`. No hero video is downloaded.

## Local build

Use Node 24 and the committed npm lockfile. Install with `npm ci`, then run `npm run dev`, `npm run typecheck`, `npm test` and `npm run build`. `npm run start` serves a production build. The dev wrapper translates the managed preview's Vite-style port flags and uses the same Webpack bundler as the build.

The public site renders from supplied source defaults without external service credentials. The assistant answers core company/contact/navigation questions without a model. Unconfigured admin and persistent submission paths fail closed and report setup needed.

## Connect this project's services

Create an ignored `.env.local` or configure the deployment's secret store. Never put real values in source, browser fields, public variables or commit history.

```text
DATABASE_URL=<AKL pooled Neon connection>
DATABASE_URL_UNPOOLED=<optional migration connection>
NEON_AUTH_BASE_URL=<AKL Neon managed Auth branch URL>
NEON_AUTH_COOKIE_SECRET=<locally generated secret of at least 32 characters>
SITE_BASE_URL=<canonical application origin>
BOOTSTRAP_OWNER_AUTH_USER_ID=<verified owner identity in this branch>
BOOTSTRAP_OWNER_EMAIL=<owner email; may self-register only until the first Super Admin exists>

STORAGE_ENDPOINT=<S3-compatible endpoint>
STORAGE_REGION=auto
STORAGE_BUCKET=<AKL scoped bucket>
STORAGE_ACCESS_KEY_ID=<server-only>
STORAGE_SECRET_ACCESS_KEY=<server-only>
PUBLIC_ASSET_BASE_URL=<HTTPS delivery origin for approved media>

OPENROUTER_API_KEY=<server-only>
OPENROUTER_PRIMARY_FREE_MODEL=<explicit verified :free model ID>
CHAT_DAILY_MODEL_LIMIT=40
```

Do not reuse a database key from an unrelated project. None of these live credentials was present during the initial build.

## Database and first owner

1. Enable managed Neon Auth on the intended AKL branch and configure the exact trusted application origins.
2. Create/verify the owner's identity through the supported Neon process (or sign up at /admin/sign-in with BOOTSTRAP_OWNER_EMAIL — account creation is otherwise invitation-only). Do not invent a password seed in the website.
3. Run `npm run db:migrate`. Migrations are checksummed and applied transactionally, never reset automatically on page load.
4. Set `BOOTSTRAP_OWNER_AUTH_USER_ID` to the verified identity and run `npm run admin:bootstrap` once. The script checks the managed identity's verified email and refuses if an active Super Admin already exists.
5. Sign in at `/admin/sign-in`. Add other staff through Super Admin invitations. Invitation links are single-use, expire after 48 hours and require the exact verified email. The UI provides a link for manual sharing; it does not claim an email was sent.
6. Use `npm run knowledge:import` to load 60 source-backed FAQ drafts. Review their facts/source pages and approve before including them in a Super Admin publication.

AKL roles are application memberships, not the provider's native admin role. Ordinary staff should remain ordinary upstream Auth users. Never grant provider-wide user management merely because the website labels someone Admin.

## Media storage

Use a dedicated private staging/original namespace and an approved public media namespace/domain. Configure CORS for PUT from the actual application origin with the required Content-Type header. The server issues short-lived upload URLs, checks bytes/format/dimensions, moves a verified original to a separate immutable key and creates 640/1440px WebP derivatives. Public variants have immutable URLs. Configure storage lifecycle cleanup for orphaned staging objects.

Uploads require alt text and source credits. The bundled stock images are illustrative; do not relabel them as AKL staff or locations. The selected logo is the original green/yellow identity, with a delivery-size derivative for navigation.

## Publishing

Save a draft, inspect the private homepage preview, then publish through the Publishing screen. Admins can publish routine content; official settings and new approved knowledge require Super Admin. A release stores an immutable content/knowledge manifest and updates the active pointer. Rollback makes a new content activation and does not rewind inquiries, membership or secrets.

Protected operations require a current membership. Elevated staff/rollback/knowledge approval operations also require a sign-in within the preceding 15 minutes. If prompted, sign out and sign in again; there is no hidden privilege override.

## Assistant and inquiries

`POST /api/chat` provides deterministic company/navigation answers and public approved retrieval. A configured, zero-priced `:free` model may be used only when there is supporting published knowledge and database-backed quota/cache state. Catalogue pricing is checked; there is no paid fallback. The model key is never sent to the browser.

`POST /api/inquiries` validates and stores employer briefs before success. A UUID idempotency key prevents duplicate submissions. No notification service is claimed enabled; the inquiry remains available to staff independently of email delivery.

## Before production

Verify the exact legal name, current credentials, profile publication approval, contact/link freshness, provider terms/quotas, retention policy, native-language copy and real-device responsiveness. Exercise real Neon sign-in, invitations, role concurrency, publication, inquiry persistence and storage in a dedicated test branch. Review the data/privacy text with the company. The application has not been pushed, deployed or connected to the production domain by this setup document.
