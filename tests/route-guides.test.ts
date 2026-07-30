import assert from "node:assert/strict"
import test from "node:test"
import { getRouteGuide, ROUTE_GUIDES, routeGuideHref } from "../src/data/route-guides"
import { findPublishedRoute, routeResultsHref } from "../src/lib/route-search"

test("every published route has the complete source-backed output contract", () => {
  assert.ok(ROUTE_GUIDES.length > 0)
  for (const guide of ROUTE_GUIDES) {
    assert.equal(guide.publication.status, "published")
    assert.deepEqual(guide.publication.gates, { visa: true, preparation: true, jobs: true, courses: true, map: true })
    assert.equal(guide.availability.status, "conditional")
    assert.ok(guide.visa.name)
    assert.ok(guide.visa.eligibility.length > 0)
    assert.ok(guide.visa.workConditions.length > 0)
    assert.ok(guide.preparation.length > 0)
    assert.ok(guide.jobs.length > 0)
    assert.ok(guide.courses.length > 0)
    assert.ok(guide.employers.length > 0)
    assert.ok(guide.map.href.startsWith("/maps"))
    assert.ok(guide.map.signals.length > 0)
    assert.ok(guide.map.signals.every((signal) => signal.source.checkedAt && signal.readiness))
    assert.ok(guide.sources.every((source) => source.url.startsWith("https://") && source.checkedAt && source.operator && source.sourceType))
    for (const link of [...guide.jobs, ...guide.courses, ...guide.employers]) {
      assert.ok(link.url.startsWith("https://"))
      assert.ok(link.source.checkedAt)
      assert.ok(link.source.operator)
      assert.ok(link.relevance.en && link.relevance.ko)
    }
  }
})

test("the first guide is the current Korean passport to Australia mining route", () => {
  const guide = getRouteGuide("south-korea", "australia", "mining-work")

  assert.equal(guide?.origin.code, "KR")
  assert.equal(guide?.destination.code, "AU")
  assert.equal(guide?.visa.name, "Working Holiday visa (subclass 417)")
  assert.equal(routeGuideHref(guide!), "/routes/australia/mining-work")
})

test("published routes resolve only for their canonical Korea to Australia intent", () => {
  assert.equal(findPublishedRoute({ citizenship: "kr", destination: "au", field: "광업", goal: "work" })?.id, "kr-au-mining-work")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "registered-nurse", goal: "study-to-work" })?.id, "kr-au-registered-nurse")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "software-engineer", goal: "work" })?.id, "kr-au-software-engineer")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "early-childhood-educator", goal: "study" })?.id, "kr-au-early-childhood-educator")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "aged-care-worker", goal: "work" })?.id, "kr-au-aged-care-worker")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "disability-support-worker", goal: "work" })?.id, "kr-au-disability-support-worker")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "cyber-security-analyst", goal: "study" })?.id, "kr-au-cyber-security-analyst")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "electrician", goal: "work" })?.id, "kr-au-electrician")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "data-analyst", goal: "study" })?.id, "kr-au-data-analyst")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "automotive-technician", goal: "work" })?.id, "kr-au-automotive-technician")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "chef", goal: "study" })?.id, "kr-au-chef")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "beauty-therapist", goal: "study-to-work" })?.id, "kr-au-beauty-therapist")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "civil-engineer", goal: "study" })?.id, "kr-au-civil-engineer")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "mechanical-engineer", goal: "work" })?.id, "kr-au-mechanical-engineer")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "accountant", goal: "study-to-work" })?.id, "kr-au-accountant")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "business-analyst", goal: "work" })?.id, "kr-au-business-analyst")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "social-worker", goal: "study" })?.id, "kr-au-social-worker")
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "ui-ux-designer", goal: "study-to-work" })?.id, "kr-au-ui-ux-designer")
  assert.equal(findPublishedRoute({ citizenship: "RO", destination: "KR", field: "beauty", goal: "study" }), null)
  assert.equal(findPublishedRoute({ citizenship: "KR", destination: "AU", field: "make-up-artist", goal: "work" }), null)
})

test("result URLs preserve the search state without becoming indexable route URLs", () => {
  assert.equal(routeResultsHref("registered-nurse", "work"), "/results?search_query=registered-nurse")
  assert.equal(routeResultsHref("Registered Nurse", "study-to-work"), "/results?search_query=Registered+Nurse&goal=study-to-work")
})
