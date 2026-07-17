import "server-only";
import { projects } from "@/content/projects";
import type { Locale } from "@/lib/i18n-types";
import { localize } from "@/content/profile";

const stopWords = new Set([
  "what", "which", "with", "from", "about", "that", "this", "have", "does", "show", "tell", "project", "projects", "sergio", "result", "results", "demonstrate", "demonstrates",
  "que", "cual", "cuales", "con", "para", "los", "las", "del", "una", "por", "proyecto", "proyectos", "sergio", "resultado", "resultados", "demuestra", "tiene", "son", "sus",
]);

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function expandedTerms(message: string) {
  const normalized = normalize(message);
  const terms = normalized
    .split(/[^\p{L}\p{N}+#.-]+/u)
    .filter((term) => term.length > 2 && !stopWords.has(term));
  if (/\bproduction\s+ml\b/.test(normalized)) {
    terms.push("mlops", "deployment", "monitoring", "fastapi", "docker");
  }
  if (/\bpublic\s+demos?\b/.test(normalized)) {
    terms.push("public-demo");
  }
  return [...new Set(terms)];
}

export function retrieveLocalSources(message: string, locale: Locale, limit = 4) {
  const terms = expandedTerms(message);
  const ranked = projects.map((project) => {
    const haystack = normalize([project.title, project.repository, localize(project.summary, locale), ...project.categories, ...project.stack, project.demoUrl ? "public-demo deployed" : ""].join(" "));
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
    return { project, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || Number(b.project.featured) - Number(a.project.featured));
  const bestScore = ranked[0]?.score ?? 0;
  return ranked.filter((item) => bestScore === 1 || item.score === bestScore).slice(0, limit);
}
