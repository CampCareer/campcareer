import { expect, test } from "@playwright/test"

test("English decision journey reaches evidence-backed results", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Choose what to study, where to go, and what you’ll have left after graduation." })).toBeVisible()

  await page.getByRole("button", { name: "Health & Care" }).click()
  await page.getByRole("option", { name: /Nursing/ }).click()
  await page.getByRole("button", { name: "Compare my options" }).click()

  await expect(page.getByRole("heading", { name: "Your comparable destinations" })).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole("link", { name: "Open detailed comparison" })).toHaveAttribute("href", "/compare?major=nursing")
  await expect(page.getByRole("button", { name: "Save this plan" })).toBeVisible()
  await expect(page.getByText(/information and planning tool/i)).toBeVisible()
})

test("Korean landing is localized and mobile-safe", async ({ page }) => {
  await page.goto("/ko")
  await expect(page.getByRole("heading", { name: "무엇을 공부할지, 어느 나라로 갈지, 졸업 후 얼마가 남는지 비교하세요." })).toBeVisible()
  await expect(page.getByLabel("무엇을 공부하거나 어떤 일을 하고 싶나요?")).toBeVisible()
})

test("text search filters options and the menu restores focus when closed", async ({ page }) => {
  await page.goto("/")
  const input = page.getByRole("combobox", { name: "What do you want to study or do?" })

  await input.fill("carpent")
  await expect(page.getByRole("option", { name: /^Carpentry/ }).first()).toBeVisible()
  await expect(page.getByRole("option", { name: /Nursing/ })).toHaveCount(0)

  await page.keyboard.press("Escape")
  await expect(input).toHaveAttribute("aria-expanded", "false")
  await expect(input).toBeFocused()

  await input.click()
  await page.getByRole("button", { name: "Close study options" }).click()
  await expect(input).toHaveAttribute("aria-expanded", "false")
  await expect(input).toBeFocused()

  if ((page.viewportSize()?.width ?? 0) >= 640) {
    await page.getByRole("button", { name: "Study option results" }).click()
    await expect(input).toHaveAttribute("aria-expanded", "true")
    await page.getByRole("button", { name: "Collapse study options" }).click()
    await expect(input).toHaveAttribute("aria-expanded", "false")
    await expect(input).toBeFocused()

    await input.click()
    await page.getByRole("heading", { name: /Choose what to study/ }).click()
    await expect(input).toHaveAttribute("aria-expanded", "false")
  } else {
    await input.click()
    await page.getByTestId("study-search-backdrop").click({ position: { x: 4, y: 4 } })
    await expect(input).toHaveAttribute("aria-expanded", "false")
  }
})

test("an unranked study concept continues to the canonical comparison tool", async ({ page }) => {
  await page.goto("/")
  const input = page.getByRole("combobox", { name: "What do you want to study or do?" })

  await input.fill("cybersecurity")
  await page.getByRole("option", { name: /^Cybersecurity/ }).first().click()
  const navigation = page.waitForRequest((request) => {
    const url = new URL(request.url())
    return request.isNavigationRequest() && url.pathname === "/compare" && url.searchParams.get("major") === "cybersecurity"
  })
  await page.getByRole("button", { name: "Compare my options" }).click()

  await navigation
})

test("global origin catalogue is available without making it a first-step requirement", async ({ page, request }) => {
  await page.goto("/")
  await expect(page.getByText("Where are you applying from?")).toHaveCount(0)

  const response = await request.get("/api/v1/countries?locale=en")
  expect(response.ok()).toBeTruthy()
  const payload = await response.json()
  expect(payload.countries).toHaveLength(249)
  expect(payload.countries).toEqual(expect.arrayContaining([
    expect.objectContaining({ code: "US" }),
    expect.objectContaining({ code: "CN" }),
    expect.objectContaining({ code: "SG" }),
  ]))
})
