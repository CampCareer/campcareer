import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const analytics = readFileSync("src/lib/analytics.ts", "utf8")
const eventsRoute = readFileSync("src/app/api/v1/discovery-events/route.ts", "utf8")
const home = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const results = readFileSync("src/app/(workspace)/home/career-market-results.tsx", "utf8")
const resultSave = readFileSync("src/app/(workspace)/home/career-result-save.tsx", "utf8")
const onboarding = readFileSync("src/components/onboarding/career-personalisation-onboarding.tsx", "utf8")
const partnerExit = readFileSync("src/app/out/[partner]/route.ts", "utf8")

test("career funnel events are consent-gated in both browser and server paths", () => {
  for (const event of [
    "career_landing_view",
    "career_search_started",
    "career_search_submitted",
    "career_result_viewed",
    "career_result_unavailable",
    "career_evidence_opened",
    "career_result_saved",
    "career_personalisation_started",
    "career_personalisation_completed",
  ]) {
    assert.match(analytics, new RegExp(`"${event}"`))
    assert.match(eventsRoute, new RegExp(`"${event}"`))
  }
  assert.match(eventsRoute, /hasMeasurementConsent\(request\.headers\.get\("cookie"\)\)/)
  assert.match(partnerExit, /if \(hasMeasurementConsent\(request\.headers\.get\("cookie"\)\)\)/)
})

test("the core career flow emits landing, search, result, evidence and personalisation events", () => {
  assert.match(home, /career_landing_view/)
  assert.match(home, /career_search_started/)
  assert.match(home, /career_search_submitted/)
  assert.match(results, /career_result_viewed/)
  assert.match(results, /career_evidence_opened/)
  assert.match(resultSave, /career_result_saved/)
  assert.match(results, /career_personalisation_started/)
  assert.match(onboarding, /career_personalisation_completed/)
})
