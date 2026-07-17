import { createHash } from "node:crypto";
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import { linkedinPosts } from "../src/content/linkedin";
import { notes } from "../src/content/notes";
import { projects } from "../src/content/projects";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server credentials are required for RAG ingestion");

const client = createClient(url, key, { auth: { persistSession: false } });
const model = process.env.EMBEDDING_MODEL || "Xenova/multilingual-e5-small";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-seven-red-73.vercel.app").replace(/\/$/, "");

interface RagRecord {
  sourceType: "project" | "note" | "linkedin";
  title: string;
  publicUrl: string;
  content: string;
  metadata: Record<string, string>;
}

function chunks(text: string, max = 2_400) {
  const paragraphs = text.split(/\n{2,}/).map((value) => value.trim()).filter(Boolean);
  const output: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (`${current}\n\n${paragraph}`.length > max && current) {
      output.push(current);
      current = paragraph;
    } else current = current ? `${current}\n\n${paragraph}` : paragraph;
  }
  if (current) output.push(current);
  return output;
}

function buildRecords(): RagRecord[] {
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
    content: `${post.title}\n\n${post.excerpt}`,
    metadata: { linkedInId: post.id, updatedAt: post.publishedAt },
  }));

  return [...projectRecords, ...noteRecords, ...linkedInRecords];
}

async function main() {
  const records = buildRecords();
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

  process.stdout.write(`Indexed ${indexed} changed record(s) from ${records.length} approved sources with ${model}.\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "RAG ingestion failed"}\n`);
  process.exitCode = 1;
});
