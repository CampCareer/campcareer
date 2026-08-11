import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const geography = readFileSync("supabase/migrations/20260811153500_normalize_ch_tier_a_city_geographies_v1.sql", "utf8")
const linkage = readFileSync("supabase/migrations/20260811153700_publish_ch_tier_a_city_read_models_v1.sql", "utf8")
const metrics = readFileSync("supabase/migrations/20260811153800_publish_ch_tier_a_city_metrics_v1.sql", "utf8")
const compare = readFileSync("src/lib/cities/ch-city-comparison.server.ts", "utf8")
const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/ch/[city]/page.tsx", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

const published = ["zurich", "lausanne", "basel", "lugano", "fribourg", "geneva"]

test("Switzerland Phase 8 locks the six-City geography and publication boundary", () => {
  assert.match(geography, /normalization expected 6 rows/)
  assert.match(routes, /PUBLISHED_CH_CITY_SLUGS = \["zurich", "lausanne", "basel", "lugano", "fribourg", "geneva"\]/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(sitemap, /PUBLISHED_CH_CITY_SLUGS/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
})

test("Switzerland Phase 8 keeps programme linkage at 170 with Lausanne at 10", () => {
  assert.match(linkage, /expected 170 rows/)
  assert.match(linkage, /Lausanne programme linkage expected 10/)
  assert.match(linkage, /EPFL/)
  assert.match(linkage, /security_invoker=true/)
  assert.match(linkage, /grant select on public\.city_directory_ch_v1 to service_role/)
})

test("Switzerland Phase 8 requires exactly 30 verified City metrics", () => {
  assert.match(metrics, /expected 30/)
  assert.match(metrics, /exactly five verified metrics/)
  assert.match(metrics, /city_specific/)
  assert.match(metrics, /third_country_students/)
})

test("Switzerland Phase 8 validates Compare without ranking a winner", () => {
  assert.match(compare, /bySlug\.get\("zurich"\)/)
  assert.match(compare, /bySlug\.get\("lausanne"\)/)
  assert.match(comparePage, /countryCode === "CH"/)
  assert.doesNotMatch(compare, /winnerScore|overallScore|bestCity/)
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
})
