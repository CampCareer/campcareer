import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/kr/[city]/page.tsx", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8")

const exactSlugs = ["seoul", "busan", "daejeon", "suwon", "yongin", "pohang"]

test("South Korea publication allowlist contains exactly six approved city profiles", () => {
  assert.match(routes, /PUBLISHED_KR_CITY_SLUGS = \["seoul", "busan", "daejeon", "suwon", "yongin", "pohang"\] as const/)
  assert.match(routes, /SUPPORTED_KR_CITY_SLUGS = PUBLISHED_KR_CITY_SLUGS/)
  for (const slug of exactSlugs) assert.ok(routes.includes(`"${slug}"`), `missing ${slug}`)
  for (const excluded of ["cheonan", "goyang", "incheon", "daegu", "gwangju", "ulsan", "jeonju", "jeju", "sejong"]) assert.ok(!routes.includes(`"${excluded}"`), `unexpected published slug ${excluded}`)
})

test("South Korea city profiles publish canonical metadata while unsupported routes remain excluded", () => {
  assert.match(page, /alternates: \{ canonical: `\/cities\/kr\/\$\{normalized\}` \}/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /isPublishedKrCitySlug/)
})

test("South Korea sitemap derives city URLs from the exact published allowlist", () => {
  assert.match(sitemap, /PUBLISHED_KR_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_KR_CITY_SLUGS\.map\(\(slug\) => \(\{ url: `\$\{SITE_URL\}\/cities\/kr\/\$\{slug\}`/)
})

test("Parameterized Compare remains noindex and is not sitemap-published", () => {
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(sitemap, /type=city&country=KR/)
})
