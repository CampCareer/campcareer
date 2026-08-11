import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const foundation = readFileSync("supabase/migrations/20260810175110_us_program_phase2_staging_foundation.sql", "utf8")
const seed = readFileSync("supabase/migrations/20260810175420_us_program_phase2_bounded_seed.sql", "utf8")
const indexes = readFileSync("supabase/migrations/20260810175448_us_program_phase2_staging_indexes.sql", "utf8")

test("US Phase 2 creates three server-only staging tables", () => {
  assert.match(foundation, /CREATE TABLE public\.program_catalog_us_staging/)
  assert.match(foundation, /CREATE TABLE public\.program_occupation_us_staging/)
  assert.match(foundation, /CREATE TABLE public\.program_international_us_staging/)
  for (const table of ["program_catalog_us_staging", "program_occupation_us_staging", "program_international_us_staging"]) {
    assert.match(foundation, new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`))
    assert.match(foundation, new RegExp(`REVOKE ALL ON public\\.${table} FROM public, anon, authenticated`))
    assert.match(foundation, new RegExp(`GRANT SELECT, INSERT, UPDATE, DELETE ON public\\.${table} TO service_role`))
  }
})

test("US Phase 2 keeps occupation and immigration dimensions separate", () => {
  assert.match(foundation, /relation_type text NOT NULL CHECK \(relation_type IN \('direct','common_pathway','related'\)\)/)
  assert.match(foundation, /sevp_status text NOT NULL DEFAULT 'unresolved'/)
  assert.match(foundation, /exact_cip_verified_for_stem boolean/)
  assert.match(foundation, /stem_designated_cip boolean/)
  assert.match(foundation, /CHECK \(stem_designated_cip IS NULL OR exact_cip_verified_for_stem = true\)/)
})

test("US Phase 2 bounded seed is exactly 24 programmes across 8 Tier A providers", () => {
  assert.match(seed, /Expected 24 US Phase 2 programmes across 8 providers/)
  const keys = [...seed.matchAll(/'((?:umich|uw|cornell|umn|utaustin|psu|wisc|nyu)-[^']+)'/g)].map((match) => match[1])
  const programmeKeys = new Set(keys.filter((key) => /(?:civil|industrial|bsn|informatics|social|hotel|food|architecture|forest|plant|accounting|interior|supply|cybersecurity|mechanical|data|environmental|information|integrated|hospitality|computer)/.test(key)))
  assert.equal(programmeKeys.size, 24)
  for (const unitid of ["170976", "236948", "190415", "174066", "228778", "214777", "240444", "193900"]) {
    assert.match(seed, new RegExp(`'${unitid}'`))
  }
})

test("US Phase 2 relations stay inside the canonical 80 product boundary", () => {
  assert.match(seed, /Expected 65 approved relations across 42 target careers/)
  assert.match(seed, /m\.country_code='CA'/)
  assert.match(seed, /m\.rule_version='v1'/)
  assert.match(seed, /m\.review_status='approved'/)
  assert.match(seed, /US Phase 2 contains % relations outside canonical 80/)
})

test("US Phase 2 only treats six exact programme CIPs as verified", () => {
  assert.match(seed, /Expected exactly 6 programme rows with current official exact CIP evidence/)
  for (const cip of ["52.0904", "01.1001", "04.0902", "11.0103", "52.0901", "11.0101"]) {
    assert.match(seed, new RegExp(cip.replace(".", "\\.")))
  }
})

test("US Phase 2 does not infer programme delivery locations", () => {
  assert.match(seed, /programme_delivery_verified,\s*source_as_of/)
  assert.match(seed, /false,\s*DATE '2026-08-10'/)
  assert.match(seed, /US Phase 2 must not infer programme delivery location/)
  assert.doesNotMatch(seed, /programme_delivery_verified\s*=\s*true/i)
})

test("US Phase 2 leaves SEVP and STEM designation for Phase 3 verification", () => {
  assert.match(seed, /'eligible_schedule_unknown','unresolved'/)
  assert.match(seed, /No programme-level STEM OPT designation is asserted in Phase 2/)
  assert.match(seed, /programme_identity_verified_context_pending/)
  assert.match(seed, /stem_designated_cip,stem_list_source_url/)
  assert.match(seed, /NULL,\s*'https:\/\/www\.ice\.gov\/sevis\/practical-training'/)
})

test("US Phase 2 creates indexes for verification joins and filters", () => {
  assert.match(indexes, /program_catalog_us_staging_institution_idx/)
  assert.match(indexes, /program_catalog_us_staging_unitid_idx/)
  assert.match(indexes, /program_catalog_us_staging_cip_idx/)
  assert.match(indexes, /program_occupation_us_staging_career_idx/)
  assert.match(indexes, /program_international_us_staging_sevp_idx/)
})
