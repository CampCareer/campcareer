import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/fr/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profile = readFileSync("src/lib/cities/fr-city-profile.server.ts", "utf8")

const published = ["paris", "paris-saclay", "bordeaux", "strasbourg", "grenoble", "aix-marseille", "nice"]
const deferred = ["lyon", "toulouse", "lille", "montpellier", "rennes", "nantes", "talence", "saint-aubin", "saint-martin-dheres", "marseille"]

test("France SEO publication allowlist is exactly the approved seven Tier A destinations", () => {
  assert.ok(routes.includes("PUBLISHED_FR_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) assert.doesNotMatch(routes, new RegExp(`PUBLISHED_FR_CITY_SLUGS = \\[.*"${slug}"`))
})

test("approved France city pages are indexable and unsupported slugs remain noindex/not-found", () => {
  assert.ok(page.includes("isPublishedFrCitySlug"))
  assert.ok(page.includes("if (!isPublishedFrCitySlug(normalized)) notFound()"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
})

test("France city metadata is country-specific and canonical", () => {
  assert.ok(page.includes("Study in ${name}, France"))
  assert.ok(page.includes("France student-work context"))
  assert.ok(page.includes("alternates: { canonical: `/cities/fr/${normalized}` }"))
})

test("sitemap derives France city URLs from the route allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_FR_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_FR_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/fr/${slug}"))
  for (const slug of deferred) assert.doesNotMatch(sitemap, new RegExp(`/cities/fr/${slug}`))
})

test("Compare remains noindex while supporting France city comparison", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(comparePage.includes('if (countryCode === "FR")'))
})

test("publication keeps programme delivery pending", () => {
  assert.ok(profile.includes("Institution or teaching-location presence is never used to infer city programme availability"))
})
