import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const loader = readFileSync("src/lib/cities/ch-city-profile.server.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/ch/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/switzerland-city-dashboard.tsx", "utf8")

test("Switzerland Phase 5 supports exactly six City routes without publishing them", () => {
  assert.match(routes, /SUPPORTED_CH_CITY_SLUGS = \["zurich", "lausanne", "basel", "lugano", "fribourg", "geneva"\]/)
  assert.doesNotMatch(routes, /PUBLISHED_CH_CITY_SLUGS/)
  for (const excluded of ["neuchatel", "bern", "st-gallen", "lucerne"]) assert.doesNotMatch(routes, new RegExp(`SUPPORTED_CH_CITY_SLUGS[^\n]*${excluded}`))
  assert.match(page, /robots: \{ index: false, follow: true \}/)
  assert.match(page, /isSupportedChCitySlug/)
  assert.match(page, /notFound\(\)/)
})

test("Switzerland Phase 5 loader reads only verified City surfaces and five metrics", () => {
  for (const view of ["city_directory_ch_v1", "city_institution_directory_ch_v1", "city_programme_directory_ch_v1"]) assert.match(loader, new RegExp(view))
  for (const key of ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]) assert.match(loader, new RegExp(key))
  assert.match(loader, /EPFL's Lausanne-labelled programme cohort is deliberately excluded/)
  assert.match(loader, /verified_partial/)
})

test("Switzerland Phase 5 dashboard preserves disclosure and international evidence state", () => {
  assert.match(dashboard, /complete accredited Swiss higher-education universe/)
  assert.match(dashboard, /not a complete physical-campus inventory/)
  assert.match(dashboard, /EU\/EFTA cases can differ/)
  assert.match(dashboard, /International:/)
  assert.doesNotMatch(dashboard, /Compare Switzerland cities/)
})
