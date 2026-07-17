import githubRagJson from "@/content/generated-github-rag.json";
import { githubRagCorpusSchema } from "@/lib/github/rag-sources";

const corpus = githubRagCorpusSchema.parse(githubRagJson);
const injectionPatterns = [
  /(?:ignore|disregard|forget|bypass|override).{0,60}(?:instruction|prompt|policy|rule)/i,
  /(?:ignora|olvida|desobedece|salta|anula).{0,60}(?:instrucci|prompt|regla|pol[ií]tica|mensaje)/i,
  /(?:reveal|show|print|dump|repeat|exfiltrate).{0,60}(?:prompt|secret|key|credential|context|environment|token)/i,
  /(?:revela|muestra|imprime|repite|filtra).{0,60}(?:prompt|secreto|clave|credencial|contexto|variable|token)/i,
  /\b(?:system|developer)\s+(?:prompt|message|instructions?)\b/i,
  /\b(?:prompt\s*injection|jailbreak|DAN mode)\b/i,
  /(?:act|pretend|behave)\s+as\b/i,
  /(?:act[uú]a|comp[oó]rtate|finge)\s+como\b/i,
  /<\/?(?:system|developer|assistant)>|\[\/?INST\]|BEGIN[_ ]SYSTEM/i,
  /(?:decode|codifica|base64).{0,50}(?:secret|key|prompt|clave|secreto)/i,
];

const scopeTerms = [
  "sergio", "project", "portfolio", "github", "repository", "repositories", "linkedin", "publication", "post", "note", "research", "experience", "skills", "hire", "job", "candidate", "education", "gemf", "exist", "urbanflow", "aion", "upv", "earth", "mlops", "llm", "smart city", "smart-city", "data", "deployment", "demo", "optimisation", "automation",
  "modelo", "proyecto", "portfolio", "repositorio", "github", "linkedin", "publicacion", "nota", "investigacion", "experiencia", "habilidades", "contratar", "empleo", "candidato", "formacion", "despliegue", "demo", "optimizacion", "automatizacion", "datos",
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase();
}

const repositoryNames = corpus.included.map((repository) => normalize(repository.repository));

export type Scope = "IN_SCOPE" | "OUT_OF_SCOPE" | "MALICIOUS_OR_INJECTION";

export function classifyScope(message: string): Scope {
  const clean = message.replace(/[\u200B-\u200D\uFEFF]/g, "");
  if (injectionPatterns.some((pattern) => pattern.test(clean))) return "MALICIOUS_OR_INJECTION";
  const normalized = normalize(clean);
  if (scopeTerms.some((term) => normalized.includes(term))) return "IN_SCOPE";
  return repositoryNames.some((repository) => normalized.includes(repository)) ? "IN_SCOPE" : "OUT_OF_SCOPE";
}
