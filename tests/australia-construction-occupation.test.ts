import assert from "node:assert/strict"
import test from "node:test"
import { AU_VOCATIONAL_PROGRAM_SHORTLIST } from "../src/data/au-vocational-program-shortlist"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

test("Australia Carpenter has a complete editorial and apprenticeship pathway", () => {
  const carpenter = getOccupationEditorial("carpenter")
  const australia = carpenter?.countries.AU

  assert.ok(carpenter)
  assert.ok(australia)
  assert.ok(carpenter.tasks.length >= 6)
  assert.match(australia.entryPathway, /CPC30220/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia Carpenter connects to the current CPC30220 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:tafe-nsw:CPC30220"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "carpentry")
  assert.equal(program.courseCode, "CPC30220")
  assert.equal(program.registrationStatus, "CURRENT")
})

test("Australia Plumber has a complete editorial, apprenticeship and licensing pathway", () => {
  const plumber = getOccupationEditorial("plumber")
  const australia = plumber?.countries.AU

  assert.ok(plumber)
  assert.ok(australia)
  assert.ok(plumber.tasks.length >= 6)
  assert.match(australia.entryPathway, /CPC32420/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /licen[cs]e|registration/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia Plumber connects to the current CPC32420 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:tafe-nsw:CPC32420"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "plumbing")
  assert.equal(program.courseCode, "CPC32420")
  assert.equal(program.registrationStatus, "CURRENT")
})

test("Australia Wall and Floor Tiler has a complete apprenticeship and licensing pathway", () => {
  const tiler = getOccupationEditorial("wall-floor-tiler")
  const australia = tiler?.countries.AU

  assert.ok(tiler)
  assert.ok(australia)
  assert.ok(tiler.tasks.length >= 6)
  assert.match(australia.entryPathway, /CPC31320/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /licen[cs]e|licensing/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia Wall and Floor Tiler connects to the current CPC31320 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:tafe-nsw:CPC31320"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "wall-floor-tiling")
  assert.equal(program.courseCode, "CPC31320")
  assert.equal(program.registrationStatus, "CURRENT")
})

test("Australia Welder has a complete fabrication apprenticeship pathway", () => {
  const welder = getOccupationEditorial("welder")
  const australia = welder?.countries.AU

  assert.ok(welder)
  assert.ok(australia)
  assert.ok(welder.tasks.length >= 6)
  assert.match(australia.entryPathway, /MEM31925/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /no single national occupational licence/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia Welder connects to the current MEM31925 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:training-gov:MEM31925"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "welding")
  assert.equal(program.courseCode, "MEM31925")
  assert.equal(program.registrationStatus, "CURRENT")
})

test("Australia Bricklayer has a complete apprenticeship and licensing pathway", () => {
  const bricklayer = getOccupationEditorial("bricklayer")
  const australia = bricklayer?.countries.AU

  assert.ok(bricklayer)
  assert.ok(australia)
  assert.ok(bricklayer.tasks.length >= 6)
  assert.match(australia.entryPathway, /CPC33020/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /no single national Bricklayer licence/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia Bricklayer connects to the current CPC33020 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:tafe-nsw:CPC33020"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "bricklaying")
  assert.equal(program.courseCode, "CPC33020")
  assert.equal(program.registrationStatus, "CURRENT")
})

test("Australia HVAC Technician has a complete apprenticeship and refrigerant licensing pathway", () => {
  const hvac = getOccupationEditorial("hvac-technician")
  const australia = hvac?.countries.AU

  assert.ok(hvac)
  assert.ok(australia)
  assert.ok(hvac.tasks.length >= 6)
  assert.match(australia.entryPathway, /UEE32225/)
  assert.match(australia.entryPathway, /apprenticeship/i)
  assert.match(australia.registration, /Refrigerant Handling Licence/i)
  assert.match(australia.registration, /White Card/)
})

test("Australia HVAC Technician connects to the current UEE32225 shortlist record", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:training-gov:UEE32225"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "hvac")
  assert.equal(program.courseCode, "UEE32225")
  assert.equal(program.registrationStatus, "CURRENT")
})
