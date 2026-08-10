import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/se/[city]/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

const slugs = ["stockholm", "gothenburg", "uppsala", "lund", "linkoping", "umea"]
const excluded = ["malmo", "lulea", "vaxjo", "kalmar", "orebro", "karlstad", "jonkoping"]

test("Sweden publication indexes exactly the six approved city profiles", () => {
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /Study in \$\{name\}, Sweden/)
  assert.match(sitemap, /PUBLISHED_SE_CITY_SLUGS/)
  assert.match(sitemap, /`\$\{SITE_URL\}\/cities\/se\/\$\{slug\}`/)
  for (const slug of slugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
})

test("Sweden provider-expansion cities do not leak into the city allowlist or sitemap", () => {
  for (const slug of excluded) {
    assert.ok(!routes.includes(`"${slug}"`), `unexpected route ${slug}`)
    assert.ok(!sitemap.includes(`/cities/se/${slug}`), `unexpected sitemap city ${slug}`)
  }
})

test("parameterized Compare remains noindex", () => {
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
})
