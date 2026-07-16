import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema, chatResponseSchema } from "@/lib/schemas";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { hasValidJsonRequest } from "@/lib/security/request";
import { publicError, safeLog } from "@/lib/security/safe-log";
import { classifyScope } from "@/lib/rag/scope-classifier";
import { retrieveLocalSources } from "@/lib/rag/retrieval";
import { generateGroundedAnswer } from "@/lib/rag/provider";
import { localize } from "@/content/profile";

export const runtime = "nodejs";

function refusal(locale: "en" | "es", type: "scope" | "evidence") {
  if (type === "scope") return locale === "es" ? "Solo puedo responder preguntas sobre los proyectos, experiencia, investigación y contenido público del portfolio de Sergio Ortiz." : "I can only answer questions about Sergio Ortiz’s projects, experience, research and published portfolio content.";
  return locale === "es" ? "No he encontrado información verificada sobre eso en el portfolio." : "I couldn’t find verified information about that in the portfolio.";
}

export async function POST(request: NextRequest) {
  const started = Date.now();
  const requestId = crypto.randomUUID();
  if (!hasValidJsonRequest(request)) return NextResponse.json(publicError(), { status: 400 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 4_000) return NextResponse.json(publicError(), { status: 413 });
  try {
    const parsed = chatRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json(publicError(), { status: 400 });
    const limit = await consumeRateLimit(request, "chat", 12, 60);
    if (!limit.allowed) return NextResponse.json({ error: limit.unavailable ? "Service temporarily unavailable." : "Too many requests." }, { status: limit.unavailable ? 503 : 429 });
    const scope = classifyScope(parsed.data.message);
    if (scope !== "IN_SCOPE") {
      const response = chatResponseSchema.parse({ answer: refusal(parsed.data.locale, "scope"), sources: [], inScope: false, confidence: "none" });
      return NextResponse.json(response);
    }
    const matches = retrieveLocalSources(parsed.data.message, parsed.data.locale);
    if (!matches.length) {
      const response = chatResponseSchema.parse({ answer: refusal(parsed.data.locale, "evidence"), sources: [], inScope: true, confidence: "none" });
      return NextResponse.json(response);
    }
    const context = matches.map(({ project }) => `${project.title}: ${localize(project.summary, parsed.data.locale)} Metrics: ${project.metrics.map((metric) => `${localize(metric.label, parsed.data.locale)} ${metric.value}`).join(", ")}. Sources: ${project.sources.map((source) => source.url).join(", ")}`).join("\n\n");
    const generated = await generateGroundedAnswer({ message: parsed.data.message, locale: parsed.data.locale, context });
    const answer = generated ?? (parsed.data.locale === "es" ? `He encontrado ${matches.length} proyectos relevantes: ${matches.map(({ project }) => `${project.title} — ${localize(project.summary, "es")}`).join(" ")}` : `I found ${matches.length} relevant projects: ${matches.map(({ project }) => `${project.title} — ${localize(project.summary, "en")}`).join(" ")}`);
    const sources = matches.map(({ project }) => ({ title: project.title, url: project.repositoryUrl, section: project.sources[0]?.section ?? "README" }));
    const response = chatResponseSchema.parse({ answer, sources, inScope: true, confidence: generated ? "high" : "medium" });
    safeLog("chat", { requestId, status: "ok", latencyMs: Date.now() - started });
    return NextResponse.json(response, { headers: { "cache-control": "no-store" } });
  } catch {
    safeLog("chat", { requestId, status: "error", latencyMs: Date.now() - started, code: "CHAT_FAILED" });
    return NextResponse.json(publicError(), { status: 500 });
  }
}
