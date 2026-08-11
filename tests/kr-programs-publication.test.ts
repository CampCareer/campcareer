import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { INDEXABLE_KR_PROGRAM_SLUGS, isIndexableKrProgramSlug, krProgramDetailPath } from "../src/lib/programs/kr-program-seo"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const staging = read("supabase/migrations/20260809113000_kr_program_staging_foundation.sql")
const publication = read("supabase/migrations/20260809113500_kr_program_canonicalization_publication.sql")
const server = read("src/lib/programs/kr-programs.server.ts")
const explorer = read("src/app/(workspace)/programs/kr-programs-explorer.tsx")
const detail = read("src/app/(workspace)/programs/kr/[program]/page.tsx")

test("South Korea staging separates international degree context from open intake", () => {
  assert.match(staging, /eligible_schedule_unknown/)
  assert.match(staging, /verified_general/)
  assert.match(publication, /KR_STUDYINKOREA_PROGRAM_KEY/)
  assert.match(publication, /KR_STUDYINKOREA/)
})

test("South Korea publication does not invent programme accreditation", () => {
  assert.match(publication, /has_programme_accreditation_claim/)
  assert.match(publication, /false as has_programme_accreditation_claim/)
  assert.match(detail, /does not convert Study in Korea or IEQAS participation into a programme-accreditation claim/)
  assert.doesNotMatch(publication, /insert into catalog\.programme_accreditations/)
})

test("South Korea pages preserve source department labels and cautious admission semantics", () => {
  assert.match(server, /source_department_name/)
  assert.match(explorer, /current window not confirmed/i)
  assert.match(explorer, /72\/80 CampCareer career categories/)
  assert.match(detail, /current application window not confirmed/i)
  assert.match(detail, /Professional licences and regulated occupation requirements remain separate/)
})

test("South Korea SEO exposes exactly 105 Tier A routes", () => {
  assert.equal(INDEXABLE_KR_PROGRAM_SLUGS.length, 105)
  assert.equal(new Set(INDEXABLE_KR_PROGRAM_SLUGS).size, 105)
  assert.equal(krProgramDetailPath("seoul-national-university-computer-science-engineering"), "/programs/kr/seoul-national-university-computer-science-engineering")
  assert.equal(isIndexableKrProgramSlug("seoul-national-university-computer-science-engineering"), true)
  assert.equal(isIndexableKrProgramSlug("unknown"), false)
})
