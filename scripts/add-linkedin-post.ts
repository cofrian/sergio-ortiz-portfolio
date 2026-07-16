import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";

const body = process.env.ISSUE_BODY || "";
const value = (heading: string) => body.match(new RegExp(`### ${heading}\\s+([\\s\\S]*?)(?=\\n### |$)`, "i"))?.[1]?.trim() || "";
const schema = z.object({
  url: z.url().refine((url) => url.startsWith("https://www.linkedin.com/")),
  title: z.string().min(3).max(160),
  excerpt: z.string().min(10).max(600),
  publishedAt: z.iso.date(),
  category: z.enum(["Research", "MLOps", "Smart Cities", "LLMs", "Data Engineering", "Community", "Innovation"]),
  image: z.union([z.literal(""), z.url().refine((url) => url.startsWith("https://"))]),
  featured: z.boolean(),
});
const entry = schema.parse({
  url: value("Public LinkedIn URL"),
  title: value("Title"),
  excerpt: value("Excerpt"),
  publishedAt: value("Published date"),
  category: value("Category"),
  image: value("Optional approved image URL").replace(/^_No response_$/, ""),
  featured: /Feature this post on the homepage/i.test(value("Placement")) && /\[x\]/i.test(value("Placement")),
});
async function main() {
  const path = resolve("content/linkedin-posts.json");
  const current = JSON.parse(await readFile(path, "utf8")) as Array<Record<string, unknown>>;
  if (current.some((post) => post.url === entry.url)) throw new Error("This LinkedIn URL is already present");
  const id = `${entry.publishedAt}-${entry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 50)}`;
  current.push({ id, ...entry, categories: [entry.category], needsEditorialReview: true });
  current.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  await writeFile(path, `${JSON.stringify(current, null, 2)}\n`, "utf8");
}

main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "LinkedIn content update failed"}\n`); process.exitCode = 1; });
