import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/nz/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profile = readFileSync("src/lib/cities/nz-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/new-zealand-city-dashboard.tsx", "utf8")

const published = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"]
const deferred = ["palmerston-north", "lincoln", "tauranga"]

test("New Zealand SEO publication allowlist is exactly the approved five Tier A cities", () => {
  assert.match(
    routes,
    /PUBLISHED_NZ_CITY_SLUGS = \["auckland", "christchurch", "hamilton", "wellington", "dunedin"\] as const/,
  )
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NZ_CITY_SLUGS = \\[.*"${slug}"`))
  }
})

test("approved New Zealand city pages are indexable and unsupported slugs remain noindex/not-found", () => {
  assert.ok(page.includes("isPublishedNzCitySlug"))
  assert.ok(page.includes("if (!isPublishedNzCitySlug(normalized)) notFound()"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
})

test("New Zealand city metadata is country-specific and canonical", () => {
  assert.ok(page.includes("Study in ${name}, New Zealand"))
  assert.ok(page.includes("student-visa work context"))
  assert.ok(page.includes("alternates: { canonical: `/cities/nz/${normalized}` }"))
})

test("sitemap derives New Zealand city URLs from the route allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_NZ_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_NZ_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/nz/${slug}"))
  for (const slug of deferred) assert.doesNotMatch(sitemap, new RegExp(`/cities/nz/${slug}`))
})

test("Compare remains a noindex decision surface while supporting New Zealand city comparison", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(comparePage.includes('if (countryCode === "NZ")'))
})

test("publication keeps programme-delivery verification pending instead of inventing zero coverage", () => {
  assert.ok(profile.includes("Institution or campus presence is never used to infer programme delivery"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.ok(dashboard.includes("initial verified teaching-campus set"))
})
