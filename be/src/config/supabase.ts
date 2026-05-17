import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

/**
 * Supabase Admin Client (server-side).
 * Uses service_role_key to bypass RLS — only use on the backend.
 */
let supabase: SupabaseClient;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.'
      );
    }

    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabase;
}
