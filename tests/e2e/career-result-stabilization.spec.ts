import { expect, test } from "@playwright/test"

test("AU Software Developer keeps its career context when opening Compare", async ({ page }) => {
  await page.goto("/career/australia/software-developer")

  const compare = page.getByRole("link", { name: "Compare" })
  await expect(compare).toBeVisible()
  await compare.click()

  await expect(page).toHaveURL(/\/compare\?type=career&country=AU&profile=starting-from-scratch&careers=software-engineer/)
})

test("legacy query-style Career URL redirects to the canonical page and preserves attribution", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=registered-nurse&utm_source=tiktok")
  await expect(page).toHaveURL(/\/career\/australia\/registered-nurse\?utm_source=tiktok$/)
})

test("signed-out Save returns through login to the same canonical Career Page", async ({ page }) => {
  await page.goto("/career/australia/registered-nurse")

  const save = page.getByRole("link", { name: "Save" })
  await expect(save).toBeVisible()

  const href = await save.getAttribute("href")
  expect(href).toContain("/login?next=")
  expect(decodeURIComponent(href ?? "")).toContain("/career/australia/registered-nurse?save=1")
})
