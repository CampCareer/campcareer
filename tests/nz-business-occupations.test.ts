import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811022744_nz_business_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811022816_nz_business_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811022847_nz_business_links_and_programs.sql", import.meta.url), "utf8")

const businessCareers = [
  ["accountant", "221111", 30],
  ["financial-analyst", "221111", 28],
  ["business-analyst", "224711", 26],
  ["supply-chain-analyst", null, 26],
  ["human-resources-specialist", "223111", 30],
  ["marketing-specialist", "225113", 35],
  ["auditor", "2212", 54],
  ["project-manager", null, 30],
] as const

test("NZ Business covers the canonical eight careers", () => {
  for (const [id] of businessCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "business")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
  }
})

test("NZ Business preserves reviewed ANZSCO mappings without borrowing related codes", () => {
  for (const [id, code] of businessCareers) {
    if (code) assert.ok(profiles.includes(`'NZ:${id}'`) && profiles.includes(`'${code}'`))
  }

  for (const id of ["supply-chain-analyst", "project-manager"]) {
    assert.ok(profiles.includes(`'NZ:${id}'`))
    assert.ok(profiles.includes(`'NZ career scope','2026-08-11',null`))
  }

  assert.ok(!profiles.includes("'NZ:supply-chain-analyst','NZ','supply-chain-analyst','Supply Chain Analyst','ANZSCO','1.3','224714'"))
  assert.ok(!profiles.includes("'NZ:project-manager','NZ','project-manager','Project Manager','ANZSCO','1.3','133111'"))
  assert.ok(!profiles.includes("'NZ:project-manager','NZ','project-manager','Project Manager','ANZSCO','1.3','135112'"))
  assert.ok(!profiles.includes("'NZ:business-analyst','NZ','business-analyst','ICT Business Analyst'"))
  assert.ok(!profiles.includes("'NZ:financial-analyst','NZ','financial-analyst','Financial Investment Adviser'"))
})

test("NZ Business scoring separates the current auditor Tier 1 signal from other business careers", () => {
  const expected = [
    "'NZ:accountant','2026-08-11',null,48.56,101000,0,0,0,0,10,10,0,5,5,30",
    "'NZ:financial-analyst','2026-08-11',null,46.88,97500,0,0,0,0,10,8,0,5,5,28",
    "'NZ:business-analyst','2026-08-11',null,46.88,97500,0,0,0,0,8,8,0,5,5,26",
    "'NZ:supply-chain-analyst','2026-08-11',null,36.78,76500,0,0,0,0,12,6,0,3,5,26",
    "'NZ:human-resources-specialist','2026-08-11',null,44.47,92500,0,0,0,0,12,8,0,5,5,30",
    "'NZ:marketing-specialist','2026-08-11',null,48.32,100500,0,0,0,0,15,10,0,5,5,35",
    "'NZ:auditor','2026-08-11',null,48.56,101000,20,0,0,0,10,10,0,10,4,54",
    "'NZ:project-manager','2026-08-11',null,51.20,106500,0,0,0,0,12,10,0,3,5,30",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))

  assert.ok(metrics.includes("221213 External Auditor and 221214 Internal Auditor"))
  assert.ok(metrics.includes("NZD 45.50/hour"))
  assert.ok(metrics.includes("24 August 2026"))
  assert.ok(metrics.includes("is not pre-scored on 11 August 2026"))
  assert.ok(metrics.includes("ICT Business Analyst 261111 benefits are not borrowed"))
  assert.ok(metrics.includes("No Green List credit is borrowed from Construction Project Manager 133111 or ICT Project Manager 135112"))
  assert.ok(metrics.includes("career-opportunity-nz-v1"))
})

test("NZ Business keeps generic profiles non-registered while recording regulated audit boundaries", () => {
  assert.equal((profiles.match(/'NZD',false,null,null,'profile_ready'/g) ?? []).length, 8)
  assert.ok(metrics.includes("auditors performing FMC audits must hold an auditor licence"))
  assert.ok(links.includes("Financial Markets Authority — auditor licensing boundary"))
})

test("NZ Business publishes an official Tahatū entry route for every career", () => {
  for (const [id] of businessCareers) {
    assert.ok(links.includes(`('NZ:${id}','entry_program'`), `${id} must have an entry route`)
  }
  assert.ok(links.includes("Logistics Specialist (closest supply-chain route)"))
})

test("NZ Business programme links come only from the reviewed NZ canonical layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!/nz-program:[0-9a-f]{8}-[0-9a-f-]{27,}/i.test(links), "generated programme UUIDs must not be hardcoded")
  for (const id of ["financial-analyst", "business-analyst", "supply-chain-analyst", "marketing-specialist"]) {
    assert.ok(!links.includes(`'NZ:${id}','nz-program:`))
  }
})
