import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810123204_sg_program_staging_foundation.sql", "utf8")
const discovery = readFileSync("docs/data-foundation/sg-program-phase1-discovery.md", "utf8")

test("Singapore Phase 1 fixes the six-university publication cohort", () => {
  for (const slug of [
    "national-university-of-singapore",
    "nanyang-technological-university",
    "singapore-management-university",
    "singapore-institute-of-technology",
    "singapore-university-of-social-sciences",
    "singapore-university-of-technology-and-design",
  ]) {
    assert.match(discovery, new RegExp(`\\`${slug}\\``))
  }
  assert.match(discovery, /https:\/\/www\.ica\.gov\.sg\/reside\/STP\/apply\/ihl/)
  assert.match(discovery, /No country after Singapore is in scope for this branch\./)
})

test("Singapore staging separates programme, career and international evidence", () => {
  for (const table of [
    "program_catalog_sg_staging",
    "program_occupation_sg_staging",
    "program_international_sg_staging",
  ]) {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`))
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(migration, new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
  }
})

test("Singapore staging preserves study mode and conservative admission states", () => {
  assert.match(migration, /study_mode text not null default 'full_time'/)
  assert.match(migration, /'full_time','part_time','mixed','unknown'/)
  assert.match(migration, /international_admission_status text not null default 'eligible_schedule_unknown'/)
  assert.match(migration, /'open','closed','not_yet_open','restricted','eligible_schedule_unknown','unknown'/)
  assert.match(migration, /grant select,insert,update,delete on public\.program_catalog_sg_staging to service_role/)
})
