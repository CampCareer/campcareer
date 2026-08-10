import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810102220_canada_design_creative_occupations.sql", import.meta.url),
  "utf8",
)

const designCreativeCareers = [
  ["graphic-designer", "52120", 24],
  ["ux-designer", "52120", 25],
  ["multimedia-designer", "52120", 25],
  ["animator", "52120", 22],
  ["interior-designer", "52121", 16],
  ["film-editor", "51120", 22],
  ["architect", "21200", 17],
  ["web-designer", "21233", 21],
] as const

test("Canada Design and Creative cohort covers the canonical eight careers", () => {
  for (const [id, noc] of designCreativeCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "design")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Design and Creative scoring separates shared design NOCs from exact architect and web-designer evidence", () => {
  const expectedScoreFragments = [
    "'CA:graphic-designer','2025-11-19',null,31.25,0,0,0,0,14,6,0,0,4,24",
    "'CA:ux-designer','2025-11-19',null,31.25,0,0,0,0,14,6,0,0,5,25",
    "'CA:multimedia-designer','2025-11-19',null,31.25,0,0,0,0,14,6,0,0,5,25",
    "'CA:animator','2025-11-19',null,31.25,0,0,0,0,12,6,0,0,4,22",
    "'CA:interior-designer','2025-11-19',null,28.85,0,0,0,0,10,4,0,0,2,16",
    "'CA:film-editor','2025-11-19',null,41.03,0,0,0,0,8,10,0,0,4,22",
    "'CA:architect','2025-11-19',26900,38.94,0,0,0,0,8,8,0,0,1,17",
    "'CA:web-designer','2025-11-19',13100,33.65,0,0,0,0,10,6,0,0,5,21",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("STRONG RISK OF SURPLUS"))
  assert.ok(migration.includes("MODERATE RISK OF SURPLUS"))
  assert.ok(migration.includes("'CA:ux-designer','52120'"))
  assert.ok(migration.includes("'CA:web-designer','21233'"))
  assert.ok(!migration.includes("'CA:ux-designer','21233'"))
})

test("Canada Design and Creative programme links use reviewed direct international routes", () => {
  for (const programRef of [
    "ca-program:179",
    "ca-program:1214",
    "ca-program:84",
    "ca-program:2078",
    "ca-program:198",
    "ca-program:1248",
    "ca-program:94",
    "ca-program:1125",
    "ca-program:180",
    "ca-program:1343",
    "ca-program:238",
    "ca-program:6653",
    "ca-program:1643",
  ]) {
    assert.ok(migration.includes(programRef))
  }

  assert.ok(migration.includes("'CA:architect','ca-program:6653','direct'"))
  assert.ok(migration.includes("'CA:film-editor','ca-program:238','direct'"))
  assert.ok(migration.includes("'CA:web-designer','ca-program:1643','direct'"))
})
