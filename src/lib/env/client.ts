const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const publicEnv = { siteUrl, supabaseUrl, supabaseAnonKey } as const;
