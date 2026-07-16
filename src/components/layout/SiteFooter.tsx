import { GitBranch, Mail, Network } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { profile } from "@/content/profile";

interface SiteFooterProps {
  locale: Locale;
  title: string;
  subtitle: string;
}

export function SiteFooter({ locale, title, subtitle }: SiteFooterProps) {
  return (
    <footer className="site-shell site-footer">
      <div>
        <p className="footer-title">{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="footer-links">
        {profile.email ? (
          <a href={`mailto:${profile.email}`}>
            <Mail aria-hidden="true" size={19} /> {profile.email}
          </a>
        ) : (
          <span title={locale === "es" ? "Correo pendiente" : "Email pending"}>
            <Mail aria-hidden="true" size={19} />
            {locale === "es" ? "Correo pendiente" : "Email pending"}
          </span>
        )}
        <a href={profile.github} rel="noreferrer" target="_blank">
          <GitBranch aria-hidden="true" size={19} /> github.com/cofrian
        </a>
        <a href={profile.linkedin} rel="noreferrer" target="_blank">
          <Network aria-hidden="true" size={19} /> LinkedIn
        </a>
      </div>
    </footer>
  );
}
