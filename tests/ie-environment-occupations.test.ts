import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811101849_ie_environment_occupations.sql", import.meta.url),
  "utf8",
)
const sourceFix = readFileSync(
  new URL("../supabase/migrations/20260811102136_ie_environment_source_url_fix.sql", import.meta.url),
  "utf8",
)

const environmentCareers = [
  ["environmental-scientist", "2142", 19],
  ["agronomist", "2112", 43],
  ["farm-manager", "1211", 23],
  ["forestry-technician", "5119", 23],
  ["food-technologist", "2129", 19],
  ["sustainability-specialist", "2142", 19],
  ["horticulturist", "5112", 17],
  ["animal-science-technician", "3111", 31],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
}

test("Ireland Environment covers the canonical eight careers", () => {
  assert.equal(environmentCareers.length, 8)
  for (const [id, soc] of environmentCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "environment")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Environment preserves the intended SOC 2010 scopes", () => {
  for (const marker of [
    "'IE:environmental-scientist','IE','environmental-scientist','Environment professionals — environmental scientist scope','SOC','SOC 2010','2142'",
    "'IE:agronomist','IE','agronomist','Biological scientists and biochemists — Agronomist','SOC','SOC 2010','2112'",
    "'IE:farm-manager','IE','farm-manager','Managers and proprietors in agriculture and horticulture — farm manager scope','SOC','SOC 2010','1211'",
    "'IE:forestry-technician','IE','forestry-technician','Other agricultural and fishing trades n.e.c. — speciality forestry harvesting technician scope','SOC','SOC 2010','5119'",
    "'IE:food-technologist','IE','food-technologist','Engineering professionals n.e.c. — Food Technologist scope','SOC','SOC 2010','2129'",
    "'IE:sustainability-specialist','IE','sustainability-specialist','Environment professionals — sustainability specialist scope','SOC','SOC 2010','2142'",
    "'IE:horticulturist','IE','horticulturist','Horticultural trades — practical horticulturist scope','SOC','SOC 2010','5112'",
    "'IE:animal-science-technician','IE','animal-science-technician','Laboratory technicians — animal-science / laboratory animal-technician scope','SOC','SOC 2010','3111'",
  ]) assert.ok(migration.includes(marker))
})

test("Ireland Environment keeps salary vacancy and growth inputs unscored", () => {
  for (const [id] of environmentCareers) {
    const row = metricRow(id)
    assert.ok(row, `${id} metric row must exist`)
    assert.match(row, /'2026-08-11',null,null,null,/)
    assert.ok(row.includes("'career-opportunity-ie-v1','provisional'"))
  }
})

test("Ireland Environment scores only bounded shortage evidence", () => {
  assert.match(metricRow("agronomist")!, /null,null,null,20,0,0,0,8,0,0,10,5,43/)
  assert.match(metricRow("animal-science-technician")!, /null,null,null,10,0,0,0,10,0,0,6,5,31/)

  for (const id of [
    "environmental-scientist",
    "farm-manager",
    "forestry-technician",
    "food-technologist",
    "sustainability-specialist",
    "horticulturist",
  ]) {
    assert.match(metricRow(id)!, /null,null,null,0,0,0,0,/)
  }

  assert.ok(migration.includes("Agronomist was added to the Critical Skills Occupations List"))
  assert.ok(migration.includes("Because the canonical Animal Science Technician is narrower than the published lab-technician group, partial credit 10/20 is used"))
  assert.ok(migration.includes("green-transition demand for scientists and engineers but does not publish an exact Environmental Scientist shortage"))
})

test("Ireland Environment preserves permit scope boundaries", () => {
  assert.ok(migration.includes("Agronomist is explicitly listed under SOC 2112"))
  assert.ok(migration.includes("Professional Forester under SOC 1213 is a separate current Critical Skills employment and is not borrowed"))
  assert.ok(migration.includes("speciality forestry harvesting technician. This exact exception scope receives ordinary GEP accessibility 6/10"))
  assert.ok(migration.includes("SOC 5112 Horticultural trades is on the current Ineligible List effective 13 May 2026; 0/10"))
  assert.ok(migration.includes("Professional/managerial SOC 1211 is kept separate from hands-on Farmers SOC 5111"))
  assert.ok(migration.includes("Food Technologist is not silently reclassified as a 2112 manufacturing biological scientist"))
  assert.ok(migration.includes("General animal-care, veterinary-nursing and farm-worker roles are not rolled into this laboratory/research technical profile"))

  assert.match(metricRow("agronomist")!, /,10,5,43,/)
  assert.match(metricRow("horticulturist")!, /,0,5,17,/)
})

test("Ireland Environment keeps all eight broad profiles non-licensed", () => {
  for (const [id, soc] of environmentCareers) {
    assert.ok(migration.includes(`'IE:${id}','IE','${id}'`))
    const profileRow = migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
    assert.ok(profileRow)
    assert.ok(profileRow.includes(`'${soc}','EUR',false,null,null`))
  }
})

test("Ireland Environment publishes only verified structured entry routes", () => {
  assert.ok(migration.includes("'IE:farm-manager','entry_program','Teagasc — Farm Manager Apprenticeship'"))
  assert.ok(migration.includes("'IE:forestry-technician','entry_program','Teagasc — Level 5 + Level 6 Forestry pathway'"))
  assert.ok(migration.includes("'IE:horticulturist','entry_program','Teagasc — Horticulturist Apprenticeship and land-based pathways'"))
  assert.ok(migration.includes("'IE:animal-science-technician','entry_program','SOLAS — Laboratory Assistant traineeship (related technical route)'"))

  const entryRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('IE:") && line.includes("'entry_program'"))
  assert.equal(entryRows.length, 4)
})

test("Ireland Environment does not publish Tier B programme relations", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})

test("Ireland Environment fixes the Horticulturist DETE source URL in a follow-up migration", () => {
  assert.ok(sourceFix.includes("IE:horticulturist"))
  assert.ok(sourceFix.includes("employment-permits/employment-permit-eligibility/ineligible-categories-of-employment/"))
})
