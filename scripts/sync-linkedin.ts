import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";

const responseSchema = z.object({
  elements: z.array(z.object({
    id: z.string().regex(/^urn:li:(?:share|ugcPost|activity):\d+$/),
    commentary: z.string().max(20_000).optional().default(""),
    publishedAt: z.number().int().positive().optional(),
    createdAt: z.number().int().positive().optional(),
    lifecycleState: z.string().optional(),
  }).passthrough()).max(100),
}).passthrough();

type StoredPost = {
  id: string;
  linkedinUrn?: string;
  url: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
  image: string;
  featured: boolean;
  needsEditorialReview: boolean;
};

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function titleFrom(commentary: string) {
  const firstSentence = commentary.split(/(?<=[.!?])\s/)[0] || commentary;
  return firstSentence.length <= 150 ? firstSentence : `${firstSentence.slice(0, 147).trimEnd()}…`;
}

async function main() {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const author = process.env.LINKEDIN_PERSON_URN;
  if (!token || !author) {
    process.stdout.write("LinkedIn sync skipped: official API credentials are not configured.\n");
    return;
  }
  if (!/^urn:li:person:[A-Za-z0-9_-]+$/.test(author)) throw new Error("LINKEDIN_PERSON_URN is invalid");

  const apiVersion = process.env.LINKEDIN_API_VERSION || "202606";
  const endpoint = new URL("https://api.linkedin.com/rest/posts");
  endpoint.searchParams.set("q", "author");
  endpoint.searchParams.set("author", author);
  endpoint.searchParams.set("count", "25");
  endpoint.searchParams.set("sortBy", "LAST_MODIFIED");

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Linkedin-Version": apiVersion,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`LinkedIn API returned ${response.status}`);

  const parsed = responseSchema.parse(await response.json());
  const path = resolve("content/linkedin-posts.json");
  const current = JSON.parse(await readFile(path, "utf8")) as StoredPost[];
  const known = new Set(current.flatMap((post) => [post.linkedinUrn, post.url].filter(Boolean)));
  let added = 0;

  for (const post of parsed.elements) {
    if (post.lifecycleState && post.lifecycleState !== "PUBLISHED") continue;
    const commentary = plainText(post.commentary);
    if (commentary.length < 10 || known.has(post.id)) continue;
    const timestamp = post.publishedAt ?? post.createdAt;
    if (!timestamp) continue;
    const publishedAt = new Date(timestamp).toISOString().slice(0, 10);
    const url = `https://www.linkedin.com/feed/update/${post.id}/`;
    current.push({
      id: `${publishedAt}-${post.id.split(":").at(-1)}`,
      linkedinUrn: post.id,
      url,
      title: titleFrom(commentary),
      excerpt: commentary.length <= 600 ? commentary : `${commentary.slice(0, 597).trimEnd()}…`,
      publishedAt,
      categories: ["LinkedIn"],
      image: "",
      featured: false,
      needsEditorialReview: true,
    });
    known.add(post.id);
    known.add(url);
    added += 1;
  }

  current.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  if (added > 0) await writeFile(path, `${JSON.stringify(current, null, 2)}\n`, "utf8");
  process.stdout.write(`LinkedIn sync found ${added} new public post(s).\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "LinkedIn sync failed"}\n`);
  process.exitCode = 1;
});
