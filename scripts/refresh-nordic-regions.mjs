import { writeFile } from "node:fs/promises"

const OUTPUTS = {
  se: new URL("../public/se-regions.geojson", import.meta.url),
  dk: new URL("../public/dk-regions.geojson", import.meta.url),
  fi: new URL("../public/fi-regions.geojson", import.meta.url),
}

const swedenCodeByNuts = {
  SE110: "AB", SE121: "C", SE122: "D", SE123: "E", SE124: "T", SE125: "U",
  SE211: "F", SE212: "G", SE213: "H", SE214: "I", SE221: "K", SE224: "M",
  SE231: "N", SE232: "O", SE311: "S", SE312: "W", SE313: "X", SE321: "Y",
  SE322: "Z", SE331: "AC", SE332: "BD",
}

const swedenNameByCode = {
  AB: "Stockholm", AC: "Västerbotten", BD: "Norrbotten", C: "Uppsala", D: "Södermanland",
  E: "Östergötland", F: "Jönköping", G: "Kronoberg", H: "Kalmar", I: "Gotland", K: "Blekinge",
  M: "Skåne", N: "Halland", O: "Västra Götaland", S: "Värmland", T: "Örebro", U: "Västmanland",
  W: "Dalarna", X: "Gävleborg", Y: "Jämtland", Z: "Västernorrland",
}

const denmarkCodeByDagi = { "1081": "NOR", "1082": "MID", "1083": "SDJ", "1084": "HST", "1085": "SJA" }
const finlandCodeByMaakunta = {
  "01": "UUS", "02": "VRS", "04": "SAT", "05": "KHM", "06": "PIR", "07": "PKY",
  "08": "KYR", "09": "SKR", "10": "KYS", "11": "NSV", "12": "NKR", "13": "KSR",
  "15": "PHM", "16": "KPK", "17": "NPO", "18": "KAI",
}

function simplifyRing(points, tolerance = 0.002) {
  if (points.length < 4) return points
  const sqTolerance = tolerance * tolerance
  const sqSegmentDistance = (point, start, end) => {
    let x = start[0]; let y = start[1]
    let dx = end[0] - x; let dy = end[1] - y
    if (dx !== 0 || dy !== 0) {
      const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)
      if (t > 1) { x = end[0]; y = end[1] } else if (t > 0) { x += dx * t; y += dy * t }
    }
    dx = point[0] - x; dy = point[1] - y
    return dx * dx + dy * dy
  }
  const simplified = [points[0]]
  const simplify = (first, last) => {
    let index = -1; let maxSqDistance = sqTolerance
    for (let i = first + 1; i < last; i += 1) {
      const distance = sqSegmentDistance(points[i], points[first], points[last])
      if (distance > maxSqDistance) { index = i; maxSqDistance = distance }
    }
    if (index >= 0) { simplify(first, index); simplified.push(points[index]); simplify(index, last) }
  }
  simplify(0, points.length - 1)
  simplified.push(points.at(-1))
  return simplified
}

function simplifyGeometry(geometry) {
  if (!geometry) return geometry
  if (geometry.type === "Polygon") return { ...geometry, coordinates: geometry.coordinates.map((ring) => simplifyRing(ring)) }
  if (geometry.type === "MultiPolygon") return { ...geometry, coordinates: geometry.coordinates.map((polygon) => polygon.map((ring) => simplifyRing(ring))) }
  return geometry
}

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  return response.json()
}

async function writeCollection(output, features) {
  await writeFile(output, `${JSON.stringify({ type: "FeatureCollection", features })}\n`)
}

const seSource = await getJson("https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_01M_2024_4326_LEVL_3.geojson")
await writeCollection(OUTPUTS.se, seSource.features
  .filter((feature) => feature.properties?.CNTR_CODE === "SE")
  .map((feature) => {
    const code = swedenCodeByNuts[feature.properties.NUTS_ID]
    if (!code) throw new Error(`Unknown Sweden NUTS region: ${feature.properties.NUTS_ID}`)
    return { type: "Feature", properties: { code, name: swedenNameByCode[code], sourceCode: feature.properties.NUTS_ID }, geometry: simplifyGeometry(feature.geometry) }
  }))

const dkSource = await getJson("https://api.dataforsyningen.dk/regioner?format=geojson")
await writeCollection(OUTPUTS.dk, dkSource.features.map((feature) => {
  const code = denmarkCodeByDagi[feature.properties?.kode]
  if (!code) throw new Error(`Unknown Denmark region: ${feature.properties?.kode}`)
  return { type: "Feature", properties: { code, name: feature.properties.navn.replace(/^Region /, ""), sourceCode: feature.properties.kode }, geometry: simplifyGeometry(feature.geometry) }
}))

// Statistics Finland serves this WFS layer in EPSG:3067 by default. Leaflet
// expects GeoJSON coordinates in WGS84, so force EPSG:4326 at the source.
const fiSource = await getJson("https://geo.stat.fi/geoserver/tilastointialueet/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=tilastointialueet:maakunta1000k_2025&outputFormat=application/json&srsName=EPSG:4326")
await writeCollection(OUTPUTS.fi, fiSource.features.map((feature) => ({
  type: "Feature",
  properties: { code: finlandCodeByMaakunta[feature.properties.maakunta] ?? null, name: feature.properties.name, sourceCode: feature.properties.maakunta },
  geometry: simplifyGeometry(feature.geometry),
})))

console.log("Wrote actual administrative boundaries for Sweden, Denmark and Finland.")
