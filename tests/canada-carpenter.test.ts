import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260809210000_canada_carpenter_profile.sql", import.meta.url),
  "utf8",
)

test("Canada Carpenter uses exact NOC 72310 and a CA editorial override", () => {
  const career = getCanonicalCareer("carpenter")
  const editorial = getOccupationEditorial("carpenter")
  assert.ok(career)
  assert.equal(career.categoryId, "trades")
  assert.ok(editorial?.countries.CA)
  assert.match(migration, /NOC 2021 72310 Carpenters/)
})

test("Canada Carpenter keeps conservative vacancy scoring and current trade-category credit", () => {
  assert.match(migration, /20,0,0,0,15,6,0,10,3,54/)
  assert.match(migration, /STRONG RISK OF SHORTAGE/)
  assert.match(migration, /Express Entry trade occupations category/)
})
