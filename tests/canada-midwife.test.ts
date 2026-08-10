import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Midwife publishes the reviewed Canada editorial override", () => {
  const editorial = getOccupationEditorial("midwife")
  assert.match(editorial?.countries.CA?.headline ?? "", /regulated maternity-care profession/)
  assert.match(editorial?.countries.CA?.scoreCaveat ?? "", /15/)
})
