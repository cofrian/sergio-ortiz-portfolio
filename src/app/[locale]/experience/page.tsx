import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { profile, verifiedMilestones } from "@/content/profile";
import { hasLocale } from "@/lib/i18n";

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Experience · Verified record</p><h1 className="display">{candidate === "es" ? "Aprender, construir y compartir." : "Learning, building and sharing."}</h1><p>{candidate === "es" ? "Por ahora esta vista muestra hitos públicos verificables. La experiencia profesional completa se incorporará al añadir el CV real." : "For now, this view shows publicly verifiable milestones. Full professional experience will be added with the real CV."}</p></header><section className="section-block"><div className="timeline-list">{verifiedMilestones.map((item) => <a className="timeline-item" href={item.href} key={item.title} rel="noreferrer" target="_blank"><span className="mono">{item.year}</span><div><p className="eyebrow">{item.type[candidate]}</p><h2>{item.title}</h2></div><p>{item.description[candidate]}</p><ArrowUpRight aria-hidden="true" size={17} /></a>)}</div></section><section className="section-block grid-two"><div><p className="eyebrow">Education</p><h2 className="display" style={{ fontSize: "3.5rem" }}>{profile.education[candidate]}</h2></div><div className="card empty-state"><div><p className="eyebrow">CV</p><h3>{candidate === "es" ? "Pendiente del documento real" : "Waiting for the real document"}</h3><p>{candidate === "es" ? "El botón de descarga se activará sin cambiar componentes cuando se añada el PDF verificado." : "The download action will activate without component edits when the verified PDF is added."}</p></div></div></section></div>;
}
