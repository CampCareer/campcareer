import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260812005110_nl_engineering_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260812005140_nl_engineering_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260812005210_nl_engineering_links_and_programs.sql", import.meta.url), "utf8")

const engineeringCareers = [
  ["civil-engineer", "2142", 37],
  ["mechanical-engineer", "2144", 37],
  ["electrical-engineer", "2151", 42],
  ["manufacturing-engineer", "2141", 37],
  ["industrial-engineer", "2141", 37],
  ["chemical-engineer", "2145", 32],
  ["environmental-engineer", "2143", 37],
  ["engineering-technician", "3119", 41],
] as const

test("NL Engineering cohort covers the canonical eight engineering careers", () => {
  for (const [id] of engineeringCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "engineering")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'NL:${id}'`))
  }
})

test("NL Engineering preserves reviewed ISCO-08 mappings and overlapping 2141 scopes", () => {
  for (const [id, code] of engineeringCareers) {
    assert.ok(profiles.includes(`'NL:${id}','NL','${id}'`))
    assert.ok(profiles.includes(`'ISCO-08','2008','${code}'`))
  }

  assert.ok(profiles.includes("Industrial and Production Engineer — manufacturing engineering scope"))
  assert.ok(profiles.includes("Industrial and Production Engineer — industrial/process optimisation scope"))
  assert.ok(profiles.includes("Physical and Engineering Science Technician n.e.c. — general engineering technician scope"))
  assert.ok(metrics.includes("broad cross-discipline Engineering Technician proxy"))
})

test("NL Engineering opportunity scores preserve reviewed shortage, salary and visa components", () => {
  const expectedRows = [
    "'NL:civil-engineer','2026-08-12',null,19.12,38772,15,0,0,0,8,6,0,3,5,37",
    "'NL:mechanical-engineer','2026-08-12',null,18.54,37596,15,0,0,0,8,6,0,3,5,37",
    "'NL:electrical-engineer','2026-08-12',null,19.35,38244,20,0,0,0,8,6,0,3,5,42",
    "'NL:manufacturing-engineer','2026-08-12',null,19.20,38940,15,0,0,0,8,6,0,3,5,37",
    "'NL:industrial-engineer','2026-08-12',null,19.20,38940,15,0,0,0,8,6,0,3,5,37",
    "'NL:chemical-engineer','2026-08-12',null,18.41,36384,10,0,0,0,8,6,0,3,5,32",
    "'NL:environmental-engineer','2026-08-12',null,18.92,35424,15,0,0,0,8,6,0,3,5,37",
    "'NL:engineering-technician','2026-08-12',null,18.11,36732,15,0,0,0,12,6,0,3,5,41",
  ]

  for (const row of expectedRows) assert.ok(metrics.includes(row), `missing reviewed metric row: ${row}`)
  assert.equal((metrics.match(/'career-opportunity-nl-v1'/g) ?? []).length, 8)
})

test("NL Engineering keeps current shortage evidence separate from migration access", () => {
  assert.ok(metrics.includes("UWV Q1 2026 explicitly names electrical engineers"))
  assert.ok(metrics.includes("No Civil Engineer-specific immigration fast track"))
  assert.ok(metrics.includes("No Mechanical Engineer-specific Dutch immigration fast track"))
  assert.ok(metrics.includes("No Electrical Engineer-specific Dutch immigration fast track"))
  assert.ok(metrics.includes("No Manufacturing Engineer-specific migration fast track"))
  assert.ok(metrics.includes("No Industrial Engineer-specific migration fast track"))
  assert.ok(metrics.includes("No Chemical Engineer-specific Dutch immigration fast track"))
  assert.ok(metrics.includes("No Environmental Engineer-specific Dutch immigration fast track"))
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
  assert.ok(links.includes("IND — Single Permit GVVA"))
  assert.ok(links.includes("IND — 2026 required income amounts"))
})

test("NL Engineering marks no generic engineering profile as universally registration-required", () => {
  for (const [id] of engineeringCareers) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    assert.ok(row.includes("'EUR',false"), `${id} must not be marked universally registration-required`)
  }
})

test("NL Engineering publishes an official study entry reference for all eight careers", () => {
  for (const marker of [
    "Studiekeuze123 — Civiele Techniek",
    "Studiekeuze123 — Werktuigbouwkunde",
    "Studiekeuze123 — Elektrotechniek",
    "Studiekeuze123 — Technische Bedrijfskunde",
    "Studiekeuze123 — Chemische Technologie",
    "Studiekeuze123 — Milieukunde",
    "Studiekeuze123 — Engineering Associate Degree",
  ]) assert.ok(links.includes(marker), `missing entry reference: ${marker}`)

  assert.ok(links.includes("'NL:manufacturing-engineer','entry_program','Studiekeuze123 — Engineering'"))
})

test("NL Engineering programme links come only from the reviewed canonical NL layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nl_v1"))
  assert.ok(links.includes("program_catalog_canonical_nl_v1"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("poc.normalized_relation_type='direct'"))
  assert.equal((links.match(/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/gi) ?? []).length, 0)
})
