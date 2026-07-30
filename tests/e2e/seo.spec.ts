import { expect, test } from "@playwright/test"

test("sitemap exposes only canonical route-product URLs", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml")
  expect(sitemap.ok()).toBeTruthy()
  expect(sitemap.headers()["content-type"]).toContain("application/xml")
  const xml = await sitemap.text()
  expect(xml).toContain("/routes/australia/mining-work")
  expect(xml).toContain("/maps")
  expect(xml).not.toContain("/au/majors/")
  expect(xml).not.toContain("/countries/")
})

test("retired sitemap endpoints are not indexable", async ({ request }) => {
  const response = await request.get("/sitemaps/fields-en.xml")
  expect(response.status()).toBe(410)
  expect(response.headers()["x-robots-tag"]).toContain("noindex")

  const legacyIndex = await request.get("/sitemap-index.xml", { maxRedirects: 0 })
  expect(legacyIndex.status()).toBe(410)
  expect(legacyIndex.headers()["x-robots-tag"]).toContain("noindex")
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
