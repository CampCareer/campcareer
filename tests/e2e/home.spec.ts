import { expect, test } from "@playwright/test"

test("landing sends a career, budget, and goal to country rankings", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Compare study paths - from campus to career." })).toBeVisible()

  await page.getByLabel("Career category", { exact: true }).selectOption("health")
  await page.getByLabel("Career", { exact: true }).selectOption("registered-nurse")
  await page.getByLabel("First-year budget (USD)", { exact: true }).selectOption("50000-75000")
  await page.getByLabel("What matters most?", { exact: true }).selectOption("work-and-immigration")
  await page.getByRole("button", { name: "See country rankings" }).click()

  await expect(page).toHaveURL(/\/countries\/search\?career=registered-nurse&budget=50000-75000&goal=work-and-immigration&currency=USD/)
  await expect(page.getByRole("heading", { name: "Which destination fits this career best?" })).toBeVisible()
  await expect(page.getByText("Ranking under review")).toBeVisible()
})

test("product hubs and discovery result pages are available", async ({ page }) => {
  await page.goto("/countries")
  await expect(page.getByRole("heading", { name: "Explore 20 study destinations." })).toBeVisible()

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
  await expect(page.getByLabel("직종")).toBeVisible()
  await expect(page.getByRole("button", { name: /Switch to .* theme/ })).toHaveCount(0)
  await expect(page.locator("body")).toHaveCSS("color-scheme", "light")
})
