import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EducationHighlight } from "@/components/profile/EducationHighlight";
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

      <EducationHighlight locale={locale} />

      <section className="section-block about-grid">
        <figure className="about-portrait">
          <Image
            alt={locale === "es" ? "Sergio Ortiz en una terraza de arquitectura contemporánea" : "Sergio Ortiz in a contemporary architectural setting"}
            fill
            priority
            sizes="(max-width: 720px) 100vw, 42vw"
            src="/images/profile/sergio-ortiz-portrait.webp"
          />
          <figcaption>{locale === "es" ? "Sergio Ortiz · Valencia" : "Sergio Ortiz · Valencia"}</figcaption>
        </figure>
        <div>
          <p className="eyebrow">{profile.location} · {locale === "es" ? "Cómo trabajo" : "How I work"}</p>
          <h2 className="about-statement">{profile.aboutStatement[locale]}</h2>
          <div className="about-copy-grid">
            <p>{profile.bio[locale]}</p>
            <p>{locale === "es" ? "Me interesan los sistemas en los que una buena predicción no basta: también importan la trazabilidad, el despliegue, la decisión y las personas que van a usar el resultado." : "I am drawn to systems where a good prediction is not enough: traceability, deployment, decision-making and the people using the result matter too."}</p>
          </div>
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
