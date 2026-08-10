import test from "node:test"
import assert from "node:assert/strict"
import {
  getPathwaySearchQuery,
  readFormValues,
  toHomeSearchQuery,
  validateForm,
} from "@/app/(workspace)/home/home-search-config"
import {
  SAVED_PATHWAY_CONFLICT_COLUMNS,
  normalizeSavedPathwayInput,
  toSavedPathwayWrite,
} from "@/app/(workspace)/home/home-pathway-save"
import {
  getPathwayRouteLabel,
  getPathwayStages,
  toDashboardPathway,
} from "@/app/(workspace)/home/home-dashboard-config"

test("canonical Home query carries origin through the pathway URL", () => {
  const query = getPathwaySearchQuery(new URLSearchParams("origin=KR&country=AU&field=nursing&status=choosing-school"))

  assert.deepEqual(query, {
    origin: "KR",
    country: "AU",
    field: "nursing",
    status: "choosing-school",
  })
  assert.equal(
    toHomeSearchQuery(query!).toString(),
    "origin=KR&country=AU&field=nursing"
  )
})

test("new Home URLs derive the default internal status without exposing it", () => {
  const query = getPathwaySearchQuery(new URLSearchParams("origin=PH&country=AU&field=health"))

  assert.deepEqual(query, {
    origin: "PH",
    country: "AU",
    field: "health",
    status: "choosing-school",
  })
})

test("new pathway form requires a citizenship", () => {
  const values = readFormValues(new URLSearchParams("country=AU&field=nursing&status=choosing-school"))

  assert.equal(values.origin, "")
  assert.equal(validateForm(values).origin, "Select your citizenship")
  assert.deepEqual(validateForm({ ...values, origin: "KR" }), {})
})

test("priority-source and unlisted citizenship choices survive the legacy origin query", () => {
  const prioritySource = getPathwaySearchQuery(new URLSearchParams("origin=PH&country=AU&field=nursing&status=choosing-school"))
  const unlisted = getPathwaySearchQuery(new URLSearchParams("origin=OTHER&country=AU&field=nursing&status=choosing-school"))

  assert.equal(prioritySource?.origin, "PH")
  assert.equal(unlisted?.origin, "OTHER")
})

test("new saved pathways persist origin and use the four-part identity", () => {
  const input = normalizeSavedPathwayInput({
    origin: "kr",
    country: "AU",
    field: "nursing",
    status: "preparing-application",
  })

  assert.deepEqual(input, {
    origin: "KR",
    country: "AU",
    field: "nursing",
    status: "preparing-application",
  })
  assert.equal(SAVED_PATHWAY_CONFLICT_COLUMNS, "user_id,origin_country_code,country_code,field_slug")
  assert.deepEqual(toSavedPathwayWrite("user-1", input!, "2026-08-05T12:00:00.000Z"), {
    user_id: "user-1",
    origin_country_code: "KR",
    country_code: "AU",
    field_slug: "nursing",
    status_slug: "preparing-application",
    updated_at: "2026-08-05T12:00:00.000Z",
  })
})

test("legacy saved pathways remain readable without inventing an origin", () => {
  const input = normalizeSavedPathwayInput({
    country: "AU",
    field: "nursing",
    status: "preparing-visa",
  })
  const pathway = toDashboardPathway({
    id: 7,
    origin_country_code: null,
    country_code: "AU",
    field_slug: "nursing",
    status_slug: "preparing-visa",
    updated_at: "2026-08-05T12:00:00.000Z",
  })

  assert.deepEqual(input, {
    country: "AU",
    field: "nursing",
    status: "preparing-visa",
  })
  assert.equal(toSavedPathwayWrite("user-1", input!, "2026-08-05T12:00:00.000Z").origin_country_code, null)
  assert.equal(pathway?.originLabel, "Citizenship not set")
  assert.equal(pathway?.isComplete, false)
  assert.equal(pathway?.href, "/home?mode=explore&country=AU&field=nursing&status=preparing-visa")
})

test("dashboard route and stages adapt to the current situation", () => {
  assert.equal(
    getPathwayRouteLabel({ field: "nursing", status: "already-qualified" }),
    "Nursing qualification → recognition → registration → employment"
  )
  assert.deepEqual(
    getPathwayStages("looking-for-job").map((stage) => stage.id),
    ["eligibility", "employers", "applications", "sponsorship", "visa"]
  )
})
