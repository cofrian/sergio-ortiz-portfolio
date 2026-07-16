import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env/server";
import { publicError } from "@/lib/security/safe-log";

function validSignature(body: string, signature: string | null, secret: string) {
  if (!signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: NextRequest) {
  const env = getServerEnv();
  if (!env.GITHUB_WEBHOOK_SECRET) return NextResponse.json(publicError(), { status: 404 });
  if (Number(request.headers.get("content-length") ?? 0) > 1_000_000) return NextResponse.json(publicError(), { status: 413 });
  const event = request.headers.get("x-github-event");
  if (!event || !["push", "repository", "ping"].includes(event)) return NextResponse.json(publicError(), { status: 400 });
  const body = await request.text();
  if (!validSignature(body, request.headers.get("x-hub-signature-256"), env.GITHUB_WEBHOOK_SECRET)) return NextResponse.json(publicError(), { status: 401 });
  const payload = JSON.parse(body) as { repository?: { owner?: { login?: string } } };
  if (payload.repository?.owner?.login && payload.repository.owner.login.toLowerCase() !== env.GITHUB_USERNAME.toLowerCase()) return NextResponse.json(publicError(), { status: 403 });
  revalidatePath("/", "layout");
  return NextResponse.json({ accepted: true });
}
