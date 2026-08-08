import assert from "node:assert/strict"
import test from "node:test"
import { isWorkspaceRoute, WORKSPACE_NAV_ITEMS } from "../src/lib/workspace/navigation"

test("isWorkspaceRoute returns true for workspace routes", () => {
  assert.equal(isWorkspaceRoute("/"), true)
  assert.equal(isWorkspaceRoute("/compare"), true)
  assert.equal(isWorkspaceRoute("/countries"), true)
  assert.equal(isWorkspaceRoute("/cities"), true)
  assert.equal(isWorkspaceRoute("/visas"), true)
  assert.equal(isWorkspaceRoute("/occupation"), true)
  assert.equal(isWorkspaceRoute("/programs"), true)
  assert.equal(isWorkspaceRoute("/institutions"), true)
  assert.equal(isWorkspaceRoute("/courses"), true)
})

test("isWorkspaceRoute returns true for workspace sub-paths", () => {
  assert.equal(isWorkspaceRoute("/visas/timeline"), true)
  assert.equal(isWorkspaceRoute("/countries/australia"), true)
  assert.equal(isWorkspaceRoute("/cities/au/melbourne"), true)
  assert.equal(isWorkspaceRoute("/cities/au/compare"), true)
  assert.equal(isWorkspaceRoute("/compare/schools"), true)
  assert.equal(isWorkspaceRoute("/institutions/au/university-of-sydney"), true)
})

test("isWorkspaceRoute returns false for standalone tools and public pages", () => {
  assert.equal(isWorkspaceRoute("/home"), false)
  assert.equal(isWorkspaceRoute("/maps"), false)
  assert.equal(isWorkspaceRoute("/map"), false)
  assert.equal(isWorkspaceRoute("/planner"), false)
  assert.equal(isWorkspaceRoute("/profile"), false)
  assert.equal(isWorkspaceRoute("/login"), false)
})

test("isWorkspaceRoute returns false for paths that merely contain a workspace segment", () => {
  assert.equal(isWorkspaceRoute("/visas-archive"), false)
  assert.equal(isWorkspaceRoute("/institutions-archive"), false)
  assert.equal(isWorkspaceRoute("/company/countries"), false)
  assert.equal(isWorkspaceRoute("/ko/visas"), false)
})

test("WORKSPACE_NAV_ITEMS contains exactly 8 entries", () => {
  assert.equal(WORKSPACE_NAV_ITEMS.length, 8)
})

test("WORKSPACE_NAV_ITEMS has the expected ids in order", () => {
  assert.deepEqual(
    WORKSPACE_NAV_ITEMS.map((item) => item.id),
    ["home", "map", "compare", "countries", "visas", "occupation", "programs", "institutions"]
  )
})

test("every primary workspace route has a matching nav item", () => {
  const hrefs = new Set(WORKSPACE_NAV_ITEMS.map((item) => item.href))
  for (const route of ["/", "/compare", "/countries", "/visas", "/occupation", "/programs", "/institutions"]) {
    assert.ok(hrefs.has(route), `missing nav item for ${route}`)
  }
})
