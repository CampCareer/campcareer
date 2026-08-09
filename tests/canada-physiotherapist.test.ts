import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Physiotherapist publishes the reviewed Canada editorial override", () => {
  const editorial = getOccupationEditorial("physiotherapist")
  assert.match(editorial?.countries.CA?.headline ?? "", /regulated rehabilitation profession/)
  assert.match(editorial?.countries.CA?.registration ?? "", /CAPR/)
})
