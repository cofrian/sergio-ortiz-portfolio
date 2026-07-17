import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const httpsUrl = z.url().refine((value) => value.startsWith("https://"));

export const githubCodeSourceSchema = z.object({
  path: z.string().min(1).max(400),
  language: z.string().min(1).max(80),
  url: httpsUrl,
  content: z.string().max(40_000),
});

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
  code: z.array(githubCodeSourceSchema).max(24).default([]),
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
export type GitHubCodeSource = z.infer<typeof githubCodeSourceSchema>;

const secretPatterns: Array<[RegExp, string]> = [
  [/-----BEGIN [^-]{0,40}PRIVATE KEY-----[\s\S]*?-----END [^-]{0,40}PRIVATE KEY-----/gi, "[private key removed]"],
  [/\b(?:nvapi|gh[pousr]|github_pat|sb_secret)_[a-z0-9._-]{8,}\b/gi, "[credential removed]"],
  [/\b(?:authorization\s*:\s*bearer|api[_ -]?key|access[_ -]?token|client[_ -]?secret|password)\s*[:=]\s*[^\s`'\"]{6,}/gi, "[credential removed]"],
  [/\b[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\s*=\s*[^\s]{6,}/g, "[credential removed]"],
];
const codeSecretPatterns: Array<[RegExp, string]> = [
  [/-----BEGIN [^-]{0,40}PRIVATE KEY-----[\s\S]*?-----END [^-]{0,40}PRIVATE KEY-----/gi, "[private key removed]"],
  [/\b(?:nvapi|gh[pousr]|github_pat|sb_secret)_[a-z0-9._-]{8,}\b/gi, "[credential removed]"],
  [/(\b(?:api[_ -]?key|access[_ -]?token|client[_ -]?secret|password)\s*[:=]\s*)(["'])([^"'\r\n]{6,})\2/gi, "$1$2[credential removed]$2"],
  [/(\b[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\s*=\s*)(["'])([^"'\r\n]{6,})\2/g, "$1$2[credential removed]$2"],
  [/(\b[A-Za-z_][A-Za-z0-9_]*(?:key|token|secret|password)\s*=\s*)(?=[^\s#]*[-.])([^\s#]{8,})/gi, "$1[credential removed]"],
  [/(authorization\s*:\s*bearer\s+)[a-z0-9._-]{8,}/gi, "$1[credential removed]"],
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

export function sanitizeRepositoryCode(value: string, maxLength = 40_000) {
  let text = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r\n/g, "\n");
  for (const [pattern, replacement] of codeSecretPatterns) text = text.replace(pattern, replacement);
  text = text
    .split("\n")
    .map((line) => instructionLikeLine.test(line) ? "[instruction-like content removed]" : line)
    .join("\n")
    .trim();
  return text.slice(0, maxLength);
}

const excludedCodePath = /(?:^|\/)(?:\.git|\.github|\.venv|venv|node_modules|site-packages|python-portable|dist|build|coverage|\.next|vendor|data|datasets?|models?|checkpoints?|artifacts?|outputs?|logs?|secrets?)(?:\/|$)|(?:^|\/)(?:package-lock|pnpm-lock|yarn\.lock|poetry\.lock)|(?:^|\/)\.env(?:\.|$)|\.(?:min\.js|map|pem|key|crt|sqlite3?|db|parquet|csv|xlsx?|pdf|pkl|pickle|joblib|onnx|pt|pth|bin|zip|tar|gz)$/i;
const codeExtensions = new Map([
  [".py", "Python"], [".ts", "TypeScript"], [".tsx", "TSX"], [".js", "JavaScript"], [".jsx", "JSX"],
  [".sql", "SQL"], [".go", "Go"], [".java", "Java"], [".rs", "Rust"], [".cpp", "C++"], [".c", "C"], [".h", "C/C++ header"],
  [".r", "R"], [".rmd", "R Markdown"], [".sh", "Shell"], [".ps1", "PowerShell"], [".yml", "YAML"], [".yaml", "YAML"], [".toml", "TOML"], [".ipynb", "Jupyter Notebook"],
]);

export interface RepositoryTreeEntry { path: string; type: string; size?: number }

export function repositoryCodeLanguage(path: string) {
  const lower = path.toLowerCase();
  const special = lower.split("/").at(-1);
  if (special === "dockerfile") return "Dockerfile";
  if (special === "package.json") return "JSON";
  const extension = [...codeExtensions.keys()].find((candidate) => lower.endsWith(candidate));
  return extension ? codeExtensions.get(extension) ?? "Code" : null;
}

export function isSafeRepositoryCodePath(entry: RepositoryTreeEntry) {
  if (entry.type !== "blob" || !entry.path || excludedCodePath.test(entry.path)) return false;
  const sizeLimit = entry.path.toLowerCase().endsWith(".ipynb") ? 250_000 : 80_000;
  return (entry.size ?? 0) > 0 && (entry.size ?? 0) <= sizeLimit && repositoryCodeLanguage(entry.path) !== null;
}

function codePathScore(path: string) {
  const lower = path.toLowerCase();
  let score = 0;
  if (/^(?:src|app|api|backend|frontend|lib|pipeline|pipelines)\//.test(lower)) score += 35;
  if (/(?:^|\/)(?:main|app|server|models?|train|inference|pipeline|routes?|api|config|dataset|evaluation|optimizer|ingest)\.(?:py|ts|tsx|js|jsx|go|rs|cpp)$/.test(lower)) score += 65;
  if (/(?:^|\/)(?:dockerfile|docker-compose[^/]*\.ya?ml|package\.json|pyproject\.toml)$/.test(lower)) score += 35;
  if (lower.includes("test") || lower.includes("spec")) score -= 8;
  if (lower.endsWith(".ipynb")) score -= 4;
  score -= Math.min(lower.split("/").length, 8);
  return score;
}

export function selectRepositoryCodeFiles(entries: RepositoryTreeEntry[], maxFiles = 18, maxTotalBytes = 160_000) {
  const selected: RepositoryTreeEntry[] = [];
  let total = 0;
  for (const entry of entries.filter(isSafeRepositoryCodePath).sort((a, b) => codePathScore(b.path) - codePathScore(a.path) || a.path.localeCompare(b.path))) {
    const size = entry.size ?? 0;
    if (selected.length >= maxFiles || total + size > maxTotalBytes) continue;
    selected.push(entry);
    total += size;
  }
  return selected;
}

export function extractNotebookCode(value: string, maxLength = 40_000) {
  try {
    const notebook = z.object({
      cells: z.array(z.object({ cell_type: z.string(), source: z.union([z.string(), z.array(z.string())]) }).passthrough()).max(2_000),
    }).passthrough().parse(JSON.parse(value));
    const code = notebook.cells
      .filter((cell) => cell.cell_type === "code")
      .map((cell, index) => `# Cell ${index + 1}\n${Array.isArray(cell.source) ? cell.source.join("") : cell.source}`)
      .join("\n\n");
    return sanitizeRepositoryCode(code, maxLength);
  } catch {
    return "";
  }
}

export function repositoryDisplayName(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
