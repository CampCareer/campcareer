import { execFile } from "child_process"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { promisify } from "util"
import {
  SPAIN_CNO_GROUPS,
  SPAIN_COMMUNITIES,
  SPAIN_PROVINCES,
  SPAIN_SHORTAGE_TRANSLATIONS,
  SPAIN_SOURCE_URLS,
  SPAIN_SERPAVI_RENT_2024,
  SPAIN_UNIVERSITY_SEEDS,
  normalizeSpanish,
  parseSpanishNumber,
  sha256,
  slugifySpanish,
} from "./lib/spain-official-source"

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, "data/raw/es")
const DATA_DIR = path.join(ROOT, "src/data")
const PUBLIC_DIR = path.join(ROOT, "public")
const RETRIEVED_AT = new Date().toISOString()
const CHECKED_AT = RETRIEVED_AT.slice(0, 10)
const execFileAsync = promisify(execFile)

type ReviewStatus = "approved" | "review-required"
type ShortageRow = { code: string; localName: string; nameEn: string | null; nameKo: string | null; provinceCodes: string[]; communityCodes: string[]; studyFields: string[]; salaryGroupCode: string | null; sourceQuarter: string; reviewStatus: ReviewStatus }

function json(value: unknown) { return `${JSON.stringify(value, null, 2)}\n` }
function escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }
function decodeHtml(value: string) { return value.replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í").replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú").replace(/&ntilde;/gi, "ñ").replace(/&uuml;/gi, "ü").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/g, "'") }
function titleCase(value: string) { return value.toLowerCase().replace(/(^|\s|-)([A-Za-zÀ-ÿ])/g, (_match, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`) }

async function download(url: string, encoding: "utf8" | "iso-8859-1" = "utf8") {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "CampCareer official-data importer/1.0 (+https://www.campcareer.com)" } })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
      const body = new Uint8Array(await response.arrayBuffer())
      return { body, text: new TextDecoder(encoding).decode(body) }
    } catch (error) { lastError = error; await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1))) }
  }
  try {
    const { stdout } = await execFileAsync("curl", ["-LfsS", "--retry", "3", "--retry-all-errors", url], { encoding: "buffer", maxBuffer: 64 * 1024 * 1024 })
    const body = new Uint8Array(stdout)
    return { body, text: new TextDecoder(encoding).decode(body) }
  } catch { throw lastError }
}

async function pdfText(pdf: string) {
  const script = "from pypdf import PdfReader; import sys; print('\\n'.join(page.extract_text() or '' for page in PdfReader(sys.argv[1]).pages))"
  const { stdout } = await execFileAsync("python3", ["-c", script, pdf], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
  return stdout
}

function gmlGeometry(xml: string): GeoJSON.MultiPolygon {
  const rings = Array.from(xml.matchAll(/<gml:posList>([\s\S]*?)<\/gml:posList>/g)).map((match) => {
    const values = match[1].trim().split(/\s+/).map(Number)
    const points: number[][] = []
    for (let index = 0; index < values.length; index += 2) points.push([values[index + 1], values[index]])
    const step = Math.max(1, Math.ceil(points.length / 800))
    const simplified = points.filter((_point, index) => index === 0 || index === points.length - 1 || index % step === 0)
    return [simplified]
  })
  if (rings.length === 0) throw new Error("IGN administrative geometry has no polygons.")
  return { type: "MultiPolygon", coordinates: rings }
}

async function ignUnit(nationalCode: string) {
  const id = `AU_ADMINISTRATIVEUNIT_${nationalCode}`
  const url = `${SPAIN_SOURCE_URLS.ign}?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&STOREDQUERY_ID=urn:ogc:def:query:OGC-WFS::GetFeatureById&ID=${id}`
  const { body, text } = await download(url)
  const name = decodeHtml(text.match(/<gn:text>([^<]+)<\/gn:text>/)?.[1] ?? "")
  return { body, name, geometry: gmlGeometry(text), url }
}

function geometryCenter(geometry: GeoJSON.MultiPolygon) {
  const points = geometry.coordinates.flatMap((polygon) => polygon.flat())
  const longitudes = points.map((point) => point[0]); const latitudes = points.map((point) => point[1])
  return { lng: (Math.min(...longitudes) + Math.max(...longitudes)) / 2, lat: (Math.min(...latitudes) + Math.max(...latitudes)) / 2 }
}

async function municipalityForCapital(province: typeof SPAIN_PROVINCES[number]) {
  const [filtered, unfiltered] = await Promise.all([
    download(`${SPAIN_SOURCE_URLS.cartoCiudad}?q=${encodeURIComponent(province.capital)}&provincia_filter=${encodeURIComponent(province.nameEs)}&limit=25`),
    download(`${SPAIN_SOURCE_URLS.cartoCiudad}?q=${encodeURIComponent(province.capital)}&limit=25`),
  ])
  const candidates = [...JSON.parse(filtered.text) as Array<{ muni?: string; muniCode?: string; provinceCode?: string }>, ...JSON.parse(unfiltered.text) as Array<{ muni?: string; muniCode?: string; provinceCode?: string }>]
  const candidate = candidates.find((item) => item.provinceCode === province.code && item.muniCode)
  if (!candidate?.muniCode) throw new Error(`CartoCiudad returned no municipality code for ${province.capital}.`)
  const unit = await ignUnit(`34${province.communityCode}${province.code}${candidate.muniCode}`)
  return { nameEs: candidate.muni ?? province.capital, ...geometryCenter(unit.geometry) }
}

function studyFieldsFor(code: string) {
  if (/^(315|383|5110|5821|8192|8340)/.test(code)) return ["Maritime studies", "Marine engineering"]
  if (/^372/.test(code)) return ["Sports science"]
  if (/^(7132|7510|8332)/.test(code)) return ["Construction and building services", "Electrical or mechanical installation"]
  return ["Official study-path mapping pending review"]
}

function salaryGroupFor(shortageCode: string) {
  const major = shortageCode[0]
  return ({ "1": "A", "2": "B", "3": "C", "4": "D", "5": "G", "6": "G", "7": "K", "8": "M", "9": "O" } as Record<string, string | undefined>)[major] ?? null
}

function parseShortages(text: string): ShortageRow[] {
  const aliases = SPAIN_PROVINCES.flatMap((province) => {
    const community = SPAIN_COMMUNITIES.find((item) => item.code === province.communityCode)!
    const provinceAliases = [province.nameEs, ...(province.aliases ?? [])]
    const communityAliases = [community.nameEs, community.nameEs.replace("Comunitat", "Com."), community.nameEs.replace("Cataluña", "Cataluna"), community.nameEs.replace("País", "Pais"), community.nameEs.replace("Rioja, La", "La Rioja")]
    return provinceAliases.flatMap((provinceAlias) => communityAliases.map((communityAlias) => ({ province, alias: `${normalizeSpanish(communityAlias)} ${normalizeSpanish(provinceAlias)}`.toUpperCase() })))
  }).sort((left, right) => right.alias.length - left.alias.length)
  const aliasToProvince = new Map(aliases.map((item) => [item.alias, item.province]))
  const aliasPattern = aliases.map((item) => escapeRegex(item.alias).replace(/ /g, "\\s+")).join("|")
  const normalized = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").toUpperCase()
  const expression = new RegExp(`(${aliasPattern})\\s+(\\d{4}\\.\\d{3}\\.\\d)\\s+(.+?)(?=(?:${aliasPattern})\\s+\\d{4}\\.\\d{3}\\.\\d|$)`, "g")
  const byCode = new Map<string, ShortageRow>()
  for (const match of Array.from(normalized.matchAll(expression))) {
    const province = aliasToProvince.get(match[1].replace(/\s+/g, " ").trim())
    if (!province) continue
    const code = match[2]
    const localName = titleCase(match[3].replace(/\s+/g, " ").trim())
    if (!localName || localName.length > 160) continue
    const key = normalizeSpanish(localName)
    const translation = Object.entries(SPAIN_SHORTAGE_TRANSLATIONS).find(([sourceName]) => normalizeSpanish(sourceName) === key)?.[1]
    const current = byCode.get(code) ?? { code, localName, nameEn: translation?.en ?? null, nameKo: translation?.ko ?? null, provinceCodes: [], communityCodes: [], studyFields: studyFieldsFor(code), salaryGroupCode: salaryGroupFor(code), sourceQuarter: "2026-Q1", reviewStatus: translation ? "approved" : "review-required" }
    if (!current.provinceCodes.includes(province.code)) current.provinceCodes.push(province.code)
    if (!current.communityCodes.includes(province.communityCode)) current.communityCodes.push(province.communityCode)
    byCode.set(code, current)
  }
  return Array.from(byCode.values()).sort((left, right) => right.provinceCodes.length - left.provinceCodes.length || left.code.localeCompare(right.code))
}

function parseTextTable(page: string, id: string) {
  const textarea = page.match(new RegExp(`id="${id}"[\\s\\S]*?<textarea[^>]*>([\\s\\S]*?)<\\/textarea>`))?.[1]
  if (!textarea) throw new Error(`${id} is missing from the INE wage page.`)
  return JSON.parse(decodeHtml(textarea.trim())) as { category: string[]; data: string[] }
}

function rentForCommunity(text: string, community: typeof SPAIN_COMMUNITIES[number]) {
  const aliases = [community.nameEs, community.nameEs.replace("Rioja, La", "Rioja (La)"), community.nameEs.replace("Madrid, Comunidad de", "Madrid (Comunidad de)"), community.nameEs.replace("Murcia, Región de", "Murcia (Región de)"), community.nameEs.replace("Navarra, Comunidad Foral de", "Navarra (Com. Foral de)"), community.nameEs.replace("Asturias, Principado de", "Asturias (Principado de)")]
  for (const alias of aliases) {
    const match = text.match(new RegExp(`${escapeRegex(alias)}\\s+[\\d.]+\\s+(\\d,\\d)\\s+(\\d,\\d)\\s+(\\d,\\d)\\s+\\d+\\s+\\d+\\s+\\d+\\s+([\\d.]+)`, "i"))
    if (match) return { eurM2: parseSpanishNumber(match[1]), p25EurM2: parseSpanishNumber(match[2]), p75EurM2: parseSpanishNumber(match[3]), monthlyEur: parseSpanishNumber(match[4]) }
  }
  return { eurM2: null, p25EurM2: null, p75EurM2: null, monthlyEur: null }
}

async function mapConcurrent<T, R>(rows: T[], limit: number, work: (row: T) => Promise<R>) {
  const result: R[] = []
  let cursor = 0
  await Promise.all(Array.from({ length: limit }, async () => {
    while (cursor < rows.length) {
      const index = cursor++
      result[index] = await work(rows[index])
      await new Promise((resolve) => setTimeout(resolve, 180))
    }
  }))
  return result
}

type CartoCandidate = { lat: number | null; lng: number | null; comunidadAutonomaCode?: string; provinceCode?: string; muni?: string }

async function geocode(query: string) {
  const options = { headers: { "user-agent": "CampCareer official-data importer/1.0 (+https://www.campcareer.com)" } }
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const candidatesResponse = await fetch(`${SPAIN_SOURCE_URLS.cartoCiudad}?q=${encodeURIComponent(query)}&limit=5`, options)
      const candidatesText = await candidatesResponse.text()
      const candidates = candidatesResponse.ok && candidatesText ? JSON.parse(candidatesText) as CartoCandidate[] : []
      const direct = candidates.find((candidate) => Number.isFinite(candidate.lat) && Number.isFinite(candidate.lng) && candidate.lat !== 0 && candidate.lng !== 0)
      if (direct) return direct
      const findResponse = await fetch(`${SPAIN_SOURCE_URLS.cartoCiudad.replace("candidates", "find")}?q=${encodeURIComponent(query)}`, options)
      const findText = await findResponse.text()
      const resolved = findResponse.ok && findText ? JSON.parse(findText) as CartoCandidate : null
      if (resolved && Number.isFinite(resolved.lat) && Number.isFinite(resolved.lng) && resolved.lat !== 0 && resolved.lng !== 0) return resolved
    } catch { /* Retry the public geocoder at a lower request rate. */ }
    await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)))
  }
  return null
}

async function collectUniversities(cities: Array<{ regionCode: string; nameEs: string; lat: number; lng: number; provinceCode: string }>) {
  const home = await download(SPAIN_SOURCE_URLS.ructUniversities, "iso-8859-1")
  const records = SPAIN_UNIVERSITY_SEEDS.map((seed) => {
    const detailUrl = `https://www.educacion.gob.es/ruct/universidad.action?codigoUniversidad=${seed.ructCode}&actual=universidades`
    const city = cities.find((item) => item.regionCode === seed.regionCode && normalizeSpanish(item.nameEs) === normalizeSpanish(seed.cityName))
    const community = SPAIN_COMMUNITIES.find((item) => item.code === seed.regionCode)
    if (!city || !community) return null
    return { country: "ES" as const, ructCode: seed.ructCode, slug: `${slugifySpanish(seed.nameEs)}-${seed.ructCode}`, nameEs: seed.nameEs, nameEn: seed.nameEs, nameKo: null, institutionType: "RUCT-recognised university", officialUrl: seed.officialUrl, cityName: seed.cityName, provinceCode: city.provinceCode, regionCode: community.code, regionName: community.nameEs, lat: city.lat, lng: city.lng, sourceUrl: detailUrl, lastChecked: CHECKED_AT, reviewStatus: "approved" as const, relatedFields: ["Official programme catalog available through RUCT"] }
  })
  return { home, universities: records.filter(Boolean) }
}

async function main() {
  await Promise.all([mkdir(RAW_DIR, { recursive: true }), mkdir(DATA_DIR, { recursive: true }), mkdir(PUBLIC_DIR, { recursive: true })])
  const [shortagePdf, wagePage, rentPdf] = await Promise.all([download(SPAIN_SOURCE_URLS.shortageCatalog), download(SPAIN_SOURCE_URLS.wages), download(SPAIN_SOURCE_URLS.rent)])
  await Promise.all([writeFile(path.join(RAW_DIR, "sepe-shortage-catalog-2026-q1.pdf"), shortagePdf.body), writeFile(path.join(RAW_DIR, "ine-eaes-2024.html"), wagePage.body), writeFile(path.join(RAW_DIR, "serpavi-2026.pdf"), rentPdf.body)])
  const shortageText = await pdfText(path.join(RAW_DIR, "sepe-shortage-catalog-2026-q1.pdf"))
  const rentText = await pdfText(path.join(RAW_DIR, "serpavi-2026.pdf"))
  const shortages = parseShortages(shortageText)
  if (shortages.length === 0) throw new Error("SEPE shortage catalog parser returned no occupations.")

  const wageGroups = parseTextTable(wagePage.text, "tabla3_data")
  const wageRegions = parseTextTable(wagePage.text, "tabla4_data")
  const nationalAverage = parseSpanishNumber(wageGroups.data[0])
  if (!nationalAverage) throw new Error("INE national wage average is unavailable.")
  const salaries = SPAIN_COMMUNITIES.flatMap((community, index) => {
    const regionalName = community.nameEs
    const tableIndex = wageRegions.category.findIndex((item) => normalizeSpanish(item) === normalizeSpanish(regionalName))
    const regionalAverage = tableIndex >= 0 ? parseSpanishNumber(wageRegions.data[(tableIndex - 5) * 6]) : null
    const factor = regionalAverage ? regionalAverage / nationalAverage : null
    return SPAIN_CNO_GROUPS.map((group, groupIndex) => ({ regionCode: community.code, cnoCode: group.code, annualGrossEur: parseSpanishNumber(wageGroups.data[6 + groupIndex * 6]), regionalAnnualGrossEur: factor ? Math.round((parseSpanishNumber(wageGroups.data[6 + groupIndex * 6]) ?? 0) * factor) : null, regionalWageFactor: factor, definition: factor ? "National CNO-11 major-group annual gross wage × INE regional all-worker wage factor" : "National CNO-11 major-group annual gross wage", period: "2024", sourceUrl: SPAIN_SOURCE_URLS.wages, lastChecked: CHECKED_AT, reviewStatus: "approved" as const }))
  })

  const [communitiesGeometry, provincesGeometry] = await Promise.all([
    Promise.all(SPAIN_COMMUNITIES.map((community) => ignUnit(`34${community.code}0000000`))),
    Promise.all(SPAIN_PROVINCES.map((province) => ignUnit(`34${province.communityCode}${province.code}00000`))),
  ])
  const communityRows = SPAIN_COMMUNITIES.map((community, index) => {
    const parsedRent = rentForCommunity(rentText, community)
    const rent = parsedRent.eurM2 != null ? parsedRent : SPAIN_SERPAVI_RENT_2024[community.code]
    const candidates = shortages.filter((occupation) => occupation.provinceCodes.some((code) => SPAIN_PROVINCES.find((province) => province.code === code)?.communityCode === community.code)).sort((left, right) => right.provinceCodes.filter((code) => SPAIN_PROVINCES.find((province) => province.code === code)?.communityCode === community.code).length - left.provinceCodes.filter((code) => SPAIN_PROVINCES.find((province) => province.code === code)?.communityCode === community.code).length)
    return { ...community, slug: slugifySpanish(community.nameEn), geometrySource: "IGN INSPIRE Administrative Units", rent: { ...rent, period: "2024", definition: "SERPAVI average rent for collective housing, tax-data reference", status: rent.eurM2 != null ? "available" : "unavailable" }, topShortage: candidates.slice(0, 20).map((occupation) => occupation.code), lastChecked: CHECKED_AT, reviewStatus: "approved" as const, geometryHash: sha256(JSON.stringify(communitiesGeometry[index].geometry)) }
  })
  const provinceRows = SPAIN_PROVINCES.map((province, index) => {
    const short = shortages.filter((occupation) => occupation.provinceCodes.includes(province.code))
    return { ...province, nameEn: province.nameEs, nameKo: null, slug: slugifySpanish(province.nameEs), geometrySource: "IGN INSPIRE Administrative Units", shortageCodes: short.map((occupation) => occupation.code), foreignHiringSignal: short.length > 0 ? "sepe-catalog-listed" : "not-listed", sourceQuarter: "2026-Q1", lastChecked: CHECKED_AT, reviewStatus: "approved" as const, geometryHash: sha256(JSON.stringify(provincesGeometry[index].geometry)) }
  })
  const cities = await mapConcurrent(SPAIN_PROVINCES, 4, async (province) => {
    const hit = await municipalityForCapital(province)
    return { code: province.code, provinceCode: province.code, regionCode: province.communityCode, nameEs: hit.nameEs, nameEn: hit.nameEs, nameKo: null, slug: slugifySpanish(hit.nameEs), lat: hit.lat, lng: hit.lng, rent: { eurM2: null, status: "unavailable" as const, note: "No reusable city-level SERPAVI aggregate was ingested." }, lastChecked: CHECKED_AT, reviewStatus: "approved" as const }
  })
  const universityResult = await collectUniversities(cities)
  await writeFile(path.join(RAW_DIR, "ruct-universities-home.html"), universityResult.home.body)
  const universities = universityResult.universities

  const snapshots = [
    { category: "shortage", sourceName: "SEPE Catálogo de Ocupaciones de Difícil Cobertura 2026 Q1", sourceUrl: SPAIN_SOURCE_URLS.shortageLanding, datasetUrls: [SPAIN_SOURCE_URLS.shortageCatalog], contentHash: sha256(shortagePdf.body), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-pdf", licenseStatus: "public-administrative-source", reviewStatus: "approved", status: "ingested" },
    { category: "contracts", sourceName: "SEPE employment contract statistics", sourceUrl: SPAIN_SOURCE_URLS.contracts, datasetUrls: [], contentHash: sha256(SPAIN_SOURCE_URLS.contracts), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-reference", licenseStatus: "public-statistics", reviewStatus: "review-required", status: "reference-only" },
    { category: "occupation", sourceName: "INE Annual Wage Structure Survey 2024", sourceUrl: SPAIN_SOURCE_URLS.wages, datasetUrls: [], contentHash: sha256(wagePage.body), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-html-table", licenseStatus: "public-statistics", reviewStatus: "approved", status: "ingested" },
    { category: "rent", sourceName: "SERPAVI 2026", sourceUrl: SPAIN_SOURCE_URLS.rentLanding, datasetUrls: [SPAIN_SOURCE_URLS.rent], contentHash: sha256(rentPdf.body), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-pdf", licenseStatus: "public-statistics", reviewStatus: "approved", status: "ingested" },
    { category: "university", sourceName: "RUCT and CartoCiudad", sourceUrl: SPAIN_SOURCE_URLS.ruct, datasetUrls: [SPAIN_SOURCE_URLS.cartoCiudad], contentHash: sha256(universityResult.home.body), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-registry-and-geocoder", licenseStatus: "public-administrative-source", reviewStatus: "approved", status: "ingested" },
    { category: "boundary", sourceName: "IGN INSPIRE Administrative Units", sourceUrl: SPAIN_SOURCE_URLS.ign, datasetUrls: [], contentHash: sha256(JSON.stringify(communitiesGeometry.map((item) => item.geometry))), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-wfs", licenseStatus: "official-source", reviewStatus: "approved", status: "ingested" },
    { category: "study-to-work", sourceName: "Spain Migration information sheets", sourceUrl: SPAIN_SOURCE_URLS.studentWork, datasetUrls: [SPAIN_SOURCE_URLS.postStudy, SPAIN_SOURCE_URLS.degreeRecognition], contentHash: sha256(`${SPAIN_SOURCE_URLS.studentWork}|${SPAIN_SOURCE_URLS.postStudy}|${SPAIN_SOURCE_URLS.degreeRecognition}`), retrievedAt: RETRIEVED_AT, lastChecked: CHECKED_AT, method: "official-policy-reference", licenseStatus: "public-administrative-source", reviewStatus: "review-required", status: "review-required" },
  ]
  const pathways = [
    { code: "student-work", titleEn: "Work while studying", titleKo: "유학 중 취업", summary: "Higher-education study authorisation can allow compatible employed or self-employed work without a separate work procedure.", sourceUrl: SPAIN_SOURCE_URLS.studentWork, reviewStatus: "review-required" as const },
    { code: "post-study-search", titleEn: "Post-study job-search residence", titleKo: "졸업 후 구직 체류", summary: "Eligible graduates of authorised higher education can seek a 24-month job-search residence. It does not itself authorise work.", sourceUrl: SPAIN_SOURCE_URLS.postStudy, reviewStatus: "review-required" as const },
    { code: "degree-recognition", titleEn: "Regulated-profession recognition", titleKo: "규제직 학위 인정", summary: "A foreign degree may require homologation before practising a regulated profession in Spain.", sourceUrl: SPAIN_SOURCE_URLS.degreeRecognition, reviewStatus: "review-required" as const },
  ]
  const communityGeoJson: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: communitiesGeometry.map((item, index) => ({ type: "Feature", properties: { code: SPAIN_COMMUNITIES[index].code, nameEs: SPAIN_COMMUNITIES[index].nameEs }, geometry: item.geometry })) }
  const provinceGeoJson: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: provincesGeometry.map((item, index) => ({ type: "Feature", properties: { code: SPAIN_PROVINCES[index].code, communityCode: SPAIN_PROVINCES[index].communityCode, nameEs: SPAIN_PROVINCES[index].nameEs }, geometry: item.geometry })) }
  const cityGeoJson: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: cities.map((city) => ({ type: "Feature", properties: { code: city.code, provinceCode: city.provinceCode, regionCode: city.regionCode, nameEs: city.nameEs }, geometry: { type: "Point", coordinates: [city.lng, city.lat] } })) }
  await Promise.all([
    writeFile(path.join(DATA_DIR, "es-shortage-occupations.json"), json(shortages)), writeFile(path.join(DATA_DIR, "es-communities.json"), json(communityRows)),
    writeFile(path.join(DATA_DIR, "es-provinces.json"), json(provinceRows)), writeFile(path.join(DATA_DIR, "es-cities.json"), json(cities)),
    writeFile(path.join(DATA_DIR, "es-salary-groups.json"), json(salaries)), writeFile(path.join(DATA_DIR, "es-universities.json"), json(universities)),
    writeFile(path.join(DATA_DIR, "es-source-snapshots.json"), json(snapshots)), writeFile(path.join(DATA_DIR, "es-study-to-work-pathways.json"), json(pathways)),
    writeFile(path.join(PUBLIC_DIR, "es-communities.geojson"), json(communityGeoJson)), writeFile(path.join(PUBLIC_DIR, "es-provinces.geojson"), json(provinceGeoJson)), writeFile(path.join(PUBLIC_DIR, "es-cities.geojson"), json(cityGeoJson)),
  ])
  console.log(`[es-import] ${shortages.length} SEPE shortage occupations, ${communityRows.length} communities, ${provinceRows.length} provinces, ${cities.length} capital cities, ${salaries.length} salary rows, ${universities.length} RUCT universities.`)
}

main().catch((error) => { console.error("[es-import] failed", error); process.exit(1) })
