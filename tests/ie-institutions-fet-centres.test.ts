import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808152500_ie_qqi_fet_centre_identity_v1.sql", import.meta.url),
  "utf8",
)

test("Ireland QQI FET cohort contains eight centre identities", () => {
  const match = migration.match(
    /insert into ie_qqi_fet_centres values\n([\s\S]*?);\n\n-- Fail closed/,
  )
  assert.ok(match)
  const rows = match[1].split("\n").filter((line) => line.trim() === "(")
  assert.equal(rows.length, 8)
  assert.match(migration, /identity_count<>8/)
})

test("FET centres stay distinct from their parent ETB providers", () => {
  assert.match(migration, /they are NOT collapsed into their parent Education and Training Board/)
  assert.match(migration, /IE_QQI_CENTRE_NAME/)
  assert.doesNotMatch(migration, /IE_QQI_ETB_PROVIDER_NAME/)
  assert.doesNotMatch(migration, /delete from catalog\.institutions/)
})

test("Irish FET terminology is not mislabeled as TAFE VET", () => {
  assert.match(migration, /institution_kind='other'/)
  assert.doesNotMatch(migration, /institution_kind='tafe_vet'/)
})

test("FET cohort keeps all programme and legacy identity links", () => {
  assert.match(migration, /cohort_program_count<>66/)
  assert.match(migration, /all_program_count<>2876/)
  assert.match(migration, /legacy_identity_count<8/)
})

test("current centre names include source-specific spelling where needed", () => {
  assert.match(migration, /Cork College of FET Morrison’s Island Campus/)
  assert.match(migration, /Cork College of FET - Douglas Street Campus/)
  assert.match(migration, /Ó Fiaich Institute of Further Education/)
  assert.match(migration, /O''Fiaich Institute of Further Education/)
})

test("FET identity view is service-role only and requires QSearch provenance", () => {
  assert.match(migration, /institution_identity_ie_fet_v1/)
  assert.match(migration, /source_url !~ '\^https:\/\/qsearch\\\.qqi\\\.ie\/'/)
  assert.match(migration, /revoke all on public\.institution_identity_ie_fet_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.institution_identity_ie_fet_v1 to service_role/)
})
