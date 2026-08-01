import test from "node:test"
import assert from "node:assert/strict"
import { getPathwayFixtures, NEXT_STEPS_BY_STATUS } from "@/app/(workspace)/home/home-result-fixtures"
import { getSchoolResultsFixture, hasComparablePrograms, toggleComparedProgram } from "@/app/(workspace)/home/home-school-fixtures"
import { getChosenFieldValues, getFieldExplorerFixture, hasComparableFields, toggleComparedField } from "@/app/(workspace)/home/home-field-fixtures"
import { countCheckedDocuments, getApplicationResultsFixture, getSchoolComparisonValues, getVisaPreparationValues, toggleApplicationShortlist } from "@/app/(workspace)/home/home-application-fixtures"
import { countCheckedVisaDocuments, getApplicationPreparationValues, getVisaResultsFixture, hasComparableVisaRoutes, toggleComparedVisaRoute } from "@/app/(workspace)/home/home-visa-fixtures"
import { FIELD_OPTIONS, getHomeScreenMode, getHomeSearchQuery, hasOption, toHomeSearchQuery } from "@/app/(workspace)/home/home-search-config"
import { getPathwayHomePath, getPathwayLoginPath, normalizeSavedPathwayInput } from "@/app/(workspace)/home/home-pathway-save"
import { getSafeNextPath } from "@/lib/auth/safe-next"
import { getPathwayBackPath, getPathwaySummaryFromNext } from "@/lib/auth/pathway-next"

test("a valid Australia Nursing query is result-safe and has the explicit UI fixture", () => {
  const query = getHomeSearchQuery(new URLSearchParams("country=AU&field=nursing&status=choosing-school"))

  assert.deepEqual(query, { country: "AU", field: "nursing", status: "choosing-school" })
  assert.equal(getPathwayFixtures(query!).length, 3)
  assert.equal(NEXT_STEPS_BY_STATUS[query!.status].title, "Compare programs and universities")
})

test("no-field only permits the normalized not-sure field in the result area", () => {
  assert.deepEqual(
    getHomeSearchQuery(new URLSearchParams("country=AU&field=not-sure&status=no-field")),
    { country: "AU", field: "not-sure", status: "no-field" }
  )
  assert.equal(getHomeSearchQuery(new URLSearchParams("country=AU&field=nursing&status=no-field")), null)
  assert.equal(getHomeSearchQuery(new URLSearchParams("country=AU&field=not-sure&status=choosing-school")), null)
})

test("unsupported and malformed queries do not produce Home results", () => {
  assert.equal(getHomeSearchQuery(new URLSearchParams("country=AU&field=unknown&status=choosing-school")), null)
  assert.equal(getPathwayFixtures({ country: "CA", field: "nursing", status: "choosing-school" }).length, 0)
})

test("Home screen mode keeps Hero search for absent or invalid queries", () => {
  assert.equal(getHomeScreenMode(new URLSearchParams()), "search")
  assert.equal(getHomeScreenMode(new URLSearchParams("country=AU&field=unknown&status=choosing-school")), "search")
  assert.equal(getHomeScreenMode(new URLSearchParams("country=AU&field=nursing&status=choosing-school")), "results")
})

test("choosing-school has an isolated Australia Nursing school comparison fixture", () => {
  const fixture = getSchoolResultsFixture({ country: "AU", field: "nursing", status: "choosing-school" })

  assert.equal(fixture?.title, "Study Nursing in Australia")
  assert.equal(fixture?.programs.length, 3)
  assert.equal(getSchoolResultsFixture({ country: "AU", field: "nursing", status: "preparing-application" }), null)
  assert.equal(getSchoolResultsFixture({ country: "CA", field: "nursing", status: "choosing-school" }), null)
})

test("program comparison selection supports the minimum-state hint and caps selection at three", () => {
  const programIds = ["one", "two", "three", "four"]
  const oneSelected = toggleComparedProgram(["one", "two"], "two", programIds)

  assert.deepEqual(oneSelected, ["one"])
  assert.equal(hasComparablePrograms(oneSelected), false)
  assert.deepEqual(toggleComparedProgram(["one", "two", "three"], "four", programIds), ["one", "two", "three"])
  assert.equal(hasComparablePrograms(["one", "two"]), true)
})

test("no-field has an isolated Australia field-exploration fixture with Home field slugs", () => {
  const fixture = getFieldExplorerFixture({ country: "AU", field: "not-sure", status: "no-field" })

  assert.equal(fixture?.title, "Find the right field in Australia")
  assert.equal(fixture?.fields.length, 5)
  assert.ok(fixture?.fields.every((field) => hasOption(FIELD_OPTIONS, field.slug)))
  assert.equal(getFieldExplorerFixture({ country: "AU", field: "nursing", status: "choosing-school" }), null)
})

test("field comparison supports its under-two hint and caps selection at three", () => {
  const fieldIds = ["one", "two", "three", "four"]
  const oneSelected = toggleComparedField(["one", "two"], "two", fieldIds)

  assert.deepEqual(oneSelected, ["one"])
  assert.equal(hasComparableFields(oneSelected), false)
  assert.deepEqual(toggleComparedField(["one", "two", "three"], "four", fieldIds), ["one", "two", "three"])
  assert.equal(hasComparableFields(["one", "two"]), true)
})

test("choosing a field reuses the normal query schema and school status", () => {
  const fixture = getFieldExplorerFixture({ country: "AU", field: "not-sure", status: "no-field" })!
  const values = getChosenFieldValues(fixture, "nursing")

  assert.deepEqual(values, { country: "AU", field: "nursing", status: "choosing-school" })
  assert.equal(toHomeSearchQuery(values!).toString(), "country=AU&field=nursing&status=choosing-school")
  assert.equal(getChosenFieldValues(fixture, "unknown"), null)
})

test("preparing application has an isolated reviewed Australia Nursing fixture", () => {
  const fixture = getApplicationResultsFixture({ country: "AU", field: "nursing", status: "preparing-application" })

  assert.equal(fixture?.title, "Prepare your Nursing application for Australia")
  assert.equal(fixture?.programs.length, 3)
  assert.equal(fixture?.documents.length, 7)
  assert.equal(getApplicationResultsFixture({ country: "AU", field: "nursing", status: "choosing-school" }), null)
})

test("application checklist count ignores unsupported document ids and shortlist caps at three", () => {
  const fixture = getApplicationResultsFixture({ country: "AU", field: "nursing", status: "preparing-application" })!
  const documentIds = fixture.documents.map((document) => document.id)
  const programIds = fixture.programs.map((program) => program.id)

  assert.equal(countCheckedDocuments([documentIds[0], "unknown"], documentIds), 1)
  assert.deepEqual(toggleApplicationShortlist([programIds[0], programIds[1], programIds[2]], "another", [...programIds, "another"]), [programIds[0], programIds[1], programIds[2]])
  assert.deepEqual(toggleApplicationShortlist([programIds[0]], programIds[0], programIds), [])
})

test("application routes preserve the current country and field", () => {
  const fixture = getApplicationResultsFixture({ country: "AU", field: "nursing", status: "preparing-application" })!

  assert.equal(toHomeSearchQuery(getSchoolComparisonValues(fixture)).toString(), "country=AU&field=nursing&status=choosing-school")
  assert.equal(toHomeSearchQuery(getVisaPreparationValues(fixture)).toString(), "country=AU&field=nursing&status=preparing-visa")
})

test("preparing visa has an isolated Australia Nursing fixture with existing official route sources", () => {
  const fixture = getVisaResultsFixture({ country: "AU", field: "nursing", status: "preparing-visa" })

  assert.equal(fixture?.title, "Prepare your visa pathway for Australia")
  assert.equal(fixture?.routes.length, 2)
  assert.ok(fixture?.routes.every((route) => route.sourceLabel === "Home Affairs" && Boolean(route.sourceUrl)))
  assert.equal(getVisaResultsFixture({ country: "AU", field: "nursing", status: "preparing-application" }), null)
})

test("visa document count and route comparison stay bounded to fixture values", () => {
  const fixture = getVisaResultsFixture({ country: "AU", field: "nursing", status: "preparing-visa" })!
  const documentIds = fixture.documents.map((document) => document.id)
  const routeIds = fixture.routes.map((route) => route.id)

  assert.equal(countCheckedVisaDocuments([documentIds[0], "unknown"], documentIds), 1)
  assert.equal(hasComparableVisaRoutes([routeIds[0], routeIds[1]]), true)
  assert.equal(hasComparableVisaRoutes([routeIds[0]]), false)
  assert.deepEqual(toggleComparedVisaRoute([routeIds[0]], routeIds[0], routeIds), [])
  assert.deepEqual(toggleComparedVisaRoute(["one", "two", "three"], "four", ["one", "two", "three", "four"]), ["one", "two", "three"])
})

test("visa back action preserves the current country and field", () => {
  const fixture = getVisaResultsFixture({ country: "AU", field: "nursing", status: "preparing-visa" })!

  assert.equal(toHomeSearchQuery(getApplicationPreparationValues(fixture)).toString(), "country=AU&field=nursing&status=preparing-application")
})

test("saved pathway input accepts only result-safe Home queries", () => {
  const valid = { country: "AU", field: "nursing", status: "preparing-visa" }

  assert.deepEqual(normalizeSavedPathwayInput(valid), valid)
  assert.deepEqual(normalizeSavedPathwayInput({ country: "AU", field: "not-sure", status: "no-field" }), { country: "AU", field: "not-sure", status: "no-field" })
  assert.equal(normalizeSavedPathwayInput({ country: "AU", field: "nursing", status: "no-field" }), null)
  assert.equal(normalizeSavedPathwayInput({ country: "AU", field: "unknown", status: "choosing-school" }), null)
})

test("pathway save return URL preserves the query and only adds the controlled save flag", () => {
  const input = { country: "AU", field: "nursing", status: "choosing-school" }
  const returnPath = getPathwayHomePath(input, true)

  assert.equal(returnPath, "/home?country=AU&field=nursing&status=choosing-school&save=1")
  assert.equal(getPathwayLoginPath(input), `/login?next=${encodeURIComponent(returnPath)}`)
})

test("authentication next paths remain same-origin relative paths", () => {
  assert.equal(getSafeNextPath("/home?country=AU&save=1"), "/home?country=AU&save=1")
  assert.equal(getSafeNextPath("//malicious.example"), "/home")
  assert.equal(getSafeNextPath("https://malicious.example"), "/home")
  assert.equal(getSafeNextPath("/\\malicious.example"), "/home")
})

test("login pathway summary reuses validated Home labels without exposing slugs", () => {
  assert.deepEqual(
    getPathwaySummaryFromNext("/home?country=AU&field=nursing&status=choosing-school&save=1"),
    { country: "Australia", field: "Nursing", status: "Choosing a school" }
  )
  assert.deepEqual(
    getPathwaySummaryFromNext("/home?country=AU&field=not-sure&status=no-field"),
    { country: "Australia", field: "Field not selected", status: "Exploring fields" }
  )
})

test("login pathway helper hides invalid or external next values and removes only the save flag for Back", () => {
  assert.equal(getPathwaySummaryFromNext("https://malicious.example/home?country=AU&field=nursing&status=choosing-school"), null)
  assert.equal(getPathwaySummaryFromNext("/home?country=AU&field=unknown&status=choosing-school"), null)
  assert.equal(
    getPathwayBackPath("/home?country=AU&field=nursing&status=choosing-school&save=1"),
    "/home?country=AU&field=nursing&status=choosing-school"
  )
  assert.equal(getPathwayBackPath("https://malicious.example"), "/home")
})
