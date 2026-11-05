/**
 * Turns API/network failures into actionable staff messages. Pure (no React, no fetch) so it can be unit-tested.
 * Every message says what happened, whether anything was saved, and what to do next.
 */
export type ProblemKind = 'session' | 'reauth' | 'forbidden' | 'conflict' | 'unconfigured' | 'network' | 'timeout' | 'validation' | 'rate' | 'notfound' | 'toolarge' | 'server';

export type ApiErrorInit = { status: number; code?: string; serverMessage?: string; paths?: Record<string, string[]>; requestId?: string };

export function classify(status: number, code = ''): ProblemKind {
  if (code === 'REAUTHENTICATION_REQUIRED') return 'reauth';
  if (code === 'UNAUTHENTICATED' || status === 401) return 'session';
  if (code === 'CONFLICT' || code === 'LAST_SUPER_ADMIN' || status === 409) return 'conflict';
  if (code === 'FORBIDDEN' || code === 'EMAIL_VERIFICATION_REQUIRED' || status === 403) return 'forbidden';
  if (status === 503) return 'unconfigured';
  if (status === 429) return 'rate';
  if (status === 413) return 'toolarge';
  if (status === 404) return 'notfound';
  if (status === 400) return 'validation';
  return 'server';
}

const SERVICE: Record<string, string> = {
  STORAGE_NOT_CONFIGURED: 'Media storage is not configured for this site yet, so this could not be completed and nothing was changed. Ask the site administrator to finish the storage setup.',
  DATABASE_NOT_CONFIGURED: 'The content database is not connected, so nothing was saved. Ask the site administrator to finish the database setup.',
  AUTH_NOT_CONFIGURED: 'Staff sign-in is not configured for this site yet. Ask the site administrator to finish the authentication setup.',
  INTEGRATION_NOT_CONFIGURED: 'This integration is not configured yet, so nothing was changed. Ask the site administrator to finish the setup.',
};

export function messageFor(kind: ProblemKind, init: ApiErrorInit): string {
  const code = init.code || '';
  switch (kind) {
    case 'session': return 'Your session has expired. Sign in again in a new tab, then retry here. Nothing was changed, and what you typed on this page is kept.';
    case 'reauth': return 'This action needs a recent sign-in. Sign in again in a new tab, then retry here. Nothing was changed, and what you typed on this page is kept.';
    case 'forbidden': return code === 'EMAIL_VERIFICATION_REQUIRED' ? 'Verify your email address before using this part of the workspace. Nothing was changed.' : 'Your role does not allow this action, so nothing was changed. Ask a Super Admin if you need access.';
    case 'conflict': return code === 'LAST_SUPER_ADMIN' ? 'The last active Super Admin cannot be demoted or suspended. Nothing was changed.' : 'Someone else changed this since you opened it, so it was not saved. Reload the latest version and review it; what you typed is kept until you decide.';
    case 'unconfigured': return SERVICE[code] || 'A service this action needs is not connected yet, so nothing was saved. Ask the site administrator to finish the setup.';
    case 'rate': return 'Too many requests in a short time. Wait a minute, then try again.';
    case 'toolarge': return 'That request is too large to send. Shorten the content or remove an item, then try again.';
    case 'notfound': return 'That item no longer exists or the page is out of date. Refresh the list and try again.';
    case 'validation': if (!(init.paths && Object.keys(init.paths).length) && code && code !== 'INVALID_REQUEST') return `That was not accepted (${code.replaceAll('_', ' ').toLowerCase()}). Nothing was changed.`; return init.paths && Object.keys(init.paths).length ? 'Some fields need attention. They are marked below, and nothing was saved.' : 'The server did not accept that request. Check the fields and try again; nothing was saved.';
    case 'timeout': return 'The server took too long to respond. The change may or may not have been saved, so reload the latest version before trying again.';
    case 'network': return typeof navigator !== 'undefined' && navigator.onLine === false
      ? 'You appear to be offline. Reconnect and try again; nothing was saved and what you typed is kept.'
      : 'Could not reach the server. Check your connection and try again; nothing is confirmed as saved and what you typed is kept.';
    default: return `The server hit an unexpected problem, so nothing is confirmed as saved. Try again; if it keeps happening, quote reference ${init.requestId ? init.requestId.slice(0, 8) : 'unavailable'}.`;
  }
}

export class ApiError extends Error {
  readonly kind: ProblemKind; readonly status: number; readonly code: string; readonly paths: Record<string, string[]>; readonly requestId?: string;
  constructor(kind: ProblemKind, init: ApiErrorInit) {
    super(messageFor(kind, init));
    this.name = 'ApiError'; this.kind = kind; this.status = init.status; this.code = init.code || ''; this.paths = init.paths || {}; this.requestId = init.requestId;
  }
}

/** Build an ApiError from an HTTP error response body ({ ok:false, error:{ code, message, fields } }). */
export function errorFromResponse(status: number, body: unknown): ApiError {
  const b = (body && typeof body === 'object' ? body : {}) as { error?: { code?: string; message?: string; fields?: { paths?: Record<string, string[]> } }; requestId?: string };
  const init: ApiErrorInit = { status, code: b.error?.code, serverMessage: b.error?.message, paths: b.error?.fields?.paths, requestId: b.requestId };
  return new ApiError(classify(status, init.code), init);
}
export const timeoutError = () => new ApiError('timeout', { status: 0 });
export const networkError = () => new ApiError('network', { status: 0 });

export type Problem = { kind: ProblemKind | 'other'; message: string; paths: Record<string, string[]> };
/** Normalise anything thrown into a Problem. Aborted fetches are timeouts; TypeError from fetch is a network failure. */
export function toProblem(error: unknown, fallback = 'Something went wrong. Please try again.'): Problem {
  if (error instanceof ApiError) return { kind: error.kind, message: error.message, paths: error.paths };
  if (error instanceof DOMException && error.name === 'AbortError') { const e = timeoutError(); return { kind: e.kind, message: e.message, paths: {} }; }
  if (error instanceof TypeError) { const e = networkError(); return { kind: e.kind, message: e.message, paths: {} }; }
  return { kind: 'other', message: error instanceof Error && error.message ? error.message : fallback, paths: {} };
}
export const toMessage = (error: unknown, fallback?: string) => toProblem(error, fallback).message;
/** Problems that mean the user must sign in again before anything will work. */
export const needsSignIn = (kind: Problem['kind']) => kind === 'session' || kind === 'reauth';

/** Upload stages shown to staff. */
export type UploadStage = 'idle' | 'authorising' | 'uploading' | 'verifying' | 'ready' | 'failed';
export const UPLOAD_STEPS: { stage: Exclude<UploadStage, 'idle' | 'failed'>; label: string }[] = [
  { stage: 'authorising', label: 'Preparing upload' }, { stage: 'uploading', label: 'Uploading' }, { stage: 'verifying', label: 'Verifying and optimising' }, { stage: 'ready', label: 'Ready' },
];
/** Which step failed, for display: the last stage reached before 'failed'. */
export function stepState(step: UploadStage, current: UploadStage, failedAt: UploadStage | null): 'done' | 'active' | 'failed' | 'todo' {
  const order = UPLOAD_STEPS.map(s => s.stage);
  const at = current === 'failed' ? failedAt : current;
  if (!at) return 'todo';
  const i = order.indexOf(step as never), j = order.indexOf(at as never);
  if (current === 'failed') return i < j ? 'done' : i === j ? 'failed' : 'todo';
  if (current === 'ready') return 'done';
  return i < j ? 'done' : i === j ? 'active' : 'todo';
}
/** Message for a failed direct-to-storage upload (before our API is involved). */
export function storageUploadMessage(status: number) {
  if (status === 403) return 'Storage refused the upload. The upload link may have expired; choose Retry to get a fresh one. If it keeps failing, storage CORS may need attention. Your file and details are kept.';
  if (status === 0) return 'The upload was interrupted. Check your connection and choose Retry; your file and details are kept.';
  return `Storage rejected the upload (status ${status}). Choose Retry; your file and details are kept.`;
}
