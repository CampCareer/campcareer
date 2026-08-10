import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810201558_uk_hospitality_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810201629_uk_hospitality_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810201654_uk_hospitality_links_and_programs.sql", import.meta.url), "utf8")
const migration = `${profiles}\n${metrics}\n${links}`

const hospitalityCareers = [
  ["chef", "5434", 27],
  ["cook", "5435", 20],
  ["hotel-manager", "1221", 26],
  ["restaurant-manager", "1222", 24],
  ["baker", "5432", 27],
  ["tourism-manager", "1225", 22],
  ["event-planner", "3557", 24],
  ["hospitality-supervisor", "9261", 20],
] as const

test("UK Hospitality cohort covers the canonical eight hospitality careers", () => {
  for (const [id, soc] of hospitalityCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "hospitality")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${soc}'`))
  }
})

test("UK Hospitality preserves exact SOC scopes", () => {
  for (const fragment of [
    "'UK:chef','5434/00'",
    "'UK:cook','5435/00'",
    "'UK:restaurant-manager','1222/01'",
    "'UK:baker','5432/01'",
    "'UK:hospitality-supervisor','9261/00'",
    "'UK:hotel-manager','1221'",
    "'UK:tourism-manager','1225'",
    "'UK:event-planner','3557'",
  ]) assert.ok(links.includes(fragment))
})

test("UK Hospitality opportunity scores keep shortage at zero and model visa restrictions", () => {
  for (const [id, , score] of hospitalityCareers) {
    assert.ok(metrics.includes(`'UK:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-uk-v1'`))
  }

  assert.ok(metrics.includes("'UK:chef','2026-08-10',null,17.13,33400,0,0,0,0,15,4,0,3,5,27"))
  assert.ok(metrics.includes("'UK:baker','2026-08-10',null,17.13,33400,0,0,0,0,15,4,0,3,5,27"))
  assert.ok(metrics.includes("'UK:hotel-manager','2026-08-10',null,19.64,38300,0,0,0,0,12,6,0,3,5,26"))
  assert.ok(metrics.includes("'UK:restaurant-manager','2026-08-10',null,17.13,33400,0,0,0,0,12,4,0,3,5,24"))
  assert.ok(metrics.includes("'UK:tourism-manager','2026-08-10',null,18.46,36000,0,0,0,0,8,6,0,3,5,22"))
  assert.ok(metrics.includes("'UK:event-planner','2026-08-10',null,17.13,33400,0,0,0,0,12,4,0,3,5,24"))
  assert.ok(metrics.includes("'UK:cook','2026-08-10',null,null,17885,0,0,0,0,15,0,0,0,5,20"))
  assert.ok(metrics.includes("'UK:hospitality-supervisor','2026-08-10',null,null,22552,0,0,0,0,15,0,0,0,5,20"))
  assert.ok(metrics.includes("Home Office Table 6"))
  assert.ok(metrics.includes("not eligible for Skilled Worker sponsorship"))
  assert.ok(metrics.includes("not on the current TSL"))
})

test("UK Hospitality publishes all eight official entry routes", () => {
  for (const marker of ["OCC0227", "OCC0589", "OCC0229C", "OCC0229B", "OCC0191A", "OCC0340", "st0168-v1-1", "OCC0230D"]) {
    assert.ok(links.includes(marker))
  }
})

test("UK Hospitality publishes only the four verified canonical university programme links", () => {
  const programRefs = links.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 4)
  for (const marker of [
    "uk-program:f5988612-a95f-2dca-ae54-dee1be4ad369",
    "uk-program:e6deefad-a4ca-6801-11d3-ef8fc07570d0",
    "uk-program:23c7fc3c-1077-6460-7fe3-e71e75811469",
  ]) assert.ok(links.includes(marker))

  for (const id of ["chef", "cook", "baker", "hospitality-supervisor"]) {
    assert.ok(!links.includes(`UK:${id}','uk-program:`))
  }
})

test("UK Hospitality migration remains source-complete", () => {
  assert.ok(migration.includes("Appendix Skilled Occupations"))
  assert.ok(migration.includes("career-opportunity-uk-v1"))
  assert.ok(migration.includes("Skills England"))
})
