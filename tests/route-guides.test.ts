import assert from "node:assert/strict"
import test from "node:test"
import { getRouteGuide, ROUTE_GUIDES, routeGuideHref } from "../src/data/route-guides"

test("every published route has the complete source-backed output contract", () => {
  assert.ok(ROUTE_GUIDES.length > 0)
  for (const guide of ROUTE_GUIDES) {
    assert.ok(guide.visa.name)
    assert.ok(guide.visa.eligibility.length > 0)
    assert.ok(guide.visa.workConditions.length > 0)
    assert.ok(guide.preparation.length > 0)
    assert.ok(guide.jobs.length > 0)
    assert.ok(guide.courses.length > 0)
    assert.ok(guide.map.href.startsWith("/maps"))
    assert.ok(guide.sources.every((source) => source.url.startsWith("https://") && source.checkedAt))
  }
})

test("the first guide is the current Korean passport to Australia mining route", () => {
  const guide = getRouteGuide("south-korea", "australia", "mining-work")

  assert.equal(guide?.origin.code, "KR")
  assert.equal(guide?.destination.code, "AU")
  assert.equal(guide?.visa.name, "Working Holiday visa (subclass 417)")
  assert.equal(routeGuideHref(guide!), "/routes/south-korea/australia/mining-work")
})
