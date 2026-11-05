import type { Moment, SiteContent } from './types';

/**
 * Pure helpers for the staff workspace: what changed between two versions of the site content, which Moments
 * the opening sequence will use, and field-level validation of Moments before a draft is saved.
 * No server or browser imports, so the same code runs in the admin UI and in tests.
 */

/** The opening shows at most this many photographs (see introPhotoSources in lib/moments.ts). */
export const INTRO_FRAME_LIMIT = 6;

export type ChangeKind = 'added' | 'removed' | 'changed' | 'reordered';
export type Change = { area: string; kind: ChangeKind; label: string; detail?: string };
export type IntroPlan = {
  /** Every Moment flagged "use in opening", in gallery order. */
  selected: Moment[];
  /** The ones the opening will actually show (first INTRO_FRAME_LIMIT). */
  used: Moment[];
  /** Flagged but beyond the limit, so not shown. */
  overflow: Moment[];
  limit: number;
  /** With nothing selected the opening falls back to bundled stock photographs. */
  usesStock: boolean;
};
export type ContentDiff = {
  changes: Change[];
  counts: Record<ChangeKind, number>;
  /** Official settings differ: publishing needs a Super Admin. */
  settingsChanged: boolean;
  intro: { before: IntroPlan; after: IntroPlan; changed: boolean };
};

/* ------------------------------------------------------------------ equality */

function trimStrings(value: unknown): unknown {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(trimStrings);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, trimStrings(v)]));
  return value;
}
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  const ao = a as Record<string, unknown>, bo = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(ao), ...Object.keys(bo)]);
  for (const k of keys) if (!deepEqual(ao[k], bo[k])) return false;
  return true;
}
/** Key-order independent comparison that ignores leading/trailing whitespace (the server trims on save). */
export function sameContent(a: unknown, b: unknown) { return deepEqual(trimStrings(a), trimStrings(b)); }

/* ------------------------------------------------------------------ intro */

export function introPlan(moments: Moment[], limit = INTRO_FRAME_LIMIT): IntroPlan {
  const selected = moments.filter(m => m.useInIntro);
  return { selected, used: selected.slice(0, limit), overflow: selected.slice(limit), limit, usesStock: selected.length === 0 };
}

/* ------------------------------------------------------------------ diff */

const AREAS: Record<string, string> = { home: 'Homepage', employers: 'Employer portfolio', about: 'Our story', story: 'Company narrative', settings: 'Official settings', industries: 'Industries', destinations: 'Destinations', moments: 'Moments gallery' };
const FIELD_LABELS: Record<string, string> = { eyebrow: 'Eyebrow', heading: 'Heading', accent: 'Accent line', intro: 'Introduction', image: 'Image', body: 'Body', closing: 'Closing line', brand: 'Brand name', phone: 'Phone', email: 'Email', address: 'Address', careersUrl: 'Careers link', facebookUrl: 'Facebook link', profileUrl: 'Company profile link', title: 'Title', description: 'Description', region: 'Region', roles: 'Role families', slug: 'Web address', alt: 'Alt text', credit: 'Credit', location: 'Location', date: 'Date', thumbnail: 'Thumbnail' };
export function fieldLabel(key: string) { return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, c => c.toUpperCase()); }
export function excerpt(value: unknown, max = 70) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}
const quote = (value: unknown) => { const x = excerpt(value); return x ? `"${x}"` : '(empty)'; };

function diffFields(area: string, prefix: string, before: Record<string, unknown>, after: Record<string, unknown>, skip: string[] = []): Change[] {
  const out: Change[] = [];
  for (const key of [...new Set([...Object.keys(after), ...Object.keys(before)])]) {
    if (skip.includes(key) || sameContent(before[key], after[key])) continue;
    const label = `${prefix}${fieldLabel(key)}`;
    if (key === 'roles' && Array.isArray(before[key]) && Array.isArray(after[key])) {
      const b = before[key] as string[], a = after[key] as string[];
      const added = a.filter(x => !b.includes(x)), removed = b.filter(x => !a.includes(x));
      const parts = [added.length && `added ${added.map(x => `"${x}"`).join(', ')}`, removed.length && `removed ${removed.map(x => `"${x}"`).join(', ')}`].filter(Boolean);
      out.push({ area, kind: 'changed', label, detail: parts.join('; ') || 'order changed' });
    } else out.push({ area, kind: 'changed', label, detail: `${quote(before[key])} → ${quote(after[key])}` });
  }
  return out;
}

function diffBySlug<T extends { slug: string; title: string }>(area: string, before: T[], after: T[]): Change[] {
  const out: Change[] = [];
  const b = new Map(before.map(x => [x.slug, x])), a = new Map(after.map(x => [x.slug, x]));
  for (const item of after) if (!b.has(item.slug)) out.push({ area, kind: 'added', label: `Added "${item.title}"`, detail: `web address /${item.slug}` });
  for (const item of before) if (!a.has(item.slug)) out.push({ area, kind: 'removed', label: `Removed "${item.title}"`, detail: `web address /${item.slug}` });
  for (const item of after) { const old = b.get(item.slug); if (old) out.push(...diffFields(area, `${item.title} — `, old as unknown as Record<string, unknown>, item as unknown as Record<string, unknown>, ['slug'])); }
  const common = (list: T[], other: Map<string, T>) => list.filter(x => other.has(x.slug)).map(x => x.slug);
  if (!deepEqual(common(before, a), common(after, b))) out.push({ area, kind: 'reordered', label: 'Order changed' });
  return out;
}

function diffMoments(before: Moment[], after: Moment[]): Change[] {
  const area = AREAS.moments, out: Change[] = [];
  const b = new Map(before.map(x => [x.id, x])), a = new Map(after.map(x => [x.id, x]));
  for (const m of after) if (!b.has(m.id)) out.push({ area, kind: 'added', label: `Added "${m.title}"`, detail: [m.date, m.location, m.useInIntro && 'selected for the opening'].filter(Boolean).join(' · ') });
  for (const m of before) if (!a.has(m.id)) out.push({ area, kind: 'removed', label: `Removed "${m.title}"`, detail: [m.date, m.location].filter(Boolean).join(' · ') });
  for (const m of after) {
    const old = b.get(m.id); if (!old) continue;
    out.push(...diffFields(area, `"${m.title}" — `, old as unknown as Record<string, unknown>, m as unknown as Record<string, unknown>, ['id', 'permissionConfirmed', 'useInIntro']));
    if (old.useInIntro !== m.useInIntro) out.push({ area, kind: 'changed', label: `"${m.title}" — opening`, detail: m.useInIntro ? 'now selected for the opening' : 'no longer selected for the opening' });
  }
  const common = (list: Moment[], other: Map<string, Moment>) => list.filter(x => other.has(x.id)).map(x => x.id);
  if (!deepEqual(common(before, a), common(after, b))) out.push({ area, kind: 'reordered', label: 'Gallery order changed' });
  return out;
}

const ids = (moments: Moment[]) => moments.map(m => m.id);

/** Human-readable summary of what publishing `after` would change compared with the live `before`. */
export function diffContent(before: SiteContent, after: SiteContent): ContentDiff {
  const changes: Change[] = [];
  for (const key of ['home', 'employers', 'about', 'story', 'settings'] as const)
    changes.push(...diffFields(AREAS[key], '', before[key] as unknown as Record<string, unknown>, after[key] as unknown as Record<string, unknown>));
  changes.push(...diffBySlug(AREAS.industries, before.industries, after.industries));
  changes.push(...diffBySlug(AREAS.destinations, before.destinations, after.destinations));
  changes.push(...diffMoments(before.moments ?? [], after.moments ?? []));

  const planBefore = introPlan(before.moments ?? []), planAfter = introPlan(after.moments ?? []);
  const introChanged = !deepEqual(ids(planBefore.used), ids(planAfter.used)) || planBefore.usesStock !== planAfter.usesStock;
  if (introChanged) {
    const names = (p: IntroPlan) => p.usesStock ? 'bundled stock photographs' : `${p.used.length} photo${p.used.length === 1 ? '' : 's'}: ${p.used.map(m => `"${m.title}"`).join(', ')}`;
    changes.push({ area: 'Opening sequence', kind: 'changed', label: 'Photographs shown in the opening', detail: `${names(planBefore)} → ${names(planAfter)}` });
  }
  const counts: Record<ChangeKind, number> = { added: 0, removed: 0, changed: 0, reordered: 0 };
  for (const c of changes) counts[c.kind]++;
  return { changes, counts, settingsChanged: !sameContent(before.settings, after.settings), intro: { before: planBefore, after: planAfter, changed: introChanged } };
}

/** Changes grouped by area, keeping the order areas first appear in. */
export function groupChanges(changes: Change[]) {
  const groups = new Map<string, Change[]>();
  for (const c of changes) groups.set(c.area, [...(groups.get(c.area) ?? []), c]);
  return [...groups].map(([area, items]) => ({ area, items }));
}

/* ------------------------------------------------------------------ field errors */

/** Zod issues → { "moments.0.title": ["…"] }. Issues without a path are filed under "_form". */
export function issuePaths(issues: readonly { path: readonly PropertyKey[]; message: string }[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.length ? issue.path.map(String).join('.') : '_form';
    (out[key] ||= []).includes(issue.message) || out[key].push(issue.message);
  }
  return out;
}
/** Plain-language version of the validator's wording. */
export function friendlyIssue(message: string): string {
  const small = /expected string to have >=(\d+) characters/.exec(message);
  if (small) return Number(small[1]) <= 1 ? 'This cannot be empty.' : `Enter at least ${small[1]} characters.`;
  const big = /expected string to have <=(\d+) characters/.exec(message);
  if (big) return `Too long: the maximum is ${big[1]} characters.`;
  if (/Too big: expected array to have <=(\d+) items/.test(message)) return `Too many items: the maximum is ${/<=(\d+)/.exec(message)![1]}.`;
  if (/Invalid ISO date/i.test(message)) return 'Enter a valid date.';
  if (/Invalid email/i.test(message)) return 'Enter a valid email address.';
  if (/expected true/i.test(message)) return 'This must be confirmed.';
  if (/Invalid input: expected string/i.test(message)) return 'This is required.';
  return message;
}
/** Messages for a field path, including nested paths (e.g. "industries.0.roles" also matches "industries.0.roles.2"). */
export function errorsFor(paths: Record<string, string[]> | undefined, path: string): string[] {
  if (!paths) return [];
  return Object.entries(paths).filter(([k]) => k === path || k.startsWith(`${path}.`)).flatMap(([, v]) => v.map(friendlyIssue));
}

/* ------------------------------------------------------------------ Moments validation */

export type MomentFields = Pick<Moment, 'title' | 'date' | 'credit' | 'alt' | 'location' | 'image'> & { permissionConfirmed: boolean };
export type MomentFieldErrors = Partial<Record<'title' | 'date' | 'credit' | 'alt' | 'location' | 'image' | 'permissionConfirmed', string>>;
/** Today's calendar date in Sri Lanka (YYYY-MM-DD). */
export function colomboToday(now = new Date()) { return now.toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }); }
export function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
/** Mirrors the server's momentSchema plus "a photograph cannot be dated in the future". */
export function validateMomentFields(m: MomentFields, today = colomboToday()): MomentFieldErrors {
  const e: MomentFieldErrors = {};
  const title = m.title.trim();
  if (!title) e.title = 'Write a caption for this photograph.'; else if (title.length > 120) e.title = 'Keep the caption to 120 characters or fewer.';
  if (!m.date) e.date = 'Choose the date the photograph was taken.';
  else if (!isRealDate(m.date)) e.date = 'Enter a valid date.';
  else if (m.date > today) e.date = 'The date cannot be in the future.';
  if (!m.credit.trim()) e.credit = 'Add the photographer or source credit.'; else if (m.credit.trim().length > 250) e.credit = 'Keep the credit to 250 characters or fewer.';
  if (!m.alt.trim()) e.alt = 'Add alt text describing the photograph.'; else if (m.alt.trim().length > 300) e.alt = 'Keep the alt text to 300 characters or fewer.';
  if (m.location.trim().length > 120) e.location = 'Keep the location to 120 characters or fewer.';
  if (!m.image) e.image = 'Choose a verified image.';
  if (m.permissionConfirmed !== true) e.permissionConfirmed = 'Confirm that you have permission to publish this photograph.';
  return e;
}
/** Validate a whole gallery; returns server-style paths ("moments.2.title") so one renderer serves both. */
export function validateMomentsPaths(moments: Moment[], today = colomboToday()): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  moments.forEach((m, i) => { for (const [k, v] of Object.entries(validateMomentFields(m, today))) out[`moments.${i}.${k}`] = [v!]; });
  if (moments.length > 100) out.moments = ['The gallery supports up to 100 moments.'];
  return out;
}
