import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const forbidden = [
  /nvapi-[a-z0-9_-]{12,}/i,
  /gh[pousr]_[a-z0-9]{20,}/i,
  /sk-(?:live|prod|test|proj)-[a-z0-9_-]{12,}/i,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+/,
  /RESEND_API_KEY\s*=\s*\S+/,
];
const roots = [resolve("src"), resolve("public"), resolve("content"), resolve(".next/static")];

async function files(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)]));
  return nested.flat();
}

async function main() {
  const findings: string[] = [];
  for (const root of roots) {
    for (const file of await files(root)) {
      if (!/\.(?:js|json|html|txt|md|map|tsx?|css)$/i.test(file)) continue;
      const content = await readFile(file, "utf8").catch(() => "");
      if (forbidden.some((pattern) => pattern.test(content))) findings.push(file);
    }
  }
  if (findings.length) throw new Error(`Potential secret material found in: ${findings.join(", ")}`);
  process.stdout.write("Bundle and source secret-pattern scan passed.\n");
}

main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "Security check failed"}\n`); process.exitCode = 1; });
