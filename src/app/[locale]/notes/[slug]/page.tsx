import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { notes } from "@/content/notes";
import { hasLocale, localePath } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export default async function NotePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: candidate, slug } = await params;
  if (!hasLocale(candidate)) notFound();
  const note = notes.find((item) => item.slug === slug);
  if (!note) notFound();
  return <article className="site-shell"><header className="page-intro" style={{ maxWidth: 1050 }}><Link className="button button-ghost" href={localePath(candidate, "/notes")}><ArrowLeft aria-hidden="true" size={16} />{candidate === "es" ? "Notas" : "Notes"}</Link><p className="eyebrow">{note.category} · {formatDate(note.date, candidate)} · {note.readTime} min</p><h1 className="display">{note.title[candidate]}</h1><p>{note.excerpt[candidate]}</p></header><ProjectVisual title={note.title[candidate]} variant={note.visual} /><section className="case-section"><div><p className="eyebrow">Editorial note</p><h2>{candidate === "es" ? "Por qué importa" : "Why it matters"}</h2></div><div><p>{candidate === "es" ? "Esta nota resume una decisión documentada en el proyecto original. La versión inicial evita añadir afirmaciones que no estén respaldadas por la fuente enlazada." : "This note summarizes a decision documented in the original project. This first version avoids adding claims not supported by the linked source."}</p><a className="button button-secondary" href={note.sourceUrl} rel="noreferrer" target="_blank" style={{ marginTop: "1rem" }}>{candidate === "es" ? "Consultar fuente" : "Open source"}<ExternalLink aria-hidden="true" size={15} /></a></div></section></article>;
}
