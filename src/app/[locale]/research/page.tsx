import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  const research = projects.filter((project) => project.kind === "research");
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Research · Evidence first</p><h1 className="display">{candidate === "es" ? "Investigación aplicada, evaluación honesta." : "Applied research, honest evaluation."}</h1><p>{candidate === "es" ? "Trabajo científico y plataformas de investigación con resultados, fuentes y limitaciones visibles." : "Scientific work and research platforms with visible results, sources and limitations."}</p></header><section className="section-block featured-work">{research.map((project) => <FeaturedProject key={project.slug} locale={candidate} project={project} />)}</section><section className="section-block"><div className="section-heading"><div><p className="eyebrow">Research record</p><h2>{candidate === "es" ? "Publicaciones y artefactos." : "Publications and artifacts."}</h2></div></div><div className="repository-list"><a className="repository-row" href="https://github.com/cofrian/exist2026-ordantis" rel="noreferrer" target="_blank"><strong>GEMF · EXIST 2026</strong><span>Working note</span><span>2026</span><ArrowUpRight aria-hidden="true" size={17} /></a><a className="repository-row" href="https://github.com/cofrian/upv-earth-planetary-boundaries" rel="noreferrer" target="_blank"><strong>UPV-EARTH</strong><span>Project report</span><span>2026</span><ArrowUpRight aria-hidden="true" size={17} /></a></div></section></div>;
}
