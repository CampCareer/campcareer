import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810175304_uk_environment_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810175341_uk_environment_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810175419_uk_environment_links_and_programs.sql", import.meta.url), "utf8")
const migration = `${profiles}\n${metrics}\n${links}`

const environmentCareers = [
  ["environmental-scientist", "2152", 24],
  ["agronomist", "2112", 31],
  ["farm-manager", "1211", 26],
  ["forestry-technician", "9112", 20],
  ["food-technologist", "2129", 35],
  ["sustainability-specialist", "2152", 22],
  ["horticulturist", "5112", 27],
  ["animal-science-technician", "3111", 31],
] as const

test("UK Environment cohort covers the canonical eight environment careers", () => {
  for (const [id, soc] of environmentCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "environment")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${soc}'`))
  }
})

test("UK Environment preserves exact SOC scopes instead of promoting adjacent roles", () => {
  for (const fragment of [
    "'UK:environmental-scientist','2152/04'",
    "'UK:agronomist','2112/01'",
    "'UK:forestry-technician','9112/01'",
    "'UK:food-technologist','2129/06'",
    "'UK:sustainability-specialist','2152/05'",
  ]) assert.ok(links.includes(fragment))

  assert.ok(!links.includes("'UK:forestry-technician','1212/03'"))
  assert.ok(metrics.includes("laboratory animal-technologist work within SOC 3111, not general animal-care SOC 6129"))
})

test("UK Environment opportunity scores separate immigration access from shortage evidence", () => {
  const expected = [
    ["environmental-scientist", 24],
    ["agronomist", 31],
    ["farm-manager", 26],
    ["forestry-technician", 20],
    ["food-technologist", 35],
    ["sustainability-specialist", 22],
    ["horticulturist", 27],
    ["animal-science-technician", 31],
  ] as const
  for (const [id, score] of expected) {
    assert.ok(metrics.includes(`'UK:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-uk-v1'`))
  }

  assert.ok(metrics.includes("'UK:agronomist','2026-08-10',null,20.67,40300,0,0,0,0,8,8,0,10,5,31"))
  assert.ok(metrics.includes("'UK:animal-science-technician','2026-08-10',77000,17.13,33400,0,0,0,0,15,4,0,10,2,31"))
  assert.ok(metrics.includes("recommended no future TSL access"))
  assert.ok(metrics.includes("'UK:farm-manager','2026-08-10',null,18.41,35900,0,0,0,0,12,6,0,3,5,26"))
  assert.ok(metrics.includes("'UK:forestry-technician','2026-08-10',null,null,25864,0,0,0,0,15,0,0,0,5,20"))
})

test("UK Environment publishes all eight official entry routes", () => {
  for (const marker of ["OCC0778","OCC0761A","OCC1320","OCC1321A","OCC0198A","OCC0748","OCC0018A","st0058-v1-2"]) {
    assert.ok(links.includes(marker))
  }
})

test("UK Environment publishes only the six verified canonical university programme links", () => {
  const programRefs = links.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 6)
  for (const marker of [
    "uk-program:003921de-2a12-3ae1-3cb9-dc9f58dc9692",
    "uk-program:04d6da87-cb49-560b-5fff-32a862d13082",
    "uk-program:2f268342-0d5b-eb39-88b1-3832bef24ecb",
    "uk-program:df7ff5ef-7ad3-8ddf-0c87-f98e26440316",
  ]) assert.ok(links.includes(marker))
  assert.ok(!links.includes("UK:forestry-technician','uk-program:"))
  assert.ok(!links.includes("UK:animal-science-technician','uk-program:"))
})
