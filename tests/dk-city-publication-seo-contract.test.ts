import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import assert from "node:assert/strict"

const root = process.cwd()
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8")

test("Denmark city publication is limited to the five Tier A municipalities", () => {
  const routes = read("src/lib/cities/city-routes.ts")
  const page = read("src/app/(workspace)/cities/dk/[city]/page.tsx")
  const sitemap = read("src/app/sitemap.ts")
  const compare = read("src/app/(workspace)/compare/page.tsx")

  assert.match(routes, /PUBLISHED_DK_CITY_SLUGS = \["copenhagen", "frederiksberg", "odense", "aarhus", "aalborg"\]/)
  assert.doesNotMatch(routes, /PUBLISHED_DK_CITY_SLUGS[^\n]*lyngby/)
  assert.doesNotMatch(routes, /PUBLISHED_DK_CITY_SLUGS[^\n]*roskilde/)
  assert.doesNotMatch(routes, /PUBLISHED_DK_CITY_SLUGS[^\n]*sonderborg/)
  assert.doesNotMatch(routes, /PUBLISHED_DK_CITY_SLUGS[^\n]*kolding/)
  assert.doesNotMatch(routes, /PUBLISHED_DK_CITY_SLUGS[^\n]*esbjerg/)

  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /alternates: \{ canonical: `\/cities\/dk\/\$\{normalized\}` \}/)
  assert.match(page, /notFound\(\)/)

  assert.match(sitemap, /PUBLISHED_DK_CITY_SLUGS/)
  assert.match(sitemap, /`\$\{SITE_URL\}\/cities\/dk\/\$\{slug\}`/)
  assert.doesNotMatch(sitemap, /\/cities\/dk\/lyngby/)
  assert.doesNotMatch(sitemap, /\/cities\/dk\/roskilde/)

  assert.match(compare, /robots: \{ index: false, follow: false \}/)
})
