import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/de/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profile = readFileSync("src/lib/cities/de-city-profile.server.ts", "utf8")

const published = ["berlin", "munich", "hamburg", "aachen", "bonn", "dresden", "heidelberg", "karlsruhe", "tuebingen"]
const deferred = ["frankfurt", "cologne", "leipzig", "muenster", "stuttgart", "freiburg"]

test("Germany publication allowlist remains exactly the nine approved city slugs", () => {
  assert.ok(routes.includes("PUBLISHED_DE_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) assert.doesNotMatch(routes, new RegExp(`PUBLISHED_DE_CITY_SLUGS = \\[.*"${slug}"`))
})

test("approved Germany city pages are indexable with country-specific canonical URLs", () => {
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("Study in ${name}, Germany"))
  assert.ok(page.includes("alternates: { canonical: `/cities/de/${normalized}` }"))
})

test("Germany city sitemap entries derive from the shared route allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_DE_CITY_SLUGS"))
  assert.ok(sitemap.includes('PUBLISHED_DE_CITY_SLUGS.map((slug) => ({ url: `${SITE_URL}/cities/de/${slug}`'))
  for (const slug of deferred) assert.doesNotMatch(sitemap, new RegExp(`/cities/de/${slug}`))
})

test("Compare remains non-indexable while profiles are published", () => {
  assert.ok(comparePage.includes("robots: { index: false, follow: false }"))
  assert.ok(comparePage.includes('countryCode === "DE"'))
})

test("publication does not convert institution presence into programme delivery", () => {
  assert.ok(profile.includes("programme delivery verification pending"))
  assert.ok(profile.includes("Institution or teaching-location presence is never used to infer programme delivery"))
  assert.doesNotMatch(profile, /\.from\("city_programme_directory_de_v1"\)/)
})
