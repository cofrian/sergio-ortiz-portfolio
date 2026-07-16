import { ArrowLeft, ArrowRight, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Tag } from "@/components/ui/Tag";
import { localize } from "@/content/profile";
import { projects } from "@/content/projects";
import { hasLocale, localePath } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectJsonLd } from "@/lib/seo/structured-data";

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: candidate, slug } = await params;
  if (!hasLocale(candidate)) notFound();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];
  return <div className="site-shell"><JsonLd data={projectJsonLd(project)} />
    <section className="detail-hero"><div className="detail-copy"><Link className="button button-ghost" href={localePath(candidate, "/work")}><ArrowLeft aria-hidden="true" size={16} />{candidate === "es" ? "Todos los proyectos" : "All projects"}</Link><div className="filter-row" style={{ marginTop: "1.5rem" }}><Tag tone={project.kind === "research" ? "research" : "featured"}>{project.kind}</Tag><Tag>{project.year}</Tag>{project.categories.slice(0, 2).map((category) => <Tag key={category}>{category}</Tag>)}</div><h1 className="display">{project.title}</h1><p className="lead">{localize(project.subtitle, candidate)}</p><div className="project-actions"><a className="button button-primary" href={project.repositoryUrl} rel="noreferrer" target="_blank"><GitBranch aria-hidden="true" size={16} />GitHub</a>{project.demoUrl ? <a className="button button-secondary" href={project.demoUrl} rel="noreferrer" target="_blank">Demo<ExternalLink aria-hidden="true" size={15} /></a> : null}</div></div><ProjectVisual title={project.title} variant={project.visual} /></section>
    <section className="detail-metrics">{project.metrics.map((metric) => <div className="metric" key={metric.evidenceRef + metric.value}><strong>{metric.value}</strong><span>{localize(metric.label, candidate)}</span></div>)}</section>
    {project.sections.map((section, sectionIndex) => <section className="case-section" key={localize(section.title, candidate)}><div><p className="eyebrow">{String(sectionIndex + 1).padStart(2, "0")}</p><h2>{localize(section.title, candidate)}</h2></div><p>{localize(section.body, candidate)}</p></section>)}
    {project.limitations ? <section className="case-section"><div><p className="eyebrow">{candidate === "es" ? "Transparencia" : "Transparency"}</p><h2>{candidate === "es" ? "Limitaciones" : "Limitations"}</h2></div><p>{localize(project.limitations, candidate)}</p></section> : null}
    <section className="case-section"><div><p className="eyebrow">Evidence</p><h2>{candidate === "es" ? "Fuentes" : "Sources"}</h2></div><ul className="sources-list">{project.sources.map((source) => <li key={source.id}><a href={source.url} rel="noreferrer" target="_blank"><span><strong>{source.title}</strong><br /><span className="muted">{source.section}</span></span><ExternalLink aria-hidden="true" size={16} /></a></li>)}</ul></section>
    <section className="section-block"><p className="eyebrow">{candidate === "es" ? "Siguiente caso" : "Next case"}</p><Link href={localePath(candidate, `/work/${next.slug}`)}><h2 className="display" style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}>{next.title} <ArrowRight aria-hidden="true" size={45} /></h2></Link></section>
  </div>;
}
