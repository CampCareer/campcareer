import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260810132743_publish_nl_tier_a_city_linkage_v1.sql"),
  "utf8",
)
const scopeDoc = readFileSync(join(process.cwd(), "docs/data-foundation/nl-city-scope-v1.md"), "utf8")

const tierA = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"] as const
const tierB = ["Delft", "Utrecht", "Enschede", "Tilburg", "Leiden", "Nijmegen", "Wageningen"] as const

test("Netherlands Phase 3 keeps linkage bounded to the five Tier A city geographies", () => {
  for (const slug of tierA) {
    assert.match(migration, new RegExp(`'${slug}'`))
    assert.ok(scopeDoc.includes("`" + slug + "`"))
  }

  assert.match(migration, /metadata->>'publication_tier'='A'/)
  assert.match(migration, /city_directory_nl_v1/)
})

test("Netherlands Phase 3 publishes six source-backed research-university location anchors", () => {
  assert.match(migration, /university-of-amsterdam/)
  assert.match(migration, /vrije-universiteit-amsterdam/)
  assert.match(migration, /maastricht-university/)
  assert.match(migration, /erasmus-university-rotterdam/)
  assert.match(migration, /university-of-groningen/)
  assert.match(migration, /eindhoven-university-of-technology/)
  assert.match(migration, /institution directory expected 6 verified initial location anchors/)
  assert.match(migration, /normalization_batch','nl_city_linkage_v1'/)
})

test("official location evidence is separated from legacy and DUO registry-only location rows", () => {
  assert.match(migration, /c\.metadata->>'normalization_batch'='nl_city_linkage_v1'/)
  assert.match(migration, /official_location_evidence/)
  assert.doesNotMatch(migration, /legacy_location_anchor'::text as linkage_basis/)
  assert.doesNotMatch(migration, /registered_institution_location'::text as linkage_basis/)
})

test("BRIN identity remains the institution linkage authority", () => {
  assert.match(migration, /identifier_system='NL_BRIN'/)
  assert.match(migration, /brin_code/)
  assert.match(migration, /brin_source_url/)
})

test("programme delivery requires a verified explicit campus offering and is not inferred", () => {
  assert.match(migration, /po\.campus_id=c\.id/)
  assert.match(migration, /po\.verification_status='verified'/)
  assert.match(migration, /programme_assignment_verified'='true'/)
  assert.match(migration, /verified_programme_offerings\.campus_id/)
  assert.match(migration, /programme directory must remain empty until explicit offering campus_id evidence is written/)

  assert.doesNotMatch(migration, /insert into catalog\.programme_offerings/i)
  assert.doesNotMatch(migration, /update catalog\.programme_offerings/i)
  assert.doesNotMatch(migration, /insert into catalog\.programmes/i)
})

test("known HBO coverage gap is explicit rather than presented as exhaustive coverage", () => {
  assert.match(migration, /research_university_core_hbo_pending/)
  assert.match(migration, /does not imply exhaustive Dutch HBO\/provider coverage/)
  for (const city of tierB) assert.ok(scopeDoc.includes(city))
})

test("NL city linkage read models remain server-only security-invoker views", () => {
  assert.match(migration, /city_institution_directory_nl_v1 with \(security_invoker=true\)/)
  assert.match(migration, /city_programme_directory_nl_v1 with \(security_invoker=true\)/)
  assert.match(migration, /city_directory_nl_v1 with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.city_institution_directory_nl_v1 from public,anon,authenticated/)
  assert.match(migration, /revoke all on public\.city_programme_directory_nl_v1 from public,anon,authenticated/)
  assert.match(migration, /revoke all on public\.city_directory_nl_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_institution_directory_nl_v1 to service_role/)
  assert.match(migration, /grant select on public\.city_programme_directory_nl_v1 to service_role/)
  assert.match(migration, /grant select on public\.city_directory_nl_v1 to service_role/)
})
