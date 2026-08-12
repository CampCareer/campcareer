import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/no/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

const published = ["oslo", "trondheim", "stavanger", "as", "tromso"]
const excluded = ["bodo", "kongsberg", "kristiansand", "bergen", "elverum"]

test("Norway Phase 7 publishes exactly five city routes", () => {
  assert.match(routes, /PUBLISHED_NO_CITY_SLUGS/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const slug of excluded) assert.doesNotMatch(routes.match(/PUBLISHED_NO_CITY_SLUGS = \[([^\]]+)\]/)?.[0] ?? "", new RegExp(`"${slug}"`))
  assert.match(routes, /SUPPORTED_NO_CITY_SLUGS = PUBLISHED_NO_CITY_SLUGS/)
  assert.match(routes, /isPublishedNoCitySlug/)
})

test("Norway Phase 7 publishes canonical metadata but rejects unsupported slugs", () => {
  assert.match(page, /PUBLISHED_NO_CITY_SLUGS/)
  assert.match(page, /isPublishedNoCitySlug/)
  assert.match(page, /index: true, follow: true/)
  assert.match(page, /index: false, follow: false/)
  assert.match(page, /canonical: `\/cities\/no\/\$\{normalized\}`/)
})

test("Norway Phase 7 sitemap contains only the published allowlist", () => {
  assert.match(sitemap, /PUBLISHED_NO_CITY_SLUGS/)
  assert.match(sitemap, /`\$\{SITE_URL\}\/cities\/no\/\$\{slug\}`/)
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
})
