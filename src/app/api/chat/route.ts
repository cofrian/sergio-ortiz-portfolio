import { NextRequest } from "next/server";
import { generateGroundedAnswer } from "@/lib/rag/provider";
import { retrieveSources } from "@/lib/rag/retrieval";
import { classifyScope } from "@/lib/rag/scope-classifier";
import { chatRequestSchema, chatResponseSchema } from "@/lib/schemas";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import {
  hasValidJsonRequest,
  InvalidRequestBodyError,
  readJsonWithLimit,
  RequestBodyTooLargeError,
} from "@/lib/security/request";
import { noStoreJson } from "@/lib/security/response";
import { publicError, safeLog } from "@/lib/security/safe-log";

export const runtime = "nodejs";

function refusal(locale: "en" | "es", type: "scope" | "evidence") {
  if (type === "scope") {
    return locale === "es"
      ? "Solo puedo responder preguntas sobre los proyectos, experiencia, investigación y contenido público del portfolio de Sergio Ortiz."
      : "I can only answer questions about Sergio Ortiz’s projects, experience, research and published portfolio content.";
  }
  return locale === "es"
    ? "No he encontrado información pública suficiente para responder con seguridad."
    : "I couldn’t find enough public information to answer that safely.";
}

function buildVerifiedContext(matches: Awaited<ReturnType<typeof retrieveSources>>) {
  return JSON.stringify(matches.map((source, index) => ({
    sourceId: `S${index + 1}`,
    title: source.title,
    publicUrl: source.url,
    section: source.section,
    excerpt: source.content.slice(0, 4_000),
  })));
}

function fallbackAnswer(locale: "en" | "es", matches: Awaited<ReturnType<typeof retrieveSources>>) {
  const titles = matches.map((source) => source.title).join(", ");
  return locale === "es"
    ? `He encontrado fuentes públicas relevantes sobre: ${titles}. Puedes abrirlas debajo para revisar la información completa.`
    : `I found relevant public sources about: ${titles}. You can open them below to review the complete information.`;
}

export async function POST(request: NextRequest) {
  const started = Date.now();
  const requestId = crypto.randomUUID();

  if (!hasValidJsonRequest(request)) {
    return noStoreJson(publicError(), { status: 400 });
  }

  try {
    const parsed = chatRequestSchema.safeParse(
      await readJsonWithLimit(request, 4_000),
    );
    if (!parsed.success) return noStoreJson(publicError(), { status: 400 });

    const limit = await consumeRateLimit(request, "chat", 12, 60);
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

    const scope = classifyScope(parsed.data.message);
    if (scope !== "IN_SCOPE") {
      const response = chatResponseSchema.parse({
        answer: refusal(parsed.data.locale, "scope"),
        sources: [],
        inScope: false,
        confidence: "none",
      });
      return noStoreJson(response);
    }

    const matches = await retrieveSources(
      parsed.data.message,
      parsed.data.locale,
      6,
      requestId,
    );
    if (!matches.length) {
      const response = chatResponseSchema.parse({
        answer: refusal(parsed.data.locale, "evidence"),
        sources: [],
        inScope: true,
        confidence: "none",
      });
      return noStoreJson(response);
    }

    const context = buildVerifiedContext(matches);
    const generated = await generateGroundedAnswer({
      message: parsed.data.message,
      locale: parsed.data.locale,
      context,
      requestId,
    });
    const answer = generated ?? fallbackAnswer(parsed.data.locale, matches);
    const sources = matches.map((source) => ({
      title: source.title,
      url: source.url,
      section: source.section,
    }));
    const response = chatResponseSchema.parse({
      answer,
      sources,
      inScope: true,
      confidence: generated ? "high" : "medium",
    });
    safeLog("chat", {
      requestId,
      status: "ok",
      latencyMs: Date.now() - started,
      sourceCount: matches.length,
    });
    return noStoreJson(response);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return noStoreJson(publicError(), { status: 413 });
    }
    if (error instanceof InvalidRequestBodyError) {
      return noStoreJson(publicError(), { status: 400 });
    }
    safeLog("chat", {
      requestId,
      status: "error",
      latencyMs: Date.now() - started,
      code: "CHAT_FAILED",
    });
    return noStoreJson(publicError(), { status: 500 });
  }
}
