import { expect, test } from "@playwright/test"

test("France country page renders its reviewed decision sections", async ({ page }) => {
  await page.goto("/countries/fr")

  await expect(page.getByRole("heading", { name: "France", exact: true })).toBeVisible()
  await expect(page.getByText("Visa options")).toBeVisible()
  await expect(page.getByText("Salary range")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Strong majors by workforce demand" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Major universities and colleges" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Regions & cities" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Work opportunities" })).toBeVisible()

  await expect(page.getByRole("link", { name: "Visa options" })).toHaveAttribute("href", "/visas?country=FR")
})
