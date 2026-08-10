import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const foundation = readFileSync(
  "supabase/migrations/20260810125846_nz_program_phase2_staging_foundation.sql",
  "utf8",
)
const seed = readFileSync(
  "supabase/migrations/20260810130426_nz_program_phase2_bounded_seed.sql",
  "utf8",
)

const stagingTables = [
  "program_catalog_nz_staging",
  "program_occupation_nz_staging",
  "program_international_nz_staging",
] as const

test("NZ Phase 2 creates private server-only staging layers", () => {
  for (const table of stagingTables) {
    assert.match(foundation, new RegExp(`CREATE TABLE public\\.${table}`))
    assert.match(foundation, new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`))
    assert.match(foundation, new RegExp(`REVOKE ALL ON public\\.${table} FROM public, anon, authenticated`))
    assert.match(foundation, new RegExp(`GRANT SELECT, INSERT, UPDATE, DELETE ON public\\.${table} TO service_role`))
  }
})

test("NZ Phase 2 seed is deliberately bounded to the occupation-led cohort", () => {
  assert.match(seed, /programme_count<>24 OR institution_count<>8/)
  assert.match(seed, /relation_count<>39 OR career_count<>35/)
  assert.match(seed, /program_occupation_match_rules/)
  assert.match(seed, /canonical 80-career target set/)
  assert.match(seed, /programmes have no approved target-career relation/)
  assert.match(seed, /source_name='NZ_OFFICIAL_2026'/)
})

test("NZ Phase 2 represents every existing university without broad catalogue expansion", () => {
  for (const providerNumber of ["7001", "7002", "7003", "7004", "7005", "7006", "7007", "7008"]) {
    assert.match(seed, new RegExp(`'${providerNumber}'`))
  }

  const expectedProgramKeys = [
    "uoa-behons-civil-engineering",
    "uoa-behons-software-engineering",
    "uoa-bsc-data-science",
    "aut-bhsc-nursing",
    "aut-bhsc-midwifery",
    "aut-bhsc-physiotherapy",
    "otago-bphysio",
    "otago-bpharm",
    "otago-bmlsc",
    "massey-bconst-construction-management",
    "massey-bfoodtech-hons",
    "massey-bav-air-transport-pilot",
    "uc-behons-electrical-electronic",
    "uc-bforestrysci",
    "uc-bswhons",
    "lincoln-bagrisci",
    "lincoln-benvmgmt",
    "lincoln-mtourismmgmt",
    "waikato-btchg-early-childhood",
    "waikato-btchg-primary",
    "waikato-bbus-accounting",
    "vuw-bdi-interaction-design",
    "vuw-bdi-communication-design",
    "vuw-bcom-hrer",
  ]

  assert.equal(new Set(expectedProgramKeys).size, 24)
  for (const key of expectedProgramKeys) assert.match(seed, new RegExp(`'${key}'`))
})

test("NZ Phase 2 keeps programme identity separate from international admission and location", () => {
  assert.match(seed, /'eligible_schedule_unknown'/)
  assert.match(seed, /'not_programme_verified'/)
  assert.match(seed, /'programme_identity_verified_context_pending'/)
  assert.match(seed, /Post Study Work Visa eligibility is qualification-sensitive/)
  assert.match(seed, /programme_delivery_verified OR programme_delivery_source_url IS NOT NULL/)
  assert.match(seed, /programme delivery locations were asserted in the bounded seed/)
})

test("NZ Phase 2 uses only canonical programme-matching career IDs", () => {
  assert.match(seed, /'software-developer'/)
  assert.match(seed, /'ux-designer'/)
  assert.match(seed, /'medical-laboratory-technician'/)
  assert.match(seed, /'human-resources-specialist'/)

  assert.doesNotMatch(seed, /'software-engineer'/)
  assert.doesNotMatch(seed, /'ux-ui-designer'/)
  assert.doesNotMatch(seed, /'medical-laboratory-scientist'/)
  assert.doesNotMatch(seed, /'dentist'/)
  assert.doesNotMatch(seed, /'data-scientist'/)
})
