import { expect, test } from "@playwright/test"

test("Korean landing keeps its language in the URL", async ({ page }) => {
  await page.goto("/ko")

  await expect(page).toHaveURL("/ko")
  await expect(page.getByRole("heading", { name: /유학 정보가 아니라/ })).toBeVisible()
})

test("Home search dropdown closes when the visitor clicks outside it", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Where").click()
  await expect(page.getByRole("listbox")).toBeVisible()

  await page.getByRole("heading", { name: /Not study information/ }).click()
  await expect(page.getByRole("listbox")).toBeHidden()
})
