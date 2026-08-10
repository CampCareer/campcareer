import assert from "node:assert/strict"
import test from "node:test"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Canada Occupational Therapist publishes the reviewed Canada editorial override", () => {
  const editorial = getOccupationEditorial("occupational-therapist")
  assert.match(editorial?.countries.CA?.headline ?? "", /regulated rehabilitation profession/)
  assert.match(editorial?.countries.CA?.registration ?? "", /ten provinces/)
})
