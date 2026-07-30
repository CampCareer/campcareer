import assert from "node:assert/strict"
import test from "node:test"
import { ROUTE_GUIDES } from "../src/data/route-guides"
import { routeMapHref } from "../src/lib/route-map-link"

test("route map links retain the exact occupation and selected Australian state", () => {
  const nurse = ROUTE_GUIDES.find((guide) => guide.candidateId === "registered-nurse")
  assert.ok(nurse)
  assert.equal(
    routeMapHref(nurse, "wa"),
    "/maps?route=kr-au-registered-nurse&country=au&state=WA&occ=265432",
  )
})

test("an invalid map state is withheld without changing the exact route occupation", () => {
  const civil = ROUTE_GUIDES.find((guide) => guide.candidateId === "civil-engineer")
  assert.ok(civil)
  assert.equal(
    routeMapHref(civil, "not-a-state"),
    "/maps?route=kr-au-civil-engineer&country=au&occ=243231",
  )
})
