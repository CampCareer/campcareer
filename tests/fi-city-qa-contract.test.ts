import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/fi/[city]/page.tsx", "utf8")
const compareServer = fs.readFileSync("src/lib/cities/fi-city-comparison.server.ts", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const readModels = fs.readFileSync("supabase/migrations/20260811023312_publish_fi_tier_a_city_read_models_v1.sql", "utf8")
const metrics = fs.readFileSync("supabase/migrations/20260811023616_publish_fi_tier_a_city_metrics_v1.sql", "utf8")

const published = ["helsinki", "espoo", "tampere", "turku", "oulu", "jyvaskyla", "lappeenranta", "joensuu"]
const excluded = ["kuopio", "vaasa", "rovaniemi", "vantaa", "lahti"]

test("Finland Phase 8 keeps exactly eight published cities", () => {
  assert.match(routes, /PUBLISHED_FI_CITY_SLUGS/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const slug of excluded) assert.doesNotMatch(routes, new RegExp(`"${slug}"`))
  assert.match(page, /index: true, follow: true/)
  assert.match(page, /index: false, follow: false/)
  assert.match(sitemap, /PUBLISHED_FI_CITY_SLUGS/)
})

test("Finland Phase 8 preserves five-metric Compare readiness", () => {
  for (const key of ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]) {
    assert.ok(compareServer.includes(`"${key}"`), `missing ${key}`)
  }
  assert.match(compareServer, /linked_campus_count/)
  assert.match(compareServer, /linked_institution_count/)
  assert.match(comparePage, /countryCode === "FI"/)
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
})

test("Finland Phase 8 keeps service-role-only security and exact metric cardinality", () => {
  assert.match(readModels, /security_invoker=true/)
  assert.match(readModels, /revoke all on public\.city_directory_fi_v1 from public,anon,authenticated/)
  assert.match(readModels, /grant select on public\.city_directory_fi_v1 to service_role/)
  assert.match(metrics, /expected 40/)
  assert.match(metrics, /five verified metrics/)
})
