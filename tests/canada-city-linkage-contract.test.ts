import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada city profiles resolve institutions through canonical CA institution identities", () => {
  const loader = readFileSync("src/lib/cities/ca-city-profile.server.ts", "utf8")

  assert.ok(loader.includes('from("city_institution_directory_ca_v1")'))
  assert.ok(loader.includes('from("institution_explorer_v1")'))
  assert.ok(loader.includes('.eq("country_code", "CA")'))
  assert.ok(loader.includes('profilePath: slug ? `/institutions/ca/${slug}` : null'))
})

test("Canada city comparison derives programme overlap from canonical city programme links", () => {
  const loader = readFileSync("src/lib/cities/ca-city-comparison.server.ts", "utf8")

  assert.ok(loader.includes('from("city_programme_directory_ca_v1")'))
  assert.ok(loader.includes("leftProgrammes.add(row.programme_id)"))
  assert.ok(loader.includes("rightProgrammes.add(row.programme_id)"))
  assert.ok(loader.includes("sharedProgramCount"))
})

test("Canada city UI describes linked programmes as canonical rather than officially verified offerings", () => {
  const dashboard = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(dashboard.includes("Canonical linked programmes"))
  assert.ok(dashboard.includes("Current canonical programme offerings"))
  assert.ok(dashboard.includes("not yet the full official city catalogue count"))
  assert.ok(matrix.includes("Canonical linked programmes"))
  assert.ok(matrix.includes("Current normalized canonical programme offerings"))
  assert.ok(matrix.includes("not yet the full Canada catalogue"))
  assert.doesNotMatch(dashboard, /Verified .* programs/)
})

test("Canada institution read model intentionally avoids inventing public Canadian programme detail routes", () => {
  const migration = readFileSync(
    "supabase/migrations/20260807183500_program_institution_bidirectional_links.sql",
    "utf8",
  )

  assert.ok(migration.includes("Canada keeps canonical program previews but no public program URL"))
  assert.ok(migration.includes("programme_preview"))
  assert.ok(migration.includes("legacyProgramId"))
})
