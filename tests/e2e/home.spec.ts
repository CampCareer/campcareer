import { expect, test } from "@playwright/test"

test("English decision journey reaches evidence-backed results", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Compare study paths—from qualification to career." })).toBeVisible()

  await page.getByRole("button", { name: "Health & Care" }).click()
  await page.getByRole("option", { name: /Nursing/ }).click()
  await page.getByRole("button", { name: "Compare my study options" }).click()

  await expect(page.getByRole("heading", { name: "Your comparable destinations" })).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole("button", { name: "Save this plan" })).toBeVisible()
  await expect(page.getByText(/information and planning tool/i)).toBeVisible()
})

test("Korean landing is localized and mobile-safe", async ({ page }) => {
  await page.goto("/ko")
  await expect(page.getByRole("heading", { name: "과정부터 취업까지, 유학의 결과를 비교하세요." })).toBeVisible()
  await expect(page.getByLabel("무엇을 배우고 싶나요?")).toBeVisible()
})
