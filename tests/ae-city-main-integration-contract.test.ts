import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const phase9 = fs.readFileSync("docs/data-foundation/ae-city-main-integration-v1.md", "utf8")

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

test("UAE Phase 9 preserves all pre-existing shared City Compare countries", () => {
  for (const country of preservedCompareCountries) {
    assert.ok(comparePage.includes(`countryCode === "${country}"`), `shared Compare country lost: ${country}`)
  }
  assert.match(comparePage, /countryCode === "AE"/)
  assert.match(comparePage, /SingaporeCityStateDecision/)
})

test("UAE Phase 9 preserves pre-existing published City route constants", () => {
  for (const constant of preservedPublishedCityConstants) {
    assert.ok(routes.includes(constant), `shared City route constant lost: ${constant}`)
    assert.ok(sitemap.includes(constant), `shared sitemap constant lost: ${constant}`)
  }
  assert.match(routes, /PUBLISHED_AE_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_AE_CITY_SLUGS/)
})

test("UAE Phase 9 records a current-main candidate with no release side effect", () => {
  assert.match(phase9, /CURRENT_MAIN_CANDIDATE/)
  assert.match(phase9, /behind main: `0`/)
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=AE/)
})
