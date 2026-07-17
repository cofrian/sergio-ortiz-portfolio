import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FloatingPortfolioAssistant } from "@/components/chat/FloatingPortfolioAssistant";
import { getDictionary, hasLocale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-seven-red-73.vercel.app";
  return {
    title: { default: "Sergio Ortiz — Data & AI Systems", template: "%s · Sergio Ortiz" },
    description: locale === "es" ? "Portfolio de Sergio Ortiz: ciencia de datos, IA, MLOps e investigación aplicada." : "Sergio Ortiz’s portfolio: data science, AI engineering, MLOps and applied research.",
    alternates: { canonical: `${base}/${locale}`, languages: { en: `${base}/en`, es: `${base}/es` } },
    openGraph: { locale: locale === "es" ? "es_ES" : "en_GB", type: "website", siteName: "Sergio Ortiz" },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  const dictionary = await getDictionary(candidate);
  return (
    <>
      <SiteHeader labels={{ ...dictionary.nav, ...dictionary.common }} locale={candidate} />
      <main className="site-main" id="main-content">{children}</main>
      <SiteFooter locale={candidate} title={dictionary.footer.title} subtitle={dictionary.footer.subtitle} />
      <FloatingPortfolioAssistant locale={candidate} />
    </>
  );
}
