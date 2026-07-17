import { NextRequest } from "next/server";
import { Resend } from "resend";
import { getServerEnv } from "@/lib/env/server";
import { contactRequestSchema } from "@/lib/schemas";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import {
  hasValidJsonRequest,
  InvalidRequestBodyError,
  readJsonWithLimit,
  RequestBodyTooLargeError,
} from "@/lib/security/request";
import { noStoreJson } from "@/lib/security/response";
import { publicError, safeLog } from "@/lib/security/safe-log";
import { toEmailHeaderValue } from "@/lib/security/text";

export const runtime = "nodejs";

const categoryLabels = {
  employment: "Job opportunity",
  internship: "Internship",
  collaboration: "Technical collaboration",
  research: "Research",
  community: "Speaking / community",
  other: "Other",
} as const;

export async function POST(request: NextRequest) {
  const started = Date.now();
  const requestId = crypto.randomUUID();

  if (!hasValidJsonRequest(request)) {
    return noStoreJson(publicError(), { status: 400 });
  }

  try {
    const parsed = contactRequestSchema.safeParse(
      await readJsonWithLimit(request, 8_000),
    );
    if (!parsed.success) {
      return noStoreJson(publicError(), { status: 400 });
    }
    if (parsed.data.website) {
      return noStoreJson({ message: "Message received." });
    }

    const limit = await consumeRateLimit(request, "contact", 4, 600);
    if (!limit.allowed) {
      return noStoreJson(
        {
          error: limit.unavailable
            ? "Service temporarily unavailable."
            : "Too many requests.",
        },
        { status: limit.unavailable ? 503 : 429 },
      );
    }

    const env = getServerEnv();
    if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
      return noStoreJson(
        { error: "Contact is not configured yet." },
        { status: 503 },
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const category = categoryLabels[parsed.data.category];
    const { error } = await resend.emails.send({
      from: "Sergio Ortiz Portfolio <onboarding@resend.dev>",
      to: env.CONTACT_EMAIL,
      replyTo: parsed.data.email,
      subject: toEmailHeaderValue(
        `[Portfolio · ${category}] ${parsed.data.name} — ${parsed.data.organisation}`,
        180,
      ),
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        `Organisation: ${parsed.data.organisation}`,
        `Role / team: ${parsed.data.role || "—"}`,
        `Contact type: ${category}`,
        `Language: ${parsed.data.locale}`,
        "",
        parsed.data.message,
      ].join("\n"),
    });

    if (error) throw new Error("CONTACT_PROVIDER_FAILED");
    safeLog("contact", {
      requestId,
      status: "ok",
      latencyMs: Date.now() - started,
    });

    return noStoreJson({
      message:
        parsed.data.locale === "es"
          ? "Mensaje enviado correctamente."
          : "Message sent successfully.",
    });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return noStoreJson(publicError(), { status: 413 });
    }
    if (error instanceof InvalidRequestBodyError) {
      return noStoreJson(publicError(), { status: 400 });
    }
    safeLog("contact", {
      requestId,
      status: "error",
      latencyMs: Date.now() - started,
      code: "CONTACT_FAILED",
    });
    return noStoreJson(publicError(), { status: 500 });
  }
}
