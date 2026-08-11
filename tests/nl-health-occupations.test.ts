import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811221410_nl_health_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811221440_nl_health_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811221510_nl_health_links_and_programs.sql", import.meta.url), "utf8")

const healthCareers = [
  ["registered-nurse", "2221", 38],
  ["midwife", "2222", 33],
  ["care-worker", "5321", 49],
  ["physiotherapist", "2264", 36],
  ["medical-lab-tech", "3212", 41],
  ["radiographer", "3211", 35],
  ["pharmacist", "2262", 28],
  ["occupational-therapist", "2269", 35],
] as const

test("NL Health cohort covers the canonical eight health careers", () => {
  for (const [id] of healthCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "health")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'NL:${id}'`))
  }
})

test("NL Health preserves reviewed ISCO-08 mappings", () => {
  for (const [id, code] of healthCareers) {
    assert.ok(profiles.includes(`'NL:${id}','NL','${id}'`))
    assert.ok(profiles.includes(`'ISCO-08','2008','${code}'`))
  }
})

test("NL Health opportunity scores preserve reviewed shortage, salary, visa and burden components", () => {
  const expectedRows = [
    "'NL:registered-nurse','2026-08-11',null,null,37536,20,0,0,0,8,6,0,3,1,38",
    "'NL:midwife','2026-08-11',null,null,43788,15,0,0,0,6,8,0,3,1,33",
    "'NL:care-worker','2026-08-11',null,21.00,43680,20,0,0,0,15,8,0,3,3,49",
    "'NL:physiotherapist','2026-08-11',null,null,33024,20,0,0,0,8,4,0,3,1,36",
    "'NL:medical-lab-tech','2026-08-11',null,19.00,39520,15,0,0,0,12,6,0,3,5,41",
    "'NL:radiographer','2026-08-11',null,null,37428,15,0,0,0,8,6,0,3,3,35",
    "'NL:pharmacist','2026-08-11',null,null,40524,10,0,0,0,6,8,0,3,1,28",
    "'NL:occupational-therapist','2026-08-11',null,null,35940,15,0,0,0,8,6,0,3,3,35",
  ]

  for (const row of expectedRows) assert.ok(metrics.includes(row), `missing reviewed metric row: ${row}`)
  assert.equal((metrics.match(/'career-opportunity-nl-v1'/g) ?? []).length, 8)
})

test("NL Health keeps BIG Article 3 registration separate from Article 34 title protection", () => {
  for (const id of ["registered-nurse", "midwife", "physiotherapist", "pharmacist"]) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    assert.ok(row.includes("'EUR',true,'BIG-register'"), `${id} must require BIG registration`)
  }

  for (const id of ["care-worker", "medical-lab-tech", "radiographer", "occupational-therapist"]) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    assert.ok(row.includes("'EUR',false"), `${id} must not be marked Article 3 BIG-registration-required`)
  }

  assert.ok(links.includes("BIG-register — Article 34 occupations"))
  assert.ok(metrics.includes("Verzorgende IG is an Article 34 protected education title"))
  assert.ok(metrics.includes("Radiodiagnostisch laborant is an Article 34 protected education title"))
  assert.ok(metrics.includes("Ergotherapeut is an Article 34 protected education title"))
})

test("NL Health keeps migration access separate from labour-shortage evidence", () => {
  assert.ok(metrics.includes("There is no nurse-specific Dutch migration fast track"))
  assert.ok(metrics.includes("No physiotherapist-specific Dutch migration fast track"))
  assert.ok(metrics.includes("Pharmacist status does not itself create an IND fast track"))
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
  assert.ok(links.includes("IND — Single Permit GVVA"))
  assert.ok(links.includes("IND — 2026 required income amounts"))
})

test("NL Health publishes an official entry reference for all eight careers", () => {
  for (const marker of [
    "Studiekeuze123 — Verpleegkunde",
    "Studiekeuze123 — Verloskunde",
    "KiesMBO — Verzorgende IG",
    "Studiekeuze123 — Fysiotherapie",
    "KiesMBO — Biologisch medisch analist",
    "Studiekeuze123 — Medisch Beeldvormende en Radiotherapeutische Technieken",
    "Studiekeuze123 — Farmacie",
    "Studiekeuze123 — Ergotherapie",
  ]) assert.ok(links.includes(marker), `missing entry reference: ${marker}`)
})

test("NL Health programme links come only from the reviewed canonical NL layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nl_v1"))
  assert.ok(links.includes("program_catalog_canonical_nl_v1"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("poc.normalized_relation_type='direct'"))
  assert.equal((links.match(/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/gi) ?? []).length, 0)
})
