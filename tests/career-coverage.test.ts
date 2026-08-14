import assert from "node:assert/strict"
import test from "node:test"
import type { CareerFoundationScoreComponent } from "../src/lib/career-data-foundation/types"
import {
  hasStrictFoundationPublicScoreEvidence,
  isCareerScoreReady,
} from "../src/lib/workspace/career-coverage"

const publicKeys = [
  "shortage_signal",
  "vacancy_intensity",
  "industry_diversity",
  "employment_momentum",
  "projected_growth",
  "relative_salary",
  "entry_accessibility",
  "entry_burden",
] as const

function components(
  override?: Partial<Record<(typeof publicKeys)[number], Partial<CareerFoundationScoreComponent>>>,
): CareerFoundationScoreComponent[] {
  return publicKeys.map((componentKey) => ({
    componentKey,
    rawInputRefs: [],
    normalizedMetricRefs: [],
    normalizedValue: 1,
    formulaVersion: "test",
    scoreValue: 1,
    maxScore: 10,
    availability: "available",
    directness: "direct",
    mappingQuality: "high",
    proxyReason: null,
    sourceType: "official_primary",
    calculatedAt: "2026-08-14T00:00:00Z",
    quality: "high",
    confidence: 1,
    explanation: "test evidence",
    reason: null,
    evidenceStatus: "direct_verified",
    ...(override?.[componentKey] ?? {}),
  }))
}

test("coverage readiness is explicit and does not follow profile existence", () => {
  assert.equal(isCareerScoreReady("AU", "electrician"), true)
  assert.equal(isCareerScoreReady("AU", "care-worker"), true)
  assert.equal(isCareerScoreReady("AU", "pharmacist"), false)
  assert.equal(isCareerScoreReady("UK", "carpenter"), false)
})

test("strict foundation evidence rejects placeholder zeros for missing evidence", () => {
  assert.equal(hasStrictFoundationPublicScoreEvidence(components()), true)

  assert.equal(hasStrictFoundationPublicScoreEvidence(components({
    industry_diversity: {
      scoreValue: 0,
      evidenceStatus: "insufficient_industry_coverage",
    },
  })), false)

  assert.equal(hasStrictFoundationPublicScoreEvidence(components({
    shortage_signal: {
      scoreValue: 0,
      evidenceStatus: "no_evidence_found",
    },
  })), false)
})

test("strict foundation evidence allows evidenced zero scores", () => {
  assert.equal(hasStrictFoundationPublicScoreEvidence(components({
    shortage_signal: {
      scoreValue: 0,
      evidenceStatus: "confirmed_not_shortage",
    },
  })), true)
})
