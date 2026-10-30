import type { Member, Role, SiteContent } from './types';

export const MEMBER_LOCK = 6031980;
export const elevatedCapabilities = ['members', 'settings', 'knowledge.approve', 'rollback', 'inquiries.export', 'inquiries.erase', 'audit', 'integrations'] as const;
const routine = new Set(['dashboard','content.edit','content.publish','media','knowledge','inquiries','preview']);
export function can(role: Role, capability: string) {
  if (routine.has(capability)) return role === 'admin' || role === 'super_admin';
  return role === 'super_admin' && elevatedCapabilities.some((item) => capability === item || capability.startsWith(`${item}.`));
}
export function assertCapability(member: Member, capability: string) {
  if (!member.active || !can(member.role, capability)) throw new Error('FORBIDDEN');
}
export function protectsLastOwner(target: Pick<Member, 'role' | 'active'>, next: Pick<Member, 'role' | 'active'>, activeOwnerCount: number) {
  return target.active && target.role === 'super_admin' && (!next.active || next.role !== 'super_admin') && activeOwnerCount <= 1;
}
export function criticalContentChanged(before: SiteContent, after: SiteContent) {
  return JSON.stringify(before.settings) !== JSON.stringify(after.settings);
}
export function safeMediaPath(value: string) {
  if (/^\/media\/[a-z0-9-]+\.webp$/.test(value)) return true;
  const base = process.env.PUBLIC_ASSET_BASE_URL;
  if (!base) return false;
  try { const u = new URL(value); const b = new URL(base); return u.protocol === 'https:' && u.origin === b.origin && !u.username && !u.password; } catch { return false; }
}
export function safePublicUrl(value: string) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; }
}
export function samePublicOrigin(origin:string|null,requestUrl:string,host:string|null,configuredOrigin?:string) {
  if(!origin)return false;
  try {
    const caller=new URL(origin);
    if(!['http:','https:'].includes(caller.protocol))return false;
    if(configuredOrigin)return caller.origin===new URL(configuredOrigin).origin;
    // Next may construct request.url with its internal bind address behind a
    // reverse proxy. The browser-controlled Host is the public request target.
    return caller.host===(host||new URL(requestUrl).host);
  }catch{return false;}
}
