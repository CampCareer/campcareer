import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811204310_nz_hospitality_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811204340_nz_hospitality_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811204410_nz_hospitality_links_and_programs.sql", import.meta.url), "utf8")
const migration = `${profiles}\n${metrics}\n${links}`

const hospitalityCareers = [
  ["chef", "351311", 29],
  ["cook", "351411", 27],
  ["hotel-manager", "141311", 28],
  ["restaurant-manager", "141111", 26],
  ["baker", "351111", 29],
  ["tourism-manager", "142116", 24],
  ["event-planner", "149311", 28],
  ["hospitality-supervisor", null, 25],
] as const

test("NZ Hospitality cohort covers the canonical eight hospitality careers", () => {
  for (const [id] of hospitalityCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "hospitality")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
  }
})

test("NZ Hospitality preserves conservative ANZSCO 1.3 scopes", () => {
  for (const [id, code] of hospitalityCareers) {
    if (code) assert.ok(profiles.includes(`'NZ:${id}','NZ','${id}'`) && profiles.includes(`'${code}'`))
  }

  assert.ok(profiles.includes("'NZ:tourism-manager','NZ','tourism-manager','Travel Agency Manager — tourism-management scope','ANZSCO','1.3','142116'"))
  assert.ok(profiles.includes("'NZ:hospitality-supervisor','NZ','hospitality-supervisor','Food Service Worker Supervisor — NZ career scope','NZ career scope','2026-08-11',null"))
  assert.ok(!migration.includes("471532"), "newer Australia-only Cafe or Restaurant Supervisor code must not be forced into NZ ANZSCO 1.3")
})

test("NZ Hospitality scores do not turn hospitality demand into Green List shortage credit", () => {
  for (const [id, , score] of hospitalityCareers) {
    assert.ok(metrics.includes(`'NZ:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-nz-v1'`))
  }

  assert.ok(metrics.includes("'NZ:chef','2026-08-11',null,31.00,64480,0,0,0,0,15,4,0,5,5,29"))
  assert.ok(metrics.includes("'NZ:cook','2026-08-11',null,28.00,58240,0,0,0,0,15,2,0,5,5,27"))
  assert.ok(metrics.includes("'NZ:hotel-manager','2026-08-11',null,38.70,80500,0,0,0,0,12,6,0,5,5,28"))
  assert.ok(metrics.includes("'NZ:restaurant-manager','2026-08-11',null,32.45,67500,0,0,0,0,12,4,0,5,5,26"))
  assert.ok(metrics.includes("'NZ:baker','2026-08-11',null,29.50,61360,0,0,0,0,15,4,0,5,5,29"))
  assert.ok(metrics.includes("'NZ:tourism-manager','2026-08-11',null,32.69,68000,0,0,0,0,10,4,0,5,5,24"))
  assert.ok(metrics.includes("'NZ:event-planner','2026-08-11',null,35.82,74500,0,0,0,0,12,6,0,5,5,28"))
  assert.ok(metrics.includes("'NZ:hospitality-supervisor','2026-08-11',null,28.50,59280,0,0,0,0,15,2,0,3,5,25"))
})

test("NZ Hospitality keeps NOL chef AEWV recognition separate from Green List residence scoring", () => {
  assert.ok(metrics.includes("141113 Head Chef/Executive Chef"))
  assert.ok(metrics.includes("351314 Chef de Partie"))
  assert.ok(metrics.includes("351315 Sous Chef"))
  assert.ok(metrics.includes("351311 Other Chef"))
  assert.ok(metrics.includes("351313 Demi Chef de Partie"))
  assert.ok(metrics.includes("not Green List residence credit"))
  assert.ok(links.includes("national-occupation-list-occupations-used-for-an-aewv"))
  assert.ok(links.includes("opsmanual/89117.htm"))
})

test("NZ Hospitality publishes an official or transparently labelled entry route for all eight careers", () => {
  for (const marker of [
    "T00575-chef",
    "T00580-cook",
    "T00048-accommodation-manager",
    "T00045-restaurant-manager",
    "T00861-baker",
    "T00648-travel-agent",
    "T00089-event-manager",
    "T00576-food-service-worker-supervisor",
  ]) assert.ok(links.includes(marker))

  assert.ok(links.includes("Travel Agent (tourism-management feeder proxy)"))
})

test("NZ Hospitality programme links come only from the reviewed canonical NZ programme layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(links), "no generated programme UUIDs should be hardcoded")
})

test("NZ Hospitality migration remains source-complete", () => {
  assert.ok(migration.includes("Tahatū"))
  assert.ok(migration.includes("ANZSCO"))
  assert.ok(migration.includes("career-opportunity-nz-v1"))
  assert.ok(migration.includes("Green List Appendix 13"))
})