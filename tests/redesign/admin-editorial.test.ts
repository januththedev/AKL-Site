import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultContent } from '../../content/default';
import { contentSchema } from '../../lib/validation';
import { introPhotoSources } from '../../lib/moments';
import type { Moment, SiteContent } from '../../lib/types';
import { INTRO_FRAME_LIMIT, diffContent, errorsFor, friendlyIssue, groupChanges, introPlan, isRealDate, issuePaths, sameContent, validateMomentFields, validateMomentsPaths } from '../../lib/contentDiff';
import { ApiError, classify, errorFromResponse, messageFor, stepState, storageUploadMessage, toMessage, toProblem } from '../../components/admin/adminErrors';

const clone = <T,>(x: T): T => structuredClone(x);
const moment = (n: number, over: Partial<Moment> = {}): Moment => ({ id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`, title: `Moment ${n}`, image: '/media/hero-team.webp', thumbnail: '/media/hero-team.webp', alt: `Alt ${n}`, credit: 'AKL', location: 'Colombo', date: '2026-01-02', useInIntro: false, permissionConfirmed: true, ...over });
const withMoments = (moments: Moment[]): SiteContent => ({ ...clone(defaultContent), moments });

test('identical content produces no changes and equality ignores key order and edge whitespace', () => {
  const diff = diffContent(defaultContent, clone(defaultContent));
  assert.deepEqual(diff.changes, []);
  assert.equal(diff.settingsChanged, false);
  assert.equal(diff.intro.changed, false);
  assert.equal(sameContent({ a: 1, b: ['x '] }, { b: ['x'], a: 1 }), true);
  assert.equal(sameContent({ a: 'x' }, { a: 'y' }), false);
});

test('page copy and settings edits are reported with before and after text', () => {
  const after = clone(defaultContent);
  after.home.heading = 'A brand new heading';
  after.settings.phone = '+94 11 000 0000';
  const diff = diffContent(defaultContent, after);
  const heading = diff.changes.find(c => c.area === 'Homepage' && c.label === 'Heading');
  assert.ok(heading?.detail?.includes('A brand new heading') && heading.detail.includes('→'));
  assert.equal(diff.settingsChanged, true);
  assert.equal(diff.counts.changed, 2);
});

test('industries are matched by slug: added, removed, changed, role lists and reorder', () => {
  const after = clone(defaultContent);
  const [first, second, ...rest] = after.industries;
  const added = { ...clone(first), slug: 'brand-new', title: 'Brand new' };
  after.industries = [second, { ...first, roles: [...first.roles, 'Brand-new role'] }, added, ...rest.slice(1)];
  const removed = rest[0];
  const diff = diffContent(defaultContent, after);
  assert.ok(diff.changes.some(c => c.kind === 'added' && c.label === 'Added "Brand new"'));
  assert.ok(diff.changes.some(c => c.kind === 'removed' && c.label === `Removed "${removed.title}"`));
  assert.ok(diff.changes.some(c => c.kind === 'changed' && c.label.endsWith('Role families') && c.detail === 'added "Brand-new role"'));
  assert.ok(diff.changes.some(c => c.kind === 'reordered'));
});

test('moments: add, remove, edit, selection and reorder are each described', () => {
  const [a, b, c] = [moment(1, { useInIntro: true }), moment(2), moment(3)];
  const before = withMoments([a, b]);
  const after = withMoments([{ ...b, title: 'Renamed', useInIntro: true }, a, c]);
  const diff = diffContent(before, after);
  const labels = diff.changes.map(x => x.label);
  assert.ok(labels.includes('Added "Moment 3"'));
  assert.ok(labels.some(l => l.includes('Title')) && diff.changes.some(x => x.detail?.includes('"Moment 2" → "Renamed"')));
  assert.ok(diff.changes.some(x => x.label.endsWith('— opening') && x.detail === 'now selected for the opening'));
  assert.ok(diff.changes.some(x => x.kind === 'reordered' && x.label === 'Gallery order changed'));
  const removed = diffContent(before, withMoments([a]));
  assert.ok(removed.changes.some(x => x.kind === 'removed' && x.label === 'Removed "Moment 2"'));
});

test('the opening plan uses the real six-frame limit, matching what Intro receives', () => {
  const moments = Array.from({ length: 9 }, (_, i) => moment(i + 1, { useInIntro: i !== 2 }));
  const plan = introPlan(moments);
  assert.equal(INTRO_FRAME_LIMIT, 6);
  assert.equal(plan.selected.length, 8);
  assert.equal(plan.used.length, 6);
  assert.equal(plan.overflow.length, 2);
  assert.deepEqual(plan.used.map(m => m.thumbnail), introPhotoSources(moments, ['/stock.webp']));
  assert.equal(introPhotoSources(moments, []).length, plan.limit);
  assert.equal(plan.usesStock, false);
  assert.equal(introPlan(moments.map(m => ({ ...m, useInIntro: false }))).usesStock, true);
  // gallery order decides which frames are used
  assert.deepEqual(introPlan(moments).used.map(m => m.title), ['Moment 1', 'Moment 2', 'Moment 4', 'Moment 5', 'Moment 6', 'Moment 7']);
});

test('a change in the opening frames is summarised, including fallback to stock', () => {
  const live = withMoments([moment(1, { useInIntro: true }), moment(2, { useInIntro: true })]);
  const draft = withMoments([moment(2, { useInIntro: true }), moment(1, { useInIntro: true })]);
  const reordered = diffContent(live, draft);
  assert.equal(reordered.intro.changed, true);
  assert.ok(reordered.changes.some(c => c.area === 'Opening sequence'));
  const toStock = diffContent(live, withMoments([moment(1), moment(2)]));
  assert.equal(toStock.intro.after.usesStock, true);
  assert.ok(toStock.changes.find(c => c.area === 'Opening sequence')?.detail?.includes('bundled stock photographs'));
  // overflow reshuffle that does not change the used frames is not an intro change
  const many = Array.from({ length: 8 }, (_, i) => moment(i + 1, { useInIntro: true }));
  assert.equal(diffContent(withMoments(many), withMoments([...many.slice(0, 6), many[7], many[6]])).intro.changed, false);
});

test('changes are grouped by area in first-seen order', () => {
  const after = clone(defaultContent);
  after.about.heading = 'x'; after.home.heading = 'y'; after.about.intro = 'z';
  const groups = groupChanges(diffContent(defaultContent, after).changes);
  assert.deepEqual(groups.map(g => g.area), ['Homepage', 'Our story']);
  assert.equal(groups[1].items.length, 2);
});

test('Moment validation covers captions, dates, credits, alt text and permission', () => {
  const ok = { title: 'Team', date: '2026-03-04', credit: 'AKL', alt: 'People', location: '', image: '/media/a.webp', permissionConfirmed: true };
  assert.deepEqual(validateMomentFields(ok, '2026-06-01'), {});
  const bad = validateMomentFields({ ...ok, title: '  ', date: '2026-02-30', credit: '', alt: '', location: 'x'.repeat(121), permissionConfirmed: false }, '2026-06-01');
  assert.deepEqual(Object.keys(bad).sort(), ['alt', 'credit', 'date', 'location', 'permissionConfirmed', 'title']);
  assert.equal(validateMomentFields({ ...ok, date: '2026-06-02' }, '2026-06-01').date, 'The date cannot be in the future.');
  assert.equal(validateMomentFields({ ...ok, date: '2026-06-01' }, '2026-06-01').date, undefined);
  assert.equal(validateMomentFields({ ...ok, title: 'x'.repeat(121) }).title, 'Keep the caption to 120 characters or fewer.');
  assert.equal(isRealDate('2024-02-29'), true);
  assert.equal(isRealDate('2025-02-29'), false);
  assert.equal(isRealDate('02/03/2026'), false);
});

test('gallery validation returns server-style paths and agrees with the real schema', () => {
  const good = moment(1), bad = moment(2, { title: '', credit: '' });
  const paths = validateMomentsPaths([good, bad], '2026-06-01');
  assert.deepEqual(Object.keys(paths).sort(), ['moments.1.credit', 'moments.1.title']);
  // whatever the client accepts the server accepts, whatever it rejects the server rejects
  assert.equal(contentSchema.safeParse(withMoments([good])).success, true);
  const server = contentSchema.safeParse(withMoments([good, bad]));
  assert.equal(server.success, false);
  if (!server.success) assert.deepEqual(Object.keys(issuePaths(server.error.issues)).filter(k => k.startsWith('moments')).sort(), Object.keys(paths).sort());
});

test('server zod issues become per-field messages that read as plain language', () => {
  const content = clone(defaultContent) as SiteContent;
  content.home.heading = '';
  content.industries[0].roles = Array.from({ length: 11 }, (_, i) => `Role ${i}`);
  content.settings.email = 'nope';
  const result = contentSchema.safeParse(content);
  assert.equal(result.success, false);
  if (result.success) return;
  const paths = issuePaths(result.error.issues);
  assert.deepEqual(errorsFor(paths, 'home.heading'), ['This cannot be empty.']);
  assert.match(errorsFor(paths, 'industries.0.roles')[0], /maximum is 10/);
  assert.deepEqual(errorsFor(paths, 'settings.email'), ['Enter a valid email address.']);
  assert.deepEqual(errorsFor(paths, 'home.intro'), []);
  assert.deepEqual(issuePaths([{ path: [], message: 'Bad' }]), { _form: ['Bad'] });
  assert.equal(friendlyIssue('Too big: expected string to have <=120 characters'), 'Too long: the maximum is 120 characters.');
  assert.equal(friendlyIssue('Invalid input: expected true'), 'This must be confirmed.');
  assert.equal(friendlyIssue('Choose an approved local or uploaded image.'), 'Choose an approved local or uploaded image.');
});

test('errors are classified so staff know what to do next', () => {
  assert.equal(classify(401, 'UNAUTHENTICATED'), 'session');
  assert.equal(classify(401, 'REAUTHENTICATION_REQUIRED'), 'reauth');
  assert.equal(classify(403, 'FORBIDDEN'), 'forbidden');
  assert.equal(classify(403, 'EMAIL_VERIFICATION_REQUIRED'), 'forbidden');
  assert.equal(classify(409, 'CONFLICT'), 'conflict');
  assert.equal(classify(409, 'LAST_SUPER_ADMIN'), 'conflict');
  assert.equal(classify(503, 'STORAGE_NOT_CONFIGURED'), 'unconfigured');
  assert.equal(classify(429, 'RATE_LIMITED'), 'rate');
  assert.equal(classify(413, 'PAYLOAD_TOO_LARGE'), 'toolarge');
  assert.equal(classify(400, 'INVALID_REQUEST'), 'validation');
  assert.equal(classify(500, 'INTERNAL_ERROR'), 'server');
  assert.match(messageFor('session', { status: 401 }), /sign in again/i);
  assert.match(messageFor('reauth', { status: 401 }), /recent sign-in/i);
  assert.match(messageFor('forbidden', { status: 403 }), /does not allow/i);
  assert.match(messageFor('conflict', { status: 409, code: 'CONFLICT' }), /Reload the latest/);
  assert.match(messageFor('conflict', { status: 409, code: 'CONFLICT' }), /what you typed is kept/);
  assert.match(messageFor('unconfigured', { status: 503, code: 'STORAGE_NOT_CONFIGURED' }), /storage is not configured/i);
  assert.doesNotMatch(messageFor('unconfigured', { status: 503 }), /phone or email/);
  assert.match(messageFor('timeout', { status: 0 }), /may or may not have been saved/);
  assert.match(messageFor('server', { status: 500, requestId: 'abcdef12-0000' }), /abcdef12/);
});

test('API error bodies, aborted fetches and network failures map to the right problem', () => {
  const e = errorFromResponse(400, { ok: false, error: { code: 'INVALID_REQUEST', message: 'Please check the form fields.', fields: { paths: { 'home.heading': ['x'] } } }, requestId: 'r1' });
  assert.ok(e instanceof ApiError);
  assert.equal(e.kind, 'validation');
  assert.deepEqual(e.paths, { 'home.heading': ['x'] });
  assert.match(e.message, /marked below/);
  assert.equal(errorFromResponse(502, null).kind, 'server');
  assert.equal(toProblem(new DOMException('aborted', 'AbortError')).kind, 'timeout');
  assert.equal(toProblem(new TypeError('Failed to fetch')).kind, 'network');
  assert.equal(toProblem(new Error('Custom')).message, 'Custom');
  assert.equal(toMessage('weird', 'Fallback'), 'Fallback');
  assert.equal(toProblem(errorFromResponse(409, { error: { code: 'CONFLICT' } })).kind, 'conflict');
});

test('upload steps show done, active, failed and todo states', () => {
  assert.equal(stepState('authorising', 'uploading', null), 'done');
  assert.equal(stepState('uploading', 'uploading', null), 'active');
  assert.equal(stepState('verifying', 'uploading', null), 'todo');
  assert.equal(stepState('uploading', 'failed', 'uploading'), 'failed');
  assert.equal(stepState('authorising', 'failed', 'uploading'), 'done');
  assert.equal(stepState('verifying', 'failed', 'uploading'), 'todo');
  assert.equal(stepState('ready', 'ready', null), 'done');
  assert.match(storageUploadMessage(403), /Retry/);
  assert.match(storageUploadMessage(0), /interrupted/);
});
