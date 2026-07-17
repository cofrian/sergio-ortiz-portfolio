import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const httpsUrl = z.url().refine((value) => value.startsWith("https://"));

export const githubRagSourceSchema = z.object({
  repository: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  description: z.string().max(1_000),
  repositoryUrl: httpsUrl,
  topics: z.array(z.string().max(80)).max(40),
  language: z.string().max(80).nullable(),
  updatedAt: z.iso.datetime(),
  fork: z.boolean(),
  readme: z.string().max(60_000),
});

export const githubRagCorpusSchema = z.object({
  generatedAt: z.iso.datetime(),
  owner: z.string().min(1).max(80),
  profile: z.object({
    repositoryUrl: httpsUrl,
    updatedAt: z.iso.datetime(),
    readme: z.string().max(60_000),
  }).nullable().default(null),
  included: z.array(githubRagSourceSchema).max(200),
  excluded: z.array(z.object({
    repository: z.string().max(120),
    reason: z.string().max(120),
  })).max(200),
});

export type GitHubRagSource = z.infer<typeof githubRagSourceSchema>;

const secretPatterns: Array<[RegExp, string]> = [
  [/-----BEGIN [^-]{0,40}PRIVATE KEY-----[\s\S]*?-----END [^-]{0,40}PRIVATE KEY-----/gi, "[private key removed]"],
  [/\b(?:nvapi|gh[pousr]|github_pat|sb_secret)_[a-z0-9._-]{8,}\b/gi, "[credential removed]"],
  [/\b(?:authorization\s*:\s*bearer|api[_ -]?key|access[_ -]?token|client[_ -]?secret|password)\s*[:=]\s*[^\s`'\"]{6,}/gi, "[credential removed]"],
  [/\b[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\s*=\s*[^\s]{6,}/g, "[credential removed]"],
];

const instructionLikeLine = /(?:ignore|disregard|forget|olvida|ignora|desobedece).{0,50}(?:instruction|prompt|instrucci|mensaje)|(?:reveal|show|print|muestra|revela).{0,40}(?:system prompt|secret|credential|clave|contexto interno)|\b(?:system|developer)\s+(?:prompt|message)\b/i;

export function sanitizeGithubRagText(value: string, maxLength = 60_000) {
  let text = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  })
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF]/g, "");

  for (const [pattern, replacement] of secretPatterns) {
    text = text.replace(pattern, replacement);
  }

  text = text
    .split(/\r?\n/)
    .map((line) => instructionLikeLine.test(line) ? "[instruction-like content removed]" : line)
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  return text.slice(0, maxLength);
}

export function repositoryDisplayName(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
