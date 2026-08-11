import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811155310_nz_environment_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811155340_nz_environment_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811155410_nz_environment_links_and_programs.sql", import.meta.url), "utf8")

const environmentCareers = [
  ["environmental-scientist", "234313", 49],
  ["agronomist", "234112", 28],
  ["farm-manager", null, 29],
  ["forestry-technician", "311413", 31],
  ["food-technologist", "234212", 51],
  ["sustainability-specialist", null, 26],
  ["horticulturist", null, 27],
  ["animal-science-technician", "311111", 28],
] as const

test("NZ Environment covers the canonical eight careers", () => {
  for (const [id, code] of environmentCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "environment")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
    if (code) assert.ok(profiles.includes(`'${code}'`))
  }
})

test("NZ Environment preserves reviewed ANZSCO 1.3 scopes and conservative gaps", () => {
  assert.ok(profiles.includes("'NZ:environmental-scientist','NZ','environmental-scientist','Environmental Research Scientist (Environmental Scientist)','ANZSCO','1.3','234313'"))
  assert.ok(profiles.includes("'NZ:agronomist','NZ','agronomist','Agricultural Scientist — Agronomist specialisation','ANZSCO','1.3','234112'"))
  assert.ok(profiles.includes("'NZ:farm-manager','NZ','farm-manager','Farmer and Farm Manager — broad livestock scope','NZ career scope','2026-08-11',null"))
  assert.ok(profiles.includes("'NZ:forestry-technician','NZ','forestry-technician','Life Science Technician — Forestry Technician specialisation','ANZSCO','1.3','311413'"))
  assert.ok(profiles.includes("'NZ:food-technologist','NZ','food-technologist','Food Technologist','ANZSCO','1.3','234212'"))
  assert.ok(profiles.includes("'NZ:sustainability-specialist','NZ','sustainability-specialist','Sustainability Specialist','NZ career scope','2026-08-11',null"))
  assert.ok(profiles.includes("'NZ:horticulturist','NZ','horticulturist','Horticulturist — broad horticulture scope','NZ career scope','2026-08-11',null"))
  assert.ok(profiles.includes("'NZ:animal-science-technician','NZ','animal-science-technician','Agricultural Technician — animal science/husbandry scope','ANZSCO','1.3','311111'"))

  assert.ok(!profiles.includes("'234115'"), "Australia-only later Agronomist code must not be forced into NZ ANZSCO 1.3")
  assert.ok(!profiles.includes("'311113'"), "Australia-only later Animal Husbandry Technician code must not be forced into NZ ANZSCO 1.3")
  assert.ok(!links.includes("'NZ:sustainability-specialist','132418'"), "Chief Sustainability Officer must not be rolled into generic Sustainability Specialist")
  assert.ok(metrics.includes("later ANZSCO 2021 code 234115 is not promoted into the NZ 1.3 layer"))
  assert.ok(metrics.includes("later Australia-only 311113 Animal Husbandry Technician code is not forced into the NZ 1.3 layer"))
})

test("NZ Environment keeps Green List credit limited to exact reviewed scopes", () => {
  assert.ok(metrics.includes("'NZ:environmental-scientist','2026-08-11',null,47.84,99500,20,0,0,0,6,8,0,10,5,49"))
  assert.ok(metrics.includes("'NZ:food-technologist','2026-08-11',null,44.95,93500,20,0,0,0,8,8,0,10,5,51"))
  assert.ok(metrics.includes("Environmental Research Scientist 234313 is on the current Green List Tier 1"))
  assert.ok(metrics.includes("Food Technologist 234212 is on the current Green List Tier 1"))

  assert.ok(links.includes("'NZ:farm-manager','121313','Dairy Cattle Farmer (Dairy Cattle Farm Manager) — dairy-only Tier 2 subset',null,true,false"))
  assert.ok(metrics.includes("dairy-only subset and is not promoted to this canonical profile"))

  for (const id of ["agronomist", "farm-manager", "forestry-technician", "sustainability-specialist", "horticulturist", "animal-science-technician"]) {
    const row = metrics.split("\n").find((line) => line.startsWith(`('NZ:${id}'`))
    assert.ok(row, `${id} must have a score row`)
    assert.match(row, /,0,0,0,0,/, `${id} must not receive shortage/vacancy credit`)
  }
})

test("NZ Environment opportunity scores preserve reviewed salary and entry proxies", () => {
  const expected = [
    "'NZ:environmental-scientist','2026-08-11',null,47.84,99500,20,0,0,0,6,8,0,10,5,49",
    "'NZ:agronomist','2026-08-11',null,49.28,102500,0,0,0,0,8,10,0,5,5,28",
    "'NZ:farm-manager','2026-08-11',null,38.46,80000,0,0,0,0,15,6,0,3,5,29",
    "'NZ:forestry-technician','2026-08-11',null,35.82,74500,0,0,0,0,15,6,0,5,5,31",
    "'NZ:food-technologist','2026-08-11',null,44.95,93500,20,0,0,0,8,8,0,10,5,51",
    "'NZ:sustainability-specialist','2026-08-11',null,42.31,88000,0,0,0,0,10,8,0,3,5,26",
    "'NZ:horticulturist','2026-08-11',null,29.50,61360,0,0,0,0,15,4,0,3,5,27",
    "'NZ:animal-science-technician','2026-08-11',null,38.70,80500,0,0,0,0,12,6,0,5,5,28",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))

  assert.ok(metrics.includes("Soil and Plant Scientist annual pay range"))
  assert.ok(metrics.includes("Nursery Grower most-common hourly pay"))
  assert.ok(metrics.includes("Agricultural Technician annual pay range"))
  assert.ok(metrics.includes("career-opportunity-nz-v1"))
})

test("NZ Environment does not mark generic occupations as statutorily registered", () => {
  for (const [id] of environmentCareers) {
    const line = profiles.split("\n").find((value) => value.includes(`'NZ:${id}'`))
    assert.ok(line?.includes("'NZD',false,null,null"), `${id} must not be marked as universally statutorily registered`)
  }
})

test("NZ Environment publishes an official or transparent entry route for every career", () => {
  for (const [id] of environmentCareers) assert.ok(links.includes(`('NZ:${id}','entry_program'`), `${id} must have an entry route`)
  assert.ok(links.includes("Soil and Plant Scientist (closest agronomy route)"))
  assert.ok(links.includes("Nursery Grower (closest broad horticulture route)"))
  assert.ok(links.includes("Tahatū — Agricultural Technician"))
})

test("NZ Environment programme links come only from the reviewed NZ canonical layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!/nz-program:[0-9a-f]{8}-[0-9a-f-]{27,}/i.test(links), "generated programme UUIDs must not be hardcoded")
})
