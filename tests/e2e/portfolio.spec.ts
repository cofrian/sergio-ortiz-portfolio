import { expect, test } from "@playwright/test";

test("home and primary views are navigable", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: /I build intelligent systems/i })).toBeVisible();
  await page.getByRole("link", { name: /View selected work/i }).click();
  await expect(page).toHaveURL(/\/en\/work/);
  await expect(page.getByRole("heading", { name: /Projects connecting/i })).toBeVisible();
});

test("language switch is explicit", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.locator(".site-shell > section").first()).toHaveId("education");
  await expect(page.getByRole("heading", { name: "BSc in Data Science", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Academic distinctions", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Cambiar a español/i }).click();
  await expect(page).toHaveURL(/\/es\/about/);
  await expect(page.getByRole("heading", { name: /Curiosidad técnica/i })).toBeVisible();
});

test("project detail exposes verified sources", async ({ page }) => {
  await page.goto("/en/work/urbanflow-valencia");
  await expect(page.getByRole("heading", { name: "UrbanFlow Valencia" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.getByText("44.4 veh/h")).toBeVisible();
});

test("experience includes leadership, clubs and innovation", async ({ page }) => {
  await page.goto("/en/experience");
  await expect(page.getByRole("heading", { name: /Building technology also means/i })).toBeVisible();
  await expect(page.locator(".site-shell > section").first()).toHaveId("education");
  await expect(page.getByText("240 ECTS", { exact: false })).toBeVisible();
  await expect(page.getByText(/Data Processing Infrastructure/)).toBeVisible();
  await expect(page.getByText("Sigma Data Club UPV", { exact: true })).toBeVisible();
  await expect(page.getByText("Freelance / Independent", { exact: true })).toBeVisible();
  await expect(page.getByText("Freelance Data & AI projects alongside my degree", { exact: true })).toBeVisible();
  await expect(page.getByText(/learn beyond the classroom/i)).toBeVisible();
  await page.locator("#freelance-data-ai summary").click();
  await expect(page.getByText(/automated document processes/i)).toBeVisible();
  await expect(page.getByText("The Pink Force Foundation", { exact: true })).toBeVisible();
  await expect(page.getByText("UPV Investment Club", { exact: true })).toBeVisible();
  await expect(page.getByText("Samsung Innovation Campus", { exact: true })).toBeVisible();
  await expect(page.locator('a[href*="pablogandia"]')).toHaveCount(0);
});

test("connections page exposes the Obsidian-inspired map", async ({ page, isMobile }) => {
  await page.goto("/en/connections");
  await expect(page.getByRole("heading", { name: /explore as a network/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Leadership", exact: true })).toBeVisible();
  if (isMobile) {
    await expect(page.getByRole("heading", { name: "All nodes" })).toBeVisible();
    await expect(page.getByLabel("Interactive connections graph")).toBeHidden();
  } else {
    await expect(page.getByLabel("Interactive connections graph")).toBeVisible();
    await expect(page.getByRole("button", { name: "Rearrange network" })).toBeVisible();
    const nodeCount = await page.locator(".graph-status strong").first().textContent();
    await page.getByRole("button", { name: "Leadership", exact: true }).click();
    await expect(page.locator(".graph-status strong").first()).toHaveText(nodeCount ?? "");
    await page.getByPlaceholder("Search project, club or capability").fill("UrbanFlow");
    await page.locator(".connections-search-results").getByRole("button", { name: /UrbanFlow/i }).click();
    await expect(page.locator(".connections-panel").getByRole("heading", { name: "UrbanFlow Valencia" })).toBeVisible();
    await expect(page.locator(".connections-related button").first()).toBeVisible();
  }
});

test("floating portfolio assistant is available from every page and returns citations", async ({ page }) => {
  await page.goto("/en/experience");
  await page.getByRole("button", { name: "Open portfolio assistant" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Question about Sergio").fill("Which Sergio project demonstrates MLOps?");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.locator(".answer-panel")).toBeVisible();
  await expect(page.locator(".source-card").first()).toBeVisible();
});

test("mobile navigation exposes every primary destination", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only interaction");
  await page.goto("/es");
  await page.getByRole("button", { name: "Abrir navegación" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("link", { name: "Conexiones", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar navegación" }).click();
  await expect(page.getByRole("button", { name: "Abrir asistente del portfolio" })).toBeVisible();
});
