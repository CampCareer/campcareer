import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/es/[city]/page.tsx", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const exactSlugs = ["madrid", "barcelona", "valencia", "sevilla", "granada", "malaga", "bilbao"]

test("Spain publication allowlist contains exactly seven approved city profiles", () => {
  assert.match(routes, /PUBLISHED_ES_CITY_SLUGS = \["madrid", "barcelona", "valencia", "sevilla", "granada", "malaga", "bilbao"\] as const/)
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const excluded of ["leioa", "cerdanyola-del-valles", "cadiz", "ciudad-real"]) {
    assert.ok(!routes.includes(`"${excluded}"`), `unexpected published slug ${excluded}`)
  }
})

test("Spain city profiles publish canonical metadata while unsupported routes remain excluded", () => {
  assert.match(page, /alternates: \{ canonical: `\/cities\/es\/\$\{normalized\}` \}/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /isPublishedEsCitySlug/)
})

test("Spain sitemap derives city URLs from the exact published allowlist", () => {
  assert.match(sitemap, /PUBLISHED_ES_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_ES_CITY_SLUGS\.map\(\(slug\) => \(\{ url: `\$\{SITE_URL\}\/cities\/es\/\$\{slug\}`/)
})

test("Parameterized Compare remains noindex and is not sitemap-published", () => {
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=ES/)
})
