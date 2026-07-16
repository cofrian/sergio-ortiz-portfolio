import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactRequestSchema } from "@/lib/schemas";
import { getServerEnv } from "@/lib/env/server";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { hasValidJsonRequest } from "@/lib/security/request";
import { publicError, safeLog } from "@/lib/security/safe-log";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const started = Date.now();
  const requestId = crypto.randomUUID();
  if (!hasValidJsonRequest(request)) return NextResponse.json(publicError(), { status: 400 });
  if (Number(request.headers.get("content-length") ?? 0) > 8_000) return NextResponse.json(publicError(), { status: 413 });
  try {
    const parsed = contactRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json(publicError(), { status: 400 });
    if (parsed.data.website) return NextResponse.json({ message: "Message received." });
    const limit = await consumeRateLimit(request, "contact", 4, 600);
    if (!limit.allowed) return NextResponse.json({ error: limit.unavailable ? "Service temporarily unavailable." : "Too many requests." }, { status: limit.unavailable ? 503 : 429 });
    const env = getServerEnv();
    if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) return NextResponse.json({ error: "Contact is not configured yet." }, { status: 503 });
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: env.CONTACT_EMAIL,
      replyTo: parsed.data.email,
      subject: `[Portfolio] ${parsed.data.category} — ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nOrganisation: ${parsed.data.organisation || "—"}\nCategory: ${parsed.data.category}\n\n${parsed.data.message}`,
    });
    if (error) throw new Error("CONTACT_PROVIDER_FAILED");
    safeLog("contact", { requestId, status: "ok", latencyMs: Date.now() - started });
    return NextResponse.json({ message: parsed.data.locale === "es" ? "Mensaje enviado correctamente." : "Message sent successfully." });
  } catch {
    safeLog("contact", { requestId, status: "error", latencyMs: Date.now() - started, code: "CONTACT_FAILED" });
    return NextResponse.json(publicError(), { status: 500 });
  }
}
