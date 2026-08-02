import assert from "node:assert/strict"
import test from "node:test"
import {
  appendCareer,
  buildCareerCompareHref,
  getCareerCompareOptions,
  getCareerSelectionStatusMessage,
  normalizeCareerCity,
  normalizeCareerIds,
  parseCareerComparisonState,
  removeCareerAtIndex,
  replaceCareerAtIndex,
} from "../src/lib/career-comparison"
import {
  AU_CAREER_COMPARISON_CATALOG,
  buildCareerLocationContext,
  CAREER_COMPARE_COUNTRY,
  CAREER_COMPARE_PROFILE,
} from "../src/data/career-comparison/australia"
import { getCareerComparisonRows } from "../src/data/career-comparison/rows"

test("career dispatcher and context contract are isolated from other compare types", () => {
  const supported = parseCareerComparisonState(new URLSearchParams("country=AU&profile=starting-from-scratch"))
  assert.equal(supported.contextState, "supported")
  assert.equal(supported.countryCode, CAREER_COMPARE_COUNTRY)
  assert.equal(supported.profile, CAREER_COMPARE_PROFILE)

  assert.equal(parseCareerComparisonState(new URLSearchParams("country=IE&profile=starting-from-scratch")).contextState, "unsupported")
  assert.equal(parseCareerComparisonState(new URLSearchParams("country=AU&profile=already-qualified")).contextState, "unsupported")
  assert.equal(parseCareerComparisonState(new URLSearchParams("profile=starting-from-scratch")).contextState, "unsupported")
})

test("career IDs trim, allowlist, dedupe, preserve order, and cap at three", () => {
  assert.deepEqual(
    normalizeCareerIds(" registered-nurse , software-engineer, software-engineer,not-a-career, early-childhood-teacher,registered-nurse"),
    ["registered-nurse", "software-engineer", "early-childhood-teacher"],
  )
  assert.equal(normalizeCareerIds(null).length, 0)
  assert.equal(normalizeCareerIds(["software-developer"]).length, 0)
})

test("career URL is canonical and city falls back to National view", () => {
  assert.equal(
    buildCareerCompareHref("sydney", ["registered-nurse", "software-engineer"]),
    "/compare?type=career&country=AU&city=sydney&profile=starting-from-scratch&careers=registered-nurse,software-engineer",
  )
  assert.equal(
    buildCareerCompareHref("not-a-city", ["registered-nurse"]),
    "/compare?type=career&country=AU&profile=starting-from-scratch&careers=registered-nurse",
  )

  const city = parseCareerComparisonState(new URLSearchParams("country=AU&city=melbourne&profile=starting-from-scratch&careers=registered-nurse,software-engineer"))
  assert.equal(city.citySlug, "melbourne")
  assert.equal(city.location.displayLabel, "Australia · Melbourne")
  assert.equal(city.careers.length, 2)

  const national = parseCareerComparisonState(new URLSearchParams("country=AU&city=unknown&profile=starting-from-scratch&careers=registered-nurse,software-engineer"))
  assert.equal(national.citySlug, null)
  assert.equal(national.location.displayLabel, "Australia · National view")
})

test("career selection helpers cover 0, 1, 2, and 3 selections", () => {
  assert.equal(getCareerSelectionStatusMessage(0), "Select two careers to start comparing.")
  assert.equal(getCareerSelectionStatusMessage(1), "Select one more career to compare.")
  assert.equal(getCareerSelectionStatusMessage(2), "2 careers")
  assert.equal(getCareerSelectionStatusMessage(3), "3 careers")

  const one = appendCareer([], "registered-nurse")
  const two = appendCareer(one, "software-engineer")
  const three = appendCareer(two, "early-childhood-teacher")
  assert.deepEqual(one, ["registered-nurse"])
  assert.deepEqual(two, ["registered-nurse", "software-engineer"])
  assert.deepEqual(three, ["registered-nurse", "software-engineer", "early-childhood-teacher"])
  assert.deepEqual(replaceCareerAtIndex(two, 1, "early-childhood-teacher"), ["registered-nurse", "early-childhood-teacher"])
  assert.deepEqual(replaceCareerAtIndex(two, 1, "registered-nurse"), two)
  assert.deepEqual(removeCareerAtIndex(three, 1), ["registered-nurse", "early-childhood-teacher"])
})

test("career chooser disables duplicates and preserves the three product IDs", () => {
  assert.deepEqual(AU_CAREER_COMPARISON_CATALOG.map((career) => career.id), [
    "registered-nurse",
    "software-engineer",
    "early-childhood-teacher",
  ])
  assert.equal(getCareerCompareOptions(["registered-nurse"], "registered-nurse").find((option) => option.id === "registered-nurse")?.disabled, false)
  assert.equal(getCareerCompareOptions(["registered-nurse"], "software-engineer").find((option) => option.id === "registered-nurse")?.disabled, true)
  assert.equal(AU_CAREER_COMPARISON_CATALOG.some((career) => (career.id as string) === "software-developer"), false)
  assert.equal(AU_CAREER_COMPARISON_CATALOG.some((career) => (career.id as string) === "early-childhood-educator"), false)
})

test("AU career records are null-safe and keep starting and typical earnings separate", () => {
  const rows = getCareerComparisonRows(AU_CAREER_COMPARISON_CATALOG)
  const starting = rows.find((row) => row.key === "startingIncome")
  const typical = rows.find((row) => row.key === "typicalEarnings")
  assert.ok(starting)
  assert.ok(typical)
  assert.notEqual(starting?.key, typical?.key)
  assert.ok(starting?.values.every((value) => value.primary === "Not available"))
  assert.ok(typical?.values.every((value) => value.primary === "Not available"))
  assert.ok(AU_CAREER_COMPARISON_CATALOG.every((career) => career.countryCode === "AU" && career.codeMappings.length === 0 && career.sourceIds.length === 0))
  assert.equal(buildCareerLocationContext(null).scope, "national")
  assert.equal(normalizeCareerCity("SYDNEY"), "sydney")
})
