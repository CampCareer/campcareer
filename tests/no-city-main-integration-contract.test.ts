import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const phase6 = fs.readFileSync("docs/data-foundation/no-city-compare-v1.md", "utf8")
const phase7 = fs.readFileSync("docs/data-foundation/no-city-publication-v1.md", "utf8")
const phase8 = fs.readFileSync("docs/data-foundation/no-city-qa-v1.md", "utf8")
const phase9 = fs.readFileSync("docs/data-foundation/no-city-main-integration-v1.md", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const cohort = ["oslo", "trondheim", "stavanger", "as", "tromso"]

test("Norway Phase 6 through 9 completion markers are present", () => {
  assert.match(phase6, /PHASE_6_COMPLETE/)
  assert.match(phase7, /PHASE_7_COMPLETE/)
  assert.match(phase8, /PHASE_8_COMPLETE/)
  assert.match(phase9, /PHASE_9_COMPLETE/)
  assert.match(phase9, /MAIN_READY_WITH_EXTERNAL_CI_LIMIT/)
})

test("Norway Phase 9 records the authoritative main and no-behind reconciliation", () => {
  assert.match(phase9, /b1bacadc840d0fb9c67e1ec8b4ab95889df27e63/)
  assert.match(phase9, /`0` commits behind main/)
  assert.match(phase9, /does not merge the branch into main/)
})

test("Norway Phase 9 keeps shared hooks minimal and the cohort consistent", () => {
  assert.match(comparePage, /getNoCityComparison/)
  assert.match(comparePage, /NorwayCitiesCompareMatrix/)
  assert.match(comparePage, /countryCode === "NO"/)
  assert.match(routes, /PUBLISHED_NO_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_NO_CITY_SLUGS/)
  for (const slug of cohort) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
})
