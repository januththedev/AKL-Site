import 'server-only';
import { headers } from 'next/headers';
import { createHash, randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { query, databaseConfigured } from './db';
import { samePublicOrigin } from '../policy';

export async function assertSameOrigin(request: Request) {
  if (!samePublicOrigin(request.headers.get('origin'),request.url,request.headers.get('host'),process.env.SITE_BASE_URL)) throw new Error('FORBIDDEN');
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new Error('FORBIDDEN');
}
export async function boundedJson(request: Request, limit = 60000) {
  if (Number(request.headers.get('content-length') || 0) > limit) throw new Error('PAYLOAD_TOO_LARGE');
  const reader = request.body?.getReader(); if (!reader) throw new Error('INVALID_REQUEST');
  const chunks: Uint8Array[] = []; let size = 0;
  try { while (true) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>limit){await reader.cancel();throw new Error('PAYLOAD_TOO_LARGE');} chunks.push(value); } }
  finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new Error('INVALID_REQUEST'); }
}
export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : 'INTERNAL_ERROR';
  const statuses: Record<string,number> = { UNAUTHENTICATED:401, REAUTHENTICATION_REQUIRED:401, EMAIL_VERIFICATION_REQUIRED:403, FORBIDDEN:403, NOT_FOUND:404, CONFLICT:409, LAST_SUPER_ADMIN:409, INVALID_REQUEST:400, INVITATION_INVALID:400, PAYLOAD_TOO_LARGE:413, RATE_LIMITED:429, INTEGRATION_NOT_CONFIGURED:503, DATABASE_NOT_CONFIGURED:503, AUTH_NOT_CONFIGURED:503, STORAGE_NOT_CONFIGURED:503 };
  const status = error instanceof ZodError ? 400 : statuses[message] || 500;
  const requestId = randomUUID();
  // Log the cause of unexpected failures (name + message only — never request bodies or personal data).
  if (status === 500) console.error('api error', requestId, error instanceof Error ? `${error.name}: ${error.message}` : 'unknown');
  const safeMessage = status===503 ? 'This service is not connected yet. Please use our phone or email.' : status===500 ? 'We could not complete that request. Please try again.' : error instanceof ZodError ? 'Please check the form fields.' : message.replaceAll('_',' ').toLowerCase();
  return Response.json({ok:false,error:{code:status===500?'INTERNAL_ERROR':error instanceof ZodError?'INVALID_REQUEST':message,message:safeMessage, ...(error instanceof ZodError ? {fields:error.flatten()} : {})},requestId},{status,headers:{'Cache-Control':'no-store'}});
}
export async function rateLimit(scope: string, limit: number, windowSeconds=60) {
  if (!databaseConfigured()) return; // no provider call or persistent write can occur without configured storage
  const address = clientAddress(await headers());
  const key = createHash('sha256').update(`${scope}:${address}`).digest('hex');
  const {rows}=await query<{hits:number}>(`INSERT INTO akl.rate_limits(key,hits,reset_at) VALUES($1,1,now()+$2*interval '1 second') ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN akl.rate_limits.reset_at<now() THEN 1 ELSE akl.rate_limits.hits+1 END, reset_at=CASE WHEN akl.rate_limits.reset_at<now() THEN now()+$2*interval '1 second' ELSE akl.rate_limits.reset_at END RETURNING hits`,[key,windowSeconds]);
  if(rows[0].hits>limit)throw new Error('RATE_LIMITED');
  // Occasionally purge expired buckets so the table cannot grow without bound.
  if(Math.random()<0.02) void query("DELETE FROM akl.rate_limits WHERE reset_at < now() - interval '1 day'").catch(()=>{});
}
/**
 * Client address for rate limiting. Prefer headers set by the hosting edge (Vercel sets x-real-ip and
 * x-vercel-forwarded-for and overwrites x-forwarded-for). For other proxies use the LAST x-forwarded-for hop,
 * which the nearest trusted proxy appended — the leftmost value is client-controlled.
 */
export function clientAddress(h: Headers) {
  const direct = h.get('x-real-ip') || h.get('x-vercel-forwarded-for')?.split(',')[0];
  if (direct?.trim()) return direct.trim();
  const hops = h.get('x-forwarded-for')?.split(',').map(x => x.trim()).filter(Boolean) || [];
  return hops.at(-1) || 'unknown';
}
