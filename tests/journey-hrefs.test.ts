import assert from "node:assert/strict"
import test from "node:test"
import { getTaxonomyJourneyHref, localizeStudyJourneyHref } from "../src/lib/study-product/journey-hrefs"

test("occupation results keep a valid Maps detail URL", () => {
  assert.equal(
    getTaxonomyJourneyHref({
      kind: "TRADE_PATHWAY",
      slug: "registered-nurses",
      exploreHref: "/maps/ca/registered-nurses",
    }),
    "/maps/ca/registered-nurses",
  )
})

test("broad concepts use a canonical comparison route", () => {
  assert.equal(
    getTaxonomyJourneyHref({ kind: "STUDY_FIELD", slug: "cybersecurity" }),
    "/compare?major=cybersecurity",
  )
  assert.equal(
    getTaxonomyJourneyHref({ kind: "TRADE_PATHWAY", slug: "carpentry" }),
    "/compare?career=carpenter",
  )
})

test("Korean journeys keep Workspace landing routes canonical", () => {
  assert.equal(localizeStudyJourneyHref("/maps?country=ca", "ko-KR"), "/maps?country=ca")
  assert.equal(localizeStudyJourneyHref("/methodology", "en"), "/methodology")
  assert.equal(
    getTaxonomyJourneyHref({ kind: "STUDY_FIELD", slug: "cybersecurity" }, "ko-KR"),
    "/compare?major=cybersecurity",
  )
  assert.equal(
    getTaxonomyJourneyHref({
      kind: "TRADE_PATHWAY",
      slug: "registered-nurses",
      exploreHref: "/maps/ca/registered-nurses",
    }, "ko-KR"),
    "/ko/maps/ca/registered-nurses",
  )
})

test("country-only Maps URLs never escape the landing journey", () => {
  assert.equal(
    getTaxonomyJourneyHref({
      kind: "TRADE_PATHWAY",
      slug: "carpentry",
      exploreHref: "/maps/au",
    }),
    "/compare?career=carpenter",
  )
})
