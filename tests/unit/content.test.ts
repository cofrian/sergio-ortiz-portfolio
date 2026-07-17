import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { careerRecords, degreeEngagement } from "@/content/career";
import { linkedinPosts } from "@/content/linkedin";
import { careerRecordSchema, contactRequestSchema, projectRecordSchema } from "@/lib/schemas";

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

describe("source-backed career records", () => {
  it("validates every experience, leadership and community entry", () => careerRecords.forEach((record) => {
    expect(careerRecordSchema.safeParse(record).success).toBe(true);
    expect(record.source.url.startsWith("https://")).toBe(true);
  }));

  it("links related projects to real portfolio slugs", () => {
    const slugs = new Set(projects.map((project) => project.slug));
    careerRecords.flatMap((record) => record.relatedProjects).forEach((slug) => expect(slugs.has(slug)).toBe(true));
  });

  it("includes the independent work and The Pink Force records without referring to Ordantis", () => {
    const freelance = careerRecords.find((record) => record.id === "freelance-data-ai");
    const pinkForce = careerRecords.find((record) => record.id === "the-pink-force-ambassador");

    expect(freelance?.period.en).toBe("Oct 2025 — Present");
    expect(freelance?.summary.en.toLowerCase()).toContain("data-driven");
    expect(JSON.stringify(freelance).toLowerCase()).not.toContain("ordantis");
    expect(pinkForce?.role.en).toBe("Ambassador");
    expect(pinkForce?.source.url).toContain("7463151444582567937");
  });

  it("publishes the current Data Science degree and source-backed academic distinctions", () => {
    const education = careerRecords.find((record) => record.id === "upv-data-science");

    expect(education?.period.en).toBe("Sep 2022 — Present · Expected 2027");
    expect(education?.summary.en).toContain("240-ECTS");
    expect(education?.summary.en).toContain("peer tutoring");
    expect(education?.bullets.map((item) => item.es).join(" ")).toContain("Matrícula de Honor");
    expect(education?.bullets.map((item) => item.es).join(" ")).toContain("Economía y Empresa");
    expect(education?.source.url).toBe("https://www.upv.es/titulaciones/GCD/indexc.html");
    expect(degreeEngagement.roles.map((role) => role.es)).toContain("Delegado de clase");
    expect(degreeEngagement.podcasts).toHaveLength(2);
    expect(degreeEngagement.podcasts.map((podcast) => podcast.url)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("open.spotify.com/episode/3y5OqwHlNSQeqWMKKEszNw"),
        expect.stringContaining("open.spotify.com/episode/2Q5wz6ImysqHcIemmEPDQm"),
      ]),
    );
  });
});

describe("curated LinkedIn evidence", () => {
  it("includes the delivered Sigma hackathon and The Pink Force event with local images", () => {
    const hackathon = linkedinPosts.find((post) => post.id === "sigma-genai-hackathon-delivered-2026");
    const pinkForce = linkedinPosts.find((post) => post.id === "pink-force-up-steam-ambassador-2026");

    expect(hackathon?.content).toContain("más de 60 participantes");
    expect(hackathon?.image).toMatch(/^\/images\/linkedin\//);
    expect(pinkForce?.content).toContain("embajador");
    expect(pinkForce?.image).toMatch(/^\/images\/linkedin\//);
  });

  it("links the university podcast directly and removes the superseded career workshop", () => {
    const podcast = linkedinPosts.find((post) => post.id === "planning-podcast-upv-2025");

    expect(podcast?.spotifyUrl).toContain("open.spotify.com/episode/2Q5wz6ImysqHcIemmEPDQm");
    expect(podcast?.spotifyTitle).toContain("Netflix");
    expect(podcast?.image).toBe("/images/linkedin/planning-podcast-cover.webp");
    expect(linkedinPosts.some((post) => post.id === "sigma-career-workshop-2026")).toBe(false);
  });
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
