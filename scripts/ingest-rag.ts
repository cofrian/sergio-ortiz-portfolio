import { createHash } from "node:crypto";
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import { linkedinPosts } from "../src/content/linkedin";
import { notes } from "../src/content/notes";
import { projects } from "../src/content/projects";
import githubRagJson from "../src/content/generated-github-rag.json";
import { githubRagCorpusSchema, sanitizeGithubRagText } from "../src/lib/github/rag-sources";
import { profile, verifiedMilestones } from "../src/content/profile";
import { careerRecords } from "../src/content/career";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server credentials are required for RAG ingestion");

const client = createClient(url, key, { auth: { persistSession: false } });
const model = process.env.EMBEDDING_MODEL || "Xenova/multilingual-e5-small";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.sergioortiz.dev").replace(/\/$/, "");

interface RagRecord {
  sourceType: "project" | "github" | "github-code" | "github-index" | "profile" | "career" | "note" | "linkedin";
  title: string;
  publicUrl: string;
  content: string;
  metadata: Record<string, string>;
}

export function chunks(text: string, max = 2_400, overlap = 240) {
  const paragraphs = text.split(/\n{2,}/).map((value) => value.trim()).filter(Boolean);
  const output: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    const pieces: string[] = [];
    if (paragraph.length <= max) pieces.push(paragraph);
    else {
      for (let start = 0; start < paragraph.length; start += max - overlap) {
        pieces.push(paragraph.slice(start, start + max));
      }
    }
    for (const piece of pieces) {
      if (current && `${current}\n\n${piece}`.length > max) {
        output.push(current);
        current = `${current.slice(-overlap)}\n\n${piece}`.slice(0, max);
      } else current = current ? `${current}\n\n${piece}` : piece;
    }
  }
  if (current) output.push(current);
  return output;
}

function buildRecords(): RagRecord[] {
  const githubCorpus = githubRagCorpusSchema.parse(githubRagJson);
  const projectRecords: RagRecord[] = projects.map((project) => ({
    sourceType: "project",
    title: project.title,
    publicUrl: project.repositoryUrl,
    content: [
      `Project: ${project.title}`,
      `English summary: ${project.summary.en}`,
      `Spanish summary: ${project.summary.es}`,
      ...project.sections.flatMap((section) => [
        `${section.title.en}: ${section.body.en}`,
        `${section.title.es}: ${section.body.es}`,
      ]),
      `Metrics: ${project.metrics.map((metric) => `${metric.label.en}: ${metric.value}`).join("; ")}`,
      project.limitations ? `Limitations: ${project.limitations.en}` : "",
    ].filter(Boolean).join("\n\n"),
    metadata: { projectSlug: project.slug, updatedAt: project.updatedAt },
  }));

  const noteRecords: RagRecord[] = notes.map((note) => ({
    sourceType: "note",
    title: note.title.en,
    publicUrl: `${siteUrl}/en/notes/${note.slug}`,
    content: [
      `English title: ${note.title.en}`,
      `Spanish title: ${note.title.es}`,
      `English summary: ${note.excerpt.en}`,
      `Spanish summary: ${note.excerpt.es}`,
      ...note.sections.flatMap((section) => [
        `${section.title.en}: ${section.body.en}`,
        `${section.title.es}: ${section.body.es}`,
      ]),
      `Takeaway: ${note.takeaway.en}`,
      `Idea central: ${note.takeaway.es}`,
    ].join("\n\n"),
    metadata: { projectSlug: note.projectSlug, noteSlug: note.slug, updatedAt: note.date },
  }));

  const linkedInRecords: RagRecord[] = linkedinPosts.map((post) => ({
    sourceType: "linkedin",
    title: post.title,
    publicUrl: post.url,
    content: sanitizeGithubRagText(`${post.title}\n\n${post.content || post.excerpt}`, 20_000),
    metadata: { linkedInId: post.id, updatedAt: post.publishedAt },
  }));

  const careerRecordSources: RagRecord[] = careerRecords.map((record) => ({
    sourceType: "career",
    title: `${record.organisation} — ${record.role.en}`,
    publicUrl: `${siteUrl}/en/experience#${record.id}`,
    content: [
      `Kind: ${record.kind}`,
      `Organisation: ${record.organisation}`,
      `English role: ${record.role.en}`,
      `Spanish role: ${record.role.es}`,
      `Period: ${record.period.en} / ${record.period.es}`,
      `English summary: ${record.summary.en}`,
      `Spanish summary: ${record.summary.es}`,
      ...record.bullets.flatMap((bullet) => [bullet.en, bullet.es]),
      `Capabilities: ${record.capabilities.join(", ")}`,
      record.relatedProjects.length ? `Related portfolio projects: ${record.relatedProjects.join(", ")}` : "",
      `Verified public source: ${record.source.title} — ${record.source.section}`,
    ].filter(Boolean).join("\n\n"),
    metadata: {
      careerId: record.id,
      upstreamSource: record.source.url,
      sourceSection: record.source.section,
      updatedAt: record.source.accessedAt,
    },
  }));

  const githubRecords: RagRecord[] = githubCorpus.included.map((repository) => ({
    sourceType: "github",
    title: repository.title,
    publicUrl: repository.repositoryUrl,
    content: [
      `GitHub repository: ${repository.repository}`,
      repository.description ? `Description: ${repository.description}` : "",
      repository.language ? `Primary language: ${repository.language}` : "",
      repository.topics.length ? `Topics: ${repository.topics.join(", ")}` : "",
      `Fork: ${repository.fork ? "yes" : "no"}`,
      repository.readme ? `Public README:\n${repository.readme}` : "No public README content was available.",
    ].filter(Boolean).join("\n\n"),
    metadata: {
      repository: repository.repository,
      projectSlug: repository.repository.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      updatedAt: repository.updatedAt,
      sourceSection: "GitHub README and public repository metadata",
    },
  }));

  const githubCodeRecords: RagRecord[] = githubCorpus.included.flatMap((repository) => repository.code.map((file) => ({
    sourceType: "github-code" as const,
    title: `${repository.title} — ${file.path}`,
    publicUrl: file.url,
    content: [
      `Public source code from GitHub repository: ${repository.repository}`,
      `File: ${file.path}`,
      `Language: ${file.language}`,
      file.content,
    ].join("\n\n"),
    metadata: {
      repository: repository.repository,
      codePath: file.path,
      language: file.language,
      updatedAt: repository.updatedAt,
      sourceSection: `Source code · ${file.path}`,
    },
  })));

  const githubIndex: RagRecord = {
    sourceType: "github-index",
    title: "Sergio Ortiz public GitHub project index",
    publicUrl: profile.github,
    content: [
      `Sergio Ortiz has ${githubCorpus.included.length} public project repositories approved for the portfolio knowledge index.`,
      ...githubCorpus.included.map((repository) =>
        `${repository.repository}: ${repository.description || "Public repository without a description."} Topics: ${repository.topics.join(", ") || "not specified"}.`,
      ),
    ].join("\n\n"),
    metadata: { updatedAt: githubCorpus.generatedAt, sourceSection: "Public repository index" },
  };

  const profileRecord: RagRecord = {
    sourceType: "profile",
    title: "Sergio Ortiz — verified public profile",
    publicUrl: profile.github,
    content: [
      `Name: ${profile.name}`,
      `Location: ${profile.location}`,
      `English bio: ${profile.bio.en}`,
      `Spanish bio: ${profile.bio.es}`,
      `Education: ${profile.education.en} / ${profile.education.es}`,
      `Focus: ${profile.focus.join(", ")}`,
      ...careerRecords.map((record) => `${record.organisation} — ${record.role.en} / ${record.role.es}: ${record.summary.en} / ${record.summary.es}`),
      ...verifiedMilestones.map((milestone) => `${milestone.year} — ${milestone.title}: ${milestone.description.en} / ${milestone.description.es}`),
      githubCorpus.profile?.readme ? `Public GitHub profile README:\n${githubCorpus.profile.readme}` : "",
    ].filter(Boolean).join("\n\n"),
    metadata: { updatedAt: githubCorpus.generatedAt, sourceSection: "Verified portfolio profile" },
  };

  return [profileRecord, githubIndex, ...careerRecordSources, ...projectRecords, ...githubRecords, ...githubCodeRecords, ...noteRecords, ...linkedInRecords];
}

async function main() {
  const records = buildRecords();
  const activeKeys = new Set(records.map((record) => `${record.sourceType}:${record.publicUrl}`));
  const managedTypes = ["project", "github", "github-code", "github-index", "profile", "career", "note", "linkedin"];
  const { data: existingDocuments, error: existingError } = await client
    .from("content_documents")
    .select("id, source_type, public_url")
    .in("source_type", managedTypes);
  if (existingError) throw existingError;
  const staleIds = (existingDocuments ?? [])
    .filter((document) => !activeKeys.has(`${document.source_type}:${document.public_url}`))
    .map((document) => document.id as string);
  if (staleIds.length) {
    const { error: staleError } = await client.from("content_documents").delete().in("id", staleIds);
    if (staleError) throw staleError;
  }
  const embed = await pipeline("feature-extraction", model, { dtype: "q8" });
  let indexed = 0;

  for (const record of records) {
    const hash = createHash("sha256").update(record.content).digest("hex");
    const { data: existing, error: lookupError } = await client
      .from("content_documents")
      .select("id, content_hash")
      .eq("public_url", record.publicUrl)
      .eq("source_type", record.sourceType)
      .maybeSingle();
    if (lookupError) throw lookupError;

    let documentId = existing?.id as string | undefined;
    if (!documentId) {
      const { data, error } = await client.from("content_documents").insert({
        source_type: record.sourceType,
        title: record.title,
        public_url: record.publicUrl,
        visibility: "public",
        approved_for_rag: true,
        content_hash: hash,
      }).select("id").single();
      if (error) throw error;
      documentId = data.id as string;
    } else if (existing?.content_hash === hash) continue;
    else {
      const { error } = await client.from("content_documents").update({
        title: record.title,
        content_hash: hash,
        updated_at: new Date().toISOString(),
      }).eq("id", documentId);
      if (error) throw error;
      const { error: deleteError } = await client.from("content_chunks").delete().eq("document_id", documentId);
      if (deleteError) throw deleteError;
    }

    for (const [index, content] of chunks(record.content).entries()) {
      const vector = await embed(`passage: ${content}`, { pooling: "mean", normalize: true });
      const values = vector.tolist() as number[][];
      const { error } = await client.from("content_chunks").insert({
        document_id: documentId,
        section: `chunk-${index + 1}`,
        content,
        embedding: values[0],
        metadata: { ...record.metadata, sourceType: record.sourceType },
      });
      if (error) throw error;
    }
    indexed += 1;
  }

  process.stdout.write(`Indexed ${indexed} changed record(s), removed ${staleIds.length} stale record(s), and retained ${records.length} approved sources with ${model}.\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "RAG ingestion failed"}\n`);
  process.exitCode = 1;
});
