import 'server-only';
import { cache } from 'react';
import { defaultContent } from '@/content/default';
import type { KnowledgeEntry, Member, Release, SiteContent } from '../types';
import { query, transaction, audit, databaseConfigured } from './db';
import { assertCapability, can, criticalContentChanged } from '../policy';
import { contentSchema } from '../validation';

export type Snapshot = { id: string; content: SiteContent; knowledge: KnowledgeEntry[] };
let lastSnapshot: Snapshot = { id: 'source-defaults', content: defaultContent, knowledge: [] };
/** Public pages read the active release at most every SNAPSHOT_TTL_MS per server instance (not on every view). */
const SNAPSHOT_TTL_MS = 20_000;
let snapshotFetchedAt = 0;
export function invalidateSnapshot() { snapshotFetchedAt = 0; }
export const getSnapshot = cache(async (): Promise<Snapshot> => {
  if (!databaseConfigured()) return lastSnapshot;
  if (Date.now() - snapshotFetchedAt < SNAPSHOT_TTL_MS) return lastSnapshot;
  try {
    const {rows}=await query<Release>('SELECT r.* FROM akl.site_state s JOIN akl.content_releases r ON r.id=s.active_release_id WHERE s.singleton=true');
    if(rows[0]) lastSnapshot={id:rows[0].id,content:contentSchema.parse(rows[0].manifest.content),knowledge:rows[0].manifest.knowledge||[]};
    snapshotFetchedAt = Date.now();
    return lastSnapshot;
  } catch (error) {
    // Keep serving the last good snapshot; log loudly so a schema/release problem is noticed.
    console.error('Public content unavailable; serving the last known snapshot.', error instanceof Error ? `${error.name}: ${error.message}` : '');
    return lastSnapshot;
  }
});
export async function getDraft() {
  const {rows}=await query<{value:SiteContent;version:number}>('SELECT value,version FROM akl.content_drafts WHERE key=$1',['site']);
  return rows[0] ? {content:contentSchema.parse(rows[0].value),version:rows[0].version} : {content:(await getSnapshot()).content,version:0};
}
export async function saveDraft(member:Member, content:SiteContent, expectedVersion:number) {
  const clean=contentSchema.parse(content);
  return transaction(async c=>{
    const actor=(await c.query<Member>('SELECT * FROM akl.admin_memberships WHERE id=$1 FOR SHARE',[member.id])).rows[0];
    if(!actor)throw new Error('FORBIDDEN');assertCapability(actor,'content.edit');
    await c.query('SELECT pg_advisory_xact_lock(6031981)');
    const row=(await c.query<{version:number;value:unknown}>('SELECT version,value FROM akl.content_drafts WHERE key=$1 FOR UPDATE',['site'])).rows[0];
    if((row?.version||0)!==expectedVersion)throw new Error('CONFLICT');
    // Official settings (contact details, careers/profile/Facebook links) are Super Admin only.
    // Admins keep whatever the current draft (or live release) has, so they cannot plant links
    // that a Super Admin later publishes without noticing.
    if(!can(actor.role,'settings')){
      const live=(await c.query<Release>('SELECT r.* FROM akl.site_state s JOIN akl.content_releases r ON r.id=s.active_release_id WHERE s.singleton=true')).rows[0];
      const base=contentSchema.parse(row?.value ?? live?.manifest.content ?? defaultContent);
      clean.settings=base.settings;
    }
    const result=await c.query('INSERT INTO akl.content_drafts(key,value,version,updated_by) VALUES($1,$2,1,$3) ON CONFLICT(key) DO UPDATE SET value=$2,version=akl.content_drafts.version+1,updated_by=$3,updated_at=now() RETURNING version',['site',JSON.stringify(clean),member.id]);
    await audit(c,member.id,'draft.saved','site',{version:result.rows[0].version});
    return result.rows[0].version as number;
  });
}
export async function publishDraft(member:Member, expectedVersion:number, message:string) {
  return transaction(async c=>{
    await c.query('SELECT pg_advisory_xact_lock(6031981)');
    const actor=(await c.query<Member>('SELECT * FROM akl.admin_memberships WHERE id=$1 FOR SHARE',[member.id])).rows[0];
    if(!actor)throw new Error('FORBIDDEN');assertCapability(actor,'content.publish');
    const draft=(await c.query('SELECT value,version FROM akl.content_drafts WHERE key=$1 FOR UPDATE',['site'])).rows[0];
    if(!draft||draft.version!==expectedVersion)throw new Error('CONFLICT');
    const content=contentSchema.parse(draft.value);
    const previous=(await c.query<Release>('SELECT r.* FROM akl.site_state s JOIN akl.content_releases r ON r.id=s.active_release_id WHERE s.singleton=true')).rows[0];
    // Parse the stored release too: jsonb reorders keys, so comparing raw JSON would always look "changed".
    if(criticalContentChanged(contentSchema.parse(previous?.manifest.content||defaultContent),content))assertCapability(actor,'settings');
    const knowledge=actor.role==='super_admin'?(await c.query<KnowledgeEntry>("SELECT * FROM akl.knowledge_entries WHERE state IN ('approved','published') AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL AND (valid_until IS NULL OR valid_until>now())")).rows:(previous?.manifest.knowledge||[]);
    const {rows}=await c.query<{id:string}>('INSERT INTO akl.content_releases(manifest,message,published_by) VALUES($1,$2,$3) RETURNING id',[JSON.stringify({content,knowledge}),message,member.id]);
    await c.query('UPDATE akl.site_state SET active_release_id=$1,updated_at=now() WHERE singleton=true',[rows[0].id]);
    await audit(c,member.id,'release.published',rows[0].id,{message,draftVersion:expectedVersion});
    invalidateSnapshot();
    return rows[0].id;
  });
}
export async function rollback(member:Member,releaseId:string) {
  return transaction(async c=>{
    await c.query('SELECT pg_advisory_xact_lock(6031981)');
    const actor=(await c.query<Member>('SELECT * FROM akl.admin_memberships WHERE id=$1 FOR SHARE',[member.id])).rows[0];
    if(!actor)throw new Error('FORBIDDEN');assertCapability(actor,'rollback');
    const previous=(await c.query<Release>('SELECT * FROM akl.content_releases WHERE id=$1',[releaseId])).rows[0];
    if(!previous)throw new Error('NOT_FOUND');
    const content=contentSchema.parse(previous.manifest.content);
    const knowledge=previous.manifest.knowledge.filter(x=>!x.valid_until||new Date(x.valid_until)>new Date());
    const {rows}=await c.query<{id:string}>('INSERT INTO akl.content_releases(manifest,message,published_by,source_release_id) VALUES($1,$2,$3,$4) RETURNING id',[JSON.stringify({content,knowledge}),`Restore ${releaseId}`,member.id,releaseId]);
    await c.query('UPDATE akl.site_state SET active_release_id=$1,updated_at=now() WHERE singleton=true',[rows[0].id]);
    // Reset the draft to the restored content so "Publish draft" doesn't silently re-publish what was rolled back.
    await c.query('INSERT INTO akl.content_drafts(key,value,version,updated_by) VALUES($1,$2,1,$3) ON CONFLICT(key) DO UPDATE SET value=$2,version=akl.content_drafts.version+1,updated_by=$3,updated_at=now()',['site',JSON.stringify(content),member.id]);
    await audit(c,member.id,'release.restored',rows[0].id,{source:releaseId});
    invalidateSnapshot();
    return rows[0].id;
  });
}
