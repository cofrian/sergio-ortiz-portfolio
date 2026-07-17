import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env/server";
import {
  readRequestText,
  RequestBodyTooLargeError,
} from "@/lib/security/request";
import { noStoreJson } from "@/lib/security/response";
import { publicError, safeLog } from "@/lib/security/safe-log";

export const runtime = "nodejs";

const payloadSchema = z.object({
  repository: z
    .object({ owner: z.object({ login: z.string().min(1).max(120) }) })
    .optional(),
});

function validSignature(body: string, signature: string | null, secret: string) {
  if (!signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const env = getServerEnv();
  if (!env.GITHUB_WEBHOOK_SECRET) {
    return noStoreJson(publicError(), { status: 404 });
  }
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return noStoreJson(publicError(), { status: 400 });
  }

  const event = request.headers.get("x-github-event");
  if (!event || !["push", "repository", "ping"].includes(event)) {
    return noStoreJson(publicError(), { status: 400 });
  }

  try {
    const body = await readRequestText(request, 1_000_000);
    if (
      !validSignature(
        body,
        request.headers.get("x-hub-signature-256"),
        env.GITHUB_WEBHOOK_SECRET,
      )
    ) {
      return noStoreJson(publicError(), { status: 401 });
    }

    const payload = payloadSchema.safeParse(JSON.parse(body) as unknown);
    if (!payload.success) return noStoreJson(publicError(), { status: 400 });
    const owner = payload.data.repository?.owner.login;
    if (event !== "ping" && !owner) {
      return noStoreJson(publicError(), { status: 400 });
    }
    if (owner && owner.toLowerCase() !== env.GITHUB_USERNAME.toLowerCase()) {
      return noStoreJson(publicError(), { status: 403 });
    }

    revalidatePath("/", "layout");
    safeLog("github-webhook", { requestId, status: "accepted" });
    return noStoreJson({ accepted: true });
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    safeLog("github-webhook", {
      requestId,
      status: "rejected",
      code: status === 413 ? "PAYLOAD_TOO_LARGE" : "INVALID_PAYLOAD",
    });
    return noStoreJson(publicError(), { status });
  }
}
