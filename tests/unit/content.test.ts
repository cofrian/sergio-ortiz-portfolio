import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { contactRequestSchema, projectRecordSchema } from "@/lib/schemas";

describe("curated project records", () => {
  it("validates every public record", () => projects.forEach((project) => expect(projectRecordSchema.safeParse(project).success).toBe(true)));
  it("requires evidence for every metric", () => projects.forEach((project) => {
    const references = new Set(project.sources.map((source) => source.id));
    project.metrics.forEach((metric) => expect(references.has(metric.evidenceRef)).toBe(true));
  }));
  it("has both locales", () => projects.forEach((project) => {
    expect(project.summary.en.length).toBeGreaterThan(10);
    expect(project.summary.es.length).toBeGreaterThan(10);
  }));
});

describe("job-focused contact requests", () => {
  it("accepts a verified employment enquiry", () => {
    const result = contactRequestSchema.safeParse({
      name: "Recruiter Name",
      email: "recruiter@example.com",
      organisation: "Example Company",
      role: "Data Scientist",
      category: "employment",
      message: "We would like to discuss a data science position with Sergio.",
      locale: "en",
    });

    expect(result.success).toBe(true);
  });

  it("rejects legacy generic project categories", () => {
    const result = contactRequestSchema.safeParse({
      name: "Recruiter Name",
      email: "recruiter@example.com",
      organisation: "Example Company",
      category: "ai-data",
      message: "We would like to discuss a data science position with Sergio.",
      locale: "en",
    });

    expect(result.success).toBe(false);
  });
});
