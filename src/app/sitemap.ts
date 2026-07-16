import type { MetadataRoute } from "next";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sergio-ortiz-portfolio.vercel.app";
  const pages = ["", "/work", "/research", "/experience", "/about", "/notes", "/contact", "/ask", "/connections"];
  const routes = [
    ...["en", "es"].flatMap((locale) => pages.map((page) => `/${locale}${page}`)),
    ...["en", "es"].flatMap((locale) => projects.map((project) => `/${locale}/work/${project.slug}`)),
    ...["en", "es"].flatMap((locale) => notes.map((note) => `/${locale}/notes/${note.slug}`)),
  ];
  return routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route.includes("/work/") ? "weekly" : "monthly", priority: route === "/en" ? 1 : 0.7 }));
}
