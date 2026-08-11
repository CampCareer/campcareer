import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811021152_nz_engineering_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811021230_nz_engineering_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811021257_nz_engineering_links_and_programs.sql", import.meta.url), "utf8")

const engineeringCareers = [
  ["civil-engineer", "233211", 53],
  ["mechanical-engineer", "233512", 51],
  ["electrical-engineer", "233311", 52],
  ["manufacturing-engineer", "233513", 53],
  ["industrial-engineer", "233511", 51],
  ["chemical-engineer", "233111", 53],
  ["environmental-engineer", "233915", 53],
  ["engineering-technician", "312999", 31],
] as const

const greenListProfessionalEngineers = engineeringCareers.slice(0, 7)

test("NZ Engineering covers the canonical eight careers", () => {
  for (const [id] of engineeringCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "engineering")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
  }
})

test("NZ Engineering preserves reviewed ANZSCO mappings", () => {
  for (const [id, code] of engineeringCareers) {
    assert.ok(profiles.includes(`'NZ:${id}'`) && profiles.includes(`'${code}'`))
  }

  assert.ok(profiles.includes("Production or Plant Engineer — manufacturing engineering scope"))
  assert.ok(!profiles.includes("'NZ:manufacturing-engineer','NZ','manufacturing-engineer','Industrial Engineer'"))
  assert.ok(profiles.includes("'NZ:engineering-technician','NZ','engineering-technician','Building and Engineering Technicians nec — general engineering technician scope','ANZSCO','1.3','312999'"))
  for (const code of ["312212", "312312", "312412", "312512"]) {
    assert.ok(!profiles.includes(`'NZ:engineering-technician','NZ','engineering-technician'`) || !profiles.includes(`'NZ:engineering-technician','NZ','engineering-technician','${code}'`))
  }
})

test("NZ Engineering scores seven current Tier 1 professional engineers and keeps technician future policy separate", () => {
  const expected = [
    "'NZ:civil-engineer','2026-08-11',null,56.49,117500,20,0,0,0,8,10,0,10,5,53",
    "'NZ:mechanical-engineer','2026-08-11',null,47.36,98500,20,0,0,0,8,8,0,10,5,51",
    "'NZ:electrical-engineer','2026-08-11',null,55.77,116000,20,0,0,0,8,10,0,10,4,52",
    "'NZ:manufacturing-engineer','2026-08-11',null,45.19,94000,20,0,0,0,10,8,0,10,5,53",
    "'NZ:industrial-engineer','2026-08-11',null,47.36,98500,20,0,0,0,8,8,0,10,5,51",
    "'NZ:chemical-engineer','2026-08-11',null,53.37,111000,20,0,0,0,8,10,0,10,5,53",
    "'NZ:environmental-engineer','2026-08-11',null,51.68,107500,20,0,0,0,8,10,0,10,5,53",
    "'NZ:engineering-technician','2026-08-11',null,38.22,79500,0,0,0,0,15,6,0,5,5,31",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))

  for (const [id] of greenListProfessionalEngineers) {
    assert.ok(metrics.includes(`'NZ:${id}'`))
    assert.ok(links.includes(`('NZ:${id}','source','Immigration New Zealand — Green List'`))
  }

  assert.ok(metrics.includes("24 August 2026"))
  assert.ok(metrics.includes("is not pre-scored on 11 August 2026"))
  assert.ok(metrics.includes("No current Green List credit is assigned to generic 312999"))
  assert.ok(links.includes("SMC Trades and Technician pathway from 24 August 2026"))
  assert.ok(metrics.includes("career-opportunity-nz-v1"))
})

test("NZ Engineering keeps registration conditional rather than universally flagging engineers", () => {
  assert.equal((profiles.match(/'NZD',false,null,null,'profile_ready'/g) ?? []).length, 8)
  assert.ok(metrics.includes("EWRB registration and current practising licence"))
  assert.ok(metrics.includes("Engineering New Zealand states engineers do not generally have to be registered"))
})

test("NZ Engineering publishes an official Tahatū entry route for every career", () => {
  for (const [id] of engineeringCareers) {
    assert.ok(links.includes(`('NZ:${id}','entry_program'`), `${id} must have an entry route`)
  }
  assert.ok(links.includes("Mechanical Engineering Technician (representative general route)"))
})

test("NZ Engineering programme links come only from the reviewed NZ canonical layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!links.includes("'nz-program:"), "generated programme UUIDs must not be hardcoded")
})
