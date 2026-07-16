import { createHash } from "node:crypto";
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import { projects } from "../src/content/projects";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server credentials are required for RAG ingestion");
const client = createClient(url, key, { auth: { persistSession: false } });
const model = process.env.EMBEDDING_MODEL || "intfloat/multilingual-e5-small";

function chunks(text: string, max = 2_400) {
  const paragraphs = text.split(/\n{2,}/).map((value) => value.trim()).filter(Boolean);
  const output: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (`${current}\n\n${paragraph}`.length > max && current) { output.push(current); current = paragraph; }
    else current = current ? `${current}\n\n${paragraph}` : paragraph;
  }
  if (current) output.push(current);
  return output;
}

async function main() {
  const embed = await pipeline("feature-extraction", model, { dtype: "q8" });
  for (const project of projects) {
    const text = [`Project: ${project.title}`, `English summary: ${project.summary.en}`, `Spanish summary: ${project.summary.es}`, ...project.sections.flatMap((section) => [`${section.title.en}: ${section.body.en}`, `${section.title.es}: ${section.body.es}`]), `Metrics: ${project.metrics.map((metric) => `${metric.label.en}: ${metric.value}`).join("; ")}`, project.limitations ? `Limitations: ${project.limitations.en}` : ""].filter(Boolean).join("\n\n");
    const hash = createHash("sha256").update(text).digest("hex");
    const { data: existing } = await client.from("content_documents").select("id, content_hash").eq("public_url", project.repositoryUrl).maybeSingle();
    let documentId = existing?.id as string | undefined;
    if (!documentId) {
      const { data, error } = await client.from("content_documents").insert({ source_type: "project", title: project.title, public_url: project.repositoryUrl, visibility: "public", approved_for_rag: true, content_hash: hash }).select("id").single();
      if (error) throw error;
      documentId = data.id as string;
    } else if (existing?.content_hash === hash) continue;
    else {
      const { error } = await client.from("content_documents").update({ content_hash: hash, updated_at: new Date().toISOString() }).eq("id", documentId);
      if (error) throw error;
      await client.from("content_chunks").delete().eq("document_id", documentId);
    }
    for (const [index, content] of chunks(text).entries()) {
      const vector = await embed(`passage: ${content}`, { pooling: "mean", normalize: true });
      const values = vector.tolist() as number[][];
      const { error } = await client.from("content_chunks").insert({ document_id: documentId, section: `chunk-${index + 1}`, content, embedding: values[0], metadata: { projectSlug: project.slug, sourceType: "project", updatedAt: project.updatedAt } });
      if (error) throw error;
    }
  }
  process.stdout.write(`Indexed ${projects.length} curated projects with ${model}.\n`);
}

main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "RAG ingestion failed"}\n`); process.exitCode = 1; });
