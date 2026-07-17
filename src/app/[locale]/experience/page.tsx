import { ArrowUpRight, BriefcaseBusiness, ChevronDown, GraduationCap, Lightbulb, UsersRound } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  careerMetrics,
  communityRecords,
  educationRecords,
  innovationRecords,
  professionalExperience,
} from "@/content/career";
import { localize, profile } from "@/content/profile";
import { hasLocale } from "@/lib/i18n";
import type { CareerRecord } from "@/lib/schemas";

function CareerTimeline({ locale, records }: { locale: "en" | "es"; records: CareerRecord[] }) {
  return (
    <div className="career-timeline">
      {records.map((record) => (
        <article className="career-entry" id={record.id} key={record.id}>
          <div className="career-entry-period">
            <span className={`career-kind career-kind-${record.kind}`}>{record.kind}</span>
            <span className="mono">{localize(record.period, locale)}</span>
          </div>
          <div className="career-entry-heading">
            <p className="eyebrow">{record.organisation}</p>
            <h3>{localize(record.role, locale)}</h3>
            {record.location ? <p className="muted">{localize(record.location, locale)}</p> : null}
          </div>
          <div className="career-entry-copy">
            <p>{localize(record.summary, locale)}</p>
            <div className="filter-row">
              {record.capabilities.slice(0, 3).map((capability) => <span className="tag" key={capability}>{capability}</span>)}
            </div>
            {record.bullets.length ? (
              <details className="career-details">
                <summary>{locale === "es" ? "Responsabilidades y resultados" : "Responsibilities and outcomes"}<ChevronDown aria-hidden="true" size={17} /></summary>
                <ul>
                  {record.bullets.map((bullet) => <li key={bullet.en}>{localize(bullet, locale)}</li>)}
                </ul>
              </details>
            ) : null}
          </div>
          <a aria-label={`${locale === "es" ? "Ver fuente" : "View source"}: ${record.organisation}`} className="career-source" href={record.source.url} rel="noreferrer" target="_blank">
            <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </article>
      ))}
    </div>
  );
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  const locale = candidate;

  return (
    <div className="site-shell">
      <header className="page-intro career-intro">
        <p className="eyebrow">Experience · Leadership · Innovation</p>
        <h1 className="display">
          {locale === "es" ? "Construir tecnología también es coordinar personas." : "Building technology also means bringing people together."}
        </h1>
        <p>
          {locale === "es"
            ? "Mi trayectoria combina sistemas de datos e IA, automatización, liderazgo universitario, mentoría e iniciativas de innovación. Cada entrada enlaza a una fuente pública verificable."
            : "My path combines data and AI systems, automation, university leadership, mentoring and innovation programmes. Every entry links to a verifiable public source."}
        </p>
      </header>

      <section aria-label={locale === "es" ? "Cifras verificadas" : "Verified figures"} className="career-metrics">
        {careerMetrics.map((metric) => (
          <div key={metric.value}>
            <strong className="display">{metric.value}</strong>
            <span>{localize(metric.label, locale)}</span>
          </div>
        ))}
      </section>

      <section aria-label={locale === "es" ? "Momentos de liderazgo e innovación" : "Leadership and innovation moments"} className="career-story">
        <a className="career-story-main" href="https://www.linkedin.com/feed/update/urn:li:activity:7375860826659766273/" rel="noreferrer" target="_blank">
          <Image alt={locale === "es" ? "Sergio presenta Sigma Data Club ante estudiantes de la UPV" : "Sergio presents Sigma Data Club to UPV students"} fill priority sizes="(max-width: 720px) 100vw, 62vw" src="/images/linkedin/sigma-presentation.jpg" />
          <span><strong>{locale === "es" ? "Construir comunidad" : "Building community"}</strong>{locale === "es" ? "Presentación de Sigma Data Club · UPV" : "Sigma Data Club presentation · UPV"}</span>
        </a>
        <div className="career-story-side">
          <a href="https://www.linkedin.com/feed/update/urn:li:activity:7402474082757320704/" rel="noreferrer" target="_blank">
            <Image alt={locale === "es" ? "Presentación del prototipo ganador en Accenture GenAI Maverick" : "Presentation of the winning prototype at Accenture GenAI Maverick"} fill sizes="(max-width: 720px) 100vw, 34vw" src="/images/linkedin/accenture-presentation.jpg" />
            <span>{locale === "es" ? "De prototipo a premio · Accenture" : "From prototype to award · Accenture"}</span>
          </a>
          <a href="https://www.linkedin.com/feed/update/urn:li:activity:7375860826659766273/" rel="noreferrer" target="_blank">
            <Image alt={locale === "es" ? "Equipo de Sigma Data Club durante su presentación" : "Sigma Data Club team during its presentation"} fill sizes="(max-width: 720px) 100vw, 34vw" src="/images/linkedin/sigma-onboarding.jpg" />
            <span>{locale === "es" ? "Equipo, organización y más de 50 inscripciones" : "Teamwork, organisation and 50+ registrations"}</span>
          </a>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow"><BriefcaseBusiness aria-hidden="true" size={15} /> 01 · {locale === "es" ? "Experiencia y liderazgo" : "Experience & leadership"}</p><h2>{locale === "es" ? "Responsabilidad técnica y operativa." : "Technical and operational responsibility."}</h2></div>
          <p>{locale === "es" ? "De la ingeniería y la automatización a coordinar una comunidad técnica de más de 100 estudiantes." : "From engineering and automation to coordinating a technical community of more than 100 students."}</p>
        </div>
        <CareerTimeline locale={locale} records={professionalExperience} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow"><UsersRound aria-hidden="true" size={15} /> 02 · {locale === "es" ? "Comunidad, clubes y mentoría" : "Community, clubs & mentoring"}</p><h2>{locale === "es" ? "Aprender y hacer que otros crezcan." : "Learning while helping others grow."}</h2></div>
          <p>{locale === "es" ? "Inversión y software, acompañamiento universitario y construcción de comunidad." : "Investment and software, university mentoring and community building."}</p>
        </div>
        <CareerTimeline locale={locale} records={communityRecords} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow"><Lightbulb aria-hidden="true" size={15} /> 03 · {locale === "es" ? "Innovación aplicada" : "Applied innovation"}</p><h2>{locale === "es" ? "Programas que terminan en productos." : "Programmes that end in products."}</h2></div>
          <p>{locale === "es" ? "Formación intensiva, retos multidisciplinares y prototipos construidos con una finalidad concreta." : "Intensive training, multidisciplinary challenges and prototypes built for a concrete purpose."}</p>
        </div>
        <div className="innovation-grid">
          {innovationRecords.map((record) => (
            <article className="card innovation-card" id={record.id} key={record.id}>
              <div><span className="mono">{localize(record.period, locale)}</span><span className="career-kind career-kind-innovation">Innovation</span></div>
              <p className="eyebrow">{record.organisation}</p>
              <h3>{localize(record.role, locale)}</h3>
              <p>{localize(record.summary, locale)}</p>
              <div className="filter-row">{record.capabilities.slice(0, 4).map((capability) => <span className="tag" key={capability}>{capability}</span>)}</div>
              <a className="button button-ghost" href={record.source.url} rel="noreferrer" target="_blank">{locale === "es" ? "Ver fuente" : "View source"}<ArrowUpRight aria-hidden="true" size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block career-education">
        <div>
          <p className="eyebrow"><GraduationCap aria-hidden="true" size={15} /> 04 · Education</p>
          <h2 className="display">{profile.education[locale]}</h2>
          {educationRecords.map((record) => <p className="muted" key={record.id}>{localize(record.period, locale)} · {record.organisation}</p>)}
        </div>
        <div className="card empty-state">
          <div><p className="eyebrow">CV</p><h3>{locale === "es" ? "Documento pendiente" : "Document pending"}</h3><p>{locale === "es" ? "La experiencia ya está publicada y respaldada por fuentes. La descarga se activará cuando incorporemos el PDF definitivo." : "The experience is already published and source-backed. The download will activate when the final PDF is added."}</p></div>
        </div>
      </section>
    </div>
  );
}
