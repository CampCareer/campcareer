import assert from "node:assert/strict"
import test from "node:test"
import { regionalDiscoveryFor } from "../src/data/regional-discovery"

test("Australia regional discovery starts with the requested city choices", () => {
  const cities = regionalDiscoveryFor("AU")
  assert.deepEqual(cities.slice(0, 4).map((city) => city.city), ["Sydney", "Melbourne", "Brisbane", "Perth"])
  assert.ok(cities.some((city) => city.city === "Gold Coast" && city.code === "QLD"))
  assert.ok(cities.every((city) => city.image.startsWith("https://images.unsplash.com/")))
})

test("US regional discovery includes New York and Chicago with valid state codes", () => {
  const regions = regionalDiscoveryFor("US")
  assert.ok(regions.some((region) => region.city === "New York" && region.code === "NY"))
  assert.ok(regions.some((region) => region.city === "Chicago" && region.code === "IL"))
})
