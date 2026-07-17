import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { degreeFacts, educationRecords } from "@/content/career";
import { localize } from "@/content/profile";
import type { Locale } from "@/lib/i18n";

export function EducationHighlight({ locale }: { locale: Locale }) {
  const degree = educationRecords[0];
  if (!degree) return null;

  const labels = locale === "es"
    ? {
        eyebrow: "01 · Educación actual",
        institution: "Universitat Politècnica de València",
        period: "Periodo",
        programme: "Programa",
        school: "Escuela",
        honours: "Matrículas de Honor",
        source: "Ver grado oficial en la UPV",
      }
    : {
        eyebrow: "01 · Current education",
        institution: "Universitat Politècnica de València",
        period: "Period",
        programme: "Programme",
        school: "School",
        honours: "Academic distinctions",
        source: "View the official UPV degree",
      };

  return (
    <section aria-labelledby="current-education-title" className="section-block education-highlight" id="education">
      <div className="education-highlight-heading">
        <p className="eyebrow"><GraduationCap aria-hidden="true" size={15} /> {labels.eyebrow}</p>
        <h2 className="display" id="current-education-title">{localize(degree.role, locale)}</h2>
        <p className="education-institution">{labels.institution}</p>
        <p className="muted">{localize(degree.summary, locale)}</p>
      </div>

      <div className="education-highlight-body">
        <div className="education-facts" aria-label={locale === "es" ? "Datos del grado" : "Degree facts"}>
          <div><span>{labels.period}</span><strong>{localize(degree.period, locale)}</strong></div>
          <div><span>{labels.programme}</span><strong>{degreeFacts.credits} · {localize(degreeFacts.duration, locale)}</strong></div>
          <div><span>{labels.school}</span><strong>{degreeFacts.school}</strong></div>
        </div>

        <div className="academic-honours">
          <div className="academic-honours-title">
            <Award aria-hidden="true" size={22} />
            <div><p className="eyebrow">{localize(degreeFacts.status, locale)}</p><h3>{labels.honours}</h3></div>
          </div>
          <ul>
            {degree.bullets.map((honour) => <li key={honour.en}>{localize(honour, locale)}</li>)}
          </ul>
        </div>

        <div className="education-evidence">
          <p>{localize(degreeFacts.evidence, locale)}</p>
          <a href={degree.source.url} rel="noreferrer" target="_blank">{labels.source}<ArrowUpRight aria-hidden="true" size={15} /></a>
        </div>
      </div>
    </section>
  );
}
