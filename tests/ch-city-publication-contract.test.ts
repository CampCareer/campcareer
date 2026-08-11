import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/ch/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

const published = ["zurich", "lausanne", "basel", "lugano", "fribourg", "geneva"]
const deferred = ["neuchatel", "bern", "st-gallen", "lucerne"]

test("Switzerland Phase 7 publishes exactly the six locked City slugs", () => {
  assert.match(routes, /PUBLISHED_CH_CITY_SLUGS = \["zurich", "lausanne", "basel", "lugano", "fribourg", "geneva"\] as const/)
  assert.match(routes, /SUPPORTED_CH_CITY_SLUGS = PUBLISHED_CH_CITY_SLUGS/)
  assert.match(routes, /isPublishedChCitySlug/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) assert.doesNotMatch(routes, new RegExp(`PUBLISHED_CH_CITY_SLUGS[^\\n]*${slug}`))
})

test("Switzerland City profiles are indexable only through the publication allowlist", () => {
  assert.match(page, /PUBLISHED_CH_CITY_SLUGS/)
  assert.match(page, /isPublishedChCitySlug/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /alternates: \{ canonical: `\/cities\/ch\/\$\{normalized\}` \}/)
})

test("Switzerland root sitemap uses the same six-City publication authority", () => {
  assert.match(sitemap, /PUBLISHED_CH_CITY_SLUGS/)
  assert.match(sitemap, /PUBLISHED_CH_CITY_SLUGS\.map\(\(slug\) => \(\{ url: `\$\{SITE_URL\}\/cities\/ch\/\$\{slug\}`/)
  for (const slug of deferred) assert.doesNotMatch(sitemap, new RegExp(`/cities/ch/${slug}`))
})
