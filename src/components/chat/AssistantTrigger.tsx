"use client";

import type { ReactNode } from "react";

export const portfolioAssistantEvent = "portfolio-assistant:open";

export function AssistantTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(portfolioAssistantEvent))}
      type="button"
    >
      {children}
    </button>
  );
}
