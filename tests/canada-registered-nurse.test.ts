import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Registered Nurse publishes the reviewed Canada editorial override", () => {
  const editorial = getOccupationEditorial("registered-nurse")
  assert.match(editorial?.countries.CA?.headline ?? "", /regulated nursing profession/)
  assert.match(editorial?.countries.CA?.registration ?? "", /NCLEX-RN/)
})
