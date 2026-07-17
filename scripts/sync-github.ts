import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { githubRepositorySchema, manualProjectOverridesSchema, repositoryPortfolioSchema } from "../src/lib/github/schemas";
import { classifyPortfolioTopics } from "../src/lib/github/topics";
import { repositoryDisplayName, sanitizeGithubRagText } from "../src/lib/github/rag-sources";

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

async function optionalFile(repository: string, file: string, maxLength = 350_000) {
  const response = await fetch(`https://raw.githubusercontent.com/${username}/${repository}/HEAD/${file}`, { headers: { "user-agent": headers["user-agent"] } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to read ${repository}/${file}`);
  const text = await response.text();
  return text.slice(0, maxLength);
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
  const ragIncluded = [];
  const ragExcluded = [];
  let githubProfile: { repositoryUrl: string; updatedAt: string; readme: string } | null = null;
  for (const repository of repositories) {
    const isPortfolioRepository = repository.name === "sergio-ortiz-portfolio";
    const isProfileRepository = repository.name.toLowerCase() === username.toLowerCase();
    const hasTopics = repository.topics.length > 0;
    if (isProfileRepository) {
      const profileReadme = await optionalFile(repository.name, "README.md", 80_000).catch(() => null);
      githubProfile = {
        repositoryUrl: repository.html_url,
        updatedAt: repository.pushed_at,
        readme: sanitizeGithubRagText(profileReadme ?? "", 60_000),
      };
      ragExcluded.push({ repository: repository.name, reason: "profile-source-not-project" });
    } else if (isPortfolioRepository || repository.archived || repository.size === 0 || !hasTopics) {
      ragExcluded.push({
        repository: repository.name,
        reason: isPortfolioRepository ? "portfolio-application" : repository.archived ? "archived" : repository.size === 0 ? "empty" : "missing-topics",
      });
    } else {
      const ragReadme = await optionalFile(repository.name, "README.md", 80_000).catch(() => null);
      ragIncluded.push({
        repository: repository.name,
        title: repositoryDisplayName(repository.name),
        description: sanitizeGithubRagText(repository.description ?? "", 1_000),
        repositoryUrl: repository.html_url,
        topics: repository.topics,
        language: repository.language,
        updatedAt: repository.pushed_at,
        fork: repository.fork,
        readme: sanitizeGithubRagText(ragReadme ?? "", 60_000),
      });
    }

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
    const rawPortfolio = await optionalFile(repository.name, "portfolio.json", 50_000);
    const portfolio = rawPortfolio ? repositoryPortfolioSchema.parse(JSON.parse(rawPortfolio)) : null;
    const readme = await optionalFile(repository.name, "README.md", 80_000);
    included.push({
      repository: repository.name,
      title: portfolio?.title || repositoryDisplayName(repository.name),
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
  const ragOutput = { generatedAt: new Date().toISOString(), owner: username, profile: githubProfile, included: ragIncluded, excluded: ragExcluded };
  if (dryRun) {
    process.stdout.write(`${JSON.stringify({
      portfolio: { included: included.map((item) => item.repository), excluded },
      rag: { included: ragIncluded.map((item) => item.repository), excluded: ragExcluded },
    }, null, 2)}\n`);
    return;
  }
  const target = resolve("src/content/generated-projects.json");
  const current = await readFile(target, "utf8").catch(() => "");
  const next = `${JSON.stringify(output, null, 2)}\n`;
  if (current !== next) await writeFile(target, next, "utf8");
  const ragTarget = resolve("src/content/generated-github-rag.json");
  const currentRag = await readFile(ragTarget, "utf8").catch(() => "");
  const nextRag = `${JSON.stringify(ragOutput, null, 2)}\n`;
  if (currentRag !== nextRag) await writeFile(ragTarget, nextRag, "utf8");
  process.stdout.write(`Synchronized ${included.length} portfolio repositories and ${ragIncluded.length} public repositories for RAG.\n`);
}

main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "Sync failed"}\n`); process.exitCode = 1; });
