import { getAuth } from '@/lib/server/auth';
import { apiError, assertSameOrigin, boundedJson, rateLimit } from '@/lib/server/http';
import { databaseConfigured, query } from '@/lib/server/db';

type Context = { params: Promise<{ path: string[] }> };

/**
 * Pass-through to managed Neon Auth, narrowed to what the staff sign-in and invitation flows use.
 * Provider admin/organisation/API-key endpoints are never reachable from the public site, and
 * account creation is invitation-only: sign-up needs a pending, unexpired AKL invitation for that
 * email (or the BOOTSTRAP_OWNER_EMAIL before the first Super Admin exists).
 */
const POST_ALLOWED = new Set([
  'sign-in/email', 'sign-up/email', 'sign-out',
  'send-verification-email', 'verify-email', 'request-password-reset', 'reset-password',
]);
const GET_BLOCKED = /^(admin|organization|api-key|multi-session|list-sessions|list-accounts|revoke)/;

const pathOf = async (context: Context) => (await context.params).path.join('/');

export async function GET(request: Request, context: Context) {
  try {
    if (GET_BLOCKED.test(await pathOf(context))) throw new Error('NOT_FOUND');
    return await getAuth().handler().GET(request, context);
  } catch (e) { return apiError(e); }
}

export async function POST(request: Request, context: Context) {
  try {
    const path = await pathOf(context);
    if (!POST_ALLOWED.has(path)) throw new Error('NOT_FOUND');
    await assertSameOrigin(request);
    await rateLimit('auth', 10, 60);
    if (path === 'sign-up/email') await assertInvited(request.clone());
    return await getAuth().handler().POST(request, context);
  } catch (e) { return apiError(e); }
}

async function assertInvited(request: Request) {
  if (!databaseConfigured()) throw new Error('FORBIDDEN');
  const body = await boundedJson(request, 8000);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) throw new Error('INVALID_REQUEST');
  const owner = process.env.BOOTSTRAP_OWNER_EMAIL?.trim().toLowerCase();
  if (owner && email === owner) {
    const { rows } = await query<{ n: string }>("SELECT count(*) AS n FROM akl.admin_memberships WHERE role='super_admin' AND active=true");
    if (Number(rows[0]?.n) === 0) return;
  }
  const { rows } = await query("SELECT 1 FROM akl.admin_invitations WHERE lower(email)=$1 AND state='pending' AND expires_at>now() LIMIT 1", [email]);
  if (!rows.length) throw new Error('FORBIDDEN');
}
