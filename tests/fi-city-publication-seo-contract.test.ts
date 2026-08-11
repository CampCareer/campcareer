import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/fi/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const compare = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const published = ["helsinki", "espoo", "tampere", "turku", "oulu", "jyvaskyla", "lappeenranta", "joensuu"]
const excluded = ["kuopio", "vaasa", "rovaniemi", "vantaa", "lahti"]

test("Finland Phase 7 indexes exactly the approved city cohort", () => {
  assert.match(routes, /PUBLISHED_FI_CITY_SLUGS/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const slug of excluded) assert.doesNotMatch(routes, new RegExp(`"${slug}"`))
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
})

test("Finland sitemap derives directly from the publication allowlist", () => {
  assert.match(sitemap, /PUBLISHED_FI_CITY_SLUGS/)
  assert.match(sitemap, /`\$\{SITE_URL\}\/cities\/fi\/\$\{slug\}`/)
  for (const slug of excluded) assert.doesNotMatch(sitemap, new RegExp(`/cities/fi/${slug}`))
})

test("Parameterized Compare remains noindex", () => {
  assert.match(compare, /robots: \{ index: false, follow: false \}/)
})
