import { expect, test } from "@playwright/test"

test("sitemap index exposes segmented canonical URL sets", async ({ request }) => {
  const index = await request.get("/sitemap-index.xml")
  expect(index.ok()).toBeTruthy()
  expect(index.headers()["content-type"]).toContain("application/xml")
  expect(await index.text()).toContain("/sitemaps/fields-en.xml")

  const fields = await request.get("/sitemaps/fields-en.xml")
  expect(fields.ok()).toBeTruthy()
  expect(Number(fields.headers()["x-sitemap-url-count"])).toBeGreaterThan(5)
  expect(await fields.text()).toContain("/fields/carpentry")
})

test("unknown sitemap segments are not indexable", async ({ request }) => {
  const response = await request.get("/sitemaps/not-a-template.xml")
  expect(response.status()).toBe(404)
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
