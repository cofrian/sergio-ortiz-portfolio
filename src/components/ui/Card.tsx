import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "article" | "section" | "div";
  interactive?: boolean;
}

export function Card({
  as: Element = "div",
  children,
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <Element
      className={cn("card", interactive && "card-hover", className)}
      {...props}
    >
      {children}
    </Element>
  );
}
