import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { validateCaptureUrl } from "../src/lib/security/ssrf";

type GeneratedProject = { repository: string; title: string; demoUrl?: string };
type SyncOutput = { included?: GeneratedProject[] };
const baseAllowlist = ["vercel.app", "github.io", "huggingface.co"];

function coverSvg(title: string, repository: string) {
  const safeTitle = title.replace(/[<>&"]/g, "").slice(0, 70);
  const safeRepository = repository.replace(/[<>&"]/g, "").slice(0, 90);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="1200" height="675" fill="#f7f5ef"/><path d="M0 520 C220 390 370 620 610 440 S980 300 1240 410" fill="none" stroke="#064e47" stroke-width="22"/><circle cx="900" cy="180" r="105" fill="#d3a94f" opacity=".86"/><text x="72" y="110" fill="#064e47" font-family="Arial" font-size="24" letter-spacing="5">SERGIO ORTIZ · PROJECT RECORD</text><text x="72" y="280" fill="#151a18" font-family="Georgia" font-size="72">${safeTitle}</text><text x="72" y="345" fill="#68736e" font-family="Arial" font-size="28">${safeRepository}</text></svg>`;
}

async function deterministic(project: GeneratedProject, target: string) {
  await sharp(Buffer.from(coverSvg(project.title, project.repository))).webp({ quality: 88 }).toFile(target);
}

async function main() {
  const raw = await readFile(resolve("src/content/generated-projects.json"), "utf8");
  const parsed = JSON.parse(raw) as SyncOutput | unknown[];
  const projects = Array.isArray(parsed) ? [] : parsed.included ?? [];
  const output = resolve("public/generated/project-covers");
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const project of projects) {
      const target = resolve(output, `${project.repository}.webp`);
      if (!project.demoUrl) { await deterministic(project, target); continue; }
      try {
        const allowed = [...baseAllowlist, ...String(process.env.CAPTURE_ALLOWED_HOSTS ?? "").split(",").map((value) => value.trim()).filter(Boolean)];
        const initial = await validateCaptureUrl(project.demoUrl, allowed);
        const context = await browser.newContext({ acceptDownloads: false, permissions: [], viewport: { width: 1440, height: 900 } });
        const page = await context.newPage();
        await page.route("**/*", async (route) => {
          try {
            const requestUrl = new URL(route.request().url());
            if (requestUrl.protocol === "data:" || requestUrl.protocol === "blob:") return route.continue();
            if (requestUrl.hostname !== initial.hostname) return route.abort("blockedbyclient");
            await validateCaptureUrl(requestUrl.toString(), [initial.hostname]);
            return route.continue({ headers: Object.fromEntries(Object.entries(route.request().headers()).filter(([key]) => !["authorization", "cookie"].includes(key.toLowerCase()))) });
          } catch { return route.abort("blockedbyclient"); }
        });
        await page.goto(initial.toString(), { waitUntil: "networkidle", timeout: 20_000 });
        const screenshot = await page.screenshot({ type: "png", fullPage: false });
        await sharp(screenshot).webp({ quality: 86 }).toFile(target);
        await context.close();
      } catch {
        await deterministic(project, target);
      }
    }
  } finally { await browser.close(); }
  process.stdout.write(`Prepared ${projects.length} project covers.\n`);
}

main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "Capture failed"}\n`); process.exitCode = 1; });
