import { notFound } from "next/navigation";
import { ConnectionsExplorer } from "@/components/graph/ConnectionsExplorer";
import { careerRecords } from "@/content/career";
import { projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";

export default async function ConnectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Explore connections · Obsidian inspired</p><h1 className="display">{candidate === "es" ? "Mi trabajo, liderazgo y aprendizaje forman una red." : "My work, leadership and learning form a network."}</h1><p>{candidate === "es" ? "Esta es la vista tipo Obsidian del portfolio: conecta proyectos, capacidades, experiencia, clubes, mentoría e innovación. En móvil se transforma en una lista accesible." : "This is the portfolio’s Obsidian-inspired view: it connects projects, capabilities, experience, clubs, mentoring and innovation. On mobile it becomes an accessible list."}</p></header><section className="section-block"><ConnectionsExplorer locale={candidate} projects={projects} records={careerRecords} /></section></div>;
}
