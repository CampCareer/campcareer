import { expect, test } from "@playwright/test"

test("France country ROI page renders all key sections", async ({ page }) => {
  await page.goto("/countries/france")

  await expect(page.getByRole("heading", { name: "Study and work in France" })).toBeVisible()
  await expect(page.getByText("Quick ROI preview")).toBeVisible()
  await expect(page.getByText("Strong majors")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Who this country is best for" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Salary projection" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Budget and take-home preview" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Visa and policy signals" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Data confidence" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Risks to check first" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Next steps" })).toBeVisible()

  await expect(page.getByRole("link", { name: /Compare schools and ROI/ })).toHaveAttribute("href", "/roi-explorer?country=fr")
  await expect(page.getByRole("link", { name: "Browse occupations" })).toHaveAttribute("href", "/fr/jobs")
})
