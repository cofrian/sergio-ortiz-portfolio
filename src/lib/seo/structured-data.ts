import { profile } from "@/content/profile";
import type { ProjectRecord } from "@/lib/schemas";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-seven-red-73.vercel.app",
  sameAs: [profile.github, profile.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Valencia", addressCountry: "ES" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Universitat Politècnica de València" },
};

export function projectJsonLd(project: ProjectRecord) {
  return {
    "@context": "https://schema.org",
    "@type": project.kind === "research" ? "ScholarlyArticle" : "CreativeWork",
    name: project.title,
    description: project.summary.en,
    dateCreated: String(project.year),
    url: project.repositoryUrl,
    author: { "@type": "Person", name: profile.name },
    keywords: project.categories,
  };
}
