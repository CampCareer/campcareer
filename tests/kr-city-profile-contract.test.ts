import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const loader = fs.readFileSync("src/lib/cities/kr-city-profile.server.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/kr/[city]/page.tsx", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/korea-city-dashboard.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const exactPublished = '["seoul", "busan", "daejeon", "suwon", "yongin", "pohang"]'

test("Korea publication locks exactly six supported City routes", () => {
  assert.ok(routes.includes(`PUBLISHED_KR_CITY_SLUGS = ${exactPublished}`))
  assert.ok(routes.includes("SUPPORTED_KR_CITY_SLUGS = PUBLISHED_KR_CITY_SLUGS"))
  assert.ok(routes.includes("isPublishedKrCitySlug"))
  assert.ok(routes.includes("/cities/kr/${slug}"))
})

test("Korea profile loader consumes only the Phase 3 and 4 city read models", () => {
  for (const view of [
    "city_directory_kr_v1",
    "city_institution_directory_kr_v1",
    "city_programme_directory_kr_v1",
    "city_metric_directory_kr_v1",
  ]) assert.ok(loader.includes(`.from("${view}")`), `missing ${view}`)

  assert.ok(!loader.includes('.from("catalog.campuses")'))
  assert.ok(!loader.includes('.from("catalog.programme_offerings")'))
  assert.ok(!loader.includes('.from("public.program_catalog_kr_staging")'))
})

test("published Korea profiles are indexable and reject unsupported slugs", () => {
  assert.ok(page.includes("PUBLISHED_KR_CITY_SLUGS.map"))
  assert.ok(page.includes("isPublishedKrCitySlug"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("notFound()"))
  assert.ok(page.includes("/cities/kr/${normalized}"))
  assert.ok(page.includes("buildCityCompareCanonicalHref"))
})

test("Korea publication promotes sitemap and Compare while preserving metric limits", () => {
  assert.ok(sitemap.includes("PUBLISHED_KR_CITY_SLUGS"))
  assert.ok(sitemap.includes("/cities/kr/${slug}"))
  assert.ok(page.includes('country: "KR"'))
  assert.ok(page.includes("Compare {profile.name}"))
  assert.ok(dashboard.includes("National Study in Korea baseline · not city-specific · not ranking-safe"))
  assert.ok(dashboard.includes("not a shortage ranking or job guarantee"))
  assert.ok(dashboard.includes("not an automatic entitlement"))
})
