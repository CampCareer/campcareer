import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Pharmacist publishes the reviewed Canada editorial override", () => {
  const editorial = getOccupationEditorial("pharmacist")
  assert.match(editorial?.countries.CA?.headline ?? "", /regulated pharmacy profession/)
  assert.match(editorial?.countries.CA?.registration ?? "", /PEBC/)
})
