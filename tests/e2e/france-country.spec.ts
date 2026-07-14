import { expect, test } from "@playwright/test"

test("France country hub matches the full country-hub journey", async ({ page }) => {
  await page.goto("/countries/france")

  await expect(page.getByRole("heading", { name: "Work & Study in France" })).toBeVisible()
  await expect(page.getByText("Metropolitan Regions", { exact: true })).toBeVisible()
  await expect(page.getByText("Public Institutions", { exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Explore France" })).toBeVisible()

  await expect(page.getByRole("link", { name: /Browse .* Occupation Groups/ })).toHaveAttribute("href", "/fr/jobs")
  await expect(page.getByRole("link", { name: "View Regional Map" })).toHaveAttribute("href", "/maps?country=fr")
  await expect(page.getByRole("link", { name: /Country Rankings/ })).toHaveAttribute("href", "/countries/search")
})
