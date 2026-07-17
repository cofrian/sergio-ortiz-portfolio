"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircleQuestion, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n-types";
import { PortfolioAsk } from "@/components/chat/PortfolioAsk";
import { portfolioAssistantEvent } from "@/components/chat/AssistantTrigger";

export function FloatingPortfolioAssistant({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(portfolioAssistantEvent, handleOpen);
    return () => window.removeEventListener(portfolioAssistantEvent, handleOpen);
  }, []);

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <button
          aria-label={locale === "es" ? "Abrir asistente del portfolio" : "Open portfolio assistant"}
          className="floating-assistant-button"
          type="button"
        >
          <MessageCircleQuestion aria-hidden="true" size={25} />
          <span aria-hidden="true">AI</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="assistant-overlay" />
        <Dialog.Content aria-describedby="portfolio-assistant-description" className="assistant-dialog">
          <div className="assistant-dialog-header">
            <div>
              <p className="eyebrow"><ShieldCheck aria-hidden="true" size={14} /> {locale === "es" ? "Fuentes públicas verificadas" : "Verified public sources"}</p>
              <Dialog.Title>{locale === "es" ? "Pregunta por mi trabajo" : "Ask about my work"}</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button aria-label={locale === "es" ? "Cerrar asistente" : "Close assistant"} className="assistant-close" type="button">
                <X aria-hidden="true" size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="assistant-description" id="portfolio-assistant-description">
            {locale === "es"
              ? "Consulta proyectos, experiencia, liderazgo o cómo está implementado el código. Cada respuesta enlaza sus fuentes."
              : "Ask about projects, experience, leadership or how the code is implemented. Every answer links to its sources."}
          </Dialog.Description>
          <PortfolioAsk locale={locale} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
