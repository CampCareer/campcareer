import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811141418_publish_es_tier_a_city_metrics_v1.sql",
  "utf8",
)

const slugs = ["madrid", "barcelona", "valencia", "sevilla", "granada", "malaga", "bilbao"]
const metrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Spain Phase 4 locks seven cities and five verified metric families", () => {
  for (const slug of slugs) assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
  for (const metric of metrics) assert.ok(migration.includes(`'${metric}'`), `missing ${metric}`)
  assert.match(migration, /ES Tier A metrics expected 35 verified rows/)
  assert.match(migration, /Each ES Tier A city must have exactly five verified metrics/)
})

test("Spain living-cost references cannot be consumed as a cheapest-city ranking", () => {
  assert.match(migration, /'ranking_safe',false/)
  assert.match(migration, /Spain living-cost references must not be marked ranking-safe/)
  assert.match(migration, /'full_budget',v\.full_budget/)
  assert.match(migration, /'reference_kind',v\.kind/)
})

test("Spain city metric read model remains service-role only", () => {
  assert.match(migration, /city_metric_directory_es_v1 with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.city_metric_directory_es_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_metric_directory_es_v1 to service_role/)
})
