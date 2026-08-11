import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const compareServer = fs.readFileSync("src/lib/cities/es-city-comparison.server.ts", "utf8")
const compareMatrix = fs.readFileSync("src/app/(workspace)/compare/spain-cities-compare-matrix.tsx", "utf8")
const profilePage = fs.readFileSync("src/app/(workspace)/cities/es/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const linkage = fs.readFileSync("supabase/migrations/20260811140230_publish_es_tier_a_city_linkage_v1.sql", "utf8")
const metrics = fs.readFileSync("supabase/migrations/20260811141418_publish_es_tier_a_city_metrics_v1.sql", "utf8")

const exactSlugs = ["madrid", "barcelona", "valencia", "sevilla", "granada", "malaga", "bilbao"]

test("Spain QA keeps one exact seven-city publication and compare cohort", () => {
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(routes, /SUPPORTED_ES_CITY_SLUGS = PUBLISHED_ES_CITY_SLUGS/)
  assert.match(compareServer, /SUPPORTED_ES_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_ES_CITY_SLUGS/)
})

test("Spain QA preserves strict programme locality boundaries", () => {
  assert.match(linkage, /ES strict city programme linkage expected 97 rows/)
  assert.match(linkage, /ES programme source-city mismatch detected/)
  assert.match(linkage, /ES locality-to-destination programme leakage detected/)
  assert.ok(linkage.includes("city_slug='bilbao'") && linkage.includes("Euskal Herriko Unibertsitatea (EHU)"))
  assert.ok(linkage.includes("city_slug='barcelona'") && linkage.includes("Universitat Autònoma de Barcelona"))
})

test("Spain QA preserves five-metric methodology guards", () => {
  assert.match(metrics, /ES Tier A metrics expected 35 verified rows/)
  assert.match(metrics, /ranking_safe/)
  assert.match(metrics, /not_shortage_ranking/)
  assert.match(metrics, /not_job_guarantee/)
  assert.match(compareMatrix, /does not score a winner/)
})

test("Spain QA preserves publication and compare SEO separation", () => {
  assert.match(profilePage, /robots: \{ index: true, follow: true \}/)
  assert.match(profilePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=ES/)
})
