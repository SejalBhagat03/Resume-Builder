import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

/**
 * Supabase admin client using the service role key.
 * This client bypasses Row Level Security — NEVER expose it to the frontend.
 * Used only in the backend for:
 *   - Verifying user JWTs (auth.getUser)
 *   - Admin DB operations
 *   - Storage operations on behalf of authenticated users
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
