import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810223330_nz_technology_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810223359_nz_technology_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810223427_nz_technology_links_and_programs.sql", import.meta.url), "utf8")

const technologyCareers = [
  ["software-developer", "261312", 53],
  ["data-analyst", null, 28],
  ["data-engineer", null, 28],
  ["cybersecurity-analyst", "262112", 50],
  ["network-administrator", "263112", 30],
  ["cloud-engineer", null, 26],
  ["database-administrator", "262111", 46],
  ["ict-support-technician", "313112", 31],
] as const

test("NZ Technology covers the canonical eight careers", () => {
  for (const [id] of technologyCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "technology")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
  }
})

test("NZ Technology preserves exact ANZSCO mappings and refuses false modern-title mappings", () => {
  for (const [id, code] of technologyCareers) {
    if (code) assert.ok(profiles.includes(`'NZ:${id}'`) && profiles.includes(`'${code}'`))
  }

  for (const id of ["data-analyst", "data-engineer", "cloud-engineer"]) {
    assert.ok(profiles.includes(`'NZ:${id}'`))
    assert.ok(profiles.includes(`'NZ career scope','2026-08-10',null`))
  }

  assert.ok(!profiles.includes("'NZ:data-analyst','NZ','data-analyst','Data Analyst','ANZSCO','1.3','224114'"))
  assert.ok(!profiles.includes("'NZ:data-engineer','NZ','data-engineer','Data Engineer','ANZSCO'"))
  assert.ok(!profiles.includes("'NZ:cloud-engineer','NZ','cloud-engineer','Cloud Engineer','ANZSCO'"))
})

test("NZ Technology scoring treats high-paid Green List ICT roles as conditional", () => {
  const expected = [
    "'NZ:software-developer','2026-08-10',null,58.65,122000,15,0,0,0,15,10,0,8,5,53",
    "'NZ:data-analyst','2026-08-10',null,45.91,95500,0,0,0,0,12,8,0,3,5,28",
    "'NZ:data-engineer','2026-08-10',null,50.24,104500,0,0,0,0,10,10,0,3,5,28",
    "'NZ:cybersecurity-analyst','2026-08-10',null,57.21,119000,15,0,0,0,12,10,0,8,5,50",
    "'NZ:network-administrator','2026-08-10',null,44.47,92500,0,0,0,0,12,8,0,5,5,30",
    "'NZ:cloud-engineer','2026-08-10',null,42.07,87500,0,0,0,0,10,8,0,3,5,26",
    "'NZ:database-administrator','2026-08-10',null,45.67,95000,15,0,0,0,10,8,0,8,5,46",
    "'NZ:ict-support-technician','2026-08-10',null,37.98,79000,0,0,0,0,15,6,0,5,5,31",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))

  assert.ok(metrics.includes("NZD 72.80/hour"))
  assert.ok(metrics.includes("NZD 70.00/hour"))
  assert.ok(metrics.includes("career-opportunity-nz-v1"))
})

test("NZ Technology does not borrow Green List status for proxy-coded modern roles", () => {
  assert.ok(metrics.includes("No Green List status is borrowed from programmer or database occupations"))
  assert.ok(metrics.includes("No Green List credit is borrowed from Systems Administrator"))
  assert.ok(metrics.includes("NOL 224118 is explicitly Data Analyst (Non-ICT)"))
  assert.ok(metrics.includes("classification ambiguity is scored conservatively at 3/10"))
})

test("NZ Technology has no statutory registration flags", () => {
  assert.equal((profiles.match(/'NZD',false,null,null,'profile_ready'/g) ?? []).length, 8)
})

test("NZ Technology publishes an official Tahatū entry route for every career", () => {
  for (const id of technologyCareers.map(([id]) => id)) {
    assert.ok(links.includes(`('NZ:${id}','entry_program'`), `${id} must have an entry route`)
  }
})

test("NZ Technology programme links are derived from the reviewed NZ canonical layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!links.includes("'NZ:cybersecurity-analyst','nz-program:"))
  assert.ok(!links.includes("'NZ:network-administrator','nz-program:"))
  assert.ok(!links.includes("'NZ:ict-support-technician','nz-program:"))
})
