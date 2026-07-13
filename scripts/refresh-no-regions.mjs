/**
 * Refresh Norway fylke boundaries from Kartverket's public administrative API.
 *
 * The service exposes EPSG:4258 coordinates (longitude, latitude), which are
 * directly compatible with Leaflet's GeoJSON reader. We simplify only for the
 * interactive map payload; the source endpoint remains the authoritative,
 * full-resolution geometry.
 */
import { writeFile } from "node:fs/promises"

const API = "https://api.kartverket.no/kommuneinfo/v1"
const OUTPUT = new URL("../public/no-regions.geojson", import.meta.url)
const TOLERANCE_DEGREES = 0.0025 // ~275 m; suitable for a country-level map.

const CODES_BY_NAME = {
  Oslo: "OSL",
  Rogaland: "ROG",
  "Møre og Romsdal": "MRD",
  Nordland: "NOR",
  Østfold: "OST",
  Akershus: "AKE",
  Buskerud: "BUS",
  Innlandet: "INN",
  Vestfold: "VST",
  Telemark: "TEL",
  Agder: "AGD",
  Vestland: "VEL",
  Trøndelag: "TRN",
  Troms: "TRO",
  Finnmark: "FIN",
}

function perpendicularDistance(point, start, end) {
  const [x, y] = point
  const [x1, y1] = start
  const [x2, y2] = end
  const dx = x2 - x1
  const dy = y2 - y1
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1)
  return Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / Math.hypot(dx, dy)
}

function simplifyOpenLine(points) {
  if (points.length < 3) return points
  let maxDistance = 0
  let index = 0
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = perpendicularDistance(points[i], points[0], points.at(-1))
    if (distance > maxDistance) {
      maxDistance = distance
      index = i
    }
  }
  if (maxDistance <= TOLERANCE_DEGREES) return [points[0], points.at(-1)]
  return [...simplifyOpenLine(points.slice(0, index + 1)).slice(0, -1), ...simplifyOpenLine(points.slice(index))]
}

function simplifyRing(ring) {
  if (ring.length < 5) return ring
  const closed = ring[0][0] === ring.at(-1)[0] && ring[0][1] === ring.at(-1)[1]
  const source = closed ? ring.slice(0, -1) : ring
  const simplified = simplifyOpenLine(source)
  const withClosure = [...simplified, simplified[0]]
  return withClosure.length >= 4 ? withClosure : ring
}

function simplifyGeometry(geometry) {
  if (geometry.type === "Polygon") return { ...geometry, coordinates: geometry.coordinates.map(simplifyRing) }
  if (geometry.type === "MultiPolygon") return { ...geometry, coordinates: geometry.coordinates.map((polygon) => polygon.map(simplifyRing)) }
  throw new Error(`Unexpected Kartverket geometry type: ${geometry.type}`)
}

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.json()
}

const counties = await getJson(`${API}/fylker`)
const selected = counties.filter((county) => CODES_BY_NAME[county.fylkesnavn])
if (selected.length !== Object.keys(CODES_BY_NAME).length) throw new Error(`Expected 15 counties, found ${selected.length}`)

const features = await Promise.all(selected.map(async (county) => {
  const detail = await getJson(`${API}/fylker/${county.fylkesnummer}/omrade`)
  return {
    type: "Feature",
    properties: {
      code: CODES_BY_NAME[county.fylkesnavn],
      name: county.fylkesnavn,
      countyNumber: county.fylkesnummer,
    },
    geometry: simplifyGeometry(detail.omrade),
  }
}))

features.sort((a, b) => a.properties.code.localeCompare(b.properties.code))
const output = {
  type: "FeatureCollection",
  source: "Kartverket Administrative units API — fylker",
  sourceUrl: `${API}/fylker/{fylkesnummer}/omrade`,
  retrievedAt: new Date().toISOString(),
  simplification: { toleranceDegrees: TOLERANCE_DEGREES, method: "Ramer–Douglas–Peucker" },
  features,
}

await writeFile(OUTPUT, `${JSON.stringify(output)}\n`)
console.log(`Wrote ${features.length} Kartverket county boundaries to ${OUTPUT.pathname}`)
