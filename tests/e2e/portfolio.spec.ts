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

test("restricted portfolio query returns citations", async ({ page }) => {
  await page.goto("/en/ask");
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
  await expect(page.getByRole("link", { name: "Pregunta al portfolio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Conexiones", exact: true })).toBeVisible();
});
