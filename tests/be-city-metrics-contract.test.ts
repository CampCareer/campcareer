import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810202906_publish_be_tier_a_city_metrics_v1.sql", "utf8")

const keys = ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]

test("Belgium Phase 4 contains the five core metrics", () => {
  for (const key of keys) assert.ok(migration.includes(`'${key}'`))
  assert.ok(migration.includes("expected 30 verified core metric rows"))
})

test("Belgium metric semantics preserve non-comparable and national-rule boundaries", () => {
  assert.ok(migration.includes("methodology_varies_by_city"))
  assert.ok(migration.includes("source_native_period"))
  assert.ok(migration.includes("hours_school_period',20"))
  assert.ok(migration.includes("compatibility_with_studies_required"))
  assert.ok(migration.includes("national_rule',true"))
  assert.ok(migration.includes("not_shortage_ranking"))
  assert.ok(migration.includes("not_job_guarantee"))
  assert.ok(migration.includes("Ottignies-Louvain-la-Neuve municipality"))
  assert.ok(migration.includes("Brussels-Capital Region"))
})
