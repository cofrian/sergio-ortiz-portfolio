"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n-types";

export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Request failed");
      setStatus("success");
      setMessage(result.message ?? "");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage(locale === "es" ? "El formulario todavía no está configurado. Puedes contactar por LinkedIn." : "The form is not configured yet. You can reach out on LinkedIn.");
    }
  }

  return (
    <form className="card form-grid" onSubmit={submit} style={{ padding: "1.3rem" }}>
      <div className="form-field">
        <label htmlFor="name">{locale === "es" ? "Nombre" : "Name"}</label>
        <input id="name" name="name" minLength={2} maxLength={80} required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" maxLength={180} required />
      </div>
      <div className="form-field">
        <label htmlFor="organisation">{locale === "es" ? "Organización" : "Organisation"}</label>
        <input id="organisation" name="organisation" maxLength={120} />
      </div>
      <div className="form-field">
        <label htmlFor="category">{locale === "es" ? "Tipo de conversación" : "What can I help with?"}</label>
        <select defaultValue="ai-data" id="category" name="category">
          <option value="research">Research collaboration</option>
          <option value="ai-data">AI / Data project</option>
          <option value="govtech">GovTech / Smart Cities</option>
          <option value="community">Speaking / community</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="message">{locale === "es" ? "¿En qué estás trabajando?" : "What are you working on?"}</label>
        <textarea id="message" name="message" minLength={20} maxLength={2000} required />
      </div>
      <label className="sr-only" aria-hidden="true">Website<input autoComplete="off" name="website" tabIndex={-1} /></label>
      <button className="button button-primary" disabled={status === "sending"} type="submit">
        {status === "sending" ? (locale === "es" ? "Enviando…" : "Sending…") : (locale === "es" ? "Enviar mensaje" : "Send message")}
      </button>
      <p aria-live="polite" className="form-message">{message}</p>
    </form>
  );
}
