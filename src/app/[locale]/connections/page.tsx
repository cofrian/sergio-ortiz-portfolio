import { notFound } from "next/navigation";
import { ConnectionsExplorer } from "@/components/graph/ConnectionsExplorer";
import { projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";

export default async function ConnectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Explore connections · Obsidian inspired</p><h1 className="display">{candidate === "es" ? "Los proyectos forman un sistema." : "The projects form a system."}</h1><p>{candidate === "es" ? "Una vista navegable de las relaciones entre proyectos y capacidades. En móvil se transforma en una lista accesible." : "A navigable view of relationships between projects and capabilities. On mobile it becomes an accessible list."}</p></header><section className="section-block"><ConnectionsExplorer locale={candidate} projects={projects} /></section></div>;
}
