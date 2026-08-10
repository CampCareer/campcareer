import test from "node:test"
import assert from "node:assert/strict"
import {
  getOverviewSearchQuery,
  readOverviewSearchValues,
  toOverviewSearchQuery,
  validateOverviewSearch,
} from "@/app/(workspace)/home/home-overview-config"
import { getHomeMode } from "@/app/(workspace)/home/home-dashboard-config"

test("Overview uses citizenship, country and category as its canonical query", () => {
  const query = getOverviewSearchQuery(new URLSearchParams("citizenship=PH&country=AU&category=health"))

  assert.deepEqual(query, { citizenship: "PH", country: "AU", category: "health" })
  assert.equal(
    toOverviewSearchQuery(query!).toString(),
    "citizenship=PH&country=AU&category=health"
  )
})

test("Overview accepts the unlisted-country selection without inventing coverage", () => {
  const query = getOverviewSearchQuery(new URLSearchParams("citizenship=OTHER&country=CA&category=not-sure"))

  assert.deepEqual(query, { citizenship: "OTHER", country: "CA", category: "not-sure" })
})

test("legacy origin and field URLs migrate to a category overview", () => {
  const values = readOverviewSearchValues(new URLSearchParams("origin=KR&country=AU&field=nursing&status=preparing-visa"))

  assert.deepEqual(values, { citizenship: "KR", country: "AU", category: "health" })
  assert.equal(getHomeMode(new URLSearchParams("citizenship=KR&country=AU&category=health"), false), "result")
})

test("Overview requires all three decision inputs", () => {
  const values = readOverviewSearchValues(new URLSearchParams("country=AU"))

  assert.equal(validateOverviewSearch(values).citizenship, "Select your passport")
  assert.equal(validateOverviewSearch(values).category, "Select a career")
})
