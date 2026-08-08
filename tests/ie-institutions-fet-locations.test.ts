import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808154500_ie_fet_verified_locations_v1.sql", import.meta.url),
  "utf8",
)

test("Ireland FET centre location cohort has 11 official rows across eight institutions", () => {
  const match = migration.match(
    /with location_rows\([\s\S]*?\) as \(\nvalues\n([\s\S]*?)\n\),\nresolved as \(/,
  )
  assert.ok(match)
  const rows = match[1].split("\n").filter((line) => line.trim() === "(")
  assert.equal(rows.length, 11)
  assert.match(migration, /location_count<>11 or institution_count<>8/)
})

test("Cavan Institute uses all four locations from its official campus map", () => {
  assert.match(migration, /'block-a','Cavan Institute Block A'/)
  assert.match(migration, /'block-b','Cavan Institute Block B'/)
  assert.match(migration, /'block-d','Cavan Institute Block D'/)
  assert.match(migration, /'block-e-workshop','Cavan Institute Block E Workshop'/)
  assert.match(migration, /https:\/\/www\.cavaninstitute\.ie\/campus-map/)
})

test("FET verified rows use official institution sources and remain display-only", () => {
  assert.match(migration, /location_quality','verified_official'/)
  assert.match(migration, /display_policy','preferred'/)
  assert.match(migration, /source_kind','institution_official_site'/)
  assert.match(migration, /cohort','qqi_fet_centre_v1'/)
  assert.match(migration, /verified_anchor_count<>0/)
})

test("representative FET centre addresses are source-backed", () => {
  assert.match(migration, /'Morrison’s Island, Cork City','T12 H685'/)
  assert.match(migration, /'Sawmill Street, Cork City','T12 DW32'/)
  assert.match(migration, /'West End, Mallow','P51 P732'/)
  assert.match(migration, /'The Twenties','A92 V586'/)
  assert.match(migration, /'Dunboyne Business Park','A86 FH01'/)
  assert.match(migration, /'Dublin Road','A91 WK75'/)
})

test("FET location migration retains the 66-program identity cohort", () => {
  assert.match(migration, /institution_identity_ie_fet_v1/)
  assert.match(migration, /cohort_program_count<>66/)
})
