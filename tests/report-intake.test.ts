import assert from "node:assert/strict"
import test from "node:test"
import {
  EMPTY_REPORT_INTAKE,
  emptyDecisionOption,
  normaliseDecisionOption,
  preferredCitiesFromText,
  toReportIntakeRow,
  validateReportIntake,
} from "../src/lib/report-intake"

test("Australia report intake keeps the user data bounded and requires consent", () => {
  const withoutConsent = validateReportIntake({ ...EMPTY_REPORT_INTAKE })
  assert.deepEqual(withoutConsent, ["privacyConsent"])

  const invalid = validateReportIntake({
    ...EMPTY_REPORT_INTAKE,
    hasPrivacyConsent: true,
    age: "12",
    maximumBudgetAud: "-100",
    desiredPaybackYears: "26",
    preferredCities: "Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Hobart",
  })
  assert.deepEqual(invalid.sort(), ["age", "desiredPaybackYears", "maximumBudgetAud", "preferredCities"].sort())
})

test("Australia report intake normalises saved fields without persisting excess choices", () => {
  const row = toReportIntakeRow({
    ...EMPTY_REPORT_INTAKE,
    hasPrivacyConsent: true,
    preferredCities: " Sydney, Sydney , Adelaide ",
    maximumBudgetAud: "85,000",
    expectedScholarshipAud: "5,000",
    targetOccupation: "  Registered   Nurse ",
  }, "user-1")

  assert.deepEqual(row.preferred_cities, ["Sydney", "Adelaide"])
  assert.equal(row.maximum_budget_aud, 85000)
  assert.equal(row.expected_scholarship_aud, 5000)
  assert.equal(row.target_occupation, "Registered Nurse")
  assert.equal(preferredCitiesFromText("Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Hobart").length, 6)
})

test("decision option normalisation preserves the A/B/C position and bounds user notes", () => {
  const option = normaliseDecisionOption({
    ...emptyDecisionOption(2),
    title: "  Master   of   IT ",
    notes: "x".repeat(2000),
  })
  assert.equal(option.position, 2)
  assert.equal(option.title, "Master of IT")
  assert.equal(option.notes.length, 1500)
})
