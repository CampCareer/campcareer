import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/ae/[city]/page.tsx", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const exactSlugs = ["abu-dhabi", "sharjah", "al-ain", "dubai"]

test("UAE publication allowlist contains exactly four approved City profiles", () => {
  assert.match(routes, /PUBLISHED_AE_CITY_SLUGS = \["abu-dhabi", "sharjah", "al-ain", "dubai"\] as const/)
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const excluded of ["khor-fakkan", "ajman", "fujairah", "ras-al-khaimah", "umm-al-quwain"]) {
    assert.ok(!routes.includes(`"${excluded}"`), `unexpected published slug ${excluded}`)
  }
})

test("UAE City profiles publish canonical metadata while unsupported routes remain excluded", () => {
  assert.match(page, /alternates: \{ canonical: `\/cities\/ae\/\$\{normalized\}` \}/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /isPublishedAeCitySlug/)
})

test("UAE sitemap derives City URLs from the exact published allowlist", () => {
  assert.match(sitemap, /PUBLISHED_AE_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_AE_CITY_SLUGS\.map\(\(slug\) => \(\{ url: `\$\{SITE_URL\}\/cities\/ae\/\$\{slug\}`/)
})

test("Parameterized Compare remains noindex and is not sitemap-published", () => {
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=AE/)
})
