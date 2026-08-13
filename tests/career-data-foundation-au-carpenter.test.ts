import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  calculateFoundationOpportunityScore,
  chooseCareerReadModelSource,
  foundationScoreConfidence,
} from "../src/lib/career-data-foundation/opportunity-score"

const migration = readFileSync("supabase/migrations/20260813024158_career_data_foundation_au_carpenter.sql", "utf8")

test("AU Carpenter uses exact current OSCA mapping with explicit ANZSCO proxy lineage", () => {
  assert.match(migration, /'AU:carpenter:OSCA:372132'/)
  assert.match(migration, /'372132','Carpenter','exact','high'/)
  assert.match(migration, /'AU:carpenter:ANZSCO:331212'/)
  assert.match(migration, /'AU:carpenter:ANZSCO:3312'/)
  assert.match(migration, /'3312','Carpenters and Joiners','broader','medium'/)
})

test("AU Carpenter component inputs reproduce 53.98 under frozen v4 scoring", () => {
  const inputs = [
    { componentKey: "shortage_signal" as const, normalizedValue: 12, availability: "available" as const, directness: "direct" as const, evidenceStatus: "direct_verified" as const },
    { componentKey: "vacancy_intensity" as const, normalizedValue: 4, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official IVI fallback.", reason: "No clean distinct 90-day numerator.", evidenceStatus: "fallback" as const },
    { componentKey: "industry_diversity" as const, normalizedValue: 0, availability: "available" as const, directness: "proxy" as const, proxyReason: "No comparable HHI shares.", reason: "Insufficient comparable industry coverage.", evidenceStatus: "insufficient_industry_coverage" as const },
    { componentKey: "employment_momentum" as const, normalizedValue: -0.4189258298143761, availability: "available" as const, directness: "proxy" as const, proxyReason: "ANZSCO 3312 broader history.", evidenceStatus: "derived" as const },
    { componentKey: "entry_accessibility" as const, normalizedValue: 14, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official training evidence mapped to rubric.", evidenceStatus: "proxy" as const },
    { componentKey: "relative_salary" as const, normalizedValue: 45 / 47, availability: "available" as const, directness: "proxy" as const, proxyReason: "ANZSCO 3312 broader wage.", evidenceStatus: "derived" as const },
    { componentKey: "projected_growth" as const, normalizedValue: -0.21454259569968492, availability: "available" as const, directness: "proxy" as const, proxyReason: "ANZSCO 3312 broader projection.", evidenceStatus: "derived" as const },
    { componentKey: "visa_accessibility" as const, normalizedValue: 9, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official 189 route mapped to rubric.", evidenceStatus: "proxy" as const },
    { componentKey: "entry_burden" as const, normalizedValue: 2, availability: "available" as const, directness: "proxy" as const, proxyReason: "White-card requirement mapped to rubric.", evidenceStatus: "proxy" as const },
  ]
  assert.equal(calculateFoundationOpportunityScore(inputs), 53.98)
})

test("AU vacancy and diversity keep fallback semantics explicit", () => {
  assert.match(migration, /clean_distinct_90_day_numerator',false/)
  assert.match(migration, /'vacancy_intensity'[\s\S]*'fallback'/)
  assert.match(migration, /'industry_diversity'[\s\S]*'insufficient_industry_coverage'/)
})

test("AU visa score uses one primary 189 route and does not add the secondary 482 route", () => {
  assert.match(migration, /'AU:carpenter:189'[\s\S]*true/)
  assert.match(migration, /'AU:carpenter:482'[\s\S]*false/)
  assert.match(migration, /Secondary flexibility evidence only; not added to the primary pathway score/)
})

test("AU licensing evidence separates employee safety training from contractor licences", () => {
  assert.match(migration, /'AU:carpenter:white-card'[\s\S]*'safety_training',true,'employee'/)
  assert.match(migration, /'AU:carpenter:NSW:contractor'[\s\S]*'contractor_license',true,'contractor'/)
  assert.match(migration, /'AU:carpenter:WA:builder'[\s\S]*'contractor_license',true,'contractor'/)
  assert.match(migration, /Employee of a registered builder does not need a Carpenter licence/)
})

test("AU Carpenter foundation takes precedence without moving AU Registered Nurse to foundation", () => {
  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: true, legacyAvailable: true }), "career_data_foundation")
  assert.equal(chooseCareerReadModelSource({ foundationExists: false, foundationDecisionReady: false, legacyAvailable: true }), "legacy_country_occupation")
  assert.doesNotMatch(migration, /AU:registered-nurse/)
})

test("AU Carpenter score confidence remains estimated because proxies and fallbacks remain", () => {
  assert.equal(foundationScoreConfidence({
    scoreReady: true,
    components: [
      { directness: "direct", evidenceStatus: "direct_verified", mappingQuality: "high", confidence: 0.9 },
      { directness: "proxy", evidenceStatus: "fallback", mappingQuality: "medium", confidence: 0.75 },
      { directness: "proxy", evidenceStatus: "derived", mappingQuality: "medium", confidence: 0.84 },
    ],
  }), "estimated")
})
