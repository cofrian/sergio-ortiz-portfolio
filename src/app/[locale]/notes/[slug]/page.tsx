import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { notes } from "@/content/notes";
import { hasLocale, localePath } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export default async function NotePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: candidate, slug } = await params;
  if (!hasLocale(candidate)) notFound();

  const note = notes.find((item) => item.slug === slug);
  if (!note) notFound();

  return (
    <article className="site-shell note-detail">
      <header className="page-intro note-detail-intro">
        <Link className="button button-ghost" href={localePath(candidate, "/notes")}>
          <ArrowLeft aria-hidden="true" size={16} />
          {candidate === "es" ? "Todas las notas" : "All notes"}
        </Link>
        <p className="eyebrow">
          {note.category} · {formatDate(note.date, candidate)} · {note.readTime} min
        </p>
        <h1 className="display">{note.title[candidate]}</h1>
        <p>{note.excerpt[candidate]}</p>
      </header>

      <ProjectVisual title={note.title[candidate]} variant={note.visual} />

      {note.sections.map((section, index) => (
        <section className="case-section" key={section.title.en}>
          <div>
            <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
            <h2>{section.title[candidate]}</h2>
          </div>
          <p>{section.body[candidate]}</p>
        </section>
      ))}

      <section className="case-section note-conclusion">
        <div>
          <p className="eyebrow">{candidate === "es" ? "Idea central" : "Takeaway"}</p>
          <h2>{candidate === "es" ? "Qué me llevo" : "What I take from it"}</h2>
        </div>
        <div>
          <p className="note-takeaway">{note.takeaway[candidate]}</p>
          <div className="note-actions">
            <Link className="button button-primary" href={localePath(candidate, `/work/${note.projectSlug}`)}>
              {candidate === "es" ? "Ver proyecto" : "View project"}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <a className="button button-secondary" href={note.sourceUrl} rel="noreferrer" target="_blank">
              {note.sourceLabel[candidate]}
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
