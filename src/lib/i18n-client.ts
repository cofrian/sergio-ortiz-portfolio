import type { Locale } from "@/lib/i18n-types";

export function localePath(locale: Locale, path = "") {
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}
