/**
 * Account save for the published web version. When the app runs as a page
 * on claude.ai, the platform offers a private per-person store: progress is
 * kept in the viewer's own `data/users/<id>/progress` document, which nobody
 * else (not even the page's owner) can read. On phones and in a plain
 * browser this does nothing and progress stays on the device.
 *
 * On start it loads the account copy and keeps whichever copy is newer;
 * afterwards it writes the state a moment after each change, one write at
 * a time, only when something changed.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { newerState } from '@/lib/sync';

import { useAppState, type PersistedState } from './app-state';

export type SaveStatus = 'device' | 'connecting' | 'account';

type DocSnapshot = { exists: boolean; data(): Record<string, unknown> | undefined };
type DocRef = { get(): Promise<DocSnapshot>; set(data: Record<string, unknown>): Promise<void> };
type Db = { doc(path: string): DocRef };
type UserNs = { id(): Promise<string | null> };
type ClaudeRuntime = { use(name: string): Promise<unknown> };

const WRITE_DELAY_MS = 2000;
/** Never keep the learner waiting on the platform for longer than this. */
const LOAD_TIMEOUT_MS = 4000;

function runtime(): ClaudeRuntime | null {
  if (Platform.OS !== 'web') return null;
  const claude = (globalThis as { claude?: Partial<ClaudeRuntime> }).claude;
  return claude && typeof claude.use === 'function' ? (claude as ClaudeRuntime) : null;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([promise, new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))]);
}

async function connect(): Promise<DocRef | null> {
  const claude = runtime();
  if (!claude) return null;
  const [user, db] = (await Promise.all([claude.use('user'), claude.use('db')])) as [UserNs | null, Db | null];
  if (!user || !db) return null;
  const id = await user.id();
  if (!id) return null;
  return db.doc(`data/users/${id}/progress`);
}

const SaveContext = createContext<{ status: SaveStatus; ready: boolean }>({ status: 'device', ready: true });

export function CloudSaveProvider({ children }: { children: ReactNode }) {
  const { state, replaceState } = useAppState();
  const [status, setStatus] = useState<SaveStatus>(() => (runtime() ? 'connecting' : 'device'));
  const [ready, setReady] = useState(() => runtime() === null);

  const ref = useRef<DocRef | null>(null);
  const latest = useRef<PersistedState>(state);
  const saved = useRef<string | null>(null);
  const writing = useRef(false);

  useEffect(() => {
    latest.current = state;
  }, [state]);

  // Load the account copy once.
  useEffect(() => {
    if (!runtime()) return;
    let cancelled = false;
    (async () => {
      try {
        const doc = await withTimeout(connect(), LOAD_TIMEOUT_MS);
        if (!doc || cancelled) throw new Error('no account store');
        const snap = await withTimeout(doc.get(), LOAD_TIMEOUT_MS);
        if (!snap || cancelled) throw new Error('no answer');
        const remote = snap.exists ? ((snap.data()?.state as PersistedState | undefined) ?? null) : null;
        const local = latest.current;
        const chosen = newerState(local, remote);
        if (chosen !== local) replaceState(chosen);
        ref.current = doc;
        saved.current = remote?.updatedAt ?? null;
        setStatus('account');
      } catch {
        if (!cancelled) setStatus('device');
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [replaceState]);

  // Write changes back, a moment after they happen, one write at a time.
  useEffect(() => {
    if (status !== 'account' || state.updatedAt === saved.current) return;
    const write = async () => {
      const doc = ref.current;
      if (!doc || writing.current) return;
      const snapshot = latest.current;
      if (snapshot.updatedAt === saved.current) return;
      writing.current = true;
      try {
        await doc.set({ state: snapshot, updatedAt: snapshot.updatedAt });
        saved.current = snapshot.updatedAt;
      } catch (error) {
        // A refused write (e.g. a view-only visitor) means no account save for this visit.
        if ((error as { code?: string })?.code === 'invalid_argument') setStatus('device');
      } finally {
        writing.current = false;
      }
      if (latest.current.updatedAt !== saved.current) setTimeout(write, WRITE_DELAY_MS);
    };
    const timer = setTimeout(write, WRITE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state, status]);

  return <SaveContext.Provider value={{ status, ready }}>{children}</SaveContext.Provider>;
}

export function useSaveStatus() {
  return useContext(SaveContext);
}
