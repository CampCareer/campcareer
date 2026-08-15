import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const loader = fs.readFileSync("src/lib/cities/ae-city-profile.server.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/ae/[city]/page.tsx", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/uae-city-dashboard.tsx", "utf8")

const expected = ["abu-dhabi", "sharjah", "al-ain", "dubai"] as const
const deferred = ["khor-fakkan", "ajman", "fujairah"] as const

test("UAE publication exposes exactly four indexed City routes", () => {
  assert.match(routes, /PUBLISHED_AE_CITY_SLUGS = \["abu-dhabi", "sharjah", "al-ain", "dubai"\] as const/)
  assert.match(routes, /SUPPORTED_AE_CITY_SLUGS = PUBLISHED_AE_CITY_SLUGS/)
  assert.match(routes, /return `\/cities\/ae\/\$\{slug\}`/)
  assert.match(page, /PUBLISHED_AE_CITY_SLUGS\.map/)
  assert.match(page, /isPublishedAeCitySlug/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  for (const slug of expected) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const slug of deferred) assert.ok(!routes.match(new RegExp(`PUBLISHED_AE_CITY_SLUGS[^\n]*${slug}`)), `deferred route leaked: ${slug}`)
})

test("UAE loader reads only UAE City read models and preserves conservative disclosures", () => {
  assert.match(loader, /city_directory_ae_v1/)
  assert.match(loader, /city_institution_directory_ae_v1/)
  assert.match(loader, /city_programme_directory_ae_v1/)
  assert.match(loader, /city_metric_directory_ae_v1/)
  assert.match(loader, /verified_partial/)
  assert.match(loader, /not the complete UAE higher-education market/)
  assert.match(dashboard, /Emirate totals are not relabelled as City population/)
  assert.match(dashboard, /ECAE is retained as a verified Abu Dhabi physical location/)
  assert.match(dashboard, /Fakeeh College for Medical Sciences – Dubai is excluded/)
  assert.match(dashboard, /Accreditation and current international admission remain separate evidence dimensions/)
})
