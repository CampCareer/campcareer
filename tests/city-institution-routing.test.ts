import assert from "node:assert/strict"
import test from "node:test"
import { auInstitutionPathFromProviderId } from "../src/lib/cities/au-institution-route"

test("Australian provider IDs map to canonical institution routes", () => {
  assert.equal(
    auInstitutionPathFromProviderId("the-university-of-sydney"),
    "/institutions/au/university-of-sydney",
  )
  assert.equal(
    auInstitutionPathFromProviderId("university-of-melbourne"),
    "/institutions/au/university-of-melbourne",
  )
})

test("invalid provider IDs do not create institution links", () => {
  assert.equal(auInstitutionPathFromProviderId(null), null)
  assert.equal(auInstitutionPathFromProviderId("bad/provider"), null)
})
