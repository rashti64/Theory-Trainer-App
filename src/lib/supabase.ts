/**
 * Supabase client, set up as the Expo docs recommend (docs.expo.dev/guides/using-supabase).
 * The app works without a backend: when the two environment variables are missing,
 * `supabase` is null and the app runs in guest mode with on-device storage only.
 *
 * Only the publishable key belongs in the app. Never put the database password or a
 * secret key here: a secret key bypasses row-level security.
 */
import 'expo-sqlite/localStorage/install';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          storage: localStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

if (supabase) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
