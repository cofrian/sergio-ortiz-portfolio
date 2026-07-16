import { GitBranch, MapPin, Network } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import { profile } from "@/content/profile";
import { hasLocale } from "@/lib/i18n";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  return <div className="site-shell"><header className="page-intro"><p className="eyebrow">Contact · Valencia</p><h1 className="display">{candidate === "es" ? "Construyamos algo útil." : "Let’s build something useful."}</h1><p>{candidate === "es" ? "Investigación, datos, IA aplicada, smart cities o una colaboración que merezca la pena explorar." : "Research, data, applied AI, smart cities or a collaboration worth exploring."}</p></header><section className="section-block contact-grid"><div><h2 className="display" style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}>{candidate === "es" ? "Cuéntame el problema." : "Tell me about the problem."}</h2><p className="muted" style={{ lineHeight: 1.7 }}>{candidate === "es" ? "El correo público aún no se ha incorporado. El formulario se activa automáticamente cuando Resend y el destinatario están configurados; mientras tanto, LinkedIn es la vía disponible." : "A public email has not been added yet. The form activates automatically when Resend and the recipient are configured; LinkedIn is available in the meantime."}</p><div className="footer-links" style={{ marginTop: "2rem" }}><a href={profile.github} rel="noreferrer" target="_blank"><GitBranch aria-hidden="true" size={18} />github.com/cofrian</a><a href={profile.linkedin} rel="noreferrer" target="_blank"><Network aria-hidden="true" size={18} />LinkedIn</a><span><MapPin aria-hidden="true" size={18} />{profile.location}</span></div></div><ContactForm locale={candidate} /></section></div>;
}
