import test from "node:test"
import assert from "node:assert/strict"
import {
  getOverviewSearchQuery,
  readOverviewSearchValues,
  toOverviewSearchQuery,
  validateOverviewSearch,
} from "@/app/(workspace)/home/home-overview-config"
import { getHomeMode } from "@/app/(workspace)/home/home-dashboard-config"

test("Career check uses country and occupation as its canonical query", () => {
  const query = getOverviewSearchQuery(new URLSearchParams("country=AU&occupation=electrician"))

  assert.deepEqual(query, { country: "AU", occupation: "electrician" })
  assert.equal(toOverviewSearchQuery(query!).toString(), "country=AU&occupation=electrician")
  assert.equal(getHomeMode(new URLSearchParams("country=AU&occupation=electrician"), false), "result")
})

test("Career check allows an undecided country but requires an occupation", () => {
  const countryUndecided = getOverviewSearchQuery(new URLSearchParams("country=not-sure&occupation=electrician"))
  const occupationUndecided = getOverviewSearchQuery(new URLSearchParams("country=AU&occupation=not-sure"))

  assert.deepEqual(countryUndecided, { country: "not-sure", occupation: "electrician" })
  assert.equal(occupationUndecided, null)
})

test("Career check requires exactly the two decision inputs", () => {
  const values = readOverviewSearchValues(new URLSearchParams("country=AU"))

  assert.equal(validateOverviewSearch(values).occupation, "하고 싶은 일을 선택해 주세요")
  assert.equal(validateOverviewSearch(values).country, undefined)
})
