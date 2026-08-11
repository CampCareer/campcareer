import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

test("Switzerland Phase 9 preserves Spain and Switzerland City route contracts together", () => {
  assert.match(routes, /PUBLISHED_ES_CITY_SLUGS/)
  assert.match(routes, /PUBLISHED_CH_CITY_SLUGS/)
  assert.match(routes, /madrid.*barcelona.*valencia.*sevilla.*granada.*malaga.*bilbao/)
  assert.match(routes, /zurich.*lausanne.*basel.*lugano.*fribourg.*geneva/)
  assert.match(routes, /esCityPath/)
  assert.match(routes, /chCityPath/)
})

test("Switzerland Phase 9 preserves Spain Compare while adding Switzerland Compare", () => {
  assert.match(comparePage, /getEsCityComparison/)
  assert.match(comparePage, /SpainCitiesCompareMatrix/)
  assert.match(comparePage, /countryCode === "ES"/)
  assert.match(comparePage, /getChCityComparison/)
  assert.match(comparePage, /SwitzerlandCitiesCompareMatrix/)
  assert.match(comparePage, /countryCode === "CH"/)
})

test("Switzerland Phase 9 preserves both Spain and Switzerland sitemap cohorts", () => {
  assert.match(sitemap, /PUBLISHED_ES_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_CH_CITY_SLUGS/)
  assert.match(sitemap, /\/cities\/es\/\$\{slug\}/)
  assert.match(sitemap, /\/cities\/ch\/\$\{slug\}/)
  assert.match(sitemap, /spainCityLastModified/)
  assert.match(sitemap, /switzerlandCityLastModified/)
})
