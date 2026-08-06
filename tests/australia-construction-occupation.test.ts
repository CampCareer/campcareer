import assert from "node:assert/strict"
import test from "node:test"
import { AU_VOCATIONAL_PROGRAM_SHORTLIST } from "../src/data/au-vocational-program-shortlist"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Australia Carpenter has a complete editorial and apprenticeship pathway", () => {
  const carpenter = getOccupationEditorial("carpenter")
  const australia = carpenter?.countries.AU

  assert.ok(carpenter)
  assert.ok(australia)
  assert.ok(carpenter.tasks.length >= 6)
  assert.match(australia.entryPathway, /CPC30220/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia Carpenter connects to the current CPC30220 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:tafe-nsw:CPC30220"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "carpentry")
  assert.equal(program.courseCode, "CPC30220")
  assert.equal(program.registrationStatus, "CURRENT")
})
