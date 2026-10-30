import 'server-only';
import { createNeonAuth } from '@neondatabase/auth/next/server';
import { query, databaseConfigured } from './db';
import { assertCapability } from '../policy';
import type { Member } from '../types';

let instance: ReturnType<typeof createNeonAuth> | undefined;
export function authConfigured() { return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET && process.env.NEON_AUTH_COOKIE_SECRET.length >= 32); }
export function getAuth() {
  if (!authConfigured()) throw new Error('AUTH_NOT_CONFIGURED');
  instance ??= createNeonAuth({ baseUrl: process.env.NEON_AUTH_BASE_URL!, cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET!, sessionDataTtl: 0 }, logLevel: 'silent' });
  return instance;
}
export async function currentIdentity() {
  if (!authConfigured()) return null;
  const { data } = await getAuth().getSession();
  return data?.user ?? null;
}
export async function currentMember(): Promise<Member | null> {
  if (!authConfigured() || !databaseConfigured()) return null;
  const user = await currentIdentity();
  if (!user) return null;
  const { rows } = await query<Member>('SELECT * FROM akl.admin_memberships WHERE auth_user_id=$1 AND active=true',[user.id]);
  return rows[0] ?? null;
}
export async function requireMember(capability = 'dashboard') {
  if (!authConfigured() || !databaseConfigured()) throw new Error('INTEGRATION_NOT_CONFIGURED');
  const identity = await currentIdentity();
  if (!identity) throw new Error('UNAUTHENTICATED');
  const { rows } = await query<Member>('SELECT * FROM akl.admin_memberships WHERE auth_user_id=$1 AND active=true',[identity.id]);
  const member = rows[0];
  if (!member) throw new Error('FORBIDDEN');
  assertCapability(member, capability);
  return member;
}
