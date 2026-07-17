import { z } from "zod";

const httpsUrlSchema = z.url().refine((value) => value.startsWith("https://"), {
  message: "Only HTTPS URLs are allowed",
});

export const githubRepositorySchema = z.object({
  name: z.string(),
  full_name: z.string(),
  html_url: httpsUrlSchema,
  description: z.string().nullable(),
  homepage: z.string().nullable(),
  topics: z.array(z.string()).default([]),
  language: z.string().nullable(),
  pushed_at: z.iso.datetime(),
  created_at: z.iso.datetime(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  archived: z.boolean(),
  size: z.number().int().nonnegative(),
  license: z.object({ spdx_id: z.string().nullable() }).nullable(),
  default_branch: z.string().min(1).max(240).default("main"),
});

export const repositoryPortfolioSchema = z.object({
  title: z.string().max(120).optional(),
  subtitle: z.string().max(240).optional(),
  featured: z.boolean().optional(),
  role: z.string().max(120).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  categories: z.array(z.string().max(50)).max(12).optional(),
  metrics: z.array(z.object({ label: z.string().max(80), value: z.string().max(40), evidenceRef: z.string().max(160) })).max(8).optional(),
  demoUrl: httpsUrlSchema.optional(),
  coverUrl: httpsUrlSchema.optional(),
  coverStrategy: z.enum(["demo-screenshot", "open-graph", "deterministic"]).optional(),
  approvedForRag: z.boolean().default(false),
  sections: z.record(z.string(), z.string().max(5_000)).optional(),
});

export const manualProjectOverridesSchema = z.record(
  z.string(),
  z.object({
    allowFork: z.boolean().optional(),
  }).passthrough(),
);

export type GitHubRepository = z.infer<typeof githubRepositorySchema>;
