import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/en", "/en/work", "/en/research", "/en/experience", "/en/about", "/en/notes", "/en/contact", "/en/ask", "/en/connections", "/en/work/gemf-exist-2026"]) {
  test(`has no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });
}
