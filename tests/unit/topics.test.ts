import { describe, expect, it } from "vitest";
import { classifyPortfolioTopics } from "@/lib/github/topics";

describe("portfolio topics", () => {
  it("includes authorized topics", () => expect(classifyPortfolioTopics(["portfolio"], { strict: true, repository: "demo" }).include).toBe(true));
  it("always lets hidden win", () => expect(classifyPortfolioTopics(["portfolio", "portfolio-hidden"], { strict: false, repository: "demo", bootstrapRepositories: ["demo"] }).include).toBe(false));
  it("uses bootstrap only before strict mode", () => {
    expect(classifyPortfolioTopics([], { strict: false, repository: "demo", bootstrapRepositories: ["demo"] }).reason).toBe("bootstrap");
    expect(classifyPortfolioTopics([], { strict: true, repository: "demo", bootstrapRepositories: ["demo"] }).include).toBe(false);
  });
  it("rejects forks without explicit override", () => expect(classifyPortfolioTopics(["portfolio"], { strict: true, repository: "demo", fork: true }).reason).toBe("fork-requires-override"));
  it("includes an explicitly approved fork", () => expect(classifyPortfolioTopics(["portfolio"], { strict: true, repository: "demo", fork: true, allowFork: true }).include).toBe(true));
  it("keeps hidden above a fork override", () => expect(classifyPortfolioTopics(["portfolio", "portfolio-hidden"], { strict: true, repository: "demo", fork: true, allowFork: true }).reason).toBe("portfolio-hidden"));
});
