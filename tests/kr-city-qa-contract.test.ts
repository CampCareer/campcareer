import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const compareServer = fs.readFileSync("src/lib/cities/kr-city-comparison.server.ts", "utf8")
const compareMatrix = fs.readFileSync("src/app/(workspace)/compare/south-korea-cities-compare-matrix.tsx", "utf8")
const profilePage = fs.readFileSync("src/app/(workspace)/cities/kr/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const linkage = fs.readFileSync("supabase/migrations/20260811211057_publish_kr_tier_a_city_linkage_v1.sql", "utf8")
const metrics = fs.readFileSync("supabase/migrations/20260811211725_publish_kr_tier_a_city_metrics_v1.sql", "utf8")

const exactSlugs = ["seoul", "busan", "daejeon", "suwon", "yongin", "pohang"]

test("South Korea QA keeps one exact six-city publication and compare cohort", () => {
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(routes, /SUPPORTED_KR_CITY_SLUGS = PUBLISHED_KR_CITY_SLUGS/)
  assert.match(compareServer, /SUPPORTED_KR_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_KR_CITY_SLUGS/)
})

test("South Korea QA preserves strict programme locality boundaries", () => {
  assert.match(linkage, /KR strict city programme linkage expected 182 rows/)
  assert.match(linkage, /KR programme source-city mismatch detected/)
  assert.match(linkage, /KR non-Tier-A city leakage detected/)
  assert.match(linkage, /programme_assignment_verified/)
  assert.match(compareMatrix, /no inherited Seoul leakage from Suwon or Yongin/)
})

test("South Korea QA preserves five-metric methodology guards", () => {
  assert.match(metrics, /KR Tier A metrics expected 30 verified rows/)
  assert.match(metrics, /ranking_safe/)
  assert.match(metrics, /city_specific/)
  assert.match(metrics, /not_shortage_ranking/)
  assert.match(metrics, /not_job_guarantee/)
  assert.match(compareMatrix, /does not score a winner/)
})

test("South Korea QA preserves publication and compare SEO separation", () => {
  assert.match(profilePage, /robots: \{ index: true, follow: true \}/)
  assert.match(profilePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=KR/)
})
