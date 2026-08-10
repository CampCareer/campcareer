import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const foundation = fs.readFileSync("supabase/migrations/20260810215750_normalize_se_tier_a_city_geographies_v1.sql", "utf8")
const linkage = fs.readFileSync("supabase/migrations/20260810220002_publish_se_tier_a_city_linkage_v1.sql", "utf8")
const metrics = fs.readFileSync("supabase/migrations/20260810220332_publish_se_tier_a_city_metrics_v1.sql", "utf8")
const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = fs.readFileSync("src/lib/cities/se-city-profile.server.ts", "utf8")
const comparison = fs.readFileSync("src/lib/cities/se-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/sweden-cities-compare-matrix.tsx", "utf8")
const cityPage = fs.readFileSync("src/app/(workspace)/cities/se/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const slugs = ["stockholm", "gothenburg", "uppsala", "lund", "linkoping", "umea"]

test("Sweden QA preserves exact Tier A geography and source-city linkage", () => {
  for (const slug of slugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(foundation, /scb_municipality/)
  assert.match(linkage, /SE_UKA_UNIVERSITY_NAME/)
  assert.match(linkage, /SE_UNIVERSITYADMISSIONS/)
  assert.match(linkage, /programme_assignment_verified/)
  assert.match(linkage, /lower\(trim\(s\.city\)\)=lower\(trim\(g\.name\)\)/)
})

test("Sweden QA preserves five verified metrics and non-ranking semantics", () => {
  for (const key of ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]) {
    assert.ok(metrics.includes(`'${key}'`), `missing metric ${key}`)
  }
  assert.match(profile, /citySpecific/)
  assert.match(matrix, /not city-specific and not ranked/)
  assert.match(matrix, /Source-native product and validity period/)
  assert.match(matrix, /does not score a winner/)
})

test("Sweden QA preserves service-only read models and profile-to-compare publication", () => {
  for (const view of ["city_directory_se_v1", "city_institution_directory_se_v1", "city_programme_directory_se_v1"]) {
    assert.ok(linkage.includes(view), `missing ${view}`)
  }
  assert.match(linkage, /security_invoker=true/)
  assert.match(linkage, /revoke all on public\.city_directory_se_v1 from public,anon,authenticated/)
  assert.match(comparison, /PUBLISHED_SE_CITY_SLUGS/)
  assert.match(cityPage, /robots: \{ index: true, follow: true \}/)
  assert.match(cityPage, /robots: \{ index: false, follow: false \}/)
  assert.match(sitemap, /PUBLISHED_SE_CITY_SLUGS\.map/)
})
