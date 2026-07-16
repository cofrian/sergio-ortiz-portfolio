import { ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioAsk } from "@/components/chat/PortfolioAsk";
import { hasLocale } from "@/lib/i18n";

export default async function AskPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Ask my portfolio · Source-backed</p><h1 className="display">{candidate === "es" ? "Consulta el archivo, no una personalidad inventada." : "Query the archive, not an invented persona."}</h1><p>{candidate === "es" ? "Busca proyectos, capacidades e investigación. Las respuestas se limitan al contenido público verificado y citan sus fuentes." : "Search projects, capabilities and research. Answers are restricted to verified public content and cite their sources."}</p></header><section className="section-block ask-layout"><PortfolioAsk locale={candidate} /><aside className="card ask-panel"><ShieldCheck aria-hidden="true" color="var(--primary)" size={28} /><h2 className="display" style={{ fontSize: "2.8rem", marginTop: "1rem" }}>{candidate === "es" ? "Alcance restringido." : "Restricted by design."}</h2><p className="muted" style={{ lineHeight: 1.7 }}>{candidate === "es" ? "No responde preguntas generales, no muestra instrucciones internas y no completa huecos. Sin proveedor LLM, mantiene una búsqueda local de fuentes verificadas." : "It does not answer general questions, expose internal instructions or fill gaps. Without an LLM provider, it remains a local search over verified sources."}</p><ul className="sources-list"><li><span className="source-card">GitHub portfolio repositories</span></li><li><span className="source-card">Verified project evidence</span></li><li><span className="source-card">Curated notes and profile</span></li></ul></aside></section></div>;
}
