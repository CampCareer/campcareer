import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811220010_nl_construction_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811220040_nl_construction_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811220110_nl_construction_links_and_programs.sql", import.meta.url), "utf8")

const constructionCareers = [
  ["carpenter", "7115", 44],
  ["electrician", "7411", 49],
  ["plumber", "7126", 49],
  ["wall-floor-tiler", "7122", 44],
  ["welder", "7212", 42],
  ["bricklayer", "7112", 49],
  ["hvac-technician", "7127", 46],
  ["construction-manager", "1323", 42],
] as const

test("NL Construction cohort covers the canonical eight construction careers", () => {
  for (const [id] of constructionCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "construction")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'NL:${id}'`))
  }
})

test("NL Construction preserves exact ISCO-08 mappings", () => {
  for (const [id, code] of constructionCareers) {
    assert.ok(profiles.includes(`'NL:${id}','NL','${id}'`))
    assert.ok(profiles.includes(`'ISCO-08','2008','${code}'`))
  }
})

test("NL Construction opportunity scores preserve reviewed shortage, salary and visa components", () => {
  const expectedRows = [
    "'NL:carpenter','2026-08-11',null,19.00,39520,15,0,0,0,15,6,0,3,5,44",
    "'NL:electrician','2026-08-11',null,18.00,37440,20,0,0,0,15,6,0,3,5,49",
    "'NL:plumber','2026-08-11',null,17.00,35360,20,0,0,0,15,6,0,3,5,49",
    "'NL:wall-floor-tiler','2026-08-11',null,19.00,39520,15,0,0,0,15,6,0,3,5,44",
    "'NL:welder','2026-08-11',null,15.00,31200,15,0,0,0,15,4,0,3,5,42",
    "'NL:bricklayer','2026-08-11',null,19.00,39520,20,0,0,0,15,6,0,3,5,49",
    "'NL:hvac-technician','2026-08-11',null,18.00,37440,20,0,0,0,15,6,0,3,2,46",
    "'NL:construction-manager','2026-08-11',null,19.08,38688,20,0,0,0,8,6,0,3,5,42",
  ]

  for (const row of expectedRows) assert.ok(metrics.includes(row), `missing reviewed metric row: ${row}`)
  assert.equal((metrics.match(/'career-opportunity-nl-v1'/g) ?? []).length, 8)
})

test("NL Construction keeps migration access separate from shortage evidence", () => {
  assert.ok(metrics.includes("The Netherlands has no carpenter-specific migration fast track"))
  assert.ok(metrics.includes("No electrician-specific residence or work-permit fast track"))
  assert.ok(metrics.includes("There is no plumber-specific Dutch migration fast track"))
  assert.ok(metrics.includes("Highly Skilled Migrant access requires a recognised sponsor"))
  assert.ok(links.includes("IND — Single Permit GVVA"))
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
})

test("NL Construction marks only HVAC as universally registration-required", () => {
  assert.ok(profiles.includes("'NL:hvac-technician','NL','hvac-technician','Air-conditioning and refrigeration mechanic / Koude- en klimaatsysteemmonteur','ISCO-08','2008','7127','EUR',true"))

  for (const id of ["carpenter", "electrician", "plumber", "wall-floor-tiler", "welder", "bricklayer", "construction-manager"]) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    assert.ok(row.includes("'EUR',false"), `${id} must not be marked universally registration-required`)
  }

  assert.ok(links.includes("CO-vrij gas-installation safety"))
  assert.ok(metrics.includes("task/company scope rather than universal personal registration"))
  assert.ok(links.includes("BRL 200 requirements for technicians"))
})

test("NL Construction publishes an official entry reference for all eight careers", () => {
  for (const marker of [
    "KiesMBO — Timmerman",
    "KiesMBO — Monteur elektrotechnische installaties",
    "KiesMBO — Monteur werktuigkundige installaties",
    "KiesMBO — Tegelzetter",
    "KiesMBO — Medewerker productietechniek (welding route)",
    "KiesMBO — Metselaar",
    "KiesMBO — Monteur koude- en klimaatsystemen",
    "KiesMBO — Middenkaderfunctionaris Bouw",
  ]) assert.ok(links.includes(marker), `missing entry reference: ${marker}`)
})

test("NL Construction programme links come only from the reviewed canonical NL layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nl_v1"))
  assert.ok(links.includes("program_catalog_canonical_nl_v1"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("poc.normalized_relation_type='direct'"))
  assert.equal((links.match(/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/gi) ?? []).length, 0)
})
