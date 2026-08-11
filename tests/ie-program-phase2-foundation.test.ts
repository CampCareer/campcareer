import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const foundation = readFileSync(
  "supabase/migrations/20260810164130_ie_program_phase2_staging_foundation.sql",
  "utf8",
)
const seed = readFileSync(
  "supabase/migrations/20260810164303_ie_program_phase2_bounded_seed.sql",
  "utf8",
)
const phase2 = readFileSync(
  "docs/data-foundation/ie-program-phase2-collection.md",
  "utf8",
)

const stagingTables = [
  "program_catalog_ie_staging",
  "program_occupation_ie_staging",
  "program_international_ie_staging",
] as const

test("IE Phase 2 creates private server-only staging layers", () => {
  for (const table of stagingTables) {
    assert.match(foundation, new RegExp(`CREATE TABLE public\\.${table}`))
    assert.match(foundation, new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`))
    assert.match(foundation, new RegExp(`REVOKE ALL ON public\\.${table} FROM public, anon, authenticated`))
    assert.match(foundation, new RegExp(`GRANT SELECT, INSERT, UPDATE, DELETE ON public\\.${table} TO service_role`))
  }
})

test("IE Phase 2 covers the catalogue institution foreign key", () => {
  assert.match(foundation, /program_catalog_ie_staging_institution_idx/)
  assert.match(foundation, /ON public\.program_catalog_ie_staging\(institution_id\)/)
})

test("IE Phase 2 is deliberately bounded to 40 occupation-led records", () => {
  assert.match(seed, /32 higher-education programmes \+ 8 employment-based apprenticeships/)
  assert.match(phase2, /programme rows: 40/)
  assert.match(phase2, /higher-education rows: 32/)
  assert.match(phase2, /employment-based apprenticeship rows: 8/)
  assert.match(phase2, /approved relations: 63/)
  assert.match(phase2, /distinct CampCareer target careers covered: 41 \/ 80/)
})

test("IE Phase 2 resolves current higher-education providers without broad catalogue promotion", () => {
  const expectedProviderSlugs = [
    "dublin-city-university",
    "trinity-college-dublin",
    "university-college-dublin",
    "university-college-cork",
    "university-of-limerick",
    "university-of-galway",
    "technological-university-dublin",
    "maynooth-university",
    "munster-technological-university",
  ]

  for (const slug of expectedProviderSlugs) assert.match(seed, new RegExp(`'${slug}'`))
  assert.match(seed, /'resolved_alias'/)
  assert.match(seed, /'legacy_snapshot_needs_recheck'/)
})

test("IE Phase 2 preserves employment-based apprenticeships as a separate access model", () => {
  for (const legacyCourseId of [2490, 2491, 2497, 3221, 3222, 3227, 3516, 3520]) {
    assert.match(seed, new RegExp(`\\(${legacyCourseId}\\)`))
  }

  assert.match(seed, /'employment_based_apprenticeship'/)
  assert.match(seed, /'employment_based_not_student_route'/)
  assert.match(seed, /'authority_without_catalog_institution'/)
  assert.match(seed, /'restricted'/)
})

test("IE Phase 2 keeps provider authorisation separate from programme-level international eligibility", () => {
  assert.match(seed, /'not_programme_verified'/)
  assert.match(seed, /'provider_authorised_programme_pending'/)
  assert.match(seed, /exact eligible-programme status and full-time daytime study remain programme-level Phase 3 checks/)
  assert.match(seed, /international_students_eligible=excluded\.international_students_eligible/)
  assert.match(phase2, /zero positive programme-level international-eligibility assertions/)
})

test("IE Phase 2 uses canonical target career IDs without forcing full coverage", () => {
  for (const career of [
    "software-developer",
    "data-analyst",
    "primary-school-teacher",
    "radiographer",
    "architect",
    "cybersecurity-analyst",
    "civil-engineer",
    "cloud-engineer",
    "ux-designer",
    "marine-engineer",
    "bricklayer",
    "carpenter",
    "electrician",
    "hvac-technician",
    "welder",
  ]) {
    assert.match(seed, new RegExp(`'${career}'`))
  }

  assert.match(phase2, /Missing careers remain missing rather than being force-filled/)
  assert.doesNotMatch(seed, /'data-scientist'/)
  assert.doesNotMatch(seed, /'software-engineer'/)
})

test("IE Phase 2 does not publish Ireland or start United States Programs", () => {
  assert.doesNotMatch(foundation, /program_explorer_ie_v1|program_detail_ie_v1/)
  assert.doesNotMatch(seed, /program_explorer_ie_v1|program_detail_ie_v1/)
  assert.doesNotMatch(foundation, /program_catalog_us_staging|program_explorer_us_v1/)
  assert.doesNotMatch(seed, /program_catalog_us_staging|program_explorer_us_v1/)
  assert.match(phase2, /Phase 3 has not started/)
  assert.match(phase2, /United States Programs remains untouched/)
})
