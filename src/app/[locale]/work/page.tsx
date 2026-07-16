import { notFound } from "next/navigation";
import { WorkExplorer } from "@/components/projects/WorkExplorer";
import { projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Work · {projects.length} records</p><h1 className="display">{candidate === "es" ? "Proyectos que conectan datos, modelos y uso real." : "Projects connecting data, models and real use."}</h1><p>{candidate === "es" ? "Casos destacados editados con detalle y un índice verificable de trabajo público." : "Carefully edited case studies plus a verifiable index of public work."}</p></header><section className="section-block"><WorkExplorer locale={candidate} projects={projects} /></section></div>;
}
