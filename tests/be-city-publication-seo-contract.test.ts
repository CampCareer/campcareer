import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/be/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

const published = ["brussels", "ghent", "leuven", "antwerp", "louvain-la-neuve", "liege"]

test("Belgium publication keeps the exact six-city allowlist", () => {
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.ok(routes.includes("PUBLISHED_BE_CITY_SLUGS"))
})

test("Approved Belgium city profiles are indexable with country-specific canonical metadata", () => {
  assert.ok(page.includes("Study in ${name}, Belgium"))
  assert.ok(page.includes('alternates: { canonical: `/cities/be/${normalized}` }'))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
})

test("Belgium city sitemap entries derive from the published allowlist", () => {
  assert.ok(sitemap.includes("PUBLISHED_BE_CITY_SLUGS"))
  assert.ok(sitemap.includes('`${SITE_URL}/cities/be/${slug}`'))
  assert.ok(sitemap.includes('new Date("2026-08-10")'))
})

test("City Compare remains non-indexable in Phase 7", () => {
  const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
  assert.ok(comparePage.includes("robots: { index: false, follow: false }"))
})
