import { expect, test } from "@playwright/test"

test("AU Software Developer result keeps its career context when opening Compare", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=software-developer")

  const compare = page.getByRole("link", { name: "Compare this career" })
  await expect(compare).toBeVisible()
  await compare.click()

  await expect(page).toHaveURL(/\/compare\?type=career&country=AU&profile=starting-from-scratch&careers=software-engineer/)
})

test("signed-out career result sends personalisation through login without losing context", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=registered-nurse")

  const personalise = page.getByRole("link", { name: "Sign in to see my path" })
  await expect(personalise).toBeVisible()

  const href = await personalise.getAttribute("href")
  expect(href).toContain("/login?next=")
  expect(decodeURIComponent(href ?? "")).toContain("/onboarding?country=AU&occupation=registered-nurse")
})

test("signed-out save returns to the same career result after login", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=registered-nurse")

  const save = page.getByRole("link", { name: "Save path" })
  await expect(save).toBeVisible()

  const href = await save.getAttribute("href")
  expect(href).toContain("/login?next=")
  expect(decodeURIComponent(href ?? "")).toContain("/career?country=AU&occupation=registered-nurse")
})
