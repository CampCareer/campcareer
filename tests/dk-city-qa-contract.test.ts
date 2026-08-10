import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import assert from "node:assert/strict"

const root = process.cwd()
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8")

test("Denmark city rollout Phases 2-7 stay internally consistent", () => {
  const routes = read("src/lib/cities/city-routes.ts")
  const profile = read("src/lib/cities/dk-city-profile.server.ts")
  const compare = read("src/lib/cities/dk-city-comparison.server.ts")
  const matrix = read("src/app/(workspace)/compare/denmark-cities-compare-matrix.tsx")
  const page = read("src/app/(workspace)/cities/dk/[city]/page.tsx")
  const sitemap = read("src/app/sitemap.ts")
  const linkage = read("docs/data-foundation/dk-city-institution-programme-linkage-v1.md")
  const metrics = read("docs/data-foundation/dk-city-metrics-v1.md")

  assert.match(routes, /copenhagen.*frederiksberg.*odense.*aarhus.*aalborg/)
  assert.match(profile, /city_directory_dk_v1/)
  assert.match(profile, /city_institution_directory_dk_v1/)
  assert.match(profile, /city_programme_directory_dk_v1/)
  assert.match(profile, /review_status", "verified/)
  assert.match(linkage, /115/)
  assert.match(linkage, /verified partial/i)
  assert.match(metrics, /25 verified rows/i)
  assert.match(metrics, /90 hours per month/i)
  assert.match(compare, /REQUIRED_METRIC_KEYS/)
  assert.match(matrix, /national baseline/)
  assert.match(matrix, /Verified-partial programmes/)
  assert.match(page, /index: true, follow: true/)
  assert.match(sitemap, /PUBLISHED_DK_CITY_SLUGS/)
  assert.doesNotMatch(sitemap, /\/cities\/dk\/lyngby/)
})
