import 'server-only';
import { cache } from 'react';
import type { PoolClient } from 'pg';
import type { Member, PortfolioLink, PortfolioLinkRow } from '../types';
import { assertCapability } from '../policy';
import { allocateSlug, isPortfolioSlug, portfolioCreateSchema, portfolioDeleteSchema, portfolioStatus, portfolioStatusSchema, portfolioUpdateSchema } from '../portfolioValidation';
import { audit, databaseConfigured, query, transaction } from './db';
import { getSnapshot } from './content';

const COLUMNS = 'id,slug,company_name,contact_name,country,sectors,roles,intro_message,show_clients,is_active,expires_at,view_count,last_viewed_at,created_by,created_at,updated_at';
type Row = Omit<PortfolioLink, 'expires_at' | 'last_viewed_at' | 'created_at' | 'updated_at'> & { expires_at: Date | null; last_viewed_at: Date | null; created_at: Date; updated_at: Date };
const iso = (value: Date | null) => (value ? new Date(value).toISOString() : null);
function toLink(row: Row): PortfolioLink {
  return { ...row, sectors: row.sectors ?? [], roles: row.roles ?? [], expires_at: iso(row.expires_at), last_viewed_at: iso(row.last_viewed_at), created_at: iso(row.created_at)!, updated_at: iso(row.updated_at)! };
}
async function allowedSectors() { return (await getSnapshot()).content.industries.map((industry) => industry.slug); }
async function actorFor(client: PoolClient, member: Member, capability: string) {
  const actor = (await client.query<Member>('SELECT * FROM akl.admin_memberships WHERE id=$1 FOR SHARE', [member.id])).rows[0];
  if (!actor) throw new Error('FORBIDDEN');
  assertCapability(actor, capability);
  return actor;
}

export async function listPortfolioLinks(now = new Date()): Promise<PortfolioLinkRow[]> {
  const { rows } = await query<Row & { created_by_email: string | null; inquiry_count: number }>(
    `SELECT ${COLUMNS.split(',').map((c) => `l.${c}`).join(',')}, m.email AS created_by_email, (SELECT count(*) FROM akl.inquiries i WHERE i.portfolio_link_id=l.id)::int AS inquiry_count
     FROM akl.portfolio_links l LEFT JOIN akl.admin_memberships m ON m.id=l.created_by ORDER BY l.created_at DESC LIMIT 500`);
  return rows.map(({ created_by_email, inquiry_count, ...row }) => { const link = toLink(row); return { ...link, status: portfolioStatus(link, now), inquiry_count, created_by_email }; });
}

export async function createPortfolioLink(member: Member, input: unknown): Promise<PortfolioLinkRow> {
  const data = portfolioCreateSchema(await allowedSectors()).parse(input);
  return transaction(async (c) => {
    await actorFor(c, member, 'portfolio');
    // The slug is claimed atomically: a collision inserts nothing and the helper draws a new random suffix.
    const { value } = await allocateSlug(data.company_name, async (slug) => (await c.query<Row>(
      `INSERT INTO akl.portfolio_links(slug,company_name,contact_name,country,sectors,roles,intro_message,show_clients,expires_at,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(slug) DO NOTHING RETURNING ${COLUMNS}`,
      [slug, data.company_name, data.contact_name, data.country, data.sectors, data.roles, data.intro_message, data.show_clients, data.expires_at, member.id])).rows[0] ?? null);
    const link = toLink(value);
    await audit(c, member.id, 'portfolio.created', link.id, { slug: link.slug, company: link.company_name });
    return { ...link, status: portfolioStatus(link), inquiry_count: 0, created_by_email: member.email };
  });
}

export async function updatePortfolioLink(member: Member, input: unknown): Promise<PortfolioLink> {
  const data = portfolioUpdateSchema(await allowedSectors()).parse(input);
  return transaction(async (c) => {
    await actorFor(c, member, 'portfolio');
    // The slug never changes after creation, so links that were already sent keep working.
    const row = (await c.query<Row>(
      `UPDATE akl.portfolio_links SET company_name=$2,contact_name=$3,country=$4,sectors=$5,roles=$6,intro_message=$7,show_clients=$8,expires_at=$9,updated_at=now()
       WHERE id=$1 RETURNING ${COLUMNS}`,
      [data.id, data.company_name, data.contact_name, data.country, data.sectors, data.roles, data.intro_message, data.show_clients, data.expires_at])).rows[0];
    if (!row) throw new Error('NOT_FOUND');
    await audit(c, member.id, 'portfolio.updated', data.id, { slug: row.slug });
    return toLink(row);
  });
}

export async function setPortfolioLinkActive(member: Member, input: unknown) {
  const data = portfolioStatusSchema.parse(input);
  return transaction(async (c) => {
    await actorFor(c, member, 'portfolio');
    const row = (await c.query<{ id: string; slug: string; is_active: boolean }>('UPDATE akl.portfolio_links SET is_active=$2,updated_at=now() WHERE id=$1 RETURNING id,slug,is_active', [data.id, data.active])).rows[0];
    if (!row) throw new Error('NOT_FOUND');
    await audit(c, member.id, data.active ? 'portfolio.enabled' : 'portfolio.disabled', data.id, { slug: row.slug });
    return row;
  });
}

/** Permanent removal. Super Admin only; inquiries that came through the link are kept (portfolio_link_id becomes NULL). */
export async function deletePortfolioLink(member: Member, input: unknown) {
  const data = portfolioDeleteSchema.parse(input);
  return transaction(async (c) => {
    await actorFor(c, member, 'portfolio.delete');
    const row = (await c.query<{ slug: string; company_name: string }>('DELETE FROM akl.portfolio_links WHERE id=$1 RETURNING slug,company_name', [data.id])).rows[0];
    if (!row) throw new Error('NOT_FOUND');
    await audit(c, member.id, 'portfolio.deleted', data.id, { slug: row.slug, company: row.company_name });
    return { id: data.id };
  });
}

export type PortfolioLookup =
  | { kind: 'ok'; link: PortfolioLink }
  | { kind: 'not_found' }                             // unknown slug (HTTP 404)
  | { kind: 'gone'; reason: 'disabled' | 'expired' }  // disabled or past expiry (HTTP 410)
  | { kind: 'unavailable' };                          // database error: do not claim the link is invalid
/** Public lookup by slug. Read-only (counting a view is a separate, explicit step); memoised per request. */
export const lookupPortfolioLink = cache(async (slug: string): Promise<PortfolioLookup> => {
  if (!isPortfolioSlug(slug) || !databaseConfigured()) return { kind: 'not_found' };
  try {
    const row = (await query<Row>(`SELECT ${COLUMNS} FROM akl.portfolio_links WHERE slug=$1`, [slug])).rows[0];
    if (!row) return { kind: 'not_found' };
    const link = toLink(row);
    const status = portfolioStatus(link);
    return status === 'active' ? { kind: 'ok', link } : { kind: 'gone', reason: status };
  } catch {
    console.warn('Portfolio link lookup unavailable.');
    return { kind: 'unavailable' };
  }
});

/** Atomic increment (no read-modify-write). Only counts a link that is still active and unexpired. */
export async function recordPortfolioView(id: string) {
  await query("UPDATE akl.portfolio_links SET view_count=view_count+1,last_viewed_at=now() WHERE id=$1 AND is_active AND (expires_at IS NULL OR expires_at>now())", [id]);
}
