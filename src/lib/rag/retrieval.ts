import "server-only";
import githubRagJson from "@/content/generated-github-rag.json";
import { careerRecords, degreeEngagement } from "@/content/career";
import { linkedinPosts } from "@/content/linkedin";
import { notes } from "@/content/notes";
import { localize, profile, verifiedMilestones } from "@/content/profile";
import { projects } from "@/content/projects";
import { githubRagCorpusSchema, sanitizeGithubRagText } from "@/lib/github/rag-sources";
import type { Locale } from "@/lib/i18n-types";
import { safeLog } from "@/lib/security/safe-log";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface RetrievedSource {
  title: string;
  url: string;
  section: string;
  content: string;
  score: number;
  repository?: string;
  origin: "supabase" | "local";
}

const corpus = githubRagCorpusSchema.parse(githubRagJson);
const stopWords = new Set([
  "what", "which", "with", "from", "about", "that", "this", "have", "does", "show", "tell", "project", "projects", "sergio", "result", "results", "demonstrate", "demonstrates", "built", "work", "works",
  "que", "cual", "cuales", "con", "para", "los", "las", "del", "una", "por", "proyecto", "proyectos", "sergio", "resultado", "resultados", "demuestra", "tiene", "son", "sus", "trabajo", "trabajos", "repositorio", "repositorios",
]);

export function normalizeRagText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase();
}

export function isRepositoryOverviewQuestion(message: string) {
  const normalized = normalizeRagText(message);
  return /\b(all|every|overview|catalog|list|todos|todas|lista|resumen)\b/.test(normalized)
    || /\b(github|repositorios?)\b/.test(normalized) && /\b(projects?|proyectos?|work|trabajos?)\b/.test(normalized);
}

export function isCodeQuestion(message: string) {
  const normalized = normalizeRagText(message);
  return /\b(code|codigo|source|implementation|implemented|function|class|module|file|algorithm|script|endpoint|pipeline|how does|como funciona|como esta hecho|como se implementa)\b/.test(normalized);
}

export function isEducationQuestion(message: string) {
  const normalized = normalizeRagText(message);
  return /\b(education|degree|stud(?:y|ies|ying|ent)|academic|honou?r|distinction|university|credits?|ects|formacion|grado|carrera|estudia|estudios|estudiante|academica|academico|matricula(?:s)?(?: de honor)?|universidad|creditos?)\b/.test(normalized);
}

export function buildRepositoryOverview(locale: Locale) {
  const groups = {
    systems: [] as string[],
    ai: [] as string[],
    analytics: [] as string[],
  };
  for (const repository of corpus.included) {
    const topics = new Set(repository.topics);
    if (["smart-city", "traffic-prediction", "emergency-services", "mlops", "data-engineering", "devops", "containerization", "real-time"].some((topic) => topics.has(topic))) {
      groups.systems.push(repository.repository);
    } else if (["llm", "machine-learning", "deep-learning", "nlp", "research-project", "rag", "multimodal", "multimodal-learning"].some((topic) => topics.has(topic))) {
      groups.ai.push(repository.repository);
    } else groups.analytics.push(repository.repository);
  }
  const list = (items: string[]) => items.length ? items.join(", ") : (locale === "es" ? "ninguno" : "none");
  return locale === "es"
    ? `El índice verificado contiene ${corpus.included.length} repositorios públicos con topics. Sistemas, infraestructura y ciudades: ${list(groups.systems)}. Investigación e IA: ${list(groups.ai)}. Analítica y productos: ${list(groups.analytics)}. Las fuentes inferiores enlazan al índice general y a los casos más relevantes para profundizar.`
    : `The verified index contains ${corpus.included.length} public repositories with topics. Systems, infrastructure and cities: ${list(groups.systems)}. Research and AI: ${list(groups.ai)}. Analytics and products: ${list(groups.analytics)}. The source cards below link to the full index and the most relevant case studies.`;
}

function expandedTerms(message: string) {
  const normalized = normalizeRagText(message);
  const terms = normalized
    .split(/[^\p{L}\p{N}+#.-]+/u)
    .filter((term) => term.length > 2 && !stopWords.has(term));
  const expansions: Array<[RegExp, string[]]> = [
    [/\bproduction\s+ml\b|\bml\s+en\s+produccion\b/, ["mlops", "deployment", "monitoring", "fastapi", "docker"]],
    [/\bpublic\s+demos?\b|\bdemos?\s+publicas?\b/, ["public-demo", "deployment", "homepage"]],
    [/\breal[ -]?time\b|\btiempo\s+real\b/, ["websocket", "streaming", "events", "pipeline"]],
    [/\bsmart[ -]?cit(?:y|ies)\b|\bciudades?\s+inteligentes?\b/, ["traffic", "valencia", "urban", "geospatial"]],
    [/\bllms?\b|\bmodelos?\s+de\s+lenguaje\b/, ["llm", "rag", "gemini", "ollama", "nlp"]],
    [/\bjob\b|\bhire\b|\bcontratar\b|\bempleo\b/, ["mlops", "machine-learning", "data-engineering", "fastapi", "python"]],
    [/\bleadership\b|\bliderazgo\b|\bcoordina(?:r|cion|dor)\b/, ["sigma", "team", "community", "programme", "partnerships"]],
    [/\bclubs?\b|\bclubes?\b|\bcommunity\b|\bcomunidad\b|\bmentor(?:ing)?\b|\btutor(?:ia)?\b/, ["sigma", "investment", "etsinf", "students", "mentoring"]],
    [/\bpodcasts?\b|\bepisodios?\b|\bspotify\b/, ["podcast", "podcasts", "episode", "episodio", "spotify", "planificacion", "marketing"]],
    [/\binnovation\b|\binnovacion\b|\bentrepreneurship\b|\bemprendimiento\b/, ["akademia", "bankinter", "samsung", "accenture", "product"]],
    [/\b(education|degree|stud(?:y|ies|ying|ent)|academic|honou?r|distinction|university|credits?|ects|formacion|grado|carrera|estudia|estudios|estudiante|academica|academico|matricula(?:s)?(?: de honor)?|universidad|creditos?)\b/, ["data science", "ciencia de datos", "upv", "etsinf", "240 ects", "distinction", "matricula de honor", "economics", "business", "economia", "empresa", "infraestructura", "procesamiento"]],
    [/\bcode\b|\bcodigo\b|\bimplementation\b|\bimplementacion\b|\bfunction\b|\bfuncion\b|\bclass\b|\bmodule\b|\barchivo\b|\bscript\b|\bendpoint\b|\balgorithm\b|\balgoritmo\b/, ["src", "app", "api", "pipeline", "model", "train", "inference"]],
  ];
  for (const [pattern, additions] of expansions) {
    if (pattern.test(normalized)) terms.push(...additions);
  }
  return [...new Set(terms)];
}

function careerSourceContent(message: string, locale: Locale): RetrievedSource[] {
  const terms = expandedTerms(message);
  const educationQuestion = isEducationQuestion(message);
  return careerRecords.map((record) => {
    const content = [
      `${localize(record.role, locale)} · ${record.organisation}`,
      localize(record.period, locale),
      localize(record.summary, locale),
      ...record.bullets.map((bullet) => localize(bullet, locale)),
      record.id === "upv-data-science" ? localize(degreeEngagement.summary, locale) : "",
      ...(record.id === "upv-data-science"
        ? degreeEngagement.podcasts.map((podcast) => `${localize(podcast.title, locale)} — ${podcast.url}`)
        : []),
      `Capabilities: ${record.capabilities.join(", ")}`,
    ].filter(Boolean).join("\n\n");
    const searchable = normalizeRagText(`${record.kind} ${record.organisation} ${content}`);
    const termScore = terms.reduce((total, term) => total + (searchable.includes(term) ? 4 : 0), 0);
    const intentScore = educationQuestion && record.kind === "education" ? 60 : 0;
    const score = termScore + intentScore;
    return {
      title: `${record.organisation} — ${localize(record.role, locale)}`,
      url: `https://www.sergioortiz.dev/${locale}/experience#${record.id}`,
      section: record.source.section,
      content,
      score,
      origin: "local" as const,
    };
  });
}

function projectSourceContent(locale: Locale) {
  return projects.map((project) => ({
    title: project.title,
    url: project.repositoryUrl,
    section: project.sources[0]?.section ?? "Verified portfolio case study",
    repository: project.repository,
    searchable: [
      project.title,
      project.repository,
      localize(project.summary, locale),
      ...project.categories,
      ...project.stack,
      ...project.sections.flatMap((section) => [localize(section.title, locale), localize(section.body, locale)]),
      project.demoUrl ? "public-demo deployed homepage" : "",
    ].join("\n"),
    content: [
      localize(project.summary, locale),
      ...project.sections.map((section) => `${localize(section.title, locale)}: ${localize(section.body, locale)}`),
      project.metrics.length ? `Verified metrics: ${project.metrics.map((metric) => `${localize(metric.label, locale)} ${metric.value}`).join("; ")}` : "",
      project.limitations ? `Limitations: ${localize(project.limitations, locale)}` : "",
    ].filter(Boolean).join("\n\n"),
  }));
}

function githubIndexSource(): RetrievedSource {
  return {
    title: "Sergio Ortiz — public GitHub project index",
    url: `https://github.com/${corpus.owner}?tab=repositories`,
    section: `Index of ${corpus.included.length} public project repositories`,
    content: [
      `The knowledge index currently contains ${corpus.included.length} public project repositories owned by or forked into Sergio Ortiz's GitHub account.`,
      ...corpus.included.map((repository) => `${repository.repository}: ${repository.description || "Public repository without a description."} Topics: ${repository.topics.join(", ") || "not specified"}.`),
    ].join("\n\n").slice(0, 12_000),
    score: 1_000,
    origin: "local",
  };
}

function profileSource(locale: Locale): RetrievedSource {
  return {
    title: "Sergio Ortiz — verified public profile",
    url: profile.github,
    section: "Profile, education, focus and verified milestones",
    content: [
      localize(profile.bio, locale),
      localize(profile.education, locale),
      `Focus: ${profile.focus.join(", ")}`,
      ...careerRecords.map((record) => `${record.organisation} — ${localize(record.role, locale)} (${localize(record.period, locale)}): ${localize(record.summary, locale)}`),
      localize(degreeEngagement.summary, locale),
      ...degreeEngagement.podcasts.map((podcast) => `${localize(podcast.title, locale)} — ${podcast.url}`),
      ...verifiedMilestones.map((milestone) => `${milestone.year} — ${milestone.title}: ${localize(milestone.description, locale)}`),
      corpus.profile?.readme ? `Public GitHub profile README:\n${corpus.profile.readme.slice(0, 6_000)}` : "",
    ].filter(Boolean).join("\n\n"),
    score: 900,
    origin: "local",
  };
}

export function retrieveLocalSources(message: string, locale: Locale, limit = 6): RetrievedSource[] {
  const terms = expandedTerms(message);
  const overview = isRepositoryOverviewQuestion(message);
  const codeQuestion = isCodeQuestion(message);
  const career = /\b(experience|skills?|education|degree|stud(?:y|ies|ying|ent)|academic|honou?r|distinction|university|credits?|ects|hire|hiring|job|candidate|career|leadership|community|clubs?|mentoring|innovation|experiencia|habilidades?|formacion|grado|carrera|estudia|estudios|estudiante|academica|academico|matricula(?:s)?(?: de honor)?|universidad|creditos?|contratar|empleo|candidato|trayectoria|liderazgo|comunidad|clubes?|tutoria|innovacion)\b/.test(normalizeRagText(message));
  const curated: RetrievedSource[] = projectSourceContent(locale).map((source) => {
    const normalized = normalizeRagText(source.searchable);
    const title = normalizeRagText(`${source.title} ${source.repository}`);
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 8 : normalized.includes(term) ? 3 : 0), 0) + 2;
    return { ...source, score, origin: "local" as const };
  });
  const github: RetrievedSource[] = corpus.included.map((repository) => {
    const title = normalizeRagText(`${repository.title} ${repository.repository}`);
    const topics = normalizeRagText(repository.topics.join(" "));
    const description = normalizeRagText(repository.description);
    const readme = normalizeRagText(repository.readme);
    const score = terms.reduce((total, term) => {
      if (title.includes(term)) return total + 10;
      if (topics.includes(term)) return total + 5;
      if (description.includes(term)) return total + 3;
      if (readme.includes(term)) return total + 1;
      return total;
    }, 0);
    return {
      title: repository.title,
      url: repository.repositoryUrl,
      section: "GitHub README and public repository metadata",
      content: [
        repository.description,
        repository.language ? `Primary language: ${repository.language}` : "",
        repository.topics.length ? `Topics: ${repository.topics.join(", ")}` : "",
        repository.readme,
      ].filter(Boolean).join("\n\n").slice(0, 5_000),
      score,
      repository: repository.repository,
      origin: "local" as const,
    };
  });
  const githubCode: RetrievedSource[] = corpus.included.flatMap((repository) => repository.code.map((file) => {
    const repositoryText = normalizeRagText(`${repository.repository} ${repository.title}`);
    const path = normalizeRagText(file.path);
    const content = normalizeRagText(file.content);
    const score = terms.reduce((total, term) => {
      if (repositoryText.includes(term)) return total + 12;
      if (path.includes(term)) return total + 8;
      if (content.includes(term)) return total + 2;
      return total;
    }, codeQuestion ? 3 : 0);
    return {
      title: `${repository.title} — ${file.path}`,
      url: file.url,
      section: `Source code · ${file.path}`,
      content: [`Repository: ${repository.repository}`, `Language: ${file.language}`, file.content].join("\n\n").slice(0, 6_000),
      score,
      repository: repository.repository,
      origin: "local" as const,
    };
  }));
  const editorial: RetrievedSource[] = notes.map((note) => {
    const content = [
      localize(note.excerpt, locale),
      ...note.sections.map((section) => `${localize(section.title, locale)}: ${localize(section.body, locale)}`),
      `${locale === "es" ? "Idea central" : "Takeaway"}: ${localize(note.takeaway, locale)}`,
    ].join("\n\n");
    const searchable = normalizeRagText(`${localize(note.title, locale)} ${note.category} ${content}`);
    return {
      title: localize(note.title, locale),
      url: `https://www.sergioortiz.dev/${locale}/notes/${note.slug}`,
      section: "Reviewed portfolio note",
      content,
      score: terms.reduce((total, term) => total + (searchable.includes(term) ? 2 : 0), 0),
      origin: "local" as const,
    };
  });
  const linkedIn: RetrievedSource[] = linkedinPosts.map((post) => {
    const content = [
      post.content || post.excerpt,
      post.spotifyUrl ? `Spotify episode: ${post.spotifyTitle || post.title} — ${post.spotifyUrl}` : "",
    ].filter(Boolean).join("\n\n");
    const searchable = normalizeRagText(`linkedin publicacion publication social post ${post.title} ${post.categories.join(" ")} ${content}`);
    return {
      title: post.title,
      url: post.url,
      section: "Reviewed public LinkedIn post",
      content,
      score: terms.reduce((total, term) => total + (searchable.includes(term) ? 3 : 0), 0),
      origin: "local" as const,
    };
  });
  const careerEntries = careerSourceContent(message, locale);

  const ranked = [...careerEntries, ...curated, ...githubCode, ...github, ...editorial, ...linkedIn]
    .filter((source) => overview || source.score > (source.repository && projects.some((project) => project.repository === source.repository) ? 2 : 0))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const results: RetrievedSource[] = [
    ...(overview ? [githubIndexSource()] : []),
    ...(career ? [profileSource(locale)] : []),
  ];
  const seen = new Set(results.map((source) => source.url));
  for (const source of ranked) {
    if (seen.has(source.url)) continue;
    results.push(source);
    seen.add(source.url);
    if (results.length >= limit) break;
  }
  return results.slice(0, limit);
}

interface LexicalRow {
  title: string;
  public_url: string;
  section: string;
  content: string;
  metadata: Record<string, unknown> | null;
  rank: number;
}

async function retrieveSupabaseSources(message: string, limit: number, requestId?: string): Promise<RetrievedSource[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client.rpc("search_content_chunks", {
    p_query: message,
    p_count: Math.min(Math.max(limit * 2, 4), 12),
  });
  if (error) {
    safeLog("rag_retrieval", { requestId, status: "fallback", code: "LEXICAL_SEARCH_UNAVAILABLE" });
    return retrieveSupabaseRowsFallback(message, limit, requestId);
  }
  return ((data ?? []) as LexicalRow[]).map((row) => ({
    title: sanitizeGithubRagText(row.title, 180),
    url: row.public_url,
    section: sanitizeGithubRagText(String(row.metadata?.sourceSection ?? row.section), 180),
    content: sanitizeGithubRagText(row.content, 5_000),
    score: 100 + Number(row.rank || 0),
    repository: typeof row.metadata?.repository === "string" ? row.metadata.repository : undefined,
    origin: "supabase" as const,
  }));
}

interface ChunkFallbackRow {
  section: string;
  content: string;
  metadata: Record<string, unknown> | null;
  content_documents: {
    title: string;
    public_url: string;
    visibility: string;
    approved_for_rag: boolean;
  } | Array<{
    title: string;
    public_url: string;
    visibility: string;
    approved_for_rag: boolean;
  }>;
}

async function retrieveSupabaseRowsFallback(message: string, limit: number, requestId?: string): Promise<RetrievedSource[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("content_chunks")
    .select("section, content, metadata, content_documents!inner(title, public_url, visibility, approved_for_rag)")
    .eq("content_documents.visibility", "public")
    .eq("content_documents.approved_for_rag", true)
    .limit(400);
  if (error) {
    safeLog("rag_retrieval", { requestId, status: "fallback", code: "CHUNK_FALLBACK_UNAVAILABLE" });
    return [];
  }
  const terms = expandedTerms(message);
  return ((data ?? []) as unknown as ChunkFallbackRow[])
    .map((row) => {
      const document = Array.isArray(row.content_documents) ? row.content_documents[0] : row.content_documents;
      const normalized = normalizeRagText(`${document?.title ?? ""} ${row.content}`);
      const score = terms.reduce((total, term) => total + (normalized.includes(term) ? 1 : 0), 0);
      return { row, document, score };
    })
    .filter(({ document, score }) => document?.approved_for_rag && score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ row, document, score }) => ({
      title: sanitizeGithubRagText(document.title, 180),
      url: document.public_url,
      section: sanitizeGithubRagText(String(row.metadata?.sourceSection ?? row.section), 180),
      content: sanitizeGithubRagText(row.content, 5_000),
      score: 50 + score,
      repository: typeof row.metadata?.repository === "string" ? row.metadata.repository : undefined,
      origin: "supabase" as const,
    }));
}

export async function retrieveSources(message: string, locale: Locale, limit = 6, requestId?: string) {
  const local = retrieveLocalSources(message, locale, limit);
  if (isEducationQuestion(message)) {
    const academic = local.filter((source) => source.url.endsWith("#upv-data-science"));
    if (academic.length) return academic.slice(0, limit);
  }
  const remote = await retrieveSupabaseSources(message, limit, requestId);
  const pinned = local.filter((source) =>
    source.section.startsWith("Index of")
      || source.section.startsWith("Profile, education")
      || isCodeQuestion(message) && source.section.startsWith("Source code"),
  );
  const ordered = [...pinned, ...remote, ...local];
  const results: RetrievedSource[] = [];
  const seen = new Set<string>();
  for (const source of ordered) {
    if (!source.url.startsWith("https://") || seen.has(source.url)) continue;
    results.push(source);
    seen.add(source.url);
    if (results.length >= limit) break;
  }
  return results;
}
