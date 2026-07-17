import { z } from "zod";

export const localeSchema = z.enum(["en", "es"]);

export const localizedTextSchema = z.object({
  en: z.string().min(1).max(5_000),
  es: z.string().min(1).max(5_000),
});

export const sourceReferenceSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(180),
  url: z.url().refine((value) => value.startsWith("https://"), {
    message: "Sources must use HTTPS",
  }),
  section: z.string().min(1).max(180),
  accessedAt: z.iso.date(),
});

export const careerRecordSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(["experience", "leadership", "community", "innovation", "education"]),
  organisation: z.string().min(1).max(140),
  role: localizedTextSchema,
  period: localizedTextSchema,
  location: localizedTextSchema.optional(),
  summary: localizedTextSchema,
  bullets: z.array(localizedTextSchema).max(8).default([]),
  capabilities: z.array(z.string().min(1).max(60)).min(1).max(12),
  relatedProjects: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(8).default([]),
  source: sourceReferenceSchema,
  order: z.number().int().min(0).max(100),
});

export const projectMetricSchema = z.object({
  label: localizedTextSchema,
  value: z.string().min(1).max(40),
  evidenceRef: z.string().min(1).max(80),
});

export const projectSectionSchema = z.object({
  title: localizedTextSchema,
  body: localizedTextSchema,
  bullets: z.array(localizedTextSchema).max(8).default([]),
});

export const projectRecordSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  repository: z.string().min(1).max(120),
  title: z.string().min(1).max(120),
  subtitle: localizedTextSchema,
  summary: localizedTextSchema,
  year: z.number().int().min(2000).max(2100),
  featured: z.boolean(),
  kind: z.enum(["system", "research", "experiment", "analysis"]),
  visual: z.enum([
    "gemf",
    "urbanflow",
    "earth",
    "aion",
    "pipeline",
    "exam",
    "fashion",
    "market",
    "sports",
    "covid",
    "fitness",
  ]),
  categories: z.array(z.string().min(1).max(50)).min(1).max(12),
  stack: z.array(z.string().min(1).max(40)).min(1).max(20),
  repositoryUrl: z.url(),
  demoUrl: z.url().optional(),
  metrics: z.array(projectMetricSchema).max(8),
  sections: z.array(projectSectionSchema).min(1).max(8),
  sources: z.array(sourceReferenceSchema).min(1).max(12),
  limitations: localizedTextSchema.optional(),
  updatedAt: z.iso.datetime(),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(2).max(500),
  locale: localeSchema.default("en"),
});

export const chatSourceSchema = z.object({
  title: z.string(),
  url: z.url(),
  section: z.string(),
});

export const chatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(chatSourceSchema).max(6),
  inScope: z.boolean(),
  confidence: z.enum(["high", "medium", "low", "none"]),
});

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(180),
  organisation: z.string().trim().min(2).max(120),
  role: z.string().trim().max(140).optional().default(""),
  category: z.enum([
    "employment",
    "internship",
    "collaboration",
    "research",
    "community",
    "other",
  ]),
  message: z.string().trim().min(20).max(2_000),
  website: z.string().max(0).optional().default(""),
  locale: localeSchema.default("en"),
});

export type ProjectRecord = z.infer<typeof projectRecordSchema>;
export type CareerRecord = z.infer<typeof careerRecordSchema>;
export type PublicProjectDTO = Omit<ProjectRecord, "sources"> & {
  sources: Array<z.infer<typeof sourceReferenceSchema>>;
};
export type ChatResponse = z.infer<typeof chatResponseSchema>;
