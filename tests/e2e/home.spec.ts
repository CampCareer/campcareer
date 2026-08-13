import { expect, test } from "@playwright/test"

test("Korean landing keeps its language in the URL", async ({ page }) => {
  await page.goto("/ko")

  await expect(page).toHaveURL("/ko")
  await expect(page.getByRole("heading", { name: /유학 정보가 아니라/ })).toBeVisible()
})

test("Korean landing serves its own language, canonical URL and brand metadata", async ({ request }) => {
  const response = await request.get("/ko")
  expect(response.ok()).toBeTruthy()
  expect(response.headers()["content-language"]).toBe("ko")
  const html = await response.text()
  expect(html).toContain('<html lang="ko"')
  expect(html).toContain("<title>CampCareer | 해외에서 일하는 경로를 찾다</title>")
  expect(html).toContain('rel="canonical" href="https://www.campcareer.com/ko"')
  expect(html).toContain('hrefLang="en" href="https://www.campcareer.com"')
  expect(html).toContain('hrefLang="ko" href="https://www.campcareer.com/ko"')
})

test("unreviewed Korean aliases do not compete with published Korean search pages", async ({ request }) => {
  const response = await request.get("/ko/methodology")
  expect(response.ok()).toBeTruthy()
  expect(response.headers()["x-robots-tag"]).toContain("noindex")
})

test("Home search dropdown closes when the visitor clicks outside it", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Where").click()
  await expect(page.getByRole("listbox")).toBeVisible()

  await page.getByLabel("Where").press("ArrowDown")
  await expect(page.getByLabel("Where")).toHaveAttribute("aria-activedescendant", /country-option-0/)

  await page.getByRole("heading", { name: /Not study information/ }).click()
  await expect(page.getByRole("listbox")).toBeHidden()
})

test("career personalisation starts near the market summary and preserves the result URL", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=registered-nurse")

  const personalisation = page.getByRole("link", { name: "See my exact path" })
  await expect(page.getByRole("button", { name: "Sign in to save" })).toBeVisible()
  await expect(personalisation).toBeVisible()
  const href = await personalisation.getAttribute("href")
  const next = new URL(href ?? "", page.url()).searchParams.get("next")
  const onboarding = new URL(next ?? "", page.url())
  expect(onboarding.pathname).toBe("/onboarding")
  expect(onboarding.searchParams.get("return_to")).toBe("/career?country=AU&occupation=registered-nurse&personalised=1")
  const box = await personalisation.boundingBox()
  expect(box?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(1400)
})
