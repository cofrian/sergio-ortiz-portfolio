import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  GitBranch,
  MapPin,
  Network,
} from "lucide-react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import { profile } from "@/content/profile";
import { hasLocale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Open to opportunities · Valencia",
    title: "Open to my next role in data & AI.",
    intro:
      "I am looking for a team where I can turn complex data into useful, deployable systems. I am especially interested in Data Science, AI/ML Engineering and end-to-end data products.",
    sideTitle: "Could I be a good fit for your team?",
    sideBody:
      "Send me the role, the team context and the challenge you are working on. I will receive the message directly and can continue the conversation by email.",
    proofTitle: "What I bring",
    proof: [
      "End-to-end ML: from data and modelling to deployment",
      "Applied AI, MLOps, optimisation and data engineering",
      "Research, communication and technical leadership",
    ],
    alternative: "Prefer a quick introduction?",
    linkedin: "Message me on LinkedIn",
  },
  es: {
    eyebrow: "Abierto a oportunidades · Valencia",
    title: "Busco mi próximo reto en datos e IA.",
    intro:
      "Busco un equipo donde convertir datos complejos en sistemas útiles y desplegables. Me interesan especialmente puestos de Data Science, AI/ML Engineering y productos de datos de principio a fin.",
    sideTitle: "¿Crees que puedo encajar en tu equipo?",
    sideBody:
      "Cuéntame el puesto, el contexto del equipo y el reto en el que estáis trabajando. Recibiré el mensaje directamente y podremos continuar la conversación por correo.",
    proofTitle: "Lo que puedo aportar",
    proof: [
      "ML de extremo a extremo: de los datos al despliegue",
      "IA aplicada, MLOps, optimización e ingeniería de datos",
      "Investigación, comunicación y liderazgo técnico",
    ],
    alternative: "¿Prefieres una presentación rápida?",
    linkedin: "Escríbeme por LinkedIn",
  },
} as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  const content = copy[candidate];

  return (
    <div className="site-shell">
      <header className="page-intro contact-intro">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 className="display">{content.title}</h1>
        <p>{content.intro}</p>
      </header>

      <section className="section-block contact-opportunity">
        <div className="contact-context">
          <span className="contact-icon" aria-hidden="true">
            <BriefcaseBusiness size={23} />
          </span>
          <h2 className="display">{content.sideTitle}</h2>
          <p className="contact-context-copy">{content.sideBody}</p>

          <div className="contact-proof">
            <p className="eyebrow">{content.proofTitle}</p>
            <ul>
              {content.proof.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" size={17} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="contact-links"
            aria-label={candidate === "es" ? "Otras vías de contacto" : "Other ways to connect"}
          >
            <a href={profile.linkedin} rel="noreferrer" target="_blank">
              <Network aria-hidden="true" size={18} />
              <span>
                <small>{content.alternative}</small>
                {content.linkedin}
              </span>
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <a href={profile.github} rel="noreferrer" target="_blank">
              <GitBranch aria-hidden="true" size={18} />
              <span>
                <small>GitHub</small>
                github.com/cofrian
              </span>
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <div className="contact-location">
              <MapPin aria-hidden="true" size={18} />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        <ContactForm locale={candidate} />
      </section>
    </div>
  );
}
