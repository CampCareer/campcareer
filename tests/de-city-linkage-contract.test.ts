import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260810163850_publish_de_tier_a_city_linkage_v1.sql"),
  "utf8",
)

const citySlugs = [
  "berlin", "munich", "hamburg", "aachen", "bonn",
  "dresden", "heidelberg", "karlsruhe", "tuebingen",
] as const

const institutionSlugs = [
  "freie-universitaet-berlin",
  "humboldt-universitaet-zu-berlin",
  "technische-universitaet-berlin",
  "ludwig-maximilians-universitaet-munich",
  "technical-university-of-munich",
  "rwth-aachen-university",
  "university-of-bonn",
  "technische-universitaet-dresden",
  "universitaet-hamburg",
  "heidelberg-university",
  "karlsruhe-institute-of-technology",
  "university-of-tuebingen",
] as const

test("Germany Phase 3 linkage remains bounded to the nine Tier A cities", () => {
  for (const slug of citySlugs) assert.match(migration, new RegExp(`'${slug}'`))
  assert.match(migration, /city_directory_de_v1\)<>9/)
})

test("Germany Phase 3 links the twelve current canonical institutions through official teaching locations", () => {
  for (const slug of institutionSlugs) assert.match(migration, new RegExp(`'${slug}'`))
  assert.match(migration, /city_institution_directory_de_v1\)<>12/)
  assert.match(migration, /DE_HRK_VERIFIED_DOMAIN/)
  assert.match(migration, /'record_scope','verified_teaching_campus'/)
  assert.match(migration, /'location_quality','verified_official'/)
  assert.match(migration, /'source_tier','institution_official'/)
})

test("Germany Phase 3 does not infer programme delivery from institution presence", () => {
  assert.match(migration, /'programme_assignment_verified',false/)
  assert.match(migration, /c\.metadata->>'programme_assignment_verified'='true'/)
  assert.match(migration, /programme directory must remain empty until campus assignment evidence is explicit/)
  assert.doesNotMatch(migration, /update catalog\.programme_offerings/i)
})

test("Germany city linkage explicitly preserves metro-boundary guardrails", () => {
  assert.match(migration, /TUM Munich City Campus/)
  assert.match(migration, /Arcisstraße 21/)
  assert.doesNotMatch(migration, /Campus Garching'/)
  assert.match(migration, /KIT Campus South/)
  assert.doesNotMatch(migration, /Campus North'/)
})

test("Germany Phase 3 creates service-role-only security-invoker city read models", () => {
  for (const view of [
    "city_institution_directory_de_v1",
    "city_programme_directory_de_v1",
    "city_directory_de_v1",
  ]) {
    assert.match(migration, new RegExp(`view public\\.${view} with \\(security_invoker=true\\)`))
    assert.match(migration, new RegExp(`revoke all on public\\.${view} from public,anon,authenticated`))
    assert.match(migration, new RegExp(`grant select on public\\.${view} to service_role`))
  }
})

test("Germany Phase 3 uses institution-owned official campus sources", () => {
  assert.match(migration, /fu-berlin\.de\/en\/redaktion\/orientierung\/dahlem/)
  assert.match(migration, /hu-berlin\.de\/en\/about\/campus\/campus-mitte/)
  assert.match(migration, /tu\.berlin\/en\/about\/campuses-and-offices\/berlin/)
  assert.match(migration, /standorte\.lmu\.de\/en\/campus-geschwister-scholl-platz/)
  assert.match(migration, /tum\.de\/en\/about-tum\/locations\/munich/)
  assert.match(migration, /rwth-aachen\.de/)
  assert.match(migration, /uni-bonn\.de/)
  assert.match(migration, /tu-dresden\.de/)
  assert.match(migration, /uni-hamburg\.de/)
  assert.match(migration, /uni-heidelberg\.de/)
  assert.match(migration, /kit\.edu/)
  assert.match(migration, /uni-tuebingen\.de/)
})
