import { expect, test } from "@playwright/test"

test("landing searches a published international career route", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Find the route from where you are to the work you want." })).toBeVisible()
  await expect(page.getByLabel("Citizenship")).toHaveValue("south-korea")
  await expect(page.getByLabel("Destination")).toHaveValue("australia")
  await expect(page.getByLabel("Occupation or industry")).toHaveValue("mining-work")

  await page.getByRole("button", { name: "Open route" }).click()
  await expect(page).toHaveURL("/routes/south-korea/australia/mining-work")
  await expect(page.getByRole("heading", { name: "How a Korean passport holder can pursue mining work in Australia" })).toBeVisible()
  await expect(page.getByText("Working Holiday visa (subclass 417)")).toBeVisible()
  await expect(page.getByRole("link", { name: "Explore Western Australia mining regions" })).toBeVisible()
})

test("Korean route search stays localized", async ({ page }) => {
  await page.goto("/ko")

  await expect(page.getByRole("heading", { name: "어디서 왔고, 어디서 어떤 일을 하고 싶은지. 그 경로를 찾습니다." })).toBeVisible()
  await page.getByRole("button", { name: "경로 보기" }).click()
  await expect(page).toHaveURL("/ko/routes/south-korea/australia/mining-work")
  await expect(page.getByRole("heading", { name: "한국 여권자가 호주 광업 취업을 준비하는 경로" })).toBeVisible()
})
