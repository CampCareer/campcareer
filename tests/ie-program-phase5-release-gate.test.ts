import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260810195944_ie_program_phase5_release_gate.sql",
  "utf8",
)
const phase5 = readFileSync(
  "docs/data-foundation/ie-program-phase5-release-gate.md",
  "utf8",
)
const header = readFileSync(
  "src/app/(workspace)/programs/programs-header.tsx",
  "utf8",
)
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

test("IE Phase 5 records an explicit zero-publication release gate", () => {
  assert.match(migration, /program_publication_gate_ie_v1/)
  assert.match(migration, /WITH \(security_invoker=true\)/)
  assert.match(migration, /verification_tier='A'/)
  assert.match(migration, /eligible_programme_source_url IS NOT NULL/)
  assert.match(migration, /international_students_eligible IS TRUE/)
  assert.match(migration, /full_time_daytime_verified IS TRUE/)
  assert.match(migration, /offering_verification_status='verified'/)
  assert.match(migration, /tier_a_count <> 0/)
  assert.match(migration, /tier_b_count <> 28/)
  assert.match(migration, /tier_c_count <> 12/)
  assert.match(migration, /publishable_count <> 0/)
  assert.match(migration, /exact_eligible_programme_evidence_required/)
})

test("IE Phase 5 release gate remains server-only", () => {
  assert.match(migration, /REVOKE ALL ON public\.program_publication_gate_ie_v1 FROM public, anon, authenticated/)
  assert.match(migration, /GRANT SELECT ON public\.program_publication_gate_ie_v1 TO service_role/)
  assert.match(phase5, /has no `anon` or `authenticated` access/)
})

test("IE remains unpublished in the shared Programs country picker", () => {
  const publishedSet = header.match(/const PUBLISHED_PROGRAM_COUNTRIES = new Set\((\[[^\n]+\])\)/)
  assert.ok(publishedSet, "PUBLISHED_PROGRAM_COUNTRIES declaration must remain explicit")
  assert.doesNotMatch(publishedSet[1], /["']IE["']/)
  assert.match(phase5, /continue to show Ireland as unpublished/)
})

test("IE programme routes and SEO remain blocked while Tier A is zero", () => {
  assert.equal(
    existsSync("src/app/(workspace)/programs/ie/[program]/page.tsx"),
    false,
  )
  assert.doesNotMatch(sitemap, /INDEXABLE_IE_PROGRAM/)
  assert.doesNotMatch(sitemap, /\/programs\/ie\//)
  assert.match(phase5, /Ireland programme sitemap entries/)
  assert.match(phase5, /Ireland programme SEO allowlist/)
})

test("IE Phase 5 does not weaken the exact programme eligibility rule", () => {
  assert.match(phase5, /eligible programmes do not appear on both lists/i)
  assert.match(phase5, /full-time daytime programme/i)
  assert.match(phase5, /Tier B in the Ireland model is deliberately review-ready rather than publication-ready/)
  assert.match(phase5, /United States programme data, routes, or release state/)
  assert.doesNotMatch(migration, /program_catalog_us_staging/)
})
