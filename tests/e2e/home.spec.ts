import { expect, test } from "@playwright/test"

test("landing sends country, major, and goal to country discovery", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Compare study paths - from campus to career." })).toBeVisible()

  await page.getByLabel("Where do you want to study?", { exact: true }).click()
  await expect(page.getByTestId("country-option-UK")).toContainText("🇬🇧")
  await page.getByTestId("country-option-AU").click()
  await page.getByLabel("What do you want to study?", { exact: true }).click()
  await page.getByTestId("major-option-computer-science").click()
  await page.getByLabel("What matters most?", { exact: true }).click()
  await page.getByTestId("goal-option-immigration").click()
  await page.getByRole("button", { name: "See country rankings" }).click()

  await expect(page).toHaveURL(/\/countries\/search\?country=AU&major=computer-science&goal=immigration/)
  await expect(page.getByRole("heading", { name: "Choose your region in Australia" })).toHaveCount(0)
  await expect(page.getByRole("heading", { name: "Where in Australia?" })).toBeVisible()
  await expect(page.getByText("Sydney", { exact: true })).toBeVisible()
  await expect(page.getByText("Gold Coast", { exact: true })).toBeVisible()
  const sydneyWorkspace = page.getByRole("link", { name: "Open workspace" }).first()
  await expect(sydneyWorkspace).toHaveAttribute("target", "_blank")
  await expect(sydneyWorkspace).toHaveAttribute("href", /\/regional-workspace\?country=AU&state=NSW&city=Sydney/)
})

test("landing keeps the search available when no goal is selected", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByLabel("What matters most?", { exact: true })).toContainText("Choose your goal")
  await page.getByRole("button", { name: "See country rankings" }).click()

  await expect(page).toHaveURL(/\/countries\/search\?country=everywhere&major=anything/)
  await expect(page.getByRole("heading", { name: "Explore countries before you decide." })).toBeVisible()
  await expect(page.getByRole("heading", { name: "What should come first?" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Explore 20 countries" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Australia", exact: true })).toBeVisible()
})

test("Ireland country results offer Dublin, Cork, Galway, and Limerick", async ({ page }) => {
  await page.goto("/countries/search?country=IE&major=computer-science&goal=immigration")

  await expect(page.getByRole("heading", { name: "Where in Ireland?" })).toBeVisible()
  for (const city of ["Dublin", "Cork", "Galway", "Limerick"]) {
    await expect(page.getByText(city, { exact: true })).toBeVisible()
  }
  await expect(page.getByRole("link", { name: "Open workspace" }).first()).toHaveAttribute(
    "href",
    /\/regional-workspace\?country=IE&state=D&city=Dublin/,
  )
})

test("Germany, Singapore, and UAE country results offer their regional choices", async ({ page }) => {
  for (const [country, cities] of [
    ["DE", ["Berlin", "Munich", "Hamburg", "Frankfurt"]],
    ["SG", ["Central", "CBD", "East", "West"]],
    ["AE", ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"]],
  ] as const) {
    await page.goto(`/countries/search?country=${country}&major=computer-science&goal=immigration`)
    for (const city of cities) await expect(page.getByRole("link", { name: new RegExp(`^${city},`) })).toBeVisible()
  }
})

test("regional selection opens the dedicated ROI workspace instead of Maps", async ({ page }) => {
  await page.goto("/regional-workspace?country=AU&state=NSW&city=Sydney&major=computer-science&goal=immigration")
  await expect(page.getByRole("heading", { name: "Sydney, New South Wales" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "University shortlist" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Career demand signals" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Cost evidence" })).toBeVisible()
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
