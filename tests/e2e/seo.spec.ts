import { expect, test } from "@playwright/test"

test("sitemap exposes only canonical route-product and country URLs", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml")
  expect(sitemap.ok()).toBeTruthy()
  expect(sitemap.headers()["content-type"]).toContain("application/xml")
  const xml = await sitemap.text()
  expect(xml).toContain("https://www.campcareer.com/")
  expect(xml).toContain("/routes/australia/mining-work")
  expect(xml).toContain("/maps")
  expect(xml).toContain("/countries/au")
  expect(xml).not.toContain("https://www.campcareer.com/home")
  expect(xml).not.toContain("/au/majors/")
})

test("member Home stays private and legacy country roots redirect permanently", async ({ request }) => {
  const home = await request.get("/home", { maxRedirects: 0 })
  expect(home.status()).toBe(307)
  expect(home.headers().location).toContain("/login?next=%2Fhome")

  const australia = await request.get("/au", { maxRedirects: 0 })
  expect(australia.status()).toBe(308)
  expect(australia.headers().location).toBe("/countries/au")
})

test("retired sitemap endpoints are not indexable", async ({ request }) => {
  const response = await request.get("/sitemaps/fields-en.xml")
  expect(response.status()).toBe(410)
  expect(response.headers()["x-robots-tag"]).toContain("noindex")

  const legacyIndex = await request.get("/sitemap-index.xml", { maxRedirects: 0 })
  expect(legacyIndex.status()).toBe(410)
  expect(legacyIndex.headers()["x-robots-tag"]).toContain("noindex")
})

test("an indexed study collection renders instead of redirecting to the retired study funnel", async ({ page }) => {
  const response = await page.goto("/study/au/sydney/health")

  expect(response?.status()).toBe(200)
  await expect(page).toHaveURL(/\/study\/au\/sydney\/health$/)
  await expect(page.getByRole("heading", { name: "Health courses in Sydney" })).toBeVisible()
  await expect(page).toHaveTitle("Health Courses in Sydney, Australia | CampCareer")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.campcareer.com/study/au/sydney/health",
  )
})

test("map country bundles defer oversized detail datasets", async ({ request }) => {
  const canada = await request.get("/api/maps/data/ca")
  expect(canada.ok()).toBeTruthy()
  const canadaPayload = await canada.json()
  expect(canadaPayload.data.caColleges.length).toBeGreaterThan(0)
  expect(canadaPayload.data.caProvinceOccupations).toBeUndefined()

  const japan = await request.get("/api/maps/data/jp")
  expect(japan.ok()).toBeTruthy()
  const japanPayload = await japan.json()
  expect(japanPayload.data.jpHighPayOccupations.length).toBeGreaterThan(0)
  expect(japanPayload.data.jpJobTagProfilesByWageCode).toBeUndefined()

  const code = japanPayload.data.jpHighPayOccupations[0].occupationCode
  const detail = await request.get(`/api/maps/data/jp/jobtag/${encodeURIComponent(code)}`)
  expect(detail.ok()).toBeTruthy()
  expect((await detail.json()).code).toBe(code)
})
