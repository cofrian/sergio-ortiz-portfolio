"use client";

import { useMemo, useState } from "react";
import type { ProjectRecord } from "@/lib/schemas";
import type { Locale } from "@/lib/i18n-types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";

const filters = ["All", "AI", "Smart Cities", "MLOps", "Research", "Data Engineering", "Visualisation", "Automation", "Experiments"];

function matches(project: ProjectRecord, filter: string) {
  if (filter === "All") return true;
  const haystack = [...project.categories, ...project.stack, project.kind].join(" ").toLowerCase();
  const aliases: Record<string, string[]> = {
    AI: ["ai", "llm", "nlp", "machine learning", "predictive"],
    Experiments: ["experiment"],
    Visualisation: ["visualisation", "visualization"],
  };
  return (aliases[filter] ?? [filter.toLowerCase()]).some((term) => haystack.includes(term.toLowerCase()));
}

export function WorkExplorer({ projects, locale }: { projects: ProjectRecord[]; locale: Locale }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => projects.filter((project) => {
    const text = `${project.title} ${project.repository} ${project.categories.join(" ")} ${project.stack.join(" ")}`.toLowerCase();
    return matches(project, filter) && text.includes(query.trim().toLowerCase());
  }), [filter, projects, query]);

  return (
    <div>
      <label className="form-field" style={{ maxWidth: 540 }}>
        <span>{locale === "es" ? "Buscar por proyecto, capacidad o tecnología" : "Search by project, capability or technology"}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" />
      </label>
      <div aria-label={locale === "es" ? "Filtros de proyectos" : "Project filters"} className="filter-row" style={{ marginTop: "1rem" }}>
        {filters.map((item) => (
          <button className={cn("filter-button", filter === item && "filter-button-active")} key={item} onClick={() => setFilter(item)} type="button">
            {locale === "es" && item === "All" ? "Todos" : item}
          </button>
        ))}
      </div>
      <p className="status-line"><span className="status-dot" />{visible.length} {locale === "es" ? "proyectos verificados" : "verified projects"}</p>
      <div className="project-grid" style={{ marginTop: "1rem" }}>
        {visible.map((project, index) => <ProjectCard key={project.slug} locale={locale} project={project} wide={index < 2} />)}
      </div>
    </div>
  );
}
