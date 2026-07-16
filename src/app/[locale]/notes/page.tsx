import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { notes } from "@/content/notes";
import { hasLocale, localePath } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export default async function NotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Notes · Project thinking</p><h1 className="display">{candidate === "es" ? "Notas sobre decisiones, fallos y aprendizajes." : "Notes on decisions, failures and lessons."}</h1><p>{candidate === "es" ? "Contenido editorial propio derivado de fuentes públicas. Los posts de LinkedIn reales se incorporarán mediante el flujo curado." : "Original editorial content derived from public sources. Real LinkedIn posts will be added through the curated workflow."}</p></header><section className="section-block notes-grid">{notes.map((note) => <article className="card note-card" key={note.slug}><ProjectVisual compact title={note.title[candidate]} variant={note.visual} /><div className="note-card-copy"><div className="note-meta"><span>{note.category}</span><span>{formatDate(note.date, candidate)} · {note.readTime} min</span></div><h2>{note.title[candidate]}</h2><p className="muted">{note.excerpt[candidate]}</p><Link className="button button-ghost" href={localePath(candidate, `/notes/${note.slug}`)}>{candidate === "es" ? "Leer nota" : "Read note"}<ArrowRight aria-hidden="true" size={15} /></Link></div></article>)}</section></div>;
}
