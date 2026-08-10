import { expect, test } from "@playwright/test"

test("retired locale home redirects to the canonical Explore experience", async ({ page }) => {
  await page.goto("/ko?mode=explore")

  await expect(page).toHaveURL("/?mode=explore")
  await expect(page.getByRole("heading", { name: "Millions of careers. Build your future." })).toBeVisible()
})

test("Home search dropdown closes when the visitor clicks outside it", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Passport").click()
  await expect(page.getByRole("listbox")).toBeVisible()

  await page.getByRole("heading", { name: "Millions of careers. Build your future." }).click()
  await expect(page.getByRole("listbox")).toBeHidden()
})
