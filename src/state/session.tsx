/**
 * Signed-in user and background sync. Without a configured backend this
 * provider does nothing and the learner stays in guest mode.
 */
import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';
import { newerState, pullProgress, pushProgress } from '@/lib/sync';

import { useAppState } from './app-state';

type SessionValue = { session: Session | null; backendReady: boolean };

const SessionContext = createContext<SessionValue>({ session: null, backendReady: false });

const PUSH_DELAY_MS = 3000;

export function SessionProvider({ children }: { children: ReactNode }) {
  const { state, replaceState } = useAppState();
  const [session, setSession] = useState<Session | null>(null);
  const pulledFor = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  // On sign-in: take whichever copy of the progress is newer.
  useEffect(() => {
    if (!userId || pulledFor.current === userId) return;
    pulledFor.current = userId;
    pullProgress(userId)
      .then((remote) => {
        const chosen = newerState(state, remote);
        if (chosen !== state) replaceState(chosen);
      })
      .catch(() => {
        // Offline or backend error: keep learning locally; the next push will catch up.
      });
    // Only on sign-in, not on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // After changes: push a snapshot, debounced.
  useEffect(() => {
    if (!userId || pulledFor.current !== userId) return;
    const timer = setTimeout(() => {
      pushProgress(userId, state).catch(() => {});
    }, PUSH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state, userId]);

  return (
    <SessionContext.Provider value={{ session, backendReady: supabase !== null }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  return useContext(SessionContext);
}
