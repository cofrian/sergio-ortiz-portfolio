import { notFound } from "next/navigation";
import { ConnectionsExplorer } from "@/components/graph/ConnectionsExplorer";
import { careerRecords } from "@/content/career";
import { projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";

export default async function ConnectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro connections-intro"><p className="eyebrow">{candidate === "es" ? "Mapa de conexiones · inspirado en Obsidian" : "Connections map · Obsidian inspired"}</p><h1 className="display">{candidate === "es" ? "Un portfolio que puedes explorar como una red." : "A portfolio you can explore as a network."}</h1><p>{candidate === "es" ? "Proyectos, investigación, tecnologías, experiencia y liderazgo conectados por relaciones reales. Mueve la red, filtra su contenido o selecciona un nodo para descubrir su contexto." : "Projects, research, technologies, experience and leadership connected by real relationships. Move the network, filter its content or select a node to reveal its context."}</p></header><section className="section-block connections-section"><ConnectionsExplorer locale={candidate} projects={projects} records={careerRecords} /></section></div>;
}
