import assert from "node:assert/strict"
import test from "node:test"
import { buildPlanHealth } from "../src/lib/plan-health"

const now = new Date(2026, 0, 1)

test("plan health explains which missing inputs block the next calculation", () => {
  const health = buildPlanHealth({
    locale: "ko",
    targetIntakeMonth: "2027-02",
    applicationDeadlines: [],
    currentSavings: 0,
    monthlySaving: 0,
    targetAmount: null,
    targetDate: null,
    englishTargetScore: null,
    englishTestDate: null,
    leadingOptionTitle: null,
    leadingRationale: null,
    now,
  })

  assert.equal(health.status, "attention")
  assert.equal(health.nextAction?.id, "deadline-missing")
  assert.deepEqual(health.signals.map((signal) => signal.id), ["deadline-missing", "english-target", "funding-target"])
})

test("plan health measures the saving pace against the target date", () => {
  const health = buildPlanHealth({
    locale: "en",
    targetIntakeMonth: "2027-02",
    applicationDeadlines: [{ title: "Nursing application", dueDate: "2026-06-01" }],
    currentSavings: 5_000,
    monthlySaving: 1_000,
    targetAmount: 15_000,
    targetDate: "2026-04-01",
    englishTargetScore: 7,
    englishTestDate: "2026-03-01",
    leadingOptionTitle: null,
    leadingRationale: null,
    now,
  })

  const pace = health.signals.find((signal) => signal.id === "funding-pace")
  assert.equal(health.status, "attention")
  assert.ok(pace)
  assert.match(pace.description, /short of the funding target/)
})

test("an overdue deadline takes priority over other actions", () => {
  const health = buildPlanHealth({
    locale: "en",
    targetIntakeMonth: "2027-02",
    applicationDeadlines: [{ title: "Engineering application", dueDate: "2025-12-15" }],
    currentSavings: 30_000,
    monthlySaving: 2_000,
    targetAmount: 30_000,
    targetDate: "2026-03-01",
    englishTargetScore: 7,
    englishTestDate: "2026-02-01",
    leadingOptionTitle: "Option B",
    leadingRationale: "It has the clearest fit with my target role.",
    now,
  })

  assert.equal(health.status, "at-risk")
  assert.equal(health.nextAction?.id, "deadline-overdue")
  assert.equal(health.signals.at(-1)?.id, "pathway-lead")
})
