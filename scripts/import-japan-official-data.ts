import { access, mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { JP_CITY_AREAS, JP_PREFECTURE_CODES, JP_PREFECTURE_NAMES } from "../src/app/map/states"
import {
  JAPAN_SOURCE_CATALOG,
  JAPAN_SOURCE_URLS,
  parsePrefectureOccupationApplicants,
  parsePrefectureOccupationOpenings,
  parseOccupationApplicants,
  parseOccupationOpenings,
  parseWageWorkbook,
  percentileScore,
  sha256,
} from "./lib/japan-official-source"

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, "data/raw/jp")
const DATA_DIR = path.join(ROOT, "src/data")
const RETRIEVED_AT = new Date().toISOString()

async function download(url: string) {
  const response = await fetch(url, { headers: { "user-agent": "CampCareer official-data importer/1.0 (+https://www.campcareer.com)" } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return new Uint8Array(await response.arrayBuffer())
}

async function getRentPages() {
  const positions = [1, 100001, 200001]
  const cachedPaths = positions.map((position) => path.join(RAW_DIR, `estat-rent-${position}.json`))
  try {
    return await Promise.all(cachedPaths.map(async (cachedPath) => new Uint8Array(await readFile(cachedPath))))
  } catch {
    const appId = process.env.ESTAT_APP_ID
    if (!appId) {
      throw new Error("Missing ESTAT_APP_ID. Set it only in the local environment, or restore cached e-Stat raw responses under data/raw/jp.")
    }
    return Promise.all(positions.map(async (position, index) => {
      const url = new URL("https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData")
      url.searchParams.set("appId", appId)
      url.searchParams.set("statsDataId", "0004021497")
      url.searchParams.set("limit", "100000")
      url.searchParams.set("startPosition", String(position))
      const body = await download(url.toString())
      await writeFile(cachedPaths[index], body)
      return body
    }))
  }
}

const RENT_BAND_LOWER_BOUND: Record<string, number> = {
  "01": 0, "02": 1, "03": 5000, "04": 10000, "05": 15000, "06": 20000,
  "07": 25000, "08": 30000, "09": 40000, "10": 50000, "11": 60000, "12": 70000,
  "13": 80000, "14": 90000, "15": 100000, "16": 120000, "17": 150000, "18": 200000,
  "19": 250000,
}

function rentBandLabel(lowerBound: number) {
  if (lowerBound === 0) return "JPY 0-1"
  if (lowerBound === 1) return "JPY 1-4,999"
  const upperBound = lowerBound === 250000 ? null : lowerBound < 100000 ? lowerBound + 9999 : lowerBound < 200000 ? lowerBound + 19999 : lowerBound + 49999
  return upperBound ? `JPY ${lowerBound.toLocaleString()}-${upperBound.toLocaleString()}` : `JPY ${lowerBound.toLocaleString()}+`
}

function parseRentDistribution(bodies: Uint8Array[]) {
  const rows = bodies.flatMap((body) => {
    const payload = JSON.parse(Buffer.from(body).toString("utf8"))
    return payload.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE ?? []
  }) as Array<Record<string, string>>
  const distributions = new Map<string, Array<{ band: string; households: number }>>()
  for (const row of rows) {
    if (row["@cat01"] !== "3" || row["@cat02"] !== "0" || row["@cat03"] !== "00") continue
    const areaCode = row["@area"]
    const band = row["@cat04"]
    const households = Number(row.$)
    if (!areaCode || !RENT_BAND_LOWER_BOUND[band] && band !== "01" || !Number.isFinite(households)) continue
    const current = distributions.get(areaCode) ?? []
    current.push({ band, households })
    distributions.set(areaCode, current)
  }

  const places = [
    ...JP_PREFECTURE_CODES.map((code) => ({ areaCode: `${code}000`, kind: "prefecture" as const, prefectureCode: code, ...JP_PREFECTURE_NAMES[code] })),
    ...Object.entries(JP_CITY_AREAS).map(([areaCode, city]) => ({ areaCode, kind: "city" as const, ...city })),
  ]
  return places.flatMap((place) => {
    const bands = (distributions.get(place.areaCode) ?? []).sort((a, b) => Number(a.band) - Number(b.band))
    const households = bands.reduce((total, band) => total + band.households, 0)
    if (households <= 0) return []
    let cumulative = 0
    const median = bands.find((band) => {
      cumulative += band.households
      return cumulative >= households / 2
    })
    const lowerBound = median ? RENT_BAND_LOWER_BOUND[median.band] : null
    if (lowerBound == null) return []
    return [{
      country: "JP",
      areaCode: place.areaCode,
      kind: place.kind,
      prefectureCode: place.prefectureCode ?? place.areaCode.slice(0, 2),
      nameEn: place.en,
      nameJa: place.ja,
      nameKo: place.ko,
      medianRentBandLowerJpy: lowerBound,
      medianRentBandLabel: rentBandLabel(lowerBound),
      rentalHouseholds: households,
      statisticPeriod: "2023 Housing and Land Survey",
      sourceUrl: JAPAN_SOURCE_URLS.rent,
      lastChecked: RETRIEVED_AT.slice(0, 10),
      reviewStatus: "approved",
    }]
  })
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true })
  const [wageBody, openingsBody, applicantsBody, rentBodies] = await Promise.all([
    download(JAPAN_SOURCE_URLS.wage),
    download(JAPAN_SOURCE_URLS.openings),
    download(JAPAN_SOURCE_URLS.applicants),
    getRentPages(),
  ])
  await Promise.all([
    writeFile(path.join(RAW_DIR, "mhlw-wages.xlsx"), wageBody),
    writeFile(path.join(RAW_DIR, "mhlw-openings.xlsx"), openingsBody),
    writeFile(path.join(RAW_DIR, "mhlw-applicants.xlsx"), applicantsBody),
  ])

  const wages = parseWageWorkbook(wageBody)
  const openings = new Map(parseOccupationOpenings(openingsBody).map((row) => [row.shortageGroupCode, row]))
  const applicants = new Map(parseOccupationApplicants(applicantsBody).map((row) => [row.shortageGroupCode, row]))
  const normalizedPrefectureName = (value: string) => {
    const withoutLabourBureau = value.replace(/労働局$/, "")
    if (withoutLabourBureau === "北海道") return withoutLabourBureau
    return value.endsWith("労働局") ? withoutLabourBureau : withoutLabourBureau.replace(/[都府県]$/, "")
  }
  const prefectureByLocalName = new Map(JP_PREFECTURE_CODES.map((code) => [normalizedPrefectureName(JP_PREFECTURE_NAMES[code].ja), code]))
  const prefectureOpenings = new Map(parsePrefectureOccupationOpenings(openingsBody)
    .flatMap((row) => {
      const prefectureName = row.prefectureName.replace(/労働局$/, "")
      const prefectureCode = prefectureByLocalName.get(normalizedPrefectureName(row.prefectureName))
      return prefectureCode ? [[`${prefectureCode}:${row.shortageGroupCode}`, { ...row, prefectureName, prefectureCode }]] : []
    }))
  const prefectureApplicants = new Map(parsePrefectureOccupationApplicants(applicantsBody)
    .flatMap((row) => {
      const prefectureName = row.prefectureName.replace(/労働局$/, "")
      const prefectureCode = prefectureByLocalName.get(normalizedPrefectureName(row.prefectureName))
      return prefectureCode ? [[`${prefectureCode}:${row.shortageGroupCode}`, { ...row, prefectureName, prefectureCode }]] : []
    }))
  const ratios = Array.from(openings.keys()).flatMap((code) => {
    const opening = openings.get(code)?.value
    const applicant = applicants.get(code)?.value
    return opening && applicant ? [opening / applicant] : []
  })
  const hourlyWages = wages.map((row) => row.hourlyBaseWageYen)
  const occupations = wages.map((wage) => ({
      country: "JP",
      occupationCode: wage.occupationCode,
      localName: wage.localName,
      occupationClassification: "MHLW occupation code",
      iscoCode: null,
      geography: "Japan",
      statisticPeriod: "FY2025 employment indicators; FY2025 wage baseline published for FY2027 application",
      hourlyBaseWageYen: wage.hourlyBaseWageYen,
      annualizedBaseSalaryYen: Math.round(wage.hourlyBaseWageYen * 160 * 12),
      annualizationMethod: "official hourly baseline x 160 hours/month x 12 months",
      salaryScore: percentileScore(wage.hourlyBaseWageYen, hourlyWages),
      salarySourceUrl: JAPAN_SOURCE_URLS.wage,
      retrievedAt: RETRIEVED_AT,
      lastChecked: RETRIEVED_AT.slice(0, 10),
      reviewStatus: "review-required",
    }))
  const shortageGroups = Array.from(openings.entries()).flatMap(([shortageGroupCode, opening]) => {
    const applicant = applicants.get(shortageGroupCode)
    if (!applicant || applicant.value <= 0) return []
    const ratio = opening.value / applicant.value
    return [{
      country: "JP",
      shortageGroupCode,
      localName: opening.localName,
      geography: "Japan",
      statisticPeriod: "FY2025 annual average monthly effective job openings and job seekers",
      jobOpenings: opening.value,
      applicants: applicant.value,
      openingsToApplicantsRatio: Number(ratio.toFixed(4)),
      shortageScore: percentileScore(ratio, ratios),
      sourceUrl: "https://www.mhlw.go.jp/toukei/list/114-1d.html",
      retrievedAt: RETRIEVED_AT,
      lastChecked: RETRIEVED_AT.slice(0, 10),
      reviewStatus: "review-required",
    }]
  })
  const prefectureRatios = Array.from(prefectureOpenings.keys()).flatMap((key) => {
    const opening = prefectureOpenings.get(key)?.value
    const applicant = prefectureApplicants.get(key)?.value
    return opening && applicant ? [opening / applicant] : []
  })
  const prefectureShortageGroups = Array.from(prefectureOpenings.entries()).flatMap(([key, opening]) => {
    const applicant = prefectureApplicants.get(key)
    if (!applicant || applicant.value <= 0) return []
    const ratio = opening.value / applicant.value
    return [{
      country: "JP",
      prefectureCode: opening.prefectureCode,
      prefectureName: opening.prefectureName,
      shortageGroupCode: opening.shortageGroupCode,
      localName: opening.localName,
      statisticPeriod: "FY2025 annual average monthly effective job openings and job seekers",
      jobOpenings: opening.value,
      applicants: applicant.value,
      openingsToApplicantsRatio: Number(ratio.toFixed(4)),
      shortageScore: percentileScore(ratio, prefectureRatios),
      sourceUrl: "https://www.mhlw.go.jp/toukei/list/114-1d.html",
      lastChecked: RETRIEVED_AT.slice(0, 10),
      reviewStatus: "approved",
    }]
  })
  const rents = parseRentDistribution(rentBodies)

  const downloadedByUrl = new Map([
    [JAPAN_SOURCE_URLS.wage, wageBody],
    [JAPAN_SOURCE_URLS.openings, openingsBody],
    [JAPAN_SOURCE_URLS.applicants, applicantsBody],
    [JAPAN_SOURCE_URLS.rent, Buffer.concat(rentBodies)],
  ])
  const snapshots = JAPAN_SOURCE_CATALOG.map((source) => {
    const bodies = source.datasetUrls.reduce<Uint8Array[]>((items, url) => {
      const body = downloadedByUrl.get(url)
      if (body) items.push(body)
      return items
    }, [])
    const hasDownloadedDataset = source.datasetUrls.length > 0 && bodies.length === source.datasetUrls.length
    return {
      countryCode: "JP",
      category: source.category,
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
      datasetUrls: [...source.datasetUrls],
      contentHash: hasDownloadedDataset ? sha256(Buffer.concat(bodies)) : null,
      retrievedAt: hasDownloadedDataset ? RETRIEVED_AT : null,
      method: source.method,
      reviewStatus: source.reviewStatus,
      status: hasDownloadedDataset ? "ingested" : "cataloged",
      summary: source.summary,
    }
  })

  await Promise.all([
    writeFile(path.join(DATA_DIR, "jp-official-occupations.json"), `${JSON.stringify(occupations, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-official-shortage-groups.json"), `${JSON.stringify(shortageGroups, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-prefecture-shortage-groups.json"), `${JSON.stringify(prefectureShortageGroups, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-rent-by-area.json"), `${JSON.stringify(rents, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-source-snapshots.json"), `${JSON.stringify(snapshots, null, 2)}\n`),
  ])
  console.log(`[jp-import] wrote ${occupations.length} national wage rows, ${shortageGroups.length} national shortage groups, ${prefectureShortageGroups.length} prefecture shortage rows, and ${rents.length} official rent areas; no code-system mapping was inferred.`)
}

main().catch((error) => {
  console.error("[jp-import] failed", error)
  process.exit(1)
})
