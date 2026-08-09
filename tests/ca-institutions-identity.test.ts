import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL(
    "../supabase/migrations/20260808113500_ca_institution_identity_foundation.sql",
    import.meta.url,
  ),
  "utf8",
)

test("Canadian institution foundation maps the 30 published universities to official IRCC DLI numbers", () => {
  const rows = migration.match(/\('[^']+', 'O\d{11}'\)/g) ?? []

  // The mapping appears twice in the migration: once for the institution
  // classification update and once for the identifier insert.
  assert.equal(rows.length, 60)
  assert.match(migration, /'CA_DLI'/)
  assert.match(migration, /institution_identity_ca_v1/)
  assert.match(migration, /institution_kind = 'university'/)
  assert.match(migration, /ownership_type = 'public'/)
  assert.match(migration, /Expected 165 active programmes/)
})

test("Canadian DLI identity preserves representative canonical and legacy joins", () => {
  assert.match(migration, /'university-of-toronto', 'O19332746152'/)
  assert.match(migration, /'university-of-british-columbia', 'O19330231062'/)
  assert.match(migration, /'mcgill-university', 'O19359011033'/)
  assert.match(migration, /'simon-fraser-university', 'O18781994282'/)
  assert.match(migration, /'universit-de-montr-al', 'O19359011045'/)
  assert.match(migration, /'universit-du-qu-bec-montr-al', 'O19359011134'/)
  assert.match(migration, /legacy_provider_id/)
})

test("Canadian DLI identity uses the canonical IRCC DLI list and service-role read access", () => {
  assert.match(
    migration,
    /https:\/\/www\.canada\.ca\/en\/immigration-refugees-citizenship\/services\/study-canada\/study-permit\/prepare\/designated-learning-institutions-list\.html/,
  )
  assert.match(migration, /with \(security_invoker = true\)/)
  assert.match(
    migration,
    /revoke all on public\.institution_identity_ca_v1 from public, anon, authenticated/,
  )
  assert.match(
    migration,
    /grant select on public\.institution_identity_ca_v1 to service_role/,
  )
  assert.match(migration, /\^O\[0-9\]\{11\}\$/)
})
