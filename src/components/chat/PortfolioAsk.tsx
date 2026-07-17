"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n-types";
import type { ChatResponse } from "@/lib/schemas";

const suggestions = {
  en: ["Give me an overview of Sergio's GitHub projects.", "Why is Sergio a strong data and AI candidate?", "What leadership and community experience does Sergio have?", "Which project demonstrates production ML?", "What has Sergio built with LLMs?"],
  es: ["Resume los proyectos de GitHub de Sergio.", "¿Por qué es Sergio un buen candidato para datos e IA?", "¿Qué experiencia tiene Sergio en liderazgo y comunidad?", "¿Qué proyecto demuestra MLOps?", "¿Qué ha construido Sergio con LLM?"],
};

export function PortfolioAsk({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(message: string) {
    const clean = message.trim();
    if (clean.length < 2) return;
    setQuery(clean);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: clean, locale }),
      });
      const payload = await response.json() as ChatResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Request failed");
      setResult(payload);
    } catch {
      setError(locale === "es" ? "La búsqueda no está disponible temporalmente." : "Search is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card ask-panel">
      <form onSubmit={(event) => { event.preventDefault(); void ask(query); }}>
        <label className="sr-only" htmlFor="portfolio-query">{locale === "es" ? "Pregunta sobre Sergio" : "Question about Sergio"}</label>
        <div className="ask-input-wrap">
          <Search aria-hidden="true" className="ask-search-icon" size={20} />
          <input className="ask-input" id="portfolio-query" maxLength={500} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "es" ? "Pregunta por proyectos, experiencia o investigación…" : "Ask about projects, experience or research…"} value={query} />
          <button className="button button-primary ask-submit" disabled={loading} type="submit">{loading ? "…" : locale === "es" ? "Preguntar" : "Ask"}</button>
        </div>
      </form>
      <div className="suggestions">
        {suggestions[locale].map((suggestion) => <button className="filter-button" key={suggestion} onClick={() => void ask(suggestion)} type="button">{suggestion}</button>)}
      </div>
      {error ? <p className="form-message ask-error" role="alert">{error}</p> : null}
      {result ? (
        <div className="answer-panel">
          <p>{result.answer}</p>
          <div className="source-list">
            {result.sources.map((source) => (
              <a className="source-card" href={source.url} key={`${source.url}-${source.section}`} rel="noreferrer" target="_blank">
                <strong>{source.title}</strong><br /><span className="muted">{source.section}</span> <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
