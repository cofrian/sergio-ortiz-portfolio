export const portfolioTopics = ["portfolio", "portfolio-featured", "portfolio-research", "portfolio-experiment"] as const;

export function classifyPortfolioTopics(
  topics: string[],
  options: { strict: boolean; bootstrapRepositories?: string[]; repository: string; fork?: boolean; allowFork?: boolean },
) {
  const normalized = new Set(topics.map((topic) => topic.toLowerCase()));
  if (normalized.has("portfolio-hidden")) return { include: false, featured: false, research: false, experiment: false, reason: "portfolio-hidden" };
  if (options.fork && !options.allowFork) return { include: false, featured: false, research: false, experiment: false, reason: "fork-requires-override" };
  const matched = portfolioTopics.some((topic) => normalized.has(topic));
  const bootstrap = !options.strict && options.bootstrapRepositories?.includes(options.repository);
  return {
    include: matched || Boolean(bootstrap),
    featured: normalized.has("portfolio-featured"),
    research: normalized.has("portfolio-research"),
    experiment: normalized.has("portfolio-experiment"),
    reason: matched ? "topic" : bootstrap ? "bootstrap" : "missing-topic",
  };
}
