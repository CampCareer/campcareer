import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const routes = fs.readFileSync("src/lib/cities/city-routes.ts", "utf8")
const loader = fs.readFileSync("src/lib/cities/no-city-profile.server.ts", "utf8")
const page = fs.readFileSync("src/app/(workspace)/cities/no/[city]/page.tsx", "utf8")
const dashboard = fs.readFileSync("src/app/(workspace)/cities/norway-city-dashboard.tsx", "utf8")

const supported = ["oslo", "trondheim", "stavanger", "as", "tromso"]

test("Norway City profiles retain exactly five supported routes after publication", () => {
  const match = routes.match(/PUBLISHED_NO_CITY_SLUGS = \[([^\]]+)\] as const/)
  assert.ok(match)
  for (const slug of supported) assert.ok(match[1].includes(`"${slug}"`), `missing ${slug}`)
  for (const excluded of ["bodo", "kongsberg", "kristiansand", "bergen", "elverum"]) {
    assert.ok(!match[1].includes(`"${excluded}"`), `unexpected ${excluded}`)
  }
  assert.match(routes, /SUPPORTED_NO_CITY_SLUGS = PUBLISHED_NO_CITY_SLUGS/)
  assert.match(routes, /return `\/cities\/no\/\$\{slug\}`/)
})

test("Norway City routes use the publication contract", () => {
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(page, /if \(!isPublishedNoCitySlug\(normalized\)\) notFound\(\)/)
  assert.match(page, /as: "Ås"/)
  assert.match(page, /tromso: "Tromsø"/)
})

test("Norway City loader uses Norway read models and five verified metrics", () => {
  assert.match(loader, /city_directory_no_v1/)
  assert.match(loader, /city_institution_directory_no_v1/)
  assert.match(loader, /city_programme_directory_no_v1/)
  for (const key of ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]) {
    assert.ok(loader.includes(`"${key}"`), `loader missing ${key}`)
  }
  assert.match(loader, /countryCode: "NO"/)
  assert.match(loader, /currency: stringValue\(living\.currency\) \?\? "NOK"/)
})

test("Norway City dashboard preserves partial-coverage disclosures", () => {
  assert.match(dashboard, /not Norway&apos;s complete approved HEI universe/)
  assert.match(dashboard, /not a complete physical-campus inventory/)
  assert.match(dashboard, /not a measured city cost ranking/)
  assert.match(dashboard, /not a city differentiator/)
})
