'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/types';
import { diffContent, sameContent, validateMomentsPaths, type ContentDiff } from '@/lib/contentDiff';
import { api } from './adminApi';
import { toProblem } from './adminErrors';

type Saved = { content: SiteContent; version: number };
export type Conflict = { latest: Saved; diff: ContentDiff } | { latest: null; diff: null };

/**
 * One shared working copy of the site draft for the Pages & content and Moments editors, so edits survive
 * switching sections. Tracks the last saved version, whether there are unsaved edits, server/field errors and
 * stale-draft conflicts. A success message is only set after the server confirms the save.
 */
export function useDraftEditor(enabled: boolean) {
  const [base, setBase] = useState<Saved | null>(null), [doc, setDoc] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(false), [loadError, setLoadError] = useState('');
  const [epoch, setEpoch] = useState(0); // bumps when the whole document is replaced, so uncontrolled fields remount
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [problem, setProblem] = useState('');
  const [paths, setPaths] = useState<Record<string, string[]>>({});
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const attempted = useRef(false), saving = useRef(false);

  const load = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      const data = await api<Saved>('draft');
      setBase({ content: data.content, version: data.version }); setDoc(structuredClone(data.content)); setEpoch(n => n + 1);
      setConflict(null); setPaths({});
    } catch (e) { setLoadError(toProblem(e, 'The draft could not be loaded.').message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { if (enabled && !attempted.current) { attempted.current = true; void load(); } }, [enabled, load]);

  const dirty = Boolean(doc && base && !sameContent(doc, base.content));
  const diff = useMemo(() => (doc && base ? diffContent(base.content, doc) : null), [doc, base]);

  // Browser-level warning for reloads, tab closes and navigation away while edits are unsaved.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  /** Edit the working copy. `clear` lists field paths whose server/validation errors should disappear. */
  const edit = useCallback((mutate: (draft: SiteContent) => void, clear: string[] = []) => {
    setDoc(previous => { if (!previous) return previous; const next = structuredClone(previous); mutate(next); return next; });
    setMessage('');
    if (clear.length) setPaths(p => Object.fromEntries(Object.entries(p).filter(([k]) => !clear.some(c => k === c || k.startsWith(`${c}.`)))));
  }, []);
  const clearStatus = useCallback(() => { setMessage(''); setProblem(''); }, []);

  const fetchLatest = useCallback(async (): Promise<Saved | null> => { try { return await api<Saved>('draft'); } catch { return null; } }, []);

  const save = useCallback(async () => {
    if (!doc || !base || saving.current) return;
    setMessage(''); setProblem(''); setConflict(null);
    const clientErrors = validateMomentsPaths(doc.moments);
    if (Object.keys(clientErrors).length) { setPaths(clientErrors); setProblem('Some Moments need attention before this can be saved. They are marked in the gallery, and nothing was saved.'); return; }
    setPaths({}); saving.current = true; setBusy(true);
    const sent = structuredClone(doc);
    try {
      const result = await api<{ version: number }>('draft', { content: sent, version: base.version });
      if (typeof result?.version !== 'number') throw new Error('The server did not confirm the save, so it is not treated as saved. Try again.');
      setBase({ content: sent, version: result.version });
      setMessage(`Draft saved as version ${result.version}. The public website is unchanged until you publish.`);
      // Read back what the server stored (it trims text and keeps official settings for Admins) so "unsaved" stays accurate.
      const stored = await fetchLatest();
      if (stored && stored.version === result.version) { setBase(stored); setDoc(current => (current && sameContent(current, sent) ? structuredClone(stored.content) : current)); }
    } catch (e) {
      const p = toProblem(e, 'Save failed.');
      setProblem(p.message); setPaths(p.paths);
      if (p.kind === 'conflict' || p.kind === 'timeout') {
        const latest = await fetchLatest();
        if (!latest) { /* the generic message above already says nothing is confirmed saved */ }
        else if (sameContent(latest.content, sent)) { setBase(latest); setProblem(''); setMessage(`Your changes were already saved, as version ${latest.version}.`); }
        else if (p.kind === 'conflict') setConflict({ latest, diff: diffContent(latest.content, sent) });
      }
    } finally { saving.current = false; setBusy(false); }
  }, [doc, base, fetchLatest]);

  /** Keep my edits but base them on the newer saved version, so the next Save replaces it. */
  const keepMine = useCallback(() => {
    if (!conflict?.latest) return;
    setBase(conflict.latest); setConflict(null); setProblem('');
    setMessage(`Your edits are now based on version ${conflict.latest.version}. Review them, then save to replace the newer draft.`);
  }, [conflict]);
  /** Throw away my unsaved edits and load the newer saved version. */
  const adoptLatest = useCallback(() => {
    if (!conflict?.latest) return;
    setBase(conflict.latest); setDoc(structuredClone(conflict.latest.content)); setEpoch(n => n + 1); setConflict(null); setProblem(''); setPaths({});
    setMessage(`Loaded version ${conflict.latest.version}. Your unsaved edits were discarded.`);
  }, [conflict]);
  const discard = useCallback(() => {
    if (!base) return;
    setDoc(structuredClone(base.content)); setEpoch(n => n + 1); setPaths({}); setProblem(''); setConflict(null); setMessage('Unsaved edits discarded.');
  }, [base]);

  return { doc, base, version: base?.version ?? 0, loading, loadError, reload: load, epoch, dirty, diff, changeCount: diff?.changes.length ?? 0, busy, message, problem, paths, conflict, edit, save, keepMine, adoptLatest, discard, clearStatus };
}
export type DraftEditor = ReturnType<typeof useDraftEditor>;
