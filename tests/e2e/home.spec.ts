import { expect, test } from "@playwright/test"

test("landing resolves the published mining route from the user's words", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByLabel("Destination")).toHaveValue("AU")
  await page.getByLabel("What do you want to do?").fill("mining")
  await page.getByRole("option", { name: /Mining Site Work/ }).click()

  await page.getByRole("button", { name: "Search" }).click()
  await expect(page).toHaveURL("/results?search_query=Mining+Site+Work")
  await expect(page.getByRole("heading", { name: "Mining Site Work" })).toBeVisible()
  await expect(page.getByText("Working Holiday visa (subclass 417)")).toBeVisible()
  await expect(page.getByRole("link", { name: "Open interactive map" }).first()).toBeVisible()
})

test("unsupported searches ask for research instead of fabricating a route", async ({ page }) => {
  await page.goto("/ko")

  await page.getByLabel("하고 싶은 일").fill("메이크업")
  await page.getByLabel("목표").selectOption("study")
  await page.getByRole("button", { name: "검색" }).click()
  await expect(page.getByRole("heading", { name: "아직 검증된 공개 경로가 없습니다" })).toBeVisible()
  await expect(page).toHaveURL("/ko")
})

test("Korean route search stays localized", async ({ page }) => {
  await page.goto("/ko")

  await expect(page.getByLabel("목적지")).toHaveValue("AU")
  await page.getByLabel("하고 싶은 일").fill("광산")
  await page.getByRole("option", { name: /광산 현장직/ }).click()
  await page.getByRole("button", { name: "검색" }).click()
  await expect(page).toHaveURL("/ko/results?search_query=%EA%B4%91%EC%82%B0+%ED%98%84%EC%9E%A5%EC%A7%81")
  await expect(page.getByRole("heading", { name: "광산 현장직" })).toBeVisible()
})
