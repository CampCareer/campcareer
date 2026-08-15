import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/nl/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profile = readFileSync("src/lib/cities/nl-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/netherlands-city-dashboard.tsx", "utf8")

const published = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"]
const deferred = ["delft", "utrecht", "enschede", "tilburg", "leiden", "nijmegen", "wageningen", "the-hague"]

test("Netherlands SEO publication allowlist is exactly the approved five Tier A cities", () => {
  assert.match(
    routes,
    /PUBLISHED_NL_CITY_SLUGS = \["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"\] as const/,
  )
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NL_CITY_SLUGS = \\[.*"${slug}"`))
  }
})

test("approved Netherlands city pages are indexable and unsupported slugs remain noindex/not-found", () => {
  assert.ok(page.includes("isPublishedNlCitySlug"))
  assert.ok(page.includes("if (!isPublishedNlCitySlug(normalized)) notFound()"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
})

test("Netherlands city metadata is country-specific and canonical", () => {
  assert.ok(page.includes("Study in ${name}, Netherlands"))
  assert.ok(page.includes("student work context"))
  assert.ok(page.includes("alternates: { canonical: `/cities/nl/${normalized}` }"))
})

test("sitemap derives Netherlands city URLs from the route allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_NL_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_NL_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/nl/${slug}"))
  for (const slug of deferred) assert.doesNotMatch(sitemap, new RegExp(`/cities/nl/${slug}`))
})

test("Compare remains a noindex decision surface while supporting Netherlands city comparison", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(comparePage.includes('if (countryCode === "NL")'))
})

test("publication keeps programme-delivery and HBO coverage gaps explicit", () => {
  assert.ok(profile.includes("explicit verified offering-to-campus link"))
  assert.ok(profile.includes("Dutch HBO providers remain an explicit expansion gap"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.ok(dashboard.includes("verified research-university institutions"))
})

test("publication preserves Netherlands metric methodology disclosures", () => {
  assert.ok(profile.includes("cbs_municipality"))
  assert.ok(profile.includes("source_native_period"))
  assert.ok(profile.includes("city_specific"))
  assert.ok(dashboard.includes("National baseline"))
  assert.ok(dashboard.includes("The employer needs a TWV"))
})
