import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aboutPrinciples, profile } from "@/content/profile";
import { hasLocale, localePath } from "@/lib/i18n";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">About · Sergio Ortiz</p><h1 className="display">{candidate === "es" ? "Curiosidad técnica con sentido práctico." : "Technical curiosity, practical intent."}</h1></header><section className="section-block about-grid"><div className="portrait-placeholder" role="img" aria-label={candidate === "es" ? "Retrato pendiente" : "Portrait pending"}>{profile.initials}</div><div><p className="eyebrow">{profile.location}</p><p style={{ fontSize: "clamp(1.25rem, 2.2vw, 2rem)", lineHeight: 1.55 }}>{profile.bio[candidate]}</p><p className="muted" style={{ lineHeight: 1.75 }}>{candidate === "es" ? "Me interesan los sistemas en los que una buena predicción no basta: también importan la trazabilidad, el despliegue, la decisión y las personas que van a usar el resultado." : "I am drawn to systems where a good prediction is not enough: traceability, deployment, decision-making and the people using the result matter too."}</p><div className="principle-list">{aboutPrinciples.map((principle) => <article className="principle" key={principle.key}><h2>{principle.title[candidate]}</h2><p>{principle.body[candidate]}</p></article>)}</div><div className="project-actions"><Link className="button button-primary" href={localePath(candidate, "/contact")}>{candidate === "es" ? "Contactar" : "Get in touch"}<ArrowRight aria-hidden="true" size={16} /></Link><span aria-disabled="true" className="button button-disabled">{candidate === "es" ? "CV pendiente" : "CV pending"}</span></div></div></section></div>;
}
