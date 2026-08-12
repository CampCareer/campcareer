import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260812010110_nl_business_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260812010140_nl_business_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260812010210_nl_business_links_and_programs.sql", import.meta.url), "utf8")

const businessCareers = [
  ["accountant", "2411", 39],
  ["financial-analyst", "2413", 37],
  ["business-analyst", "2421", 35],
  ["supply-chain-analyst", null, 37],
  ["human-resources-specialist", "2423", 27],
  ["marketing-specialist", "2431", 20],
  ["auditor", "2411", 30],
  ["project-manager", null, 25],
] as const

test("NL Business cohort covers the canonical eight business careers", () => {
  for (const [id] of businessCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "business")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'NL:${id}'`))
  }
})

test("NL Business preserves direct ISCO-08 mappings and explicit modern career scopes", () => {
  for (const [id, code] of businessCareers) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row, `missing profile row for ${id}`)
    if (code) assert.ok(row.includes(`'ISCO-08','2008','${code}'`), `${id} must map to ISCO-08 ${code}`)
    else assert.ok(row.includes("'NL career scope','2026-08-12',null"), `${id} must preserve explicit NL career scope`)
  }
})

test("NL Business opportunity scores preserve reviewed labour, salary, visa and burden components", () => {
  const expectedRows = [
    "'NL:accountant','2026-08-12',null,18.01,35580,20,0,0,0,8,6,0,3,2,39",
    "'NL:financial-analyst','2026-08-12',null,18.01,35580,15,0,0,0,8,6,0,3,5,37",
    "'NL:business-analyst','2026-08-12',null,18.17,34956,15,0,0,0,8,4,0,3,5,35",
    "'NL:supply-chain-analyst','2026-08-12',null,18.51,37536,15,0,0,0,8,6,0,3,5,37",
    "'NL:human-resources-specialist','2026-08-12',null,18.19,35004,5,0,0,0,8,6,0,3,5,27",
    "'NL:marketing-specialist','2026-08-12',null,17.46,33600,0,0,0,0,8,4,0,3,5,20",
    "'NL:auditor','2026-08-12',null,18.01,35580,15,0,0,0,5,6,0,3,1,30",
    "'NL:project-manager','2026-08-12',null,18.17,34956,5,0,0,0,8,4,0,3,5,25",
  ]
  for (const row of expectedRows) assert.ok(metrics.includes(row), `missing reviewed metric row: ${row}`)
  assert.equal((metrics.match(/'career-opportunity-nl-v1'/g) ?? []).length, 8)
})

test("NL Business keeps immigration access separate from shortage evidence", () => {
  assert.equal((metrics.match(/,3,/g) ?? []).length >= 8, true)
  assert.ok(metrics.includes("There is no accountant-specific Dutch immigration fast track"))
  assert.ok(metrics.includes("No Business Analyst-specific Dutch migration fast track"))
  assert.ok(metrics.includes("No project-manager-specific Dutch migration fast track"))
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
  assert.ok(links.includes("IND — Single Permit GVVA"))
  assert.ok(!metrics.includes("Green List"))
})

test("NL Business marks protected accountant and statutory-auditor scopes as registration-required", () => {
  const accountant = profiles.split("\n").find((line) => line.startsWith("('NL:accountant'"))
  const auditor = profiles.split("\n").find((line) => line.startsWith("('NL:auditor'"))
  assert.ok(accountant?.includes("'EUR',true,'Nederlandse Beroepsorganisatie van Accountants (NBA)'"))
  assert.ok(auditor?.includes("'EUR',true,'NBA / Autoriteit Financiele Markten (AFM)'"))

  for (const id of ["financial-analyst", "business-analyst", "supply-chain-analyst", "human-resources-specialist", "marketing-specialist", "project-manager"]) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NL:${id}'`))
    assert.ok(row?.includes("'EUR',false"), `${id} must not be marked universally registration-required`)
  }
  assert.ok(links.includes("NBA — Protected accountant title"))
  assert.ok(links.includes("AFM — External accountant register requirements"))
})

test("NL Business publishes an official study reference for all eight careers", () => {
  for (const marker of [
    "Studiekeuze123 — Accountancy",
    "Studiekeuze123 — Finance & Control",
    "Studiekeuze123 — Bedrijfskunde",
    "Studiekeuze123 — Logistics Management",
    "Studiekeuze123 — Human Resource Management",
    "Studiekeuze123 — Commerciele Economie",
  ]) assert.ok(links.includes(marker), `missing study reference: ${marker}`)
})

test("NL Business programme links come only from the reviewed canonical NL layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nl_v1"))
  assert.ok(links.includes("program_catalog_canonical_nl_v1"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("poc.normalized_relation_type='direct'"))
  assert.equal((links.match(/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/gi) ?? []).length, 0)
})
