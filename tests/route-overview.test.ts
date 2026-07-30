import assert from "node:assert/strict"
import test from "node:test"
import { AU_ROUTE_OVERVIEW_ANCHORS, getAuRouteOverviewAnchor } from "../src/data/au-route-overview-contract"
import { ROUTE_GUIDES } from "../src/data/route-guides"

test("every published route declares an explicit JSA overview policy", () => {
  for (const guide of ROUTE_GUIDES.filter((guide) => guide.publication.status === "published")) {
    assert.ok(guide.candidateId, guide.id)
    assert.ok(getAuRouteOverviewAnchor(guide.candidateId!), guide.candidateId)
  }
})

test("overview anchors use only four-digit historical ANZSCO profile groups", () => {
  for (const anchor of AU_ROUTE_OVERVIEW_ANCHORS) {
    for (const profile of anchor.profiles) {
      assert.match(profile.anzscoV13, /^\d{4}$/)
    }
  }
})

test("ambiguous historical profile bridges remain intentionally withheld", () => {
  assert.deepEqual(getAuRouteOverviewAnchor("data-analyst")?.profiles, [])
  assert.deepEqual(getAuRouteOverviewAnchor("ui-ux-designer")?.profiles, [])
})
