import "server-only";
import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { getServerEnv } from "@/lib/env/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const developmentBuckets = new Map<string, { count: number; resetAt: number }>();

function clientAddress(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function consumeRateLimitForAddress(address: string, scope: string, limit: number, windowSeconds: number) {
  const env = getServerEnv();
  if (env.NODE_ENV !== "production" && !env.RATE_LIMIT_HMAC_SECRET) {
    const key = `${scope}:${address}`;
    const now = Date.now();
    const bucket = developmentBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      developmentBuckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return { allowed: true, remaining: limit - 1 };
    }
    bucket.count += 1;
    return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) };
  }
  if (!env.RATE_LIMIT_HMAC_SECRET) return { allowed: false, remaining: 0, unavailable: true };
  const client = getSupabaseAdmin();
  if (!client) return { allowed: false, remaining: 0, unavailable: true };
  const identifier = createHmac("sha256", env.RATE_LIMIT_HMAC_SECRET).update(address).digest("hex");
  const { data, error } = await client.rpc("consume_rate_limit", { p_identifier: identifier, p_scope: scope, p_limit: limit, p_window_seconds: windowSeconds });
  if (error || !data) return { allowed: false, remaining: 0, unavailable: true };
  const result = Array.isArray(data) ? data[0] : data;
  return { allowed: Boolean(result.allowed), remaining: Number(result.remaining ?? 0) };
}

export async function consumeRateLimit(request: NextRequest, scope: string, limit: number, windowSeconds: number) {
  return consumeRateLimitForAddress(clientAddress(request), scope, limit, windowSeconds);
}
