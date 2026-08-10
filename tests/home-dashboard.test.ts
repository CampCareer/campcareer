import test from "node:test"
import assert from "node:assert/strict"
import { getHomeMode, getStageIndex, STATUS_ACTIONS, toDashboardPathway, toDashboardPathways } from "@/app/(workspace)/home/home-dashboard-config"
import { SAVED_PATHWAY_CONFLICT_COLUMNS, toSavedPathwayWrite } from "@/app/(workspace)/home/home-pathway-save"

test("Home mode gives a valid result query precedence over authentication and explore mode", () => {
  const valid = new URLSearchParams("country=AU&field=nursing&status=choosing-school&mode=explore")

  assert.equal(getHomeMode(valid, false), "result")
  assert.equal(getHomeMode(valid, true), "result")
  assert.equal(getHomeMode(new URLSearchParams("mode=explore"), true), "explore")
  assert.equal(getHomeMode(new URLSearchParams(), true), "dashboard")
  assert.equal(getHomeMode(new URLSearchParams("country=AU&field=unknown&status=choosing-school"), true), "dashboard")
  assert.equal(getHomeMode(new URLSearchParams(), false), "explore")
})

test("each valid Home status stays in Result mode for guests and authenticated users", () => {
  for (const status of Object.keys(STATUS_ACTIONS)) {
    const field = status === "no-field" ? "not-sure" : "nursing"
    const query = new URLSearchParams({ country: "AU", field, status })

    assert.equal(getHomeMode(query, false), "result")
    assert.equal(getHomeMode(query, true), "result")
  }
})

test("saved pathways reuse Home labels and produce a stable result href", () => {
  const pathway = toDashboardPathway({
    id: 10,
    country_code: "AU",
    field_slug: "nursing",
    status_slug: "choosing-school",
    updated_at: "2026-08-01T12:00:00.000Z",
  })

  assert.deepEqual(pathway, {
    id: 10,
    values: { origin: "", country: "AU", field: "nursing", status: "choosing-school" },
    originLabel: "Citizenship not set",
    countryLabel: "Australia",
    fieldLabel: "Nursing",
    statusLabel: "Choosing a program",
    routeLabel: "Nursing program → application → visa → career entry",
    updatedAt: "2026-08-01T12:00:00.000Z",
    href: "/home?mode=explore&country=AU&field=nursing&status=choosing-school",
    isComplete: false,
  })
})

test("no-field saved pathways show friendly labels and invalid records are ignored", () => {
  const noField = toDashboardPathway({
    id: 11,
    country_code: "AU",
    field_slug: "not-sure",
    status_slug: "no-field",
    updated_at: "2026-08-01T12:00:00.000Z",
  })

  assert.equal(noField?.fieldLabel, "Field not selected")
  assert.equal(noField?.statusLabel, "Exploring options")
  assert.equal(toDashboardPathway({ id: 12, country_code: "AU", field_slug: "unknown", status_slug: "choosing-school", updated_at: "2026-08-01T12:00:00.000Z" }), null)
})

test("Dashboard safely handles no saved paths, excludes invalid paths, and keeps the newest valid path first", () => {
  assert.deepEqual(toDashboardPathways([]), [])

  const pathways = toDashboardPathways([
    { id: 21, country_code: "AU", field_slug: "nursing", status_slug: "choosing-school", updated_at: "2026-07-30T12:00:00.000Z" },
    { id: 22, country_code: "AU", field_slug: "nursing", status_slug: "preparing-application", updated_at: "2026-08-01T12:00:00.000Z" },
    { id: 23, country_code: "AU", field_slug: "unknown", status_slug: "choosing-school", updated_at: "2026-08-02T12:00:00.000Z" },
  ])

  assert.deepEqual(pathways.map((pathway) => pathway.id), [22, 21])
  assert.equal(pathways[0].statusLabel, "Preparing my application")
})

test("the saved-path write contract upserts one country and field identity while status remains updateable", () => {
  const common = { country: "AU", field: "nursing" }
  const schoolWrite = toSavedPathwayWrite("user-1", { ...common, status: "choosing-school" }, "2026-08-01T10:00:00.000Z")
  const applicationWrite = toSavedPathwayWrite("user-1", { ...common, status: "preparing-application" }, "2026-08-01T11:00:00.000Z")

  assert.equal(SAVED_PATHWAY_CONFLICT_COLUMNS, "user_id,origin_country_code,country_code,field_slug")
  assert.deepEqual(
    { user_id: applicationWrite.user_id, country_code: applicationWrite.country_code, field_slug: applicationWrite.field_slug },
    { user_id: schoolWrite.user_id, country_code: schoolWrite.country_code, field_slug: schoolWrite.field_slug }
  )
  assert.equal(applicationWrite.status_slug, "preparing-application")
  assert.notEqual(applicationWrite.updated_at, schoolWrite.updated_at)
})

test("each status maps to its current stage and three anchored next actions", () => {
  for (const [status, actions] of Object.entries(STATUS_ACTIONS)) {
    assert.notEqual(getStageIndex(status), -1)
    assert.equal(actions.actions.length, 3)
    assert.ok(actions.primaryAnchor.startsWith("#"))
    assert.ok(actions.actions.every((action) => action.anchor.startsWith("#")))
  }
})
