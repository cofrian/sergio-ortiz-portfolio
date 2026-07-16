import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n-types";
import type { ProjectRecord } from "@/lib/schemas";
import { localePath } from "@/lib/i18n-client";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Tag } from "@/components/ui/Tag";
import { localize } from "@/content/profile";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectRecord;
  locale: Locale;
  wide?: boolean;
}

export function ProjectCard({ project, locale, wide = false }: ProjectCardProps) {
  return (
    <article className={cn("card card-hover project-card", wide && "project-card-wide")}>
      <div className="project-card-visual">
        <ProjectVisual compact title={project.title} variant={project.visual} />
      </div>
      <div className="project-card-copy">
        <div className="filter-row">
          <Tag tone={project.kind === "research" ? "research" : project.featured ? "featured" : "default"}>
            {project.kind}
          </Tag>
          <Tag>{project.year}</Tag>
        </div>
        <h3>{project.title}</h3>
        <p>{localize(project.summary, locale)}</p>
        <div className="metrics-row">
          {project.metrics.slice(0, 3).map((metric) => (
            <div className="metric" key={metric.evidenceRef + metric.value}>
              <strong>{metric.value}</strong>
              <span>{localize(metric.label, locale)}</span>
            </div>
          ))}
        </div>
        <div className="project-actions">
          <Link className="button button-primary" href={localePath(locale, `/work/${project.slug}`)}>
            {locale === "es" ? "Ver caso" : "View case"} <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <a className="button button-secondary" href={project.repositoryUrl} rel="noreferrer" target="_blank">
            <GitBranch aria-hidden="true" size={16} /> GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
