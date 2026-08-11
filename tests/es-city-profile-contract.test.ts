import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const loader = fs.readFileSync("src/lib/cities/es-city-profile.server.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/es/[city]/page.tsx", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/spain-city-dashboard.tsx", "utf8")

const exactSlugs = ["madrid", "barcelona", "valencia", "sevilla", "granada", "malaga", "bilbao"]

test("Spain profile route cohort remains exactly the seven Tier A slugs", () => {
  assert.match(routes, /PUBLISHED_ES_CITY_SLUGS = \["madrid", "barcelona", "valencia", "sevilla", "granada", "malaga", "bilbao"\] as const/)
  assert.match(routes, /SUPPORTED_ES_CITY_SLUGS = PUBLISHED_ES_CITY_SLUGS/)
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(routes, /return `\/cities\/es\/\$\{slug\}`/)
})

test("Spain published routes are indexable while unsupported routes remain excluded", () => {
  assert.match(page, /generateStaticParams/)
  assert.match(page, /PUBLISHED_ES_CITY_SLUGS/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /notFound\(\)/)
})

test("Spain profile loader consumes only the private Phase 3 and Phase 4 read models", () => {
  assert.match(loader, /from\("city_directory_es_v1"\)/)
  assert.match(loader, /from\("city_institution_directory_es_v1"\)/)
  assert.match(loader, /from\("city_programme_directory_es_v1"\)/)
  assert.match(loader, /from\("city_metric_directory_es_v1"\)/)
  assert.doesNotMatch(loader, /from\("campuses"\)/)
  assert.doesNotMatch(loader, /from\("programme_offerings"\)/)
})

test("Spain profile discloses pending programme verification and non-comparable cost methodology", () => {
  assert.match(loader, /Programme delivery verification pending/)
  assert.match(dashboard, /not a cheapest-city ranking/)
  assert.match(dashboard, /verification is pending, not that the city has no programmes/)
  assert.match(dashboard, /Official\/local context only, not a shortage ranking or job guarantee/)
})
