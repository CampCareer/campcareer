import assert from "node:assert/strict"
import test from "node:test"

import {
  CAMPUS_PILOT_SCHEMA_VERSION,
  canonicalProgrammeRef,
  validateCampusPilotPayload,
  type CampusPilotPayload,
} from "../scripts/lib/campus-pilot"

function validPayload(): CampusPilotPayload {
  return {
    schemaVersion: CAMPUS_PILOT_SCHEMA_VERSION,
    countryCode: "AU",
    fieldKey: "nursing",
    qualificationLevelCode: "7",
    studentMarket: "international",
    sources: [
      {
        sourceKey: "qilt",
        organisationName: "QILT",
        sourceName: "Graduate outcomes — Nursing",
        sourceType: "government_dataset",
        canonicalUrl: "https://example.gov.au/qilt",
        snapshot: {
          sourceUrl: "https://example.gov.au/qilt/nursing",
          contentSha256: `sha256:${"a".repeat(64)}`,
          dataAsOf: "2026-01-01",
          retrievedAt: "2026-08-15T20:00:00Z",
        },
      },
      {
        sourceKey: "provider",
        organisationName: "Example University",
        sourceName: "Bachelor of Nursing course page",
        sourceType: "provider",
        canonicalUrl: "https://example.edu.au/nursing",
        snapshot: {
          sourceUrl: "https://example.edu.au/nursing",
          contentSha256: `sha256:${"b".repeat(64)}`,
          retrievedAt: "2026-08-15T20:00:00Z",
        },
      },
    ],
    outcomes: [
      {
        sourceKey: "qilt",
        institutionIdentifier: { system: "AU_CRICOS_PROVIDER_CODE", value: "00001A" },
        fieldKey: "nursing",
        fieldName: "Nursing",
        qualificationLevelCode: "7",
        metricKey: "median_earnings",
        value: 78_000,
        unit: "AUD",
        confidence: "medium",
      },
      {
        sourceKey: "qilt",
        institutionIdentifier: { system: "AU_CRICOS_PROVIDER_CODE", value: "00001A" },
        fieldKey: "nursing",
        fieldName: "Nursing",
        qualificationLevelCode: "7",
        metricKey: "employment_rate",
        value: 0.94,
        unit: "ratio",
        confidence: "medium",
      },
    ],
    programmes: [
      {
        cricosCode: "012345A",
        requirements: [
          {
            sourceKey: "provider",
            requirementType: "english",
            requirementText: "IELTS Academic 7.0 overall",
            structuredValue: { test: "IELTS Academic", overall: 7 },
          },
        ],
        careerLinks: [
          {
            profileKey: "AU:registered-nurse",
            relationType: "direct",
            sourceCheckedAt: "2026-08-15",
          },
        ],
      },
    ],
  }
}

test("valid AU Nursing pilot payload passes without invented defaults", () => {
  assert.deepEqual(validateCampusPilotPayload(validPayload()), [])
})

test("payload rejects outcomes whose field or qualification escapes the declared cohort", () => {
  const payload = validPayload()
  payload.outcomes[0].fieldKey = "health"
  payload.outcomes[1].qualificationLevelCode = "9"
  const errors = validateCampusPilotPayload(payload)
  assert.ok(errors.some((error) => error.includes("does not match payload fieldKey")))
  assert.ok(errors.some((error) => error.includes("does not match payload qualificationLevelCode")))
})

test("payload rejects unknown source lineage and malformed snapshots", () => {
  const payload = validPayload()
  payload.outcomes[0].sourceKey = "missing"
  payload.sources[0].snapshot.contentSha256 = "not-a-hash"
  const errors = validateCampusPilotPayload(payload)
  assert.ok(errors.some((error) => error.includes("unknown sourceKey")))
  assert.ok(errors.some((error) => error.includes("sha256:<64 hex>")))
})

test("employment-rate units cannot silently mix ratios and percentages", () => {
  const payload = validPayload()
  const employment = payload.outcomes.find((row) => row.metricKey === "employment_rate")!
  employment.unit = "ratio"
  employment.value = 94
  const errors = validateCampusPilotPayload(payload)
  assert.ok(errors.some((error) => error.includes("ratio must be between 0 and 1")))
})

test("canonical Career links converge on programme UUID references", () => {
  assert.equal(
    canonicalProgrammeRef("123e4567-e89b-12d3-a456-426614174000"),
    "programme:123e4567-e89b-12d3-a456-426614174000",
  )
})
