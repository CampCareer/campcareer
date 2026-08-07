import assert from "node:assert/strict"
import test from "node:test"
import {
  buildProgramsUrl,
  parseProgramId,
  parseProgramSearchParams,
  programDetailPath,
  programLevelTypes,
} from "../src/lib/programs/program-search"

test("program search params default to Australia and safe filter values", () => {
  assert.deepEqual(parseProgramSearchParams({}), {
    country: "AU",
    q: "",
    level: "all",
    field: "all",
    city: "all",
    state: "all",
    duration: "all",
    fee: "all",
    source: "all",
    sort: "recommended",
    page: 1,
  })
})

test("program search params keep supported filters and reject unknown values", () => {
  const parsed = parseProgramSearchParams({
    country: "au",
    q: "  Nursing  ",
    level: "bachelor",
    field: "06 - Health",
    state: "NSW",
    duration: "2-3",
    fee: "40000-50000",
    source: "verified",
    sort: "fee-low",
    page: "3",
  })

  assert.equal(parsed.country, "AU")
  assert.equal(parsed.q, "Nursing")
  assert.equal(parsed.level, "bachelor")
  assert.equal(parsed.field, "06 - Health")
  assert.equal(parsed.city, "all")
  assert.equal(parsed.state, "NSW")
  assert.equal(parsed.duration, "2-3")
  assert.equal(parsed.fee, "40000-50000")
  assert.equal(parsed.source, "verified")
  assert.equal(parsed.sort, "fee-low")
  assert.equal(parsed.page, 3)

  assert.equal(parseProgramSearchParams({ level: "unknown" }).level, "all")
  assert.equal(parseProgramSearchParams({ city: "unknown" }).city, "all")
  assert.equal(parseProgramSearchParams({ page: "-4" }).page, 1)
})

test("verified city filters take precedence over representative state filters", () => {
  const sydney = parseProgramSearchParams({ city: "sydney", state: "VIC" })
  assert.equal(sydney.city, "sydney")
  assert.equal(sydney.state, "all")
  assert.equal(buildProgramsUrl(sydney), "/programs?country=AU&city=sydney")

  const melbourne = parseProgramSearchParams({ city: "melbourne", state: "NSW" })
  assert.equal(melbourne.city, "melbourne")
  assert.equal(melbourne.state, "all")
  assert.equal(buildProgramsUrl(melbourne), "/programs?country=AU&city=melbourne")

  const brisbane = parseProgramSearchParams({ city: "brisbane", state: "NSW" })
  assert.equal(brisbane.city, "brisbane")
  assert.equal(brisbane.state, "all")
  assert.equal(buildProgramsUrl(brisbane), "/programs?country=AU&city=brisbane")
})

test("program URLs preserve country and omit default filters", () => {
  const filters = parseProgramSearchParams({
    country: "AU",
    q: "Data Science",
    level: "master",
    state: "VIC",
    page: "2",
  })

  assert.equal(
    buildProgramsUrl(filters),
    "/programs?country=AU&q=Data+Science&level=master&state=VIC&page=2",
  )
  assert.equal(
    buildProgramsUrl(filters, { q: "", level: "all", city: "all", state: "all", page: 1 }),
    "/programs?country=AU",
  )
})

test("program detail paths use a stable numeric id and readable slug", () => {
  const path = programDetailPath(856, "Bachelor of Computer Science & Data")
  assert.equal(path, "/programs/au/856-bachelor-of-computer-science-and-data")
  assert.equal(parseProgramId("856-bachelor-of-computer-science-and-data"), 856)
  assert.equal(parseProgramId("not-a-program"), null)
  assert.equal(parseProgramId("856oops"), null)
})

test("program level filters map to Australian course types", () => {
  assert.deepEqual(programLevelTypes("bachelor"), [
    "Bachelor Degree",
    "Bachelor Honours Degree",
  ])
  assert.equal(programLevelTypes("all"), null)
})
