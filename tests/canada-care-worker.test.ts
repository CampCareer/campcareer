import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Care Worker publishes the reviewed Canada editorial override", () => {
  const editorial = getOccupationEditorial("care-worker")
  assert.match(editorial?.countries.CA?.headline ?? "", /frontline patient-care/)
  assert.match(editorial?.countries.CA?.scoreCaveat ?? "", /33102/)
})
