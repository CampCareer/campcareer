import { mkdir, writeFile } from "fs/promises"
import { execFile } from "child_process"
import { promisify } from "util"
import path from "path"
import AdmZip from "adm-zip"
import {
  FRANCE_SOURCE_URLS,
  FR_OCCUPATION_TRANSLATIONS,
  METROPOLITAN_REGION_CODES,
  normalizeFrench,
  parseFrenchNumber,
  parseSemicolonCsv,
  percentile,
  sha256,
  slugifyFrench,
} from "./lib/france-official-source"

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, "data/raw/fr")
const DATA_DIR = path.join(ROOT, "src/data")
const PUBLIC_DIR = path.join(ROOT, "public")
const RETRIEVED_AT = new Date().toISOString()
const CHECKED_AT = RETRIEVED_AT.slice(0, 10)
const execFileAsync = promisify(execFile)

type BmoOccupation = { localName: string; nameEn: string | null; nameKo: string | null; bmoCode: string; recruitmentProjects: number; recruitmentDifficultyPct: number | null; seasonalPct: number | null; demandScore: number; reviewStatus: "approved" | "review-required" }
type Matrix = { columns: string[]; rows: Map<string, number[]> }

async function download(url: string) {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "CampCareer official-data importer/1.0 (+https://www.campcareer.com)" } })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
      return new Uint8Array(await response.arrayBuffer())
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)))
    }
  }
  // Some French government hosts intermittently fail Node's DNS resolver while
  // remaining reachable over curl. Keep the importer reproducible in that case.
  try {
    const { stdout } = await execFileAsync("curl", ["-LfsS", "--retry", "3", "--retry-all-errors", url], { maxBuffer: 128 * 1024 * 1024, encoding: "buffer" })
    return new Uint8Array(stdout)
  } catch {
    throw lastError
  }
}

function json(value: unknown) { return `${JSON.stringify(value, null, 2)}\n` }

function parseBmoMatrix(text: string): Matrix {
  const rows = parseSemicolonCsv(text.replace(/^\uFEFF/, ""))
  const headerIndex = rows.findIndex((row) => row[0] === "Métier")
  if (headerIndex < 0) throw new Error("France Travail BMO export header not found.")
  const header = rows[headerIndex]
  const columns = header.slice(1).filter((column) => column && column !== "Total" && column !== "autre")
  const values = new Map<string, number[]>()
  for (const row of rows.slice(headerIndex + 1)) {
    const localName = row[0]?.trim()
    if (!localName || localName === "Total") continue
    values.set(localName, row.slice(1, columns.length + 1).map((value) => parseFrenchNumber(value) ?? 0))
  }
  return { columns, rows: values }
}

function simplifyLine(points: number[][], tolerance = 0.004): number[][] {
  if (points.length <= 4) return points
  const sqTolerance = tolerance * tolerance
  const distance = (point: number[], start: number[], end: number[]) => {
    let x = start[0]; let y = start[1]
    let dx = end[0] - x; let dy = end[1] - y
    if (dx !== 0 || dy !== 0) {
      const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)
      if (t > 1) { x = end[0]; y = end[1] } else if (t > 0) { x += dx * t; y += dy * t }
    }
    dx = point[0] - x; dy = point[1] - y
    return dx * dx + dy * dy
  }
  const keep = new Uint8Array(points.length)
  keep[0] = 1; keep[points.length - 1] = 1
  const visit = (first: number, last: number) => {
    let max = sqTolerance; let index = -1
    for (let cursor = first + 1; cursor < last; cursor += 1) {
      const d = distance(points[cursor], points[first], points[last])
      if (d > max) { index = cursor; max = d }
    }
    if (index >= 0) { keep[index] = 1; visit(first, index); visit(index, last) }
  }
  visit(0, points.length - 1)
  return points.filter((_point, index) => keep[index])
}

function simplifyGeometry(geometry: GeoJSON.Geometry): GeoJSON.Geometry {
  const simplifyPolygon = (rings: number[][][]) => rings.map((ring) => simplifyLine(ring))
  if (geometry.type === "Polygon") return { ...geometry, coordinates: simplifyPolygon(geometry.coordinates as number[][][]) }
  if (geometry.type === "MultiPolygon") return { ...geometry, coordinates: geometry.coordinates.map((polygon) => simplifyPolygon(polygon as number[][][])) }
  return geometry
}

function regionSlug(name: string) { return slugifyFrench(name) }

async function main() {
  await Promise.all([mkdir(RAW_DIR, { recursive: true }), mkdir(DATA_DIR, { recursive: true }), mkdir(PUBLIC_DIR, { recursive: true })])
  const [nationalBody, regionalBody, basinBody, rentBody, salaryBody, universityBody, regionBody] = await Promise.all([
    download(FRANCE_SOURCE_URLS.bmoNational), download(FRANCE_SOURCE_URLS.bmoRegions), download(FRANCE_SOURCE_URLS.bmoBasins),
    download(FRANCE_SOURCE_URLS.rentDataset), download(FRANCE_SOURCE_URLS.salaries), download(FRANCE_SOURCE_URLS.universities), download(FRANCE_SOURCE_URLS.regions),
  ])
  await Promise.all([
    writeFile(path.join(RAW_DIR, "france-travail-bmo-2026-national.csv"), nationalBody),
    writeFile(path.join(RAW_DIR, "france-travail-bmo-2026-regions.csv"), regionalBody),
    writeFile(path.join(RAW_DIR, "france-travail-bmo-2026-basins.csv"), basinBody),
    writeFile(path.join(RAW_DIR, "carte-des-loyers-2025-apartments.csv"), rentBody),
    writeFile(path.join(RAW_DIR, "insee-net-monthly-salary-pcs-2023.zip"), salaryBody),
    writeFile(path.join(RAW_DIR, "mesr-public-institutions.csv"), universityBody),
    writeFile(path.join(RAW_DIR, "ign-regions.geojson"), regionBody),
  ])

  const nationalRows = parseSemicolonCsv(new TextDecoder("utf-8").decode(nationalBody).replace(/^\uFEFF/, ""))
  const nationalHeader = nationalRows.findIndex((row) => row[0] === "Métier")
  if (nationalHeader < 0) throw new Error("France Travail national BMO header not found.")
  const parsedNational = nationalRows.slice(nationalHeader + 1)
    .filter((row) => row[0] && row[0] !== "Total")
    .map((row) => ({ localName: row[0], recruitmentProjects: parseFrenchNumber(row[1]) ?? 0, recruitmentDifficultyPct: parseFrenchNumber(row[2]), seasonalPct: parseFrenchNumber(row[3]) }))
    .filter((row) => row.recruitmentProjects > 0)
  const nationalProjects = parsedNational.map((row) => row.recruitmentProjects)
  const occupations: BmoOccupation[] = parsedNational.map((row) => {
    const translation = FR_OCCUPATION_TRANSLATIONS[row.localName]
    return {
      localName: row.localName,
      nameEn: translation?.en ?? null,
      nameKo: translation?.ko ?? null,
      bmoCode: `FAP2021-${slugifyFrench(row.localName)}`,
      recruitmentProjects: row.recruitmentProjects,
      recruitmentDifficultyPct: row.recruitmentDifficultyPct,
      seasonalPct: row.seasonalPct,
      demandScore: percentile(row.recruitmentProjects, nationalProjects),
      reviewStatus: translation ? "approved" : "review-required",
    }
  })

  const regionalMatrix = parseBmoMatrix(new TextDecoder("utf-8").decode(regionalBody))
  const basinMatrix = parseBmoMatrix(new TextDecoder("utf-8").decode(basinBody))
  const regionGeo = JSON.parse(new TextDecoder("utf-8").decode(regionBody)) as GeoJSON.FeatureCollection
  const regions = regionGeo.features
    .filter((feature) => METROPOLITAN_REGION_CODES.includes(String(feature.properties?.code_insee) as typeof METROPOLITAN_REGION_CODES[number]))
    .map((feature) => ({
      code: String(feature.properties?.code_insee),
      nameFr: String(feature.properties?.nom_officiel),
      nameEn: String(feature.properties?.nom_officiel),
      nameKo: null,
      slug: regionSlug(String(feature.properties?.nom_officiel)),
      geometrySource: "IGN ADMIN EXPRESS COG",
      lastChecked: CHECKED_AT,
      reviewStatus: "approved" as const,
    }))
  if (regions.length !== 13) throw new Error(`Expected 13 metropolitan regions, received ${regions.length}.`)
  const publicRegions: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: regionGeo.features
      .filter((feature) => regions.some((region) => region.code === String(feature.properties?.code_insee)))
      .map((feature) => ({ type: "Feature", properties: { code: String(feature.properties?.code_insee), nameFr: String(feature.properties?.nom_officiel) }, geometry: simplifyGeometry(feature.geometry!) })),
  }

  const rentRows = parseSemicolonCsv(new TextDecoder("utf-8").decode(rentBody).replace(/^\uFEFF/, ""))
  const rentHeader = rentRows[0]
  const rentIndex = (name: string) => rentHeader.indexOf(name)
  const rentsByCommune = new Map(rentRows.slice(1).map((row) => [row[rentIndex("INSEE_C")], {
    advertisedRentEurM2: parseFrenchNumber(row[rentIndex("loypredm2")]),
    observationCount: parseFrenchNumber(row[rentIndex("nbobs_com")]),
    r2Adjusted: parseFrenchNumber(row[rentIndex("R2_adj")]),
    lowerEurM2: parseFrenchNumber(row[rentIndex("lwr.IPm2")]),
    upperEurM2: parseFrenchNumber(row[rentIndex("upr.IPm2")]),
    predictionType: row[rentIndex("TYPPRED")] || null,
  }]))

  const universityRows = parseSemicolonCsv(new TextDecoder("utf-8").decode(universityBody).replace(/^\uFEFF/, ""))
  const universityHeader = universityRows[0]
  const universityIndex = (name: string) => universityHeader.indexOf(name)
  const institutions = universityRows.slice(1)
    .map((row) => {
      const coordinates = row[universityIndex("coordonnees")]?.split(",").map((value) => Number(value.trim())) ?? []
      const regionCode = row[universityIndex("reg_id")]?.replace(/^R/, "")
      return {
        sourceId: row[universityIndex("etablissement_id_paysage")], nameFr: row[universityIndex("uo_lib")], nameEn: row[universityIndex("uo_lib_en")] || row[universityIndex("uo_lib")],
        type: row[universityIndex("type_d_etablissement")], sector: row[universityIndex("secteur_d_etablissement")], officialUrl: row[universityIndex("url")],
        communeCode: row[universityIndex("com_code")], cityName: row[universityIndex("com_nom")], regionCode, regionName: row[universityIndex("reg_nom")],
        lat: coordinates[0], lng: coordinates[1], studentCount: parseFrenchNumber(row[universityIndex("inscrits_2024")]),
      }
    })
    .filter((row) => row.sourceId && row.nameFr && row.sector === "public" && row.officialUrl && Number.isFinite(row.lat) && Number.isFinite(row.lng) && METROPOLITAN_REGION_CODES.includes(row.regionCode as typeof METROPOLITAN_REGION_CODES[number]))

  const cityCandidates = new Map<string, { code: string; name: string; regionCode: string; population: number; studentCount: number }>()
  for (const institution of institutions) {
    const existing = cityCandidates.get(institution.communeCode) ?? { code: institution.communeCode, name: institution.cityName, regionCode: institution.regionCode, population: 0, studentCount: 0 }
    existing.studentCount += institution.studentCount ?? 0
    cityCandidates.set(institution.communeCode, existing)
  }
  const communes = await Promise.all(METROPOLITAN_REGION_CODES.map(async (regionCode) => {
    const response = await fetch(`${FRANCE_SOURCE_URLS.communeBase}?codeRegion=${regionCode}&fields=nom,code,codeRegion,population&format=json`)
    if (!response.ok) throw new Error(`API Geo communes failed for region ${regionCode}: ${response.status}`)
    return response.json() as Promise<Array<{ nom: string; code: string; codeRegion: string; population: number }>>
  }))
  const allCommuneCandidates = communes.flat()
  for (const commune of allCommuneCandidates) {
    const existing = cityCandidates.get(commune.code)
    if (existing) existing.population = commune.population
  }
  const basinByNormalizedName = new Map(basinMatrix.columns.map((name, index) => [normalizeFrench(name), { name, index }]))
  // Universities rank first, but BMO employment basins do not use every
  // university-city label. Fill the initial 50 from the remaining official
  // communes only when their name maps exactly to a published BMO basin.
  for (const commune of allCommuneCandidates) {
    if (cityCandidates.has(commune.code) || !basinByNormalizedName.has(normalizeFrench(commune.nom))) continue
    cityCandidates.set(commune.code, { code: commune.code, name: commune.nom, regionCode: commune.codeRegion, population: commune.population, studentCount: 0 })
  }
  const selectedCities: Array<{ code: string; name: string; regionCode: string; population: number; studentCount: number; basinName: string; basinIndex: number }> = []
  const usedRegionCodes = new Set<string>()
  const sortedCandidates = Array.from(cityCandidates.values()).sort((left, right) => right.studentCount - left.studentCount || right.population - left.population)
  for (const candidate of sortedCandidates) {
    const basin = basinByNormalizedName.get(normalizeFrench(candidate.name))
    if (!basin || usedRegionCodes.has(candidate.regionCode)) continue
    selectedCities.push({ ...candidate, basinName: basin.name, basinIndex: basin.index })
    usedRegionCodes.add(candidate.regionCode)
  }
  for (const candidate of sortedCandidates) {
    if (selectedCities.length >= 50) break
    if (selectedCities.some((city) => city.code === candidate.code)) continue
    const basin = basinByNormalizedName.get(normalizeFrench(candidate.name))
    if (!basin) continue
    selectedCities.push({ ...candidate, basinName: basin.name, basinIndex: basin.index })
  }
  if (selectedCities.length < 50) throw new Error(`Only ${selectedCities.length}/50 cities match a BMO employment basin.`)

  const cityGeometry = await Promise.all(selectedCities.map(async (city) => {
    const response = await fetch(`${FRANCE_SOURCE_URLS.communeBase}?code=${city.code}&format=geojson&geometry=contour`)
    if (!response.ok) throw new Error(`API Geo contour failed for ${city.code}: ${response.status}`)
    const collection = await response.json() as GeoJSON.FeatureCollection
    return collection.features[0]
  }))
  const publicCities: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: cityGeometry.map((feature) => ({ type: "Feature", properties: { code: String(feature.properties?.code), name: String(feature.properties?.nom), regionCode: String(feature.properties?.codeRegion) }, geometry: simplifyGeometry(feature.geometry!) })),
  }

  const cityRows = selectedCities.map((city) => {
    const rent = rentsByCommune.get(city.code)
    const demand = occupations
      .map((occupation) => ({ occupation, recruitmentProjects: basinMatrix.rows.get(occupation.localName)?.[city.basinIndex] ?? 0 }))
      .filter((row) => row.recruitmentProjects > 0)
      .sort((left, right) => right.recruitmentProjects - left.recruitmentProjects)
      .slice(0, 20)
      .map((row) => ({ code: row.occupation.bmoCode, recruitmentProjects: row.recruitmentProjects }))
    return {
      code: city.code, nameFr: city.name, nameEn: city.name, nameKo: null, slug: slugifyFrench(city.name), regionCode: city.regionCode,
      population: city.population, studentCount: city.studentCount || null, basinName: city.basinName, topDemand: demand,
      rent: rent ? { ...rent, statisticPeriod: "2025", status: rent.advertisedRentEurM2 != null && (rent.observationCount ?? 0) >= 30 && (rent.r2Adjusted ?? 0) >= 0.5 && rent.predictionType === "commune" ? "available" : "quality-warning" } : { advertisedRentEurM2: null, observationCount: null, r2Adjusted: null, lowerEurM2: null, upperEurM2: null, predictionType: null, statisticPeriod: "2025", status: "unavailable" },
      lastChecked: CHECKED_AT, reviewStatus: "approved" as const,
    }
  })

  const salaryZip = new AdmZip(Buffer.from(salaryBody))
  const salaryEntry = salaryZip.getEntries().find((entry) => entry.entryName.endsWith("_data.csv"))
  if (!salaryEntry) throw new Error("INSEE PCS salary CSV is missing from zip.")
  const salaryRows = parseSemicolonCsv(salaryEntry.getData().toString("utf8").replace(/^\uFEFF/, ""))
  const salaryHeader = salaryRows[0]
  const salaryIndex = (name: string) => salaryHeader.indexOf(name)
  const salaryGroups = salaryRows.slice(1)
    .filter((row) => row[salaryIndex("GEO_OBJECT")] === "REG" && row[salaryIndex("SEX")] === "_T" && row[salaryIndex("TIME_PERIOD")] === "2023" && row[salaryIndex("CONF_STATUS")] === "F" && row[salaryIndex("PCS_ESE")] !== "_T")
    .map((row) => ({ regionCode: row[salaryIndex("GEO")].replace(/^REG/, ""), pcsCode: row[salaryIndex("PCS_ESE")], monthlyNetEur: parseFrenchNumber(row[salaryIndex("OBS_VALUE")]) }))
    .filter((row) => METROPOLITAN_REGION_CODES.includes(row.regionCode as typeof METROPOLITAN_REGION_CODES[number]) && row.monthlyNetEur != null)
    .map((row) => ({ ...row, definition: "Average monthly net salary in full-time equivalent, private sector, 2023", sourceUrl: FRANCE_SOURCE_URLS.salaryLanding, lastChecked: CHECKED_AT, reviewStatus: "approved" as const }))

  const universities = institutions.map((institution) => ({
    country: "FR", slug: `${slugifyFrench(institution.nameFr)}-${institution.sourceId.toLowerCase()}`, nameFr: institution.nameFr, nameEn: institution.nameEn,
    institutionType: institution.type, officialUrl: institution.officialUrl, cityName: institution.cityName, communeCode: institution.communeCode,
    regionCode: institution.regionCode, regionName: institution.regionName, lat: institution.lat, lng: institution.lng, studentCount: institution.studentCount ?? null,
    sourceUrl: FRANCE_SOURCE_URLS.universityLanding, lastChecked: CHECKED_AT, reviewStatus: "approved" as const,
  }))

  const regionDemand = regions.map((region) => {
    const index = regionalMatrix.columns.findIndex((column) => normalizeFrench(column) === normalizeFrench(region.nameFr))
    const rows = occupations.map((occupation) => ({ occupation, recruitmentProjects: index >= 0 ? regionalMatrix.rows.get(occupation.localName)?.[index] ?? 0 : 0 }))
      .filter((row) => row.recruitmentProjects > 0)
      .sort((left, right) => right.recruitmentProjects - left.recruitmentProjects)
      .slice(0, 20)
      .map((row) => ({ code: row.occupation.bmoCode, recruitmentProjects: row.recruitmentProjects }))
    const cityRents = cityRows.filter((city) => city.regionCode === region.code && city.rent.status === "available" && city.rent.advertisedRentEurM2 != null)
    const totalPopulation = cityRents.reduce((sum, city) => sum + city.population, 0)
    const weightedRent = totalPopulation > 0 ? cityRents.reduce((sum, city) => sum + (city.rent.advertisedRentEurM2 ?? 0) * city.population, 0) / totalPopulation : null
    return { ...region, topDemand: rows, rent: { advertisedRentEurM2: weightedRent, cityCoverage: cityRents.length, sourceCityCount: cityRows.filter((city) => city.regionCode === region.code).length, status: weightedRent != null ? "internal-estimate" : "unavailable" } }
  })

  const snapshots = [
    { category: "shortage", sourceName: "France Travail BMO 2026", sourceUrl: FRANCE_SOURCE_URLS.bmoNational, datasetUrls: [FRANCE_SOURCE_URLS.bmoRegions, FRANCE_SOURCE_URLS.bmoBasins], contentHash: sha256(nationalBody), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-download", licenseStatus: "pending-verification", reviewStatus: "approved", status: "ingested" },
    { category: "rent", sourceName: "Carte des loyers 2025", sourceUrl: FRANCE_SOURCE_URLS.rentLanding, datasetUrls: [FRANCE_SOURCE_URLS.rentDataset], contentHash: sha256(rentBody), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-download", licenseStatus: "pending-verification", reviewStatus: "review-required", status: "ingested" },
    { category: "occupation", sourceName: "INSEE private-sector salaries by PCS, 2023", sourceUrl: FRANCE_SOURCE_URLS.salaryLanding, datasetUrls: [FRANCE_SOURCE_URLS.salaries], contentHash: sha256(salaryBody), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-download", licenseStatus: "public-statistics", reviewStatus: "approved", status: "ingested" },
    { category: "university", sourceName: "MESR public higher-education institutions", sourceUrl: FRANCE_SOURCE_URLS.universityLanding, datasetUrls: [FRANCE_SOURCE_URLS.universities], contentHash: sha256(universityBody), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-api", licenseStatus: "Licence Ouverte 2.0", reviewStatus: "approved", status: "ingested" },
    { category: "boundary", sourceName: "IGN ADMIN EXPRESS COG", sourceUrl: FRANCE_SOURCE_URLS.regions, datasetUrls: [FRANCE_SOURCE_URLS.communeBase], contentHash: sha256(regionBody), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-api", licenseStatus: "official-source", reviewStatus: "approved", status: "ingested" },
  ]

  await Promise.all([
    writeFile(path.join(DATA_DIR, "fr-demand-occupations.json"), json(occupations)),
    writeFile(path.join(DATA_DIR, "fr-regions.json"), json(regionDemand)),
    writeFile(path.join(DATA_DIR, "fr-cities.json"), json(cityRows)),
    writeFile(path.join(DATA_DIR, "fr-salary-groups.json"), json(salaryGroups)),
    writeFile(path.join(DATA_DIR, "fr-universities.json"), json(universities)),
    writeFile(path.join(DATA_DIR, "fr-source-snapshots.json"), json(snapshots)),
    writeFile(path.join(PUBLIC_DIR, "fr-regions.geojson"), json(publicRegions)),
    writeFile(path.join(PUBLIC_DIR, "fr-cities.geojson"), json(publicCities)),
  ])
  console.log(`[fr-import] ${occupations.length} BMO occupations, ${regions.length} regions, ${cityRows.length} cities, ${salaryGroups.length} INSEE PCS salary rows, ${universities.length} MESR institutions.`)
}

main().catch((error) => { console.error("[fr-import] failed", error); process.exit(1) })
