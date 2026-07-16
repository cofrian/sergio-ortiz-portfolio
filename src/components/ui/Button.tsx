import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "button",
        `button-${variant}`,
        props.disabled && "button-disabled",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external = false,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = cn("button", `button-${variant}`, className);
  if (external) {
    return (
      <a
        aria-label={ariaLabel}
        className={classes}
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }
  return (
    <Link aria-label={ariaLabel} className={classes} href={href}>
      {children}
    </Link>
  );
}
