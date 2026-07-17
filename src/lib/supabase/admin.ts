import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv, getSupabaseServerKey } from "@/lib/env/server";

let admin: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  if (admin) return admin;
  const env = getServerEnv();
  const key = getSupabaseServerKey(env);
  if (!env.SUPABASE_URL || !key) return null;
  admin = createClient(env.SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
