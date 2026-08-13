import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { calculateFoundationOpportunityScore, scoreFoundationComponent, scoreIndustryDiversity, scoreVisaAccessibility } from "../src/lib/career-data-foundation/opportunity-score"

const migration = readFileSync("supabase/migrations/20260813184500_career_data_foundation_uk_carpenter.sql", "utf8")

test("UK Carpenter locks exact ONS salary and revised DfE inputs", () => {
  for (const expected of ["'row_index_1based',361", "'median_gbp',34014", "to_jsonb(39039)", "203247.3719", "188293.6923", "35139637.999037", "37567871.999864"]) {
    assert.ok(migration.includes(expected), `missing ${expected}`)
  }
})

test("UK Carpenter industry concentration is a derived zero", () => {
  assert.deepEqual(scoreIndustryDiversity({ hhi: 0.6247843227442887, topIndustrySharePct: 77.60532150776054, coveragePct: 99.88913525498891, comparableBroadSectors: true }), { score: 0, evidenceStatus: "derived" })
})

test("UK Carpenter visa rubric is seven", () => {
  assert.equal(scoreVisaAccessibility({ occupationApplicability: 3, employerDependency: 1, eligibilityBurden: 1, longTermPathway: 2 }), 7)
})

test("UK Carpenter salary, growth and momentum calculations are fixed", () => {
  assert.equal(scoreFoundationComponent({ componentKey: "relative_salary", normalizedValue: 34014 / 39039, availability: "available", directness: "direct", evidenceStatus: "derived" }), 3.71)
  assert.equal(scoreFoundationComponent({ componentKey: "projected_growth", normalizedValue: -1.0228, availability: "available", directness: "proxy", proxyReason: "Working Futures projection method.", evidenceStatus: "derived" }), 2.44)
  assert.equal(scoreFoundationComponent({ componentKey: "employment_momentum", normalizedValue: -3.9907, availability: "available", directness: "proxy", proxyReason: "SOC bridge and official employee series.", evidenceStatus: "derived" }), 0)
})

test("complete UK Carpenter methodology yields 47.15", () => {
  const inputs = [
    { componentKey: "shortage_signal" as const, normalizedValue: 12, availability: "available" as const, directness: "direct" as const, evidenceStatus: "direct_verified" as const },
    { componentKey: "vacancy_intensity" as const, normalizedValue: 3, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official demand fallback.", reason: "No clean 90-day numerator.", evidenceStatus: "fallback" as const },
    { componentKey: "industry_diversity" as const, normalizedValue: 0, availability: "available" as const, directness: "direct" as const, evidenceStatus: "derived" as const },
    { componentKey: "employment_momentum" as const, normalizedValue: -3.9907, availability: "available" as const, directness: "proxy" as const, proxyReason: "SOC bridge and official employee series.", evidenceStatus: "derived" as const },
    { componentKey: "entry_accessibility" as const, normalizedValue: 14, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official apprenticeship evidence.", evidenceStatus: "proxy" as const },
    { componentKey: "relative_salary" as const, normalizedValue: 34014 / 39039, availability: "available" as const, directness: "direct" as const, evidenceStatus: "derived" as const },
    { componentKey: "projected_growth" as const, normalizedValue: -1.0228, availability: "available" as const, directness: "proxy" as const, proxyReason: "Working Futures projection method.", evidenceStatus: "derived" as const },
    { componentKey: "visa_accessibility" as const, normalizedValue: 7, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official immigration rules.", evidenceStatus: "proxy" as const },
    { componentKey: "entry_burden" as const, normalizedValue: 5, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official regulation evidence.", evidenceStatus: "proxy" as const },
  ]
  assert.equal(calculateFoundationOpportunityScore(inputs), 47.15)
})
