import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { getServerEnv } from "@/lib/env/server";
import { noStoreJson } from "@/lib/security/response";
import { publicError } from "@/lib/security/safe-log";

export async function POST(request: NextRequest) {
  const secret = getServerEnv().CRON_SECRET;
  const provided = request.headers.get("x-revalidation-secret");
  if (!secret || !provided) return noStoreJson(publicError(), { status: 404 });
  const left = Buffer.from(provided);
  const right = Buffer.from(secret);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return noStoreJson(publicError(), { status: 401 });
  revalidatePath("/", "layout");
  return noStoreJson({ revalidated: true, at: new Date().toISOString() });
}
