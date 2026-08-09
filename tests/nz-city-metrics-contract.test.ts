import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260809123214_publish_nz_tier_a_city_metrics_v1.sql"),
  "utf8",
)

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

const tierA = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"] as const

test("NZ Phase 4 publishes exactly five verified metrics for five Tier A cities", () => {
  for (const key of metricKeys) assert.match(migration, new RegExp(`'${key}'`))
  for (const slug of tierA) assert.match(migration, new RegExp(`'${slug}'`))
  assert.match(migration, /review_status='verified'/)
  assert.match(migration, /total_n<>25/)
  assert.match(migration, /having count\(r\.metric_key\)<>5/)
})

test("population evidence records the exact Stats NZ geography used", () => {
  assert.match(migration, /'auckland',1547200::numeric,'Auckland urban area'/)
  assert.match(migration, /'christchurch',419200,'Christchurch City territorial authority'/)
  assert.match(migration, /'hamilton',192100,'Hamilton City territorial authority'/)
  assert.match(migration, /'wellington',210800,'Wellington City territorial authority'/)
  assert.match(migration, /'dunedin',132800,'Dunedin City territorial authority'/)
  assert.match(migration, /'geography_kind'/)
  assert.match(migration, /'estimated_resident_population'/)
})

test("living-cost evidence preserves source values and explicit conversion", () => {
  assert.match(migration, /'auckland',1867\.67::numeric,1871\.70::numeric,431::numeric,431\.93::numeric/)
  assert.match(migration, /'christchurch',1889\.33,2275\.00,436,525/)
  assert.match(migration, /'hamilton',1521\.00,2751\.67,351,635/)
  assert.match(migration, /'wellington',2127\.67,2127\.67,491,491/)
  assert.match(migration, /'dunedin',2383\.33,2925\.00,550,675/)
  assert.match(migration, /'conversion','weekly_x_52_div_12'/)
  assert.match(migration, /not a market-cost survey/)
})

test("transport references remain source-native and do not invent a national student fare", () => {
  assert.match(migration, /'auckland',1\.55::numeric,'single_trip','one_zone_tertiary_at_hop'/)
  assert.match(migration, /'christchurch',2\.50,'single_bus_trip','metro_youth_19_24'/)
  assert.match(migration, /'hamilton',2\.67,'single_trip','one_zone_adult_bee_card'/)
  assert.match(migration, /'wellington',1\.59,'single_trip','one_zone_peak_tertiary'/)
  assert.match(migration, /'dunedin',2\.50,'single_bus_trip','adult_bee_card_flat_fare'/)
  assert.match(migration, /tertiary-specific concession was discontinued/)
  assert.match(migration, /no generic tertiary concession is asserted/)
  assert.match(migration, /'source_native_period',true/)
})

test("student work rights use the current conditional 25-hour national rule", () => {
  assert.match(migration, /"hours_term_time":25/)
  assert.match(migration, /"full_time_during_eligible_scheduled_breaks":true/)
  assert.match(migration, /"eligibility_conditions_apply":true/)
  assert.match(migration, /"national_rule":true/)
  assert.match(migration, /"effective_from":"2025-11-03"/)
  assert.match(migration, /may retain a 20-hour condition unless varied or replaced/)
})

test("employment sectors are economic context rather than shortage rankings", () => {
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /Aerospace and future transport/)
  assert.match(migration, /Tech and innovation/)
  assert.match(migration, /Climate action and environment/)
  assert.match(migration, /Professional, scientific and technical services/)
})
