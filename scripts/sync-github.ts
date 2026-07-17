import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { githubRepositorySchema, manualProjectOverridesSchema, repositoryPortfolioSchema } from "../src/lib/github/schemas";
import { classifyPortfolioTopics } from "../src/lib/github/topics";

const bootstrapRepositories = ["exist2026-ordantis", "urbanflow-valencia-mlops", "upv-earth-planetary-boundaries", "aion-emergency-routing-valencia", "outfit-ai-recommender", "genaq-market-selection", "Exam_Box", "nobil_data", "nba-scouting-analytics", "covid19-wealth-mortality", "Proyecto_fitplanner"];
const username = process.env.GITHUB_USERNAME || "cofrian";
const strict = process.env.STRICT_TOPIC_MODE === "true";
const dryRun = process.env.DRY_RUN === "true";
const headers: Record<string, string> = { accept: "application/vnd.github+json", "user-agent": "sergio-ortiz-portfolio-sync" };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function github(path: string) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);
  return response.json() as Promise<unknown>;
}

async function optionalFile(repository: string, file: string) {
  const response = await fetch(`https://raw.githubusercontent.com/${username}/${repository}/HEAD/${file}`, { headers: { "user-agent": headers["user-agent"] } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to read ${repository}/${file}`);
  const text = await response.text();
  if (text.length > 350_000) throw new Error(`${repository}/${file} exceeds the allowed size`);
  return text;
}

async function main() {
  const overrides = manualProjectOverridesSchema.parse(
    JSON.parse(await readFile(resolve("src/content/manual-project-overrides.json"), "utf8")),
  );
  const payload = await github(`/users/${username}/repos?per_page=100&sort=pushed&type=owner`);
  if (!Array.isArray(payload)) throw new Error("Unexpected GitHub response");
  const repositories = payload.map((item) => githubRepositorySchema.parse(item));
  const included = [];
  const excluded = [];
  for (const repository of repositories) {
    const classification = classifyPortfolioTopics(repository.topics, {
      strict,
      bootstrapRepositories,
      repository: repository.name,
      fork: repository.fork,
      allowFork: overrides[repository.name]?.allowFork === true,
    });
    if (!classification.include || repository.archived || repository.size === 0) {
      excluded.push({ repository: repository.name, reason: repository.archived ? "archived" : repository.size === 0 ? "empty" : classification.reason });
      continue;
    }
    const rawPortfolio = await optionalFile(repository.name, "portfolio.json");
    const portfolio = rawPortfolio ? repositoryPortfolioSchema.parse(JSON.parse(rawPortfolio)) : null;
    const readme = await optionalFile(repository.name, "README.md");
    included.push({
      repository: repository.name,
      title: portfolio?.title || repository.name.replace(/[-_]+/g, " "),
      description: repository.description || "",
      repositoryUrl: repository.html_url,
      demoUrl: portfolio?.demoUrl || (repository.homepage?.startsWith("https://") ? repository.homepage : undefined),
      topics: repository.topics,
      language: repository.language,
      updatedAt: repository.pushed_at,
      featured: portfolio?.featured ?? classification.featured,
      research: classification.research,
      experiment: classification.experiment,
      approvedForRag: portfolio?.approvedForRag ?? false,
      portfolio,
      needsEditorialReview: !portfolio,
      syncHash: await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${repository.pushed_at}:${rawPortfolio ?? ""}:${readme ?? ""}`)).then((buffer) => Buffer.from(buffer).toString("hex")),
    });
  }
  const output = { generatedAt: new Date().toISOString(), strictTopicMode: strict, included, excluded };
  if (dryRun) {
    process.stdout.write(`${JSON.stringify({ included: included.map((item) => item.repository), excluded }, null, 2)}\n`);
    return;
  }
  const target = resolve("src/content/generated-projects.json");
  const current = await readFile(target, "utf8").catch(() => "");
  const next = `${JSON.stringify(output, null, 2)}\n`;
  if (current !== next) await writeFile(target, next, "utf8");
  process.stdout.write(`Synchronized ${included.length} repositories; ${excluded.length} excluded.\n`);
}

main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "Sync failed"}\n`); process.exitCode = 1; });
