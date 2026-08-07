import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const midwifeMigration = readFileSync(
  new URL("../supabase/migrations/20260807191500_australia_midwife_profile.sql", import.meta.url),
  "utf8",
)

test("Australia Midwife uses the exact current OSCA occupation mapping", () => {
  const career = getCanonicalCareer("midwife")

  assert.ok(career)
  assert.equal(career.categoryId, "health")
  assert.match(midwifeMigration, /'AU:midwife'/)
  assert.match(midwifeMigration, /'265131', 'Midwife'/)
  assert.match(midwifeMigration, /'254111'/)
  assert.match(midwifeMigration, /'2651'/)
  assert.doesNotMatch(midwifeMigration, /251911/)
})

test("Australia Midwife has a complete regulated entry pathway", () => {
  const midwife = getOccupationEditorial("midwife")
  const australia = midwife?.countries.AU

  assert.ok(midwife)
  assert.ok(australia)
  assert.ok(midwife.tasks.length >= 6)
  assert.match(australia.entryPathway, /Bachelor of Midwifery/i)
  assert.match(australia.entryPathway, /postgraduate midwifery/i)
  assert.match(australia.entryPathway, /MidStart/)
  assert.match(australia.registration, /Nursing and Midwifery Board of Australia/)
  assert.match(australia.registration, /mandatory/i)
})

test("Australia Midwife profile keeps verified labour-market inputs and regional shortage evidence", () => {
  assert.match(midwifeMigration, /19400, 2114, 56, 109928/)
  assert.match(midwifeMigration, /197\.33333/)
  assert.match(midwifeMigration, /9\.23/)
  assert.match(midwifeMigration, /13\.91, 26\.74/)

  for (const region of ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]) {
    assert.match(midwifeMigration, new RegExp(`'AU:midwife', '${region}', '2026-05-01', 3`))
  }
})

test("Australia Midwife exposes current regulator, pathway and visa sources", () => {
  assert.match(midwifeMigration, /Approved programs of study/i)
  assert.match(midwifeMigration, /GradStart/)
  assert.match(midwifeMigration, /MidStart/)
  assert.match(midwifeMigration, /Core Skills Occupation List includes legacy ANZSCO 254111 Midwife/)
  assert.match(midwifeMigration, /Home Affairs — Skilled occupation list/)
})
