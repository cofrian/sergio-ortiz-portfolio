import { NextRequest } from "next/server";
import { localize } from "@/content/profile";
import { generateGroundedAnswer } from "@/lib/rag/provider";
import { retrieveLocalSources } from "@/lib/rag/retrieval";
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
    ? "No he encontrado información verificada sobre eso en el portfolio."
    : "I couldn’t find verified information about that in the portfolio.";
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

    const matches = retrieveLocalSources(
      parsed.data.message,
      parsed.data.locale,
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

    const context = matches
      .map(
        ({ project }) =>
          `${project.title}: ${localize(project.summary, parsed.data.locale)} Metrics: ${project.metrics.map((metric) => `${localize(metric.label, parsed.data.locale)} ${metric.value}`).join(", ")}. Sources: ${project.sources.map((source) => source.url).join(", ")}`,
      )
      .join("\n\n");
    const generated = await generateGroundedAnswer({
      message: parsed.data.message,
      locale: parsed.data.locale,
      context,
      requestId,
    });
    const answer =
      generated ??
      (parsed.data.locale === "es"
        ? `He encontrado ${matches.length} proyectos relevantes: ${matches.map(({ project }) => `${project.title} — ${localize(project.summary, "es")}`).join(" ")}`
        : `I found ${matches.length} relevant projects: ${matches.map(({ project }) => `${project.title} — ${localize(project.summary, "en")}`).join(" ")}`);
    const sources = matches.map(({ project }) => ({
      title: project.title,
      url: project.repositoryUrl,
      section: project.sources[0]?.section ?? "README",
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
