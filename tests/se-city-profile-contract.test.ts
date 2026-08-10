import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/se/[city]/page.tsx", "utf8")
const loader = fs.readFileSync("src/lib/cities/se-city-profile.server.ts", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/sweden-city-dashboard.tsx", "utf8")

const slugs = ["stockholm", "gothenburg", "uppsala", "lund", "linkoping", "umea"]

test("Sweden profile route is restricted to the six Tier A cities", () => {
  for (const slug of slugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  assert.match(routes, /PUBLISHED_SE_CITY_SLUGS/)
  assert.match(page, /isPublishedSeCitySlug/)
  assert.match(page, /notFound\(\)/)
})

test("Sweden profile preserves unsupported-route noindex protection", () => {
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /alternates: \{ canonical: `\/cities\/se\/\$\{normalized\}` \}/)
})

test("Sweden profile uses verified read models and exposes coverage gaps", () => {
  assert.match(loader, /city_directory_se_v1/)
  assert.match(loader, /city_institution_directory_se_v1/)
  assert.match(loader, /city_programme_directory_se_v1/)
  assert.match(loader, /report_metric_evidence_city/)
  assert.match(dashboard, /selected ten-university core/)
  assert.match(dashboard, /not a shortage ranking/)
  assert.match(dashboard, /verified-partial programmes/)
})
