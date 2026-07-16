import "server-only";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  GITHUB_USERNAME: z.string().default("cofrian"),
  GITHUB_TOKEN: z.string().min(10).optional(),
  GITHUB_WEBHOOK_SECRET: z.string().min(16).optional(),
  SUPABASE_URL: z.url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  NVIDIA_API_KEY: z.string().min(10).optional(),
  LLM_BASE_URL: z.url().default("https://integrate.api.nvidia.com/v1"),
  LLM_MODEL: z.string().optional(),
  RESEND_API_KEY: z.string().min(10).optional(),
  CONTACT_EMAIL: z.email().optional(),
  CRON_SECRET: z.string().min(16).optional(),
  ADMIN_SECRET: z.string().min(16).optional(),
  RATE_LIMIT_HMAC_SECRET: z.string().min(16).optional(),
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid server configuration: ${fields}`);
  }
  cached = parsed.data;
  return cached;
}

export function getFeatureStatus() {
  const env = getServerEnv();
  return {
    github: Boolean(env.GITHUB_TOKEN),
    supabase: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
    llm: Boolean(env.NVIDIA_API_KEY && env.LLM_MODEL),
    contact: Boolean(env.RESEND_API_KEY && env.CONTACT_EMAIL),
    rateLimit: Boolean(env.RATE_LIMIT_HMAC_SECRET && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  };
}
