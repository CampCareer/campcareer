import assert from "node:assert/strict"
import test from "node:test"
import { createReportDraftFromMyPlan, getRoiReportReadiness } from "../src/lib/report-plan-bridge"

test("ROI report readiness requires a career, shortlist, budget and English baseline", () => {
  const incomplete = getRoiReportReadiness({ targetOccupation: "Registered Nurse", shortlistCount: 1, targetAmount: 60_000, currentEnglishScore: null, targetEnglishScore: 7 })
  assert.equal(incomplete.ready, false)
  assert.equal(incomplete.completedCount, 3)
  assert.equal(incomplete.nextHref, "/english")

  const ready = getRoiReportReadiness({ targetOccupation: "Registered Nurse", shortlistCount: 2, targetAmount: 60_000, currentEnglishScore: 6.5, targetEnglishScore: 7 })
  assert.equal(ready.ready, true)
  assert.equal(ready.completedCount, 4)
})

test("My Plan is copied into a report draft without setting privacy consent", () => {
  const draft = createReportDraftFromMyPlan({
    profile: { target_occupation_title: "Registered Nurse" },
    options: [{ position: 1, source_type: "saved_course", source_reference: "42", title: "Bachelor of Nursing", provider_name: "Example University", field_name: "Nursing" }],
    budget: { target_amount: 60_000 },
    moneyScenario: { scholarship_amount: 5_000 },
    language: { exam_name: "IELTS Academic" },
    reportLanguage: "ko",
  })

  assert.equal(draft.hasImportedData, true)
  assert.equal(draft.intake.targetOccupation, "Registered Nurse")
  assert.equal(draft.intake.maximumBudgetAud, "60000")
  assert.equal(draft.intake.expectedScholarshipAud, "5000")
  assert.equal(draft.intake.englishLevel, "ielts")
  assert.equal(draft.intake.hasPrivacyConsent, false)
  assert.equal(draft.options[0].title, "Bachelor of Nursing")
})
