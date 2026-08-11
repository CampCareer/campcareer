import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const preservedCompareCountries = ["AU", "BE", "CA", "DE", "DK", "ES", "FI", "FR", "NL", "NZ", "SE", "UK", "US"]
const preservedPublishedCityConstants = [
  "PUBLISHED_BE_CITY_SLUGS",
  "PUBLISHED_DE_CITY_SLUGS",
  "PUBLISHED_DK_CITY_SLUGS",
  "PUBLISHED_ES_CITY_SLUGS",
  "PUBLISHED_FI_CITY_SLUGS",
  "PUBLISHED_FR_CITY_SLUGS",
  "PUBLISHED_NL_CITY_SLUGS",
  "PUBLISHED_NZ_CITY_SLUGS",
  "PUBLISHED_SE_CITY_SLUGS",
  "PUBLISHED_UK_CITY_SLUGS",
  "PUBLISHED_US_CITY_SLUGS",
]

test("South Korea Phase 9 preserves all pre-existing shared City Compare countries", () => {
  for (const country of preservedCompareCountries) assert.ok(comparePage.includes(`countryCode === "${country}"`), `shared Compare country lost: ${country}`)
  assert.match(comparePage, /countryCode === "KR"/)
})

test("South Korea Phase 9 preserves pre-existing published city route constants", () => {
  for (const constant of preservedPublishedCityConstants) {
    assert.ok(routes.includes(constant), `shared city route constant lost: ${constant}`)
    assert.ok(sitemap.includes(constant), `shared sitemap constant lost: ${constant}`)
  }
  assert.match(routes, /PUBLISHED_KR_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_KR_CITY_SLUGS/)
})

test("South Korea Phase 9 keeps release actions outside the application contract", () => {
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=KR/)
})
