import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/uk/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

const published = [
  "london",
  "manchester",
  "birmingham",
  "edinburgh",
  "glasgow",
  "cardiff",
  "belfast",
  "oxford",
  "cambridge",
  "bristol",
]

test("UK SEO publication allowlist is exactly the approved ten Tier A cities", () => {
  assert.ok(routes.includes("PUBLISHED_UK_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.doesNotMatch(routes, /PUBLISHED_UK_CITY_SLUGS[\s\S]*"leeds"|PUBLISHED_UK_CITY_SLUGS[\s\S]*"nottingham"/)
})

test("approved UK city pages are indexable and unsupported slugs remain noindex/not-found", () => {
  assert.ok(page.includes("isPublishedUkCitySlug"))
  assert.ok(page.includes("if (!isPublishedUkCitySlug(normalized)) notFound()"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
})

test("UK city metadata is country-specific and canonical", () => {
  assert.ok(page.includes("Study in ${name}, United Kingdom"))
  assert.ok(page.includes("Student visa work context"))
  assert.ok(page.includes("alternates: { canonical: `/cities/uk/${normalized}` }"))
  assert.doesNotMatch(page, /\/cities\/gb\//i)
})

test("sitemap derives UK city URLs from the route allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_UK_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_UK_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/uk/${slug}"))
  assert.doesNotMatch(sitemap, /\/cities\/uk\/(leeds|nottingham)/)
})

test("Compare remains a noindex decision surface while supporting UK city comparison", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(comparePage.includes('if (countryCode === "UK")'))
})
