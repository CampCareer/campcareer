import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  getCoordinateBounds,
  metropolitanFranceOnly,
} from "../src/app/map/france-geometry"

const worldCountries = JSON.parse(
  readFileSync(new URL("../public/world-countries.geojson", import.meta.url), "utf8"),
) as GeoJSON.FeatureCollection

test("the world map retains metropolitan France and Corsica", () => {
  const original = worldCountries.features.find((feature) => {
    const properties = (feature.properties ?? {}) as Record<string, unknown>
    return properties.ISO_A3 === "FRA" || properties.ADM0_A3 === "FRA"
  })

  assert.equal(original?.geometry?.type, "MultiPolygon")
  const originalPolygonCount = original.geometry.type === "MultiPolygon"
    ? original.geometry.coordinates.length
    : 0

  const filtered = metropolitanFranceOnly(worldCountries)
  const france = filtered.features.find((feature) => {
    const properties = (feature.properties ?? {}) as Record<string, unknown>
    return properties.ISO_A3 === "FRA" || properties.ADM0_A3 === "FRA"
  })

  assert.equal(france?.geometry?.type, "MultiPolygon")
  if (france?.geometry?.type !== "MultiPolygon") return

  assert.equal(
    france.geometry.coordinates.length,
    2,
    "metropolitan mainland France and Corsica must both remain visible",
  )
  assert.ok(
    france.geometry.coordinates.length < originalPolygonCount,
    "the overseas polygon must be removed",
  )

  for (const polygon of france.geometry.coordinates) {
    const bounds = getCoordinateBounds(polygon)
    assert.ok(bounds)
    assert.ok(bounds.maxLatitude >= 40 && bounds.minLatitude <= 52)
    assert.ok(bounds.maxLongitude >= -6 && bounds.minLongitude <= 10)
  }
})

test("malformed nested coordinates do not throw or produce invalid bounds", () => {
  assert.equal(getCoordinateBounds([[["bad", null], []], null]), null)
  assert.doesNotThrow(() => metropolitanFranceOnly({
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { ADM0_A3: "FRA" },
      geometry: { type: "MultiPolygon", coordinates: [[[]]] },
    } as unknown as GeoJSON.Feature],
  }))
})
