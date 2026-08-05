import { expect, test } from "@playwright/test"

test("retired locale home redirects to the canonical Explore experience", async ({ page }) => {
  await page.goto("/ko?mode=explore")

  await expect(page).toHaveURL("/home?mode=explore")
  await expect(page.getByRole("heading", { name: "Explore, Compare, Find Your Future" })).toBeVisible()
})
