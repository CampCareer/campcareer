import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/fi/[city]/page.tsx", "utf8")
const loader = fs.readFileSync("src/lib/cities/fi-city-profile.server.ts", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/finland-city-dashboard.tsx", "utf8")
const slugs = ["helsinki", "espoo", "tampere", "turku", "oulu", "jyvaskyla", "lappeenranta", "joensuu"]

test("Finland profile route is restricted to exactly eight published cities", () => {
  for (const slug of slugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(routes, /PUBLISHED_FI_CITY_SLUGS/)
  assert.match(page, /isPublishedFiCitySlug/)
  assert.match(page, /notFound\(\)/)
})

test("Finland Phase 7 publishes supported profiles but protects unsupported routes", () => {
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /alternates: \{ canonical: `\/cities\/fi\/\$\{normalized\}` \}/)
  assert.match(page, /City Compare/)
})

test("Finland profiles use verified read models and expose coverage gaps", () => {
  assert.match(loader, /city_directory_fi_v1/)
  assert.match(loader, /city_institution_directory_fi_v1/)
  assert.match(loader, /city_programme_directory_fi_v1/)
  assert.match(loader, /report_metric_evidence_city/)
  assert.match(dashboard, /selected ten-university core/)
  assert.match(dashboard, /Studyinfo organisation OID reconciliation remains pending/)
  assert.match(dashboard, /verified-partial programmes/)
  assert.match(dashboard, /not a shortage ranking/)
  assert.match(dashboard, /canonical `qualification_level_id` repair is still pending/)
})
