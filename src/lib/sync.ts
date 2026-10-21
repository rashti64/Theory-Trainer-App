/**
 * Progress sync, v1: one JSON snapshot per user in `user_progress`, last write wins.
 * Simple and robust for a single learner on one or two devices. A per-question
 * merge can replace this later without changing the app state shape.
 */
import type { PersistedState } from '@/state/app-state';

import { supabase } from './supabase';

export async function pullProgress(userId: string): Promise<PersistedState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('user_progress')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.state as PersistedState | undefined) ?? null;
}

export async function pushProgress(userId: string, state: PersistedState): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, state, updated_at: state.updatedAt });
  if (error) throw error;
}

/** Pick the newer of the local and remote state. */
export function newerState(local: PersistedState, remote: PersistedState | null): PersistedState {
  if (!remote) return local;
  return remote.updatedAt > local.updatedAt ? remote : local;
}
