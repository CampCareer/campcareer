import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260812004510_nl_technology_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260812004540_nl_technology_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260812004610_nl_technology_links_and_programs.sql", import.meta.url), "utf8")

const technologyCareers = [
  ["software-developer", "2512", 41],
  ["data-analyst", null, 39],
  ["data-engineer", null, 39],
  ["cybersecurity-analyst", "2529", 44],
  ["network-administrator", "2523", 41],
  ["cloud-engineer", null, 39],
  ["database-administrator", "2521", 39],
  ["ict-support-technician", "3512", 32],
] as const

test("NL Technology cohort covers the canonical eight technology careers", () => {
  for (const [id] of technologyCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "technology")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'NL:${id}'`))
  }
})

test("NL Technology preserves direct ISCO mappings and conservative no-code modern scopes", () => {
  for (const [id, code] of technologyCareers) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    if (code) {
      assert.ok(row.includes(`'ISCO-08','2008','${code}'`), `${id} must preserve ISCO-08 ${code}`)
    } else {
      assert.ok(row.includes("'NL career scope','2026-08-12',null"), `${id} must not force a legacy ISCO code`)
    }
  }

  assert.ok(profiles.includes("'NL:data-analyst','NL','data-analyst','Data Analyst / BI Analyst — Netherlands career scope'"))
  assert.ok(profiles.includes("'NL:data-engineer','NL','data-engineer','Data Engineer — database/software engineering scope'"))
  assert.ok(profiles.includes("'NL:cloud-engineer','NL','cloud-engineer','Cloud Engineer / DevOps infrastructure — Netherlands career scope'"))
})

test("NL Technology opportunity scores preserve reviewed shortage and conservative visa components", () => {
  const expectedRows = [
    "'NL:software-developer','2026-08-12',null,19.43,38400,15,0,0,0,12,6,0,3,5,41",
    "'NL:data-analyst','2026-08-12',null,19.43,38400,15,0,0,0,10,6,0,3,5,39",
    "'NL:data-engineer','2026-08-12',null,19.43,38400,15,0,0,0,10,6,0,3,5,39",
    "'NL:cybersecurity-analyst','2026-08-12',null,19.43,38400,20,0,0,0,10,6,0,3,5,44",
    "'NL:network-administrator','2026-08-12',null,19.43,38400,15,0,0,0,12,6,0,3,5,41",
    "'NL:cloud-engineer','2026-08-12',null,19.43,38400,15,0,0,0,10,6,0,3,5,39",
    "'NL:database-administrator','2026-08-12',null,19.43,38400,15,0,0,0,10,6,0,3,5,39",
    "'NL:ict-support-technician','2026-08-12',null,16.99,33564,5,0,0,0,15,4,0,3,5,32",
  ]

  for (const row of expectedRows) assert.ok(metrics.includes(row), `missing reviewed metric row: ${row}`)
  assert.equal((metrics.match(/'career-opportunity-nl-v1'/g) ?? []).length, 8)
})

test("NL Technology keeps specialised demand separate from overall ICT cooling", () => {
  assert.ok(metrics.includes("overall ICT labour-market tightness has moderated"))
  assert.ok(metrics.includes("significantly demanded"))
  assert.ok(metrics.includes("structurally promising ICT occupations"))
  assert.ok(metrics.includes("only limited shortage credit 5/20"))
  assert.ok(links.includes("UWV — ICT beroepen"))
  assert.ok(links.includes("UWV — Kansrijke beroepen hbo/wo"))
  assert.ok(links.includes("UWV — Structureel kansrijke beroepen"))
})

test("NL Technology does not convert Highly Skilled Migrant rules into an occupation fast track", () => {
  assert.equal((metrics.match(/,0,3,5,/g) ?? []).length, 8)
  assert.ok(metrics.includes("No software-developer-specific Dutch immigration fast track exists"))
  assert.ok(metrics.includes("No occupation-specific route"))
  assert.ok(metrics.includes("No cloud-engineer-specific migration fast track"))
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
  assert.ok(links.includes("IND — 2026 required income amounts"))
})

test("NL Technology marks no profile as universally registration-required", () => {
  for (const [id] of technologyCareers) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    assert.ok(row.includes("'EUR',false"), `${id} must not be marked universally registration-required`)
  }
})

test("NL Technology publishes an official study reference for all eight careers", () => {
  for (const marker of [
    "Studiekeuze123 — Informatica (HBO bachelor)",
    "Studiekeuze123 — Applied Data Science & Artificial Intelligence",
    "Studiekeuze123 — Data Science (joint degree)",
    "Studiekeuze123 — ICT (HBO bachelor; Cyber Security & Cloud variants)",
    "Studiekeuze123 — ICT (HBO bachelor)",
    "Studiekeuze123 — Business IT & Management",
    "Studiekeuze123 — ICT (associate degree)",
  ]) assert.ok(links.includes(marker), `missing study reference: ${marker}`)
})

test("NL Technology programme links come only from the reviewed canonical NL layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nl_v1"))
  assert.ok(links.includes("program_catalog_canonical_nl_v1"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("poc.normalized_relation_type='direct'"))
  assert.equal((links.match(/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/gi) ?? []).length, 0)
})
