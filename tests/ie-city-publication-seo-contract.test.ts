import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/ie/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profile = readFileSync("src/lib/cities/ie-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/ireland-city-dashboard.tsx", "utf8")

const published = ["dublin", "cork", "galway", "limerick"]
const deferred = ["maynooth", "waterford", "athlone", "sligo", "dundalk", "letterkenny"]

test("Ireland SEO publication allowlist is exactly the approved four Tier A cities", () => {
  assert.match(routes, /PUBLISHED_IE_CITY_SLUGS = \["dublin", "cork", "galway", "limerick"\] as const/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_IE_CITY_SLUGS = \\[.*"${slug}"`))
  }
})

test("approved Ireland city pages are indexable and unsupported slugs remain noindex/not-found", () => {
  assert.ok(page.includes("isPublishedIeCitySlug"))
  assert.ok(page.includes("if (!isPublishedIeCitySlug(normalized)) notFound()"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
})

test("Ireland city metadata is country-specific and canonical", () => {
  assert.ok(page.includes("Study in ${name}, Ireland"))
  assert.ok(page.includes("Stamp 2 work context"))
  assert.ok(page.includes("alternates: { canonical: `/cities/ie/${normalized}` }"))
})

test("sitemap derives Ireland city URLs from the route allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_IE_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_IE_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/ie/${slug}"))
  for (const slug of deferred) assert.doesNotMatch(sitemap, new RegExp(`/cities/ie/${slug}`))
})

test("Compare remains a noindex decision surface while supporting Ireland city comparison", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(comparePage.includes('if (countryCode === "IE")'))
})

test("publication keeps programme-delivery verification pending instead of inventing zero coverage", () => {
  assert.ok(profile.includes("Institution presence is never used to infer programme delivery"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.ok(dashboard.includes("programme-offering-to-campus evidence"))
})
