import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810205331_ie_health_occupations.sql", import.meta.url),
  "utf8",
)

const healthCareers = [
  ["registered-nurse", "2231", 39],
  ["midwife", "2232", 19],
  ["care-worker", "6145", 45],
  ["physiotherapist", "2221", 17],
  ["medical-laboratory-technician", "3218", 18],
  ["radiographer", "2217", 17],
  ["pharmacist", "2213", 15],
  ["occupational-therapist", "2222", 17],
] as const

test("Ireland Health covers the canonical eight health careers", () => {
  for (const [id, soc] of healthCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "health")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Health preserves exact SOC 2010 professional scopes", () => {
  for (const marker of [
    "'IE:registered-nurse','2231','Registered Nurses'",
    "'IE:midwife','2232','Registered Midwives'",
    "'IE:care-worker','6145','Care workers and home carers'",
    "'IE:physiotherapist','2221','Physiotherapist'",
    "'IE:medical-laboratory-technician','3218','Medical and dental technicians — medical laboratory technician scope'",
    "'IE:radiographer','2217','Radiographers — diagnostic and therapeutic radiography scope'",
    "'IE:pharmacist','2213','Pharmacist / Industrial Pharmacist'",
    "'IE:occupational-therapist','2222','Occupational Therapist'",
  ]) assert.ok(migration.includes(marker))
})

test("Ireland Health keeps direct shortage evidence separate from permit access", () => {
  assert.ok(migration.includes("'IE:registered-nurse','2026-08-10',null,null,null,20,0,0,0,8,0,0,10,1,39"))
  assert.ok(migration.includes("'IE:care-worker','2026-08-10',null,null,null,20,0,0,0,15,0,0,6,4,45"))

  for (const [id] of [
    ["midwife"],
    ["physiotherapist"],
    ["medical-laboratory-technician"],
    ["radiographer"],
    ["pharmacist"],
    ["occupational-therapist"],
  ] as const) {
    const row = migration.split("\n").find((line) => line.startsWith(`  ('IE:${id}','2026-08-10'`))
    assert.ok(row)
    assert.match(row, /null,null,null,0,0,0,0,/)
  }

  assert.ok(migration.includes("SOLAS National Skills Bulletin 2025 identifies nurses as a current healthcare skills shortage"))
  assert.ok(migration.includes("SOLAS National Skills Bulletin 2025 identifies care workers as a labour shortage"))
  assert.ok(migration.includes("shortage evidence for some therapist occupations is inconclusive"))
})

test("Ireland Health models statutory registration without regulating generic care or technician roles", () => {
  for (const id of ["registered-nurse","midwife","physiotherapist","radiographer","pharmacist","occupational-therapist"]) {
    const row = migration.split("\n").find((line) => line.startsWith(`  ('IE:${id}','IE'`))
    assert.ok(row)
    assert.ok(row.includes("'EUR',true"), `${id} must require statutory registration`)
  }

  for (const id of ["care-worker","medical-laboratory-technician"]) {
    const row = migration.split("\n").find((line) => line.startsWith(`  ('IE:${id}','IE'`))
    assert.ok(row)
    assert.ok(row.includes("'EUR',false"), `${id} must not inherit a protected professional register`)
  }

  assert.ok(migration.includes("It is not the CORU-regulated Medical Scientist profession"))
  assert.ok(migration.includes("No Medical Scientist shortage evidence is borrowed for the technician scope"))
})

test("Ireland Health uses CSEP only for the professions explicitly listed", () => {
  for (const id of ["registered-nurse","midwife","physiotherapist","radiographer","pharmacist","occupational-therapist"]) {
    const row = migration.split("\n").find((line) => line.startsWith(`  ('IE:${id}','2026-08-10'`))
    assert.ok(row)
    assert.match(row, /,10,1,\d+,'career-opportunity-ie-v1'/)
  }

  assert.ok(migration.includes("'IE:care-worker','2026-08-10',null,null,null,20,0,0,0,15,0,0,6,4,45"))
  assert.ok(migration.includes("'IE:medical-laboratory-technician','2026-08-10',null,null,null,0,0,0,0,8,0,0,6,4,18"))
  assert.ok(migration.includes("current Critical Skills list only names specified SOC 3218 employments"))
})

test("Ireland Health does not fabricate occupation median salary inputs", () => {
  for (const [id, , score] of healthCareers) {
    assert.ok(migration.includes(`'IE:${id}','2026-08-10'`))
    assert.ok(migration.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }

  const scoreRows = migration
    .split("\n")
    .filter((line) => line.startsWith("  ('IE:") && line.includes("'career-opportunity-ie-v1'"))
  assert.equal(scoreRows.length, 8)
  for (const row of scoreRows) assert.match(row, /null,null,null,\d+,0,0,0,\d+,0,0,\d+,\d+,\d+,'career-opportunity-ie-v1'/)
})

test("Ireland Health publishes only structured entry and official evidence links", () => {
  const entryRows = migration
    .split("\n")
    .filter((line) => line.startsWith("  ('IE:") && line.includes("'entry_program'"))
  assert.equal(entryRows.length, 7)
  assert.ok(!migration.includes("'IE:medical-laboratory-technician','entry_program'"))

  const linkRows = migration
    .split("\n")
    .filter((line) => line.startsWith("  ('IE:") && (line.includes("'entry_program'") || line.includes("'source'")))
  assert.equal(linkRows.length, 28)
})

test("Ireland Health does not publish programme links while IE programme Tier A is empty", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})
