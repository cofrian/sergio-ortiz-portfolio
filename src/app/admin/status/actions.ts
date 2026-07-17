"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerEnv } from "@/lib/env/server";
import { consumeRateLimitForAddress } from "@/lib/security/rate-limit";

function sessionValue(secret: string) {
  return createHmac("sha256", secret).update("portfolio-admin-status-v1").digest("hex");
}

export async function signIn(formData: FormData) {
  const env = getServerEnv();
  const submitted = String(formData.get("secret") ?? "");
  if (!env.ADMIN_SECRET) redirect("/en");
  const requestHeaders = await headers();
  const address =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await consumeRateLimitForAddress(address, "admin-sign-in", 5, 900);
  if (!limit.allowed) redirect("/admin/status?error=1");
  const left = Buffer.from(submitted);
  const right = Buffer.from(env.ADMIN_SECRET);
  if (left.length !== right.length || !timingSafeEqual(left, right)) redirect("/admin/status?error=1");
  const store = await cookies();
  store.set("portfolio_admin_session", sessionValue(env.ADMIN_SECRET), { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 60 * 60 });
  redirect("/admin/status");
}

export async function isAdminSession() {
  const env = getServerEnv();
  if (!env.ADMIN_SECRET) return false;
  const value = (await cookies()).get("portfolio_admin_session")?.value;
  if (!value) return false;
  const left = Buffer.from(value);
  const right = Buffer.from(sessionValue(env.ADMIN_SECRET));
  return left.length === right.length && timingSafeEqual(left, right);
}
