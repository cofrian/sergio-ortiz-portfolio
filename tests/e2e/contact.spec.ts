import { expect, test } from "@playwright/test";

test("contact page prioritises job opportunities", async ({ page }) => {
  await page.goto("/es/contact");

  await expect(page.getByRole("heading", { name: "Busco mi próximo reto en datos e IA." })).toBeVisible();
  await expect(page.getByText("Oferta de empleo", { exact: true })).toBeVisible();
  await expect(page.getByText("Colaboración técnica", { exact: true })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Oferta de empleo" })).toBeChecked();
});

test("contact form completes a successful recruiter enquiry", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    const payload = route.request().postDataJSON() as Record<string, string>;
    expect(payload.category).toBe("employment");
    expect(payload.role).toBe("Data Scientist");
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({ message: "Message sent successfully." }),
    });
  });

  await page.goto("/en/contact");
  await page.getByLabel("Your name").fill("Recruiter Name");
  await page.getByLabel("Work email").fill("recruiter@example.com");
  await page.getByLabel("Company or organisation").fill("Example Company");
  await page.getByLabel("Role or team").fill("Data Scientist");
  await page.getByLabel("Tell me about the role or opportunity").fill(
    "We would like to discuss a data science position and the next steps with Sergio.",
  );
  await page.getByRole("button", { name: "Send opportunity" }).click();

  await expect(page.getByRole("heading", { name: "Thanks for reaching out." })).toBeVisible();
  await expect(page.getByText("your message has been sent directly to Sergio", { exact: false })).toBeVisible();
});
