import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { linkedinPosts } from "@/content/linkedin";
import { notes } from "@/content/notes";
import { hasLocale, localePath } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export default async function NotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();

  return (
    <div className="site-shell">
      <header className="page-intro">
        <p className="eyebrow">Notes · Project thinking</p>
        <h1 className="display">
          {candidate === "es" ? "Notas sobre decisiones, fallos y aprendizajes." : "Notes on decisions, failures and lessons."}
        </h1>
        <p>
          {candidate === "es"
            ? "Ideas propias construidas a partir de la evidencia pública de cada proyecto. Sin titulares genéricos ni afirmaciones sin fuente."
            : "Original thinking built from the public evidence behind each project—without generic headlines or unsupported claims."}
        </p>
      </header>

      <section className="section-block notes-grid">
        {notes.map((note) => (
          <article className="card note-card" key={note.slug}>
            <ProjectVisual compact title={note.title[candidate]} variant={note.visual} />
            <div className="note-card-copy">
              <div className="note-meta"><span>{note.category}</span><span>{formatDate(note.date, candidate)} · {note.readTime} min</span></div>
              <h2>{note.title[candidate]}</h2>
              <p className="muted">{note.excerpt[candidate]}</p>
              <Link className="button button-ghost" href={localePath(candidate, `/notes/${note.slug}`)}>
                {candidate === "es" ? "Leer nota" : "Read note"}<ArrowRight aria-hidden="true" size={15} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {linkedinPosts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">LinkedIn</p><h2>{candidate === "es" ? "Publicaciones y actualizaciones." : "Posts and updates."}</h2></div>
            <a className="button button-ghost" href="https://www.linkedin.com/in/sergioortizmontesinos/" rel="noreferrer" target="_blank">
              {candidate === "es" ? "Ver perfil" : "View profile"}<ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
          <div className="linkedin-grid">
            {linkedinPosts.map((post) => (
              <a className="card linkedin-card" href={post.url} key={post.id} rel="noreferrer" target="_blank">
                {post.image ? <div className="linkedin-card-image"><Image alt="" fill sizes="(max-width: 720px) 100vw, 33vw" src={post.image} /></div> : null}
                <div className="note-meta"><span>{post.categories[0]}</span><span>{formatDate(post.publishedAt, candidate)}</span></div>
                <h3>{post.title}</h3>
                <p className="muted">{post.excerpt}</p>
                <span className="button button-ghost">{candidate === "es" ? "Leer en LinkedIn" : "Read on LinkedIn"}<ExternalLink aria-hidden="true" size={15} /></span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
