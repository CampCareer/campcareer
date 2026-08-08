import assert from "node:assert/strict"
import test from "node:test"
import { institutionDetailPath } from "../src/lib/institutions/institution-search"
import { programDetailPath } from "../src/lib/programs/program-search"

test("Australian program and institution routes use stable public identities", () => {
  assert.equal(
    institutionDetailPath("AU", "university-of-sydney"),
    "/institutions/au/university-of-sydney",
  )
  assert.equal(
    programDetailPath(19393, "Bachelor of Advanced Computing"),
    "/programs/au/19393-bachelor-of-advanced-computing",
  )
})

test("Canadian institution routes do not require a program route", () => {
  assert.equal(
    institutionDetailPath("CA", "university-of-toronto"),
    "/institutions/ca/university-of-toronto",
  )
})
