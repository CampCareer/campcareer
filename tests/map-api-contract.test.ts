import assert from "node:assert/strict"
import test from "node:test"
import { GET as getNewZealandMapData } from "../src/app/api/maps/data/nz/route"
import { GET as getMapsV1Country } from "../src/app/api/v1/maps/[country]/route"
import { GET as getKoreaBoundaries } from "../src/app/api/maps/kr-boundaries/route"
import {
  buildMapDataEnvelope,
  type MapDataEnvelope,
} from "../src/app/api/maps/data/contract"
import type { MapData } from "../src/lib/map-data"
import { buildMapsHref } from "../src/app/map/maps-route"
import { buildMapsV1Envelope } from "../src/lib/maps-v1-contract"

test("legacy map redirects preserve deep-link state", () => {
  assert.equal(
    buildMapsHref({ country: "fr", state: "11", tab: "pay" }),
    "/maps?country=fr&state=11&tab=pay",
  )
  assert.equal(
    buildMapsHref({ tab: "shortage", q: ["nurse", "teacher"] }, "UK"),
    "/maps?tab=shortage&q=nurse&q=teacher&country=uk",
  )
})

test("map data envelopes expose versioned readiness metadata", () => {
  const envelope = buildMapDataEnvelope("AU", { example: true }, "test-version")

  assert.deepEqual(Object.keys(envelope).sort(), [
    "country",
    "data",
    "dataVersion",
    "readiness",
  ])
  assert.equal(envelope.country, "AU")
  assert.equal(envelope.dataVersion, "test-version")
  assert.equal(envelope.readiness.map, "READY")
})

test("Maps v1 envelopes carry transparent readiness, methodology, and evidence fields", () => {
  const envelope = buildMapsV1Envelope({
    country: "AU",
    data: { example: true },
    dataVersion: "map-country-bundle-2026-07-14",
    evidence: [{ status: "needs_review", note: "row-level sources are retained with map data" }],
    generatedAt: "2026-07-14T00:00:00.000Z",
  })

  assert.deepEqual(Object.keys(envelope).sort(), [
    "country",
    "data",
    "dataVersion",
    "evidence",
    "generatedAt",
    "methodologyVersion",
    "readiness",
  ])
  assert.equal(envelope.country, "AU")
  assert.equal(envelope.readiness, "discovery")
  assert.equal(envelope.methodologyVersion, "maps-v1")
  assert.equal(envelope.generatedAt, "2026-07-14T00:00:00.000Z")
})

test("the NZ endpoint follows the unified contract and withholds unreviewed metrics", async () => {
  const response = getNewZealandMapData()
  const payload = await response.json() as MapDataEnvelope<Partial<MapData>>

  assert.equal(payload.country, "NZ")
  assert.equal(typeof payload.dataVersion, "string")
  assert.equal(payload.readiness.map, "READY")
  assert.equal(payload.readiness.comparison, "REVIEW_REQUIRED")
  assert.ok((payload.data.nzRegions ?? []).length > 0)
  assert.ok((payload.data.nzUniversities ?? []).length > 0)
  assert.deepEqual(payload.data.nzOccupations, [])
  assert.ok(Object.values(payload.data.nzShortageByRegion ?? {}).every(
    (rows) => Array.isArray(rows) && rows.length === 0,
  ))
  assert.ok((payload.data.nzRegions ?? []).every(
    (region) => region.rent.status === "unavailable",
  ))
})

test("Maps v1 uses the same safe NZ projection and exposes source review state", async () => {
  const response = await getMapsV1Country(
    new Request("https://campcareer.test/api/v1/maps/nz"),
    { params: Promise.resolve({ country: "nz" }) },
  )
  const payload = await response.json() as {
    country: string
    data: Partial<MapData>
    readiness: string
    methodologyVersion: string
    generatedAt: string
    evidence: Array<{ status: string; sourceUrl?: string }>
  }

  assert.equal(response.status, 200)
  assert.equal(payload.country, "NZ")
  assert.equal(payload.readiness, "discovery")
  assert.equal(payload.methodologyVersion, "maps-v1")
  assert.ok(Number.isFinite(Date.parse(payload.generatedAt)))
  assert.equal(payload.evidence.length, 5)
  assert.ok(payload.evidence.every((item) => item.status === "needs_review" && item.sourceUrl?.startsWith("https://")))
  assert.deepEqual(payload.data.nzOccupations, [])
  assert.ok((payload.data.nzRegions ?? []).every((region) => region.rent.status === "unavailable"))
  assert.ok(Object.values(payload.data.nzShortageByRegion ?? {}).every(
    (rows) => Array.isArray(rows) && rows.length === 0,
  ))
})

test("Maps v1 rejects unsupported countries without loading a country bundle", async () => {
  const response = await getMapsV1Country(
    new Request("https://campcareer.test/api/v1/maps/xx"),
    { params: Promise.resolve({ country: "xx" }) },
  )

  assert.equal(response.status, 404)
  assert.deepEqual(await response.json(), { error: "Unsupported map country" })
})

test("missing optional Korea boundary configuration degrades to empty GeoJSON", async () => {
  const previousSourceUrl = process.env.KR_SIDO_BOUNDARY_URL
  const previousServiceKey = process.env.DATA_GO_KR_SERVICE_KEY

  delete process.env.KR_SIDO_BOUNDARY_URL
  delete process.env.DATA_GO_KR_SERVICE_KEY

  try {
    const response = await getKoreaBoundaries()
    const payload = await response.json() as GeoJSON.FeatureCollection

    assert.equal(response.status, 200)
    assert.equal(response.headers.get("x-map-boundary-status"), "NOT_CONFIGURED")
    assert.deepEqual(payload, { type: "FeatureCollection", features: [] })
  } finally {
    if (previousSourceUrl === undefined) delete process.env.KR_SIDO_BOUNDARY_URL
    else process.env.KR_SIDO_BOUNDARY_URL = previousSourceUrl
    if (previousServiceKey === undefined) delete process.env.DATA_GO_KR_SERVICE_KEY
    else process.env.DATA_GO_KR_SERVICE_KEY = previousServiceKey
  }
})
