import "server-only";

import type { Locale } from "@/lib/i18n-types";

export const locales = ["en", "es"] as const;
export type { Locale } from "@/lib/i18n-types";

export const defaultLocale: Locale = "en";

const dictionaries = {
  en: () => import("@/content/dictionaries/en.json").then((m) => m.default),
  es: () => import("@/content/dictionaries/es.json").then((m) => m.default),
};

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export function localePath(locale: Locale, path = "") {
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}
