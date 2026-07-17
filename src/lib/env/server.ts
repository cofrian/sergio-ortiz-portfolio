import "server-only";
import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;
const optional = <T extends z.ZodType>(value: T) =>
  z.preprocess(emptyToUndefined, value.optional());

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: optional(z.url()),
  GITHUB_USERNAME: z.preprocess(emptyToUndefined, z.string().default("cofrian")),
  GITHUB_TOKEN: optional(z.string().min(10)),
  GITHUB_WEBHOOK_SECRET: optional(z.string().min(16)),
  SUPABASE_URL: optional(z.url()),
  SUPABASE_SECRET_KEY: optional(z.string().min(20)),
  SUPABASE_SERVICE_ROLE_KEY: optional(z.string().min(20)),
  NVIDIA_API_KEY: optional(z.string().min(10)),
  LLM_BASE_URL: z.preprocess(
    emptyToUndefined,
    z.url().default("https://integrate.api.nvidia.com/v1"),
  ),
  LLM_MODEL: optional(z.string()),
  RESEND_API_KEY: optional(z.string().min(10)),
  CONTACT_EMAIL: optional(z.email()),
  CRON_SECRET: optional(z.string().min(16)),
  ADMIN_SECRET: optional(z.string().min(16)),
  RATE_LIMIT_HMAC_SECRET: optional(z.string().min(16)),
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

export function getSupabaseServerKey(env = getServerEnv()) {
  return env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getFeatureStatus() {
  const env = getServerEnv();
  const supabaseKey = getSupabaseServerKey(env);
  return {
    github: Boolean(env.GITHUB_TOKEN),
    supabase: Boolean(env.SUPABASE_URL && supabaseKey),
    llm: Boolean(env.NVIDIA_API_KEY && env.LLM_MODEL),
    contact: Boolean(env.RESEND_API_KEY && env.CONTACT_EMAIL),
    rateLimit: Boolean(env.RATE_LIMIT_HMAC_SECRET && env.SUPABASE_URL && supabaseKey),
  };
}
