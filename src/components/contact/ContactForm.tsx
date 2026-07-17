"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n-types";

const content = {
  en: {
    eyebrow: "Start a conversation",
    title: "Tell me about the opportunity",
    description: "A few details are enough. Your message will go directly to Sergio.",
    name: "Your name",
    email: "Work email",
    organisation: "Company or organisation",
    role: "Role or team",
    rolePlaceholder: "e.g. Data Scientist · AI team",
    category: "What would you like to discuss?",
    categories: [
      ["employment", "Job opportunity"],
      ["internship", "Internship"],
      ["collaboration", "Technical collaboration"],
      ["research", "Research"],
      ["community", "Speaking / community"],
      ["other", "Other"],
    ],
    message: "Tell me about the role or opportunity",
    messagePlaceholder: "What are you hiring for, what would I work on and what would the next step be?",
    privacy: "Your details are used only to reply to this message. They are never added to the portfolio or its AI assistant.",
    send: "Send opportunity",
    sending: "Sending…",
    success: "Thank you — your message has been sent directly to Sergio.",
    fallback: "The message could not be sent right now. You can contact Sergio on LinkedIn.",
  },
  es: {
    eyebrow: "Empecemos una conversación",
    title: "Cuéntame la oportunidad",
    description: "Con unos pocos datos es suficiente. El mensaje llegará directamente a Sergio.",
    name: "Tu nombre",
    email: "Email profesional",
    organisation: "Empresa u organización",
    role: "Puesto o equipo",
    rolePlaceholder: "Ej. Data Scientist · Equipo de IA",
    category: "¿Sobre qué te gustaría hablar?",
    categories: [
      ["employment", "Oferta de empleo"],
      ["internship", "Prácticas"],
      ["collaboration", "Colaboración técnica"],
      ["research", "Investigación"],
      ["community", "Charlas / comunidad"],
      ["other", "Otro"],
    ],
    message: "Cuéntame sobre el puesto o la oportunidad",
    messagePlaceholder: "¿Qué perfil buscáis, en qué trabajaría y cuál sería el siguiente paso?",
    privacy: "Tus datos se usan únicamente para responder a este mensaje. Nunca se añaden al portfolio ni a su asistente de IA.",
    send: "Enviar oportunidad",
    sending: "Enviando…",
    success: "Gracias — tu mensaje se ha enviado directamente a Sergio.",
    fallback: "No se ha podido enviar el mensaje ahora mismo. Puedes contactar con Sergio por LinkedIn.",
  },
} as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const copy = content[locale];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Request failed");
      setStatus("success");
      setMessage(copy.success);
      form.reset();
    } catch {
      setStatus("error");
      setMessage(copy.fallback);
    }
  }

  if (status === "success") {
    return (
      <div className="card contact-success" role="status">
        <span aria-hidden="true"><CheckCircle2 size={28} /></span>
        <p className="eyebrow">{locale === "es" ? "Mensaje enviado" : "Message sent"}</p>
        <h2 className="display">{locale === "es" ? "Gracias por contactar." : "Thanks for reaching out."}</h2>
        <p>{message}</p>
        <button
          className="button button-secondary"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          type="button"
        >
          {locale === "es" ? "Enviar otro mensaje" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <form className="card contact-form" onSubmit={submit}>
      <header className="contact-form-header">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="display">{copy.title}</h2>
        <p>{copy.description}</p>
      </header>

      <div className="contact-form-fields">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">{copy.name}</label>
            <input autoComplete="name" id="name" name="name" minLength={2} maxLength={80} required />
          </div>
          <div className="form-field">
            <label htmlFor="email">{copy.email}</label>
            <input autoComplete="email" id="email" name="email" type="email" maxLength={180} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="organisation">{copy.organisation}</label>
            <input autoComplete="organization" id="organisation" name="organisation" maxLength={120} required />
          </div>
          <div className="form-field">
            <label htmlFor="role">{copy.role}</label>
            <input id="role" name="role" maxLength={140} placeholder={copy.rolePlaceholder} />
          </div>
        </div>

        <fieldset className="contact-category">
          <legend>{copy.category}</legend>
          <div className="contact-category-options">
            {copy.categories.map(([value, label], index) => (
              <label key={value}>
                <input defaultChecked={index === 0} name="category" type="radio" value={value} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-field">
          <label htmlFor="message">{copy.message}</label>
          <textarea
            id="message"
            name="message"
            minLength={20}
            maxLength={2_000}
            placeholder={copy.messagePlaceholder}
            required
          />
        </div>

        <label className="sr-only" aria-hidden="true">
          Website
          <input autoComplete="off" name="website" tabIndex={-1} />
        </label>

        <div className="contact-form-footer">
          <p>{copy.privacy}</p>
          <button className="button button-primary" disabled={status === "sending"} type="submit">
            {status === "sending" ? copy.sending : copy.send}
            {status !== "sending" ? <ArrowRight aria-hidden="true" size={17} /> : null}
          </button>
        </div>

        <p
          aria-live="polite"
          className={`form-message${status === "error" ? " form-message-error" : ""}`}
        >
          {message}
        </p>
      </div>
    </form>
  );
}
