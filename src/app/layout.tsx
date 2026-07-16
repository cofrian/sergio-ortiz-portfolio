import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Sergio Ortiz — Data & AI Systems",
    template: "%s · Sergio Ortiz",
  },
  description:
    "Bilingual portfolio of data science, AI engineering, MLOps and applied research projects by Sergio Ortiz.",
  applicationName: "Sergio Ortiz Portfolio",
  authors: [{ name: "Sergio Ortiz", url: "https://github.com/cofrian" }],
  creator: "Sergio Ortiz",
  openGraph: {
    type: "website",
    title: "Sergio Ortiz — Data & AI Systems",
    description:
      "Projects connecting data, machine learning, software and real-world decisions.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F7F5EF",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const locale = (await headers()).get("x-locale") === "es" ? "es" : "en";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        {children}
      </body>
    </html>
  );
}
