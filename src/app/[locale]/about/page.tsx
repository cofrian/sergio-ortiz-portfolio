import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { leadershipAndCommunity } from "@/content/career";
import { aboutPrinciples, localize, profile } from "@/content/profile";
import { hasLocale, localePath } from "@/lib/i18n";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  const locale = candidate;

  return (
    <div className="site-shell">
      <header className="page-intro">
        <p className="eyebrow">About · Sergio Ortiz</p>
        <h1 className="display">{locale === "es" ? "Curiosidad técnica y responsabilidad compartida." : "Technical curiosity and shared responsibility."}</h1>
        <p>{profile.headline[locale]}</p>
      </header>

      <section className="section-block about-grid">
        <div className="portrait-placeholder" role="img" aria-label={locale === "es" ? "Retrato pendiente" : "Portrait pending"}>{profile.initials}</div>
        <div>
          <p className="eyebrow">{profile.location}</p>
          <p style={{ fontSize: "clamp(1.25rem, 2.2vw, 2rem)", lineHeight: 1.55 }}>{profile.bio[locale]}</p>
          <p className="muted" style={{ lineHeight: 1.75 }}>{locale === "es" ? "Me interesan los sistemas en los que una buena predicción no basta: también importan la trazabilidad, el despliegue, la decisión y las personas que van a usar el resultado." : "I am drawn to systems where a good prediction is not enough: traceability, deployment, decision-making and the people using the result matter too."}</p>
          <div className="principle-list">{aboutPrinciples.map((principle) => <article className="principle" key={principle.key}><h2>{principle.title[locale]}</h2><p>{principle.body[locale]}</p></article>)}</div>
          <div className="project-actions"><Link className="button button-primary" href={localePath(locale, "/contact")}>{locale === "es" ? "Contactar" : "Get in touch"}<ArrowRight aria-hidden="true" size={16} /></Link><span aria-disabled="true" className="button button-disabled">{locale === "es" ? "CV pendiente" : "CV pending"}</span></div>
        </div>
      </section>

      <section className="section-block about-community">
        <div className="section-heading">
          <div><p className="eyebrow">Leadership · Community</p><h2>{locale === "es" ? "La parte humana también es parte del sistema." : "The human side is part of the system too."}</h2></div>
          <p>{locale === "es" ? "Coordino equipos, participo en clubes técnicos, acompaño a otros estudiantes y ayudo a difundir iniciativas con propósito social porque el conocimiento gana valor cuando circula." : "I coordinate teams, contribute to technical clubs, mentor other students and help make socially purposeful initiatives visible because knowledge becomes more valuable when it circulates."}</p>
        </div>
        <div className="grid-three">
          {leadershipAndCommunity.map((record) => (
            <article className="card about-community-card" key={record.id}>
              <p className="eyebrow">{record.organisation}</p>
              <h3>{localize(record.role, locale)}</h3>
              <p>{localize(record.summary, locale)}</p>
              <a href={record.source.url} rel="noreferrer" target="_blank">{locale === "es" ? "Fuente pública" : "Public source"}<ArrowUpRight aria-hidden="true" size={15} /></a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
