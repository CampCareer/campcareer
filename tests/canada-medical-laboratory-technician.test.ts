import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Medical Laboratory Technician keeps technician scope separate from technologist", () => {
  const editorial = getOccupationEditorial("medical-laboratory-technician")
  assert.match(editorial?.countries.CA?.entryPathway ?? "", /33101/)
  assert.match(editorial?.countries.CA?.scoreCaveat ?? "", /32120/)
})
