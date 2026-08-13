import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/no/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const compareServer = fs.readFileSync("src/lib/cities/no-city-comparison.server.ts", "utf8")
const compareMatrix = fs.readFileSync("src/app/(workspace)/compare/norway-cities-compare-matrix.tsx", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const readModels = fs.readFileSync("supabase/migrations/20260811125400_publish_no_tier_a_city_read_models_v1.sql", "utf8")
const metrics = fs.readFileSync("supabase/migrations/20260811125500_publish_no_tier_a_city_metrics_v1.sql", "utf8")

const published = ["oslo", "trondheim", "stavanger", "as", "tromso"]
const excluded = ["bodo", "kongsberg", "kristiansand", "bergen", "elverum"]
const metricKeys = ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]

test("Norway Phase 8 locks five published cities and excludes the deferred cohort", () => {
  const publishedBlock = routes.match(/PUBLISHED_NO_CITY_SLUGS = \[([^\]]+)\] as const/)?.[1] ?? ""
  for (const slug of published) assert.ok(publishedBlock.includes(`"${slug}"`), `missing ${slug}`)
  for (const slug of excluded) assert.ok(!publishedBlock.includes(`"${slug}"`), `unexpected ${slug}`)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(sitemap, /PUBLISHED_NO_CITY_SLUGS/)
})

test("Norway Phase 8 preserves exact linkage and service-role read-model security", () => {
  assert.match(readModels, /NO_STUDYINNORWAY/)
  assert.match(readModels, /lower\(trim\(s\.city\)\)=lower\(trim\(g\.name\)\)/)
  assert.match(readModels, /programme_assignment_verified/)
  assert.match(readModels, /security_invoker=true/)
  assert.match(readModels, /revoke all on public\.city_institution_directory_no_v1 from public,anon,authenticated/)
  assert.match(readModels, /grant select on public\.city_institution_directory_no_v1 to service_role/)
})

test("Norway Phase 8 requires exactly five verified metric families per city", () => {
  for (const key of metricKeys) assert.ok(metrics.includes(`'${key}'`) || metrics.includes(`:${key}`), `missing ${key}`)
  assert.match(metrics, /expected 25/)
  assert.match(compareServer, /REQUIRED_METRIC_KEYS/)
  assert.match(compareServer, /linked_campus_count/)
  assert.match(compareServer, /linked_institution_count/)
})

test("Norway Phase 8 keeps Compare non-indexed and evidence caveats intact", () => {
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
  assert.match(comparePage, /countryCode === "NO"/)
  assert.match(compareMatrix, /does not score a winner/)
  assert.match(compareMatrix, /not city rankings/)
  assert.match(compareMatrix, /source-native/)
  assert.match(compareMatrix, /verified-partial/)
})
