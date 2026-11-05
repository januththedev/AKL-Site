'use client';
import { useCallback, useEffect, useState } from 'react';
import { ApiError, errorFromResponse, networkError, timeoutError, needsSignIn, toProblem, type Problem } from './adminErrors';

/** Fired when any request shows the staff session is no longer valid, so the shell can offer a sign-in link. */
export const SESSION_EVENT = 'akl-admin-session';

export async function api<T>(path: string, body?: unknown, timeoutMs = 30000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(`/api/admin/${path}`, body !== undefined ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal } : { cache: 'no-store', signal: controller.signal });
  } catch (e) {
    throw e instanceof DOMException && e.name === 'AbortError' ? timeoutError() : networkError();
  } finally { clearTimeout(timer); }
  let json: { ok?: boolean; data?: T } | null = null;
  try { json = await response.json(); } catch { json = null; }
  if (!response.ok || !json || json.ok === false) {
    const error: ApiError = errorFromResponse(response.status || 500, json);
    if (needsSignIn(error.kind) && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: error.kind }));
    throw error;
  }
  return json.data as T;
}

export function useResource<T>(path: string) {
  const [data, setData] = useState<T>(), [problem, setProblem] = useState<Problem | null>(null), [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true); setProblem(null);
    try { setData(await api<T>(path)); } catch (e) { setProblem(toProblem(e, 'Request failed.')); } finally { setLoading(false); }
  }, [path]);
  useEffect(() => { void reload(); }, [reload]);
  return { data, error: problem?.message || '', problem, loading, reload };
}

/** PUT a file straight to storage with progress. Rejects with an Error carrying `.status` (0 = network failure). */
export function putWithProgress(url: string, file: File, onProgress: (fraction: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(Object.assign(new Error('Storage rejected the upload.'), { status: xhr.status }));
    xhr.onerror = xhr.ontimeout = xhr.onabort = () => reject(Object.assign(new Error('Upload interrupted.'), { status: 0 }));
    xhr.timeout = 10 * 60 * 1000;
    xhr.send(file);
  });
}
