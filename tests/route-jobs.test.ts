import assert from "node:assert/strict"
import test from "node:test"
import { aggregateLatestRouteVacancies } from "../src/data/au-route-jobs-contract"

test("JSA vacancy aggregation keeps only the latest period and records every included historical group", () => {
  const result = aggregateLatestRouteVacancies([
    { state: "WA", period: "2026-04-01", vacancyCount: 8, unitGroup: "2544" },
    { state: "WA", period: "2026-05-01", vacancyCount: 10, unitGroup: "2544" },
    { state: "WA", period: "2026-05-01", vacancyCount: 7, unitGroup: "4231" },
    { state: "VIC", period: "2026-05-01", vacancyCount: 12, unitGroup: "2544" },
  ], ["VIC", "WA"])

  assert.deepEqual(result, [
    { state: "VIC", period: "2026-05-01", vacancyCount: 12, includedUnitGroups: 1 },
    { state: "WA", period: "2026-05-01", vacancyCount: 17, includedUnitGroups: 2 },
  ])
})

test("invalid states and negative vacancy values are withheld", () => {
  const result = aggregateLatestRouteVacancies([
    { state: "WA", period: "2026-05-01", vacancyCount: -1, unitGroup: "2544" },
    { state: "Outside Australia", period: "2026-05-01", vacancyCount: 2, unitGroup: "2544" },
  ], ["WA"])
  assert.deepEqual(result, [])
})
