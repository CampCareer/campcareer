import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Radiographer keeps diagnostic scope narrower than the MRT unit group", () => {
  const editorial = getOccupationEditorial("radiographer")
  assert.match(editorial?.countries.CA?.headline ?? "", /medical-imaging profession/)
  assert.match(editorial?.countries.CA?.scoreCaveat ?? "", /32121/)
})
