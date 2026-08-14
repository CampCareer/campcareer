import assert from "node:assert/strict"
import test from "node:test"
import {
  CA_PROGRAM_CITIES,
  buildProgramsUrl,
  caProgramDetailPath,
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
    province: "all",
    career: "all",
    careerContext: "all",
    institution: "all",
    pgwp: "all",
    duration: "all",
    fee: "all",
    source: "all",
    sort: "recommended",
    page: 1,
  })
})

test("program search params keep supported Australian filters and reject unknown values", () => {
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
  assert.equal(parsed.province, "all")
  assert.equal(parsed.career, "all")
  assert.equal(parsed.careerContext, "all")
  assert.equal(parsed.institution, "all")
  assert.equal(parsed.pgwp, "all")
  assert.equal(parsed.duration, "2-3")
  assert.equal(parsed.fee, "40000-50000")
  assert.equal(parsed.source, "verified")
  assert.equal(parsed.sort, "fee-low")
  assert.equal(parsed.page, 3)

  assert.equal(parseProgramSearchParams({ level: "unknown" }).level, "all")
  assert.equal(parseProgramSearchParams({ city: "unknown" }).city, "all")
  assert.equal(parseProgramSearchParams({ page: "-4" }).page, 1)
})

test("verified Australian city filters take precedence over representative state filters", () => {
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

  const perth = parseProgramSearchParams({ city: "perth", state: "QLD" })
  assert.equal(perth.city, "perth")
  assert.equal(perth.state, "all")
  assert.equal(buildProgramsUrl(perth), "/programs?country=AU&city=perth")

  const adelaide = parseProgramSearchParams({ city: "adelaide", state: "WA" })
  assert.equal(adelaide.city, "adelaide")
  assert.equal(adelaide.state, "all")
  assert.equal(buildProgramsUrl(adelaide), "/programs?country=AU&city=adelaide")
})

test("Canadian filters keep city, career, institution, province and PGWP inside Canada", () => {
  const parsed = parseProgramSearchParams({
    country: "ca",
    q: "Nursing",
    city: "toronto",
    career: "registered-nurse",
    institution: "george-brown-college",
    province: "ON",
    pgwp: "eligible",
    state: "NSW",
    source: "verified",
  })

  assert.equal(parsed.country, "CA")
  assert.equal(parsed.city, "toronto")
  assert.equal(parsed.state, "all")
  assert.equal(parsed.province, "ON")
  assert.equal(parsed.career, "registered-nurse")
  assert.equal(parsed.institution, "george-brown-college")
  assert.equal(parsed.pgwp, "eligible")
  assert.equal(
    buildProgramsUrl(parsed),
    "/programs?country=CA&q=Nursing&city=toronto&province=ON&career=registered-nurse&institution=george-brown-college&pgwp=eligible&source=verified",
  )

  assert.equal(parseProgramSearchParams({ country: "CA", city: "sydney" }).city, "all")
  assert.equal(parseProgramSearchParams({ country: "CA", province: "XX" }).province, "all")
  assert.equal(parseProgramSearchParams({ country: "CA", career: "BAD CAREER" }).career, "all")
  assert.equal(parseProgramSearchParams({ country: "CA", institution: "BAD INSTITUTION" }).institution, "all")
  assert.equal(parseProgramSearchParams({ country: "CA", pgwp: "maybe" }).pgwp, "all")
  assert.equal(parseProgramSearchParams({ country: "AU", institution: "some-school" }).institution, "all")
  assert.equal(parseProgramSearchParams({ country: "AU", city: "toronto" }).city, "all")
})

test("Career Page context survives Programs pagination and filter changes without becoming a filter", () => {
  const au = parseProgramSearchParams({
    country: "AU",
    careerContext: "electrician",
    state: "NSW",
    page: "2",
  })

  assert.equal(au.career, "all")
  assert.equal(au.careerContext, "electrician")
  assert.equal(
    buildProgramsUrl(au),
    "/programs?country=AU&state=NSW&careerContext=electrician&page=2",
  )
  assert.equal(
    buildProgramsUrl(au, { state: "all", page: 1 }),
    "/programs?country=AU&careerContext=electrician",
  )

  const ca = parseProgramSearchParams({
    country: "CA",
    career: "registered-nurse",
    careerContext: "registered-nurse",
  })
  assert.equal(
    buildProgramsUrl(ca),
    "/programs?country=CA&career=registered-nurse&careerContext=registered-nurse",
  )
})

test("Canada program city filter covers published geographic city values without exposing campus labels", () => {
  const cityValues = new Set<string>(CA_PROGRAM_CITIES.map((city) => city.value))

  assert.equal(CA_PROGRAM_CITIES.length, 25)
  assert.ok(CA_PROGRAM_CITIES.some((city) => city.value === "burnaby" && city.province === "BC"))
  assert.ok(CA_PROGRAM_CITIES.some((city) => city.value === "new westminster" && city.province === "BC"))
  assert.ok(CA_PROGRAM_CITIES.some((city) => city.value === "st. john's" && city.province === "NL"))
  assert.ok(CA_PROGRAM_CITIES.some((city) => city.value === "sault ste. marie" && city.province === "ON"))
  assert.ok(!cityValues.has("ottawa - perley health"))

  const newWestminster = parseProgramSearchParams({ country: "CA", city: "new westminster" })
  assert.equal(newWestminster.city, "new westminster")
  assert.equal(buildProgramsUrl(newWestminster), "/programs?country=CA&city=new+westminster")

  const stJohns = parseProgramSearchParams({ country: "CA", city: "st. john's" })
  assert.equal(stJohns.city, "st. john's")
  assert.equal(buildProgramsUrl(stJohns), "/programs?country=CA&city=st.+john%27s")

  assert.equal(
    parseProgramSearchParams({ country: "CA", city: "ottawa - perley health" }).city,
    "all",
  )
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

test("program detail paths use stable numeric ids and readable country routes", () => {
  const auPath = programDetailPath(856, "Bachelor of Computer Science & Data")
  assert.equal(auPath, "/programs/au/856-bachelor-of-computer-science-and-data")

  const caPath = caProgramDetailPath(17, "Accounting (Bachelor of Business Administration)")
  assert.equal(caPath, "/programs/ca/17-accounting-bachelor-of-business-administration")

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
