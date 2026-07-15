import assert from "node:assert/strict"
import test from "node:test"
import { buildLandingDiscovery } from "../src/lib/discovery/landing-discovery"

test("Everywhere, Anything, and a goal returns destination signals with promising fields", () => {
  const result = buildLandingDiscovery({ country: "everywhere", major: "anything", goal: "high-income" })

  assert.equal(result.major, null)
  assert.equal(result.ranked.length, 20)
  assert.ok(result.ranked.every((country) => country.bestMajors.length > 0))
  assert.equal(result.similar.length, 3)
})

test("a selected country stays visible and receives comparable alternatives without a score boost", () => {
  const selected = buildLandingDiscovery({ country: "CA", major: "computer-science", goal: "high-income" })
  const everywhere = buildLandingDiscovery({ country: "everywhere", major: "computer-science", goal: "high-income" })

  assert.equal(selected.selectedCountry?.code, "CA")
  assert.equal(selected.selectedCountry?.score, everywhere.ranked.find((country) => country.code === "CA")?.score)
  assert.ok(selected.similar.every((country) => country.code !== "CA"))
})

test("an unknown major or country is rejected instead of silently falling back", () => {
  assert.throws(() => buildLandingDiscovery({ country: "XX", major: "anything", goal: "low-cost" }))
  assert.throws(() => buildLandingDiscovery({ country: "everywhere", major: "not-a-major", goal: "low-cost" }))
})
