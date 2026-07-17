import { projects } from "../src/content/projects";
import { projectRecordSchema } from "../src/lib/schemas";
import githubRagJson from "../src/content/generated-github-rag.json";
import { githubRagCorpusSchema } from "../src/lib/github/rag-sources";

const slugs = new Set<string>();
for (const project of projects) {
  projectRecordSchema.parse(project);
  if (slugs.has(project.slug)) throw new Error(`Duplicate slug: ${project.slug}`);
  slugs.add(project.slug);
  const sourceIds = new Set(project.sources.map((source) => source.id));
  for (const metric of project.metrics) if (!sourceIds.has(metric.evidenceRef)) throw new Error(`${project.slug}: metric without evidence ${metric.evidenceRef}`);
}
const githubRag = githubRagCorpusSchema.parse(githubRagJson);
const repositories = new Set<string>();
for (const source of githubRag.included) {
  if (repositories.has(source.repository)) throw new Error(`Duplicate GitHub RAG source: ${source.repository}`);
  repositories.add(source.repository);
  if (source.repository === "sergio-ortiz-portfolio") throw new Error("The portfolio application must never be indexed into its own RAG");
}
process.stdout.write(`Validated ${projects.length} projects, all metric evidence references and ${githubRag.included.length} public GitHub RAG sources.\n`);
