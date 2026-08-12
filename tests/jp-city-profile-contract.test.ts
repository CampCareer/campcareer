import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const loader = fs.readFileSync("src/lib/cities/jp-city-profile.server.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/jp/[city]/page.tsx", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/japan-city-dashboard.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const exactSlugs = ["tokyo", "kyoto", "nagoya", "sendai", "suita", "tsukuba", "fukuoka"]

test("Japan Phase 5 supports exactly seven non-published Tier A routes", () => {
  assert.match(routes, /SUPPORTED_JP_CITY_SLUGS = \["tokyo", "kyoto", "nagoya", "sendai", "suita", "tsukuba", "fukuoka"\] as const/)
  assert.doesNotMatch(routes, /PUBLISHED_JP_CITY_SLUGS/)
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(routes, /return `\/cities\/jp\/\$\{slug\}`/)
})

test("Japan Phase 5 keeps supported routes noindex and unsupported routes excluded", () => {
  assert.match(page, /SUPPORTED_JP_CITY_SLUGS/)
  assert.match(page, /robots: \{ index: false, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /notFound\(\)/)
  assert.doesNotMatch(sitemap, /PUBLISHED_JP_CITY_SLUGS/)
  assert.doesNotMatch(sitemap, /cities\/jp/)
})

test("Japan profile loader consumes only the four private city read models", () => {
  assert.match(loader, /from\("city_directory_jp_v1"\)/)
  assert.match(loader, /from\("city_institution_directory_jp_v1"\)/)
  assert.match(loader, /from\("city_programme_directory_jp_v1"\)/)
  assert.match(loader, /from\("city_metric_directory_jp_v1"\)/)
  assert.doesNotMatch(loader, /from\("campuses"\)/)
  assert.doesNotMatch(loader, /from\("programme_offerings"\)/)
})

test("Japan profile discloses pending programmes and metric methodology guards", () => {
  assert.match(loader, /Programme delivery verification pending/)
  assert.match(dashboard, /not a cheapest-city ranking/)
  assert.match(dashboard, /verification is pending, not that the city has no programmes/)
  assert.match(dashboard, /not a shortage ranking or job guarantee/)
  assert.match(dashboard, /no synthetic monthly normalization/)
})
