"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Download, Languages, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { alternateLocale, localePath } from "@/lib/i18n-client";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  locale: Locale;
  labels: {
    work: string;
    research: string;
    experience: string;
    about: string;
    notes: string;
    contact: string;
    connections: string;
    ask: string;
    menu: string;
    close: string;
    downloadCv: string;
    cvPending: string;
  };
}

const navItems = [
  ["work", "/work"],
  ["research", "/research"],
  ["experience", "/experience"],
  ["about", "/about"],
  ["notes", "/notes"],
  ["ask", "/ask"],
  ["contact", "/contact"],
] as const;

export function SiteHeader({ locale, labels }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = alternateLocale(locale);
  const localeTarget = pathname.replace(/^\/(en|es)/, `/${otherLocale}`);

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="brand" href={localePath(locale)} aria-label="Sergio Ortiz home">
          <span aria-hidden="true" className="brand-mark">
            SO
          </span>
          <span className="brand-name">Sergio Ortiz</span>
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navItems.map(([key, href]) => {
            const localizedHref = localePath(locale, href);
            const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn("nav-link", isActive && "nav-link-active")}
                href={localizedHref}
                key={key}
              >
                {labels[key]}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link
            className="locale-switch"
            href={localeTarget || `/${otherLocale}`}
            hrefLang={otherLocale}
            aria-label={otherLocale === "es" ? "Cambiar a español" : "Switch to English"}
          >
            <Languages aria-hidden="true" size={16} />
            {otherLocale.toUpperCase()}
          </Link>
          <span aria-disabled="true" className="button button-disabled cv-button" title={labels.cvPending}>
            <Download aria-hidden="true" size={16} />
            {labels.downloadCv}
          </span>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="mobile-menu-button" aria-label={labels.menu} type="button"><Menu aria-hidden="true" size={22} /></button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="mobile-nav-overlay" />
              <Dialog.Content className="mobile-nav-sheet">
                <div className="mobile-nav-head">
                  <Dialog.Title className="brand-mark">SO</Dialog.Title>
                  <Dialog.Close asChild><button aria-label={labels.close} className="mobile-menu-button" type="button"><X aria-hidden="true" size={22} /></button></Dialog.Close>
                </div>
                <nav aria-label="Mobile navigation" className="mobile-nav-links">
                  {navItems.map(([key, href]) => <Link href={localePath(locale, href)} key={key} onClick={() => setOpen(false)}>{labels[key]}</Link>)}
                  <Link href={localePath(locale, "/connections")} onClick={() => setOpen(false)}>{labels.connections}</Link>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
