import "server-only";
import { projects } from "@/content/projects";
import type { Locale } from "@/lib/i18n-types";
import { localize } from "@/content/profile";

const stopWords = new Set(["what", "which", "with", "from", "about", "that", "this", "have", "does", "show", "tell", "qué", "cual", "cuál", "con", "para", "los", "las", "del", "que", "una", "por"]);

export function retrieveLocalSources(message: string, locale: Locale, limit = 4) {
  const terms = message.toLowerCase().split(/[^\p{L}\p{N}+#.-]+/u).filter((term) => term.length > 2 && !stopWords.has(term));
  return projects.map((project) => {
    const haystack = [project.title, project.repository, localize(project.summary, locale), ...project.categories, ...project.stack].join(" ").toLowerCase();
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
    return { project, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || Number(b.project.featured) - Number(a.project.featured)).slice(0, limit);
}
