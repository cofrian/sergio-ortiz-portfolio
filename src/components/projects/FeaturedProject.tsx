import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Tag } from "@/components/ui/Tag";
import { localize } from "@/content/profile";
import type { Locale } from "@/lib/i18n-types";
import type { ProjectRecord } from "@/lib/schemas";
import { localePath } from "@/lib/i18n-client";

export function FeaturedProject({ project, locale }: { project: ProjectRecord; locale: Locale }) {
  return (
    <article className="card featured-project">
      <div className="featured-project-copy">
        <div className="filter-row">
          <Tag tone="featured">{locale === "es" ? "Destacado" : "Featured"}</Tag>
          <Tag tone={project.kind === "research" ? "research" : "default"}>{project.kind}</Tag>
          <Tag>{project.year}</Tag>
        </div>
        <h3>{project.title}</h3>
        <p>{localize(project.subtitle, locale)}</p>
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
            {locale === "es" ? "Explorar proyecto" : "Explore project"} <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          {project.demoUrl ? (
            <a className="button button-secondary" href={project.demoUrl} rel="noreferrer" target="_blank">
              {locale === "es" ? "Demo" : "Live demo"} <ExternalLink aria-hidden="true" size={15} />
            </a>
          ) : null}
        </div>
      </div>
      <div className="featured-project-visual">
        <ProjectVisual title={project.title} variant={project.visual} />
      </div>
    </article>
  );
}
