import { projects } from "../src/content/projects";
import { projectRecordSchema } from "../src/lib/schemas";

const slugs = new Set<string>();
for (const project of projects) {
  projectRecordSchema.parse(project);
  if (slugs.has(project.slug)) throw new Error(`Duplicate slug: ${project.slug}`);
  slugs.add(project.slug);
  const sourceIds = new Set(project.sources.map((source) => source.id));
  for (const metric of project.metrics) if (!sourceIds.has(metric.evidenceRef)) throw new Error(`${project.slug}: metric without evidence ${metric.evidenceRef}`);
}
process.stdout.write(`Validated ${projects.length} projects and all metric evidence references.\n`);
