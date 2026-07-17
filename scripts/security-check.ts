import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const forbidden = [
  /nvapi-[a-z0-9_-]{12,}/i,
  /gh[pousr]_[a-z0-9]{20,}/i,
  /sb_secret_[a-z0-9._-]{12,}/i,
  /sk-(?:live|prod|test|proj)-[a-z0-9_-]{12,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /postgres(?:ql)?:\/\/[^\s"'<>:]+:[^\s"'<>@]+@/i,
  /NEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|SERVICE_ROLE|API_KEY)/,
  /(?:SUPABASE_(?:SECRET_KEY|SERVICE_ROLE_KEY)|NVIDIA_API_KEY|GITHUB_TOKEN|RESEND_API_KEY|POSTGRES_PASSWORD)\s*=\s*\S+/,
];

const roots = [
  resolve("src"),
  resolve("public"),
  resolve("content"),
  resolve(".next/static"),
  resolve(".next/server/app"),
];

async function files(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)],
    ),
  );
  return nested.flat();
}

function containsPrivilegedJwt(content: string) {
  const candidates = content.match(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g) ?? [];
  return candidates.some((candidate) => {
    try {
      const payload = candidate.split(".")[1];
      const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
        role?: unknown;
      };
      return decoded.role === "service_role" || decoded.role === "supabase_admin";
    } catch {
      return false;
    }
  });
}

async function main() {
  const findings = new Set<string>();
  for (const root of roots) {
    for (const file of await files(root)) {
      if (!/\.(?:js|json|html|rsc|txt|md|map|tsx?|css)$/i.test(file)) continue;
      const content = await readFile(file, "utf8").catch(() => "");
      if (
        forbidden.some((pattern) => pattern.test(content)) ||
        containsPrivilegedJwt(content)
      ) {
        findings.add(file);
      }
    }
  }
  if (findings.size) {
    throw new Error(
      `Potential secret material found in: ${[...findings].join(", ")}`,
    );
  }
  process.stdout.write("Bundle, server payload and source secret-pattern scan passed.\n");
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Security check failed"}\n`,
  );
  process.exitCode = 1;
});
