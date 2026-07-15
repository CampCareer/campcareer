import { expect, test } from "@playwright/test"

test("landing sends country, major, and goal to country discovery", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Compare study paths - from campus to career." })).toBeVisible()

  await page.getByLabel("Where do you want to study?", { exact: true }).click()
  await page.getByTestId("country-option-CA").click()
  await page.getByLabel("What do you want to study?", { exact: true }).click()
  await page.getByTestId("major-option-computer-science").click()
  await page.getByLabel("What matters most?", { exact: true }).click()
  await page.getByTestId("goal-option-immigration").click()
  await page.getByRole("button", { name: "See country rankings" }).click()

  await expect(page).toHaveURL(/\/countries\/search\?country=CA&major=computer-science&goal=immigration/)
  await expect(page.getByRole("heading", { name: "Which destination best fits your goal?" })).toBeVisible()
  await expect(page.getByText("Canada is your chosen country.")).toBeVisible()
})

test("product hubs and discovery result pages are available", async ({ page }) => {
  await page.goto("/countries")
  await expect(page.getByRole("heading", { name: "Compare study paths - from campus to career." })).toBeVisible()

  await page.goto("/majors/search?country=AU&goal=career-outcomes")
  await expect(page.getByRole("heading", { name: "Which career path fits this place?" })).toBeVisible()
  await expect(page.getByText("Regional ranking under review")).toBeVisible()

  await page.goto("/universities/search?country=AU&career=software-developer&budget=50000-75000")
  await expect(page.getByRole("heading", { name: "Which university fits your budget and career?" })).toBeVisible()
  await expect(page.getByText("University matches under review")).toBeVisible()
})

test("Korean landing is localized and stays light without a theme toggle", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/ko")
  await expect(page.getByRole("heading", { name: "무엇을 공부할지, 어느 나라로 갈지, 졸업 후 얼마가 남는지 선택하세요." })).toBeVisible()
  await expect(page.getByLabel("어느 나라에서 공부하고 싶나요?")).toBeVisible()
  await expect(page.getByRole("button", { name: /Switch to .* theme/ })).toHaveCount(0)
  await expect(page.locator("body")).toHaveCSS("color-scheme", "light")
})
