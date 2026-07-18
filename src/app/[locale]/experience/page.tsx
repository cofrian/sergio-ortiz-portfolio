import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Lightbulb, UsersRound } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EducationHighlight } from "@/components/profile/EducationHighlight";
import {
  careerMetrics,
  communityRecords,
  innovationRecords,
  professionalExperience,
} from "@/content/career";
import { localize } from "@/content/profile";
import { hasLocale } from "@/lib/i18n";
import type { CareerRecord } from "@/lib/schemas";

const careerKindLabels: Record<CareerRecord["kind"], { en: string; es: string }> = {
  experience: { en: "Experience", es: "Experiencia" },
  leadership: { en: "Leadership", es: "Liderazgo" },
  community: { en: "Community", es: "Comunidad" },
  innovation: { en: "Innovation", es: "Innovación" },
  education: { en: "Education", es: "Formación" },
};

function CareerTimeline({ locale, records }: { locale: "en" | "es"; records: CareerRecord[] }) {
  return (
    <div className="career-timeline">
      {records.map((record) => (
        <article className="career-entry" id={record.id} key={record.id}>
          <div className="career-entry-period">
            <span className={`career-kind career-kind-${record.kind}`}>{localize(careerKindLabels[record.kind], locale)}</span>
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
            ? "Mi trayectoria combina trabajo freelance en datos e IA, automatización, liderazgo universitario, impacto social e iniciativas de innovación. Cada entrada enlaza a una fuente pública verificable."
            : "My path combines freelance data and AI work, automation, university leadership, social impact and innovation programmes. Every entry links to a verifiable public source."}
        </p>
      </header>

      <EducationHighlight locale={locale} />

      <section aria-label={locale === "es" ? "Cifras verificadas" : "Verified figures"} className="career-metrics">
        {careerMetrics.map((metric) => (
          <div key={metric.value}>
            <strong className="display">{metric.value}</strong>
            <span>{localize(metric.label, locale)}</span>
          </div>
        ))}
      </section>

      <section aria-label={locale === "es" ? "Momentos de liderazgo e impacto" : "Leadership and impact moments"} className="career-story">
        <article className="career-story-card career-story-main">
          <Image alt={locale === "es" ? "Participantes y organización del GenAI Hackathon de Sigma Data Club" : "Participants and organisers at Sigma Data Club's GenAI Hackathon"} fill priority sizes="(max-width: 720px) 100vw, 62vw" src="/images/linkedin/sigma-genai-hackathon-group.jpg" />
          <span><strong>{locale === "es" ? "Liderar haciendo" : "Leading by building"}</strong>{locale === "es" ? "GenAI Hackathon · más de 60 participantes" : "GenAI Hackathon · 60+ participants"}</span>
        </article>
        <div className="career-story-side">
          <article className="career-story-card">
            <Image alt={locale === "es" ? "Mentoría y coordinación de equipos durante el GenAI Hackathon de Sigma" : "Team mentoring and coordination during Sigma's GenAI Hackathon"} fill sizes="(max-width: 720px) 100vw, 34vw" src="/images/linkedin/sigma-hackathon-mentoring.webp" />
            <span>{locale === "es" ? "Coordinación y mentoría de equipos" : "Team coordination and mentoring"}</span>
          </article>
          <a className="career-story-card" href="https://www.linkedin.com/feed/update/urn:li:activity:7463151444582567937/" rel="noreferrer" target="_blank">
            <Image alt={locale === "es" ? "Sergio junto a R2-KT y estudiantes durante Up! Steam 7" : "Sergio with R2-KT and students during Up! Steam 7"} fill sizes="(max-width: 720px) 100vw, 34vw" src="/images/linkedin/pink-force-up-steam.jpg" />
            <span>{locale === "es" ? "Embajador · The Pink Force" : "Ambassador · The Pink Force"}</span>
          </a>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow"><BriefcaseBusiness aria-hidden="true" size={15} /> 02 · {locale === "es" ? "Experiencia y liderazgo" : "Experience & leadership"}</p><h2>{locale === "es" ? "Datos, IA y responsabilidad real." : "Data, AI and real responsibility."}</h2></div>
          <p>{locale === "es" ? "Proyectos reales durante el grado para aprender a escuchar a clientes, definir necesidades, gestionar entregas y crecer más allá del aula." : "Real projects during my degree to learn how to listen to clients, define needs, manage delivery and grow beyond the classroom."}</p>
        </div>
        <CareerTimeline locale={locale} records={professionalExperience} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow"><UsersRound aria-hidden="true" size={15} /> 03 · {locale === "es" ? "Comunidad, clubes y mentoría" : "Community, clubs & mentoring"}</p><h2>{locale === "es" ? "Aprender y hacer que otros crezcan." : "Learning while helping others grow."}</h2></div>
          <p>{locale === "es" ? "Inversión y software, acompañamiento universitario, tecnología con propósito y construcción de comunidad." : "Investment and software, university mentoring, technology with purpose and community building."}</p>
        </div>
        <CareerTimeline locale={locale} records={communityRecords} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow"><Lightbulb aria-hidden="true" size={15} /> 04 · {locale === "es" ? "Innovación aplicada" : "Applied innovation"}</p><h2>{locale === "es" ? "Programas que terminan en productos." : "Programmes that end in products."}</h2></div>
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

    </div>
  );
}
