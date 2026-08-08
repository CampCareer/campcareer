import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Toronto city profile is published as a Canada workspace city", () => {
  const page = readFileSync("src/app/(workspace)/cities/ca/toronto/page.tsx", "utf8")
  const dashboard = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")
  const loader = readFileSync("src/lib/cities/ca-city-profile.server.ts", "utf8")

  assert.ok(page.includes('getCaCityProfile("toronto")'))
  assert.ok(page.includes('canonical: "/cities/ca/toronto"'))
  assert.ok(dashboard.includes("City of Toronto"))
  assert.ok(dashboard.includes("h / week"))
  assert.ok(loader.includes('metrics.get("student_work_hours_week")'))
  assert.ok(dashboard.includes("Canonical linked programs"))
})

test("Canada city normalization does not infer GTA programme membership", () => {
  const migration = readFileSync(
    "supabase/migrations/20260808100208_normalize_canada_city_slugs_v1.sql",
    "utf8",
  )
  const torontoMigration = readFileSync(
    "supabase/migrations/20260808100251_publish_toronto_city_mvp_v1.sql",
    "utf8",
  )

  assert.ok(migration.includes("study_destination_scope', 'named_city'"))
  assert.ok(migration.includes("Do not infer GTA/CMA membership"))
  assert.ok(torontoMigration.includes("Mississauga, Brampton and Oakville are not inferred"))
})

test("Canada dashboard links only the published Toronto city profile", () => {
  const dashboard = readFileSync(
    "src/app/(workspace)/countries/canada-country-dashboard.tsx",
    "utf8",
  )
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

  assert.ok(dashboard.includes('Toronto: "/cities/ca/toronto"'))
  assert.ok(sitemap.includes("/cities/ca/toronto"))
  assert.ok(!sitemap.includes("/cities/ca/vancouver"))
})
