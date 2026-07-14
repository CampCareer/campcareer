import { createHash } from "node:crypto"
import { writeFile } from "node:fs/promises"

const SOURCE_URL = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=420000,30000,900000,350000&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&returnGeometry=true"
const OUTPUT = new URL("../public/ch-cantons.geojson", import.meta.url)

// geo.admin returns swissBOUNDARIES3D geometry in CH1903/LV03 (EPSG:21781).
// Leaflet consumes WGS84 longitude/latitude coordinates, so transform at
// collection time and never ship the source CRS to the browser.
function lv03ToWgs84([east, north]) {
  const y = (east - 600000) / 1_000_000
  const x = (north - 200000) / 1_000_000
  const latitude = (16.9023892 + 3.238272 * x - 0.270978 * y ** 2 - 0.002528 * x ** 2 - 0.0447 * y ** 2) * 100 / 36
  const longitude = (2.6779094 + 4.728982 * y + 0.791484 * y * x + 0.1306 * y * x ** 2 - 0.0436 * y ** 3) * 100 / 36
  return [Number(longitude.toFixed(7)), Number(latitude.toFixed(7))]
}

const response = await fetch(SOURCE_URL)
if (!response.ok) throw new Error(`Swiss canton boundary request failed: ${response.status}`)
const raw = await response.text()
const payload = JSON.parse(raw)
if (!Array.isArray(payload.results) || payload.results.length !== 26) {
  throw new Error(`Expected exactly 26 Swiss cantons, received ${payload.results?.length ?? 0}`)
}

const features = payload.results.map((result) => {
  const code = result.attributes?.ak
  const name = result.attributes?.name
  const rings = result.geometry?.rings
  if (typeof code !== "string" || typeof name !== "string" || !Array.isArray(rings) || rings.length === 0) {
    throw new Error(`Invalid canton result: ${JSON.stringify(result.attributes)}`)
  }
  return {
    type: "Feature",
    properties: { code, name, sourceId: result.id, sourceAreaM2: result.attributes?.flaeche ?? null },
    // A canton can contain several disconnected surfaces. Keep every source
    // ring visible rather than flattening it into a bounding rectangle.
    geometry: { type: "MultiPolygon", coordinates: rings.map((ring) => [ring.map(lv03ToWgs84)]) },
  }
})

const collection = { type: "FeatureCollection", features }
await writeFile(OUTPUT, `${JSON.stringify(collection)}\n`)
console.log(JSON.stringify({ sourceUrl: SOURCE_URL, contentHash: `sha256:${createHash("sha256").update(raw).digest("hex")}`, cantons: features.length }))
