import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const comparison = readFileSync("src/lib/cities/us-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const compareMatrix = readFileSync("src/app/(workspace)/compare/united-states-cities-compare-matrix.tsx", "utf8")
const cityPage = readFileSync("src/app/(workspace)/cities/us/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/united-states-city-dashboard.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

const published = [
  "new-york",
  "boston",
  "los-angeles",
  "chicago",
  "seattle",
  "san-diego",
  "philadelphia",
  "tempe",
]

test("US city publication scope is exactly the approved eight named cities", () => {
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.ok(routes.includes("PUBLISHED_US_CITY_SLUGS"))
  assert.equal((routes.match(/export const PUBLISHED_US_CITY_SLUGS = \[/g) ?? []).length, 1)
  assert.doesNotMatch(routes, /san-francisco|washington-dc|austin|baltimore|ann-arbor|champaign|denton|west-lafayette/)
})

test("US city profiles are indexable only through the allowlist", () => {
  assert.ok(cityPage.includes("isPublishedUsCitySlug"))
  assert.ok(cityPage.includes("generateStaticParams"))
  assert.ok(cityPage.includes("robots: { index: true, follow: true }"))
  assert.ok(sitemap.includes("PUBLISHED_US_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/us/${slug}"))
})

test("US City and root Compare are bidirectionally linked", () => {
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "US", left: profile.slug })'))
  assert.ok(comparePage.includes('if (countryCode === "US")'))
  assert.ok(comparePage.includes("getUsCityComparison"))
  assert.ok(compareMatrix.includes('href={`/cities/us/${city.slug}`}'))
  assert.ok(compareMatrix.includes('countryCode="US"'))
})

test("US compare readiness requires five metrics and institution linkage, not invented programmes", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(comparison.includes(`"${key}"`))

  assert.ok(comparison.includes("profile.linkedCampusCount > 0"))
  assert.ok(comparison.includes("profile.linkedInstitutionCount > 0"))
  assert.doesNotMatch(comparison, /profile\.linkedProgramCount > 0/)
})

test("programme catalogue gap and F-1 qualification are explicit", () => {
  assert.ok(dashboard.includes("not presented as “0 programmes”"))
  assert.ok(compareMatrix.includes("Canonical U.S. programme catalogue pending"))
  assert.ok(compareMatrix.includes("Off-campus employment requires separate authorization"))
  assert.ok(dashboard.includes("off-campus work requires separate authorization"))
})

test("US city copy preserves named-city scope instead of metro inference", () => {
  assert.ok(dashboard.includes("named-city geography"))
  assert.ok(dashboard.includes("Neighbouring municipalities, boroughs and metro areas are not added"))
  assert.ok(compareMatrix.includes("Metro areas and neighbouring municipalities are not silently merged"))
})
