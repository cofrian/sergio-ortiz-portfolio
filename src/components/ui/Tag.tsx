import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  tone?: "default" | "featured" | "research" | "experiment";
  className?: string;
}

export function Tag({ children, tone = "default", className }: TagProps) {
  return (
    <span
      className={cn("tag", tone !== "default" && `tag-${tone}`, className)}
    >
      {children}
    </span>
  );
}
