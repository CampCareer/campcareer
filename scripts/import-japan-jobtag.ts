import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import * as XLSX from "xlsx"
import { sha256 } from "./lib/japan-official-source"

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, "data/raw/jp/jobtag")
const DATA_DIR = path.join(ROOT, "src/data")
const RETRIEVED_AT = new Date().toISOString()
const JOBTAG_DOWNLOAD_PAGE = "https://shigoto.mhlw.go.jp/User/download"
const DESCRIPTION_FILE = "IPD_DL_description_7_01.xlsx"
const NUMERIC_FILE = "IPD_DL_numeric_7_00.xlsx"
const CROSSWALK_FILE = "jobtag-classification-crosswalk.xlsx"

type Row = unknown[]

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function rowsFor(filePath: string, sheetName: string) {
  const workbook = XLSX.readFile(filePath)
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) throw new Error(`Missing ${sheetName} in ${path.basename(filePath)}.`)
  return XLSX.utils.sheet_to_json<Row>(sheet, { header: 1, defval: null })
}

function topScoredLabels(row: Row, labels: Row, start: number, end: number, count: number) {
  return labels.slice(start, end + 1)
    .flatMap((label, offset) => {
      const score = row[start + offset]
      return typeof label === "string" && typeof score === "number" && Number.isFinite(score)
        ? [{ nameJa: label, score: Number(score.toFixed(3)) }]
        : []
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
}

async function main() {
  const [descriptionBody, numericBody, crosswalkBody] = await Promise.all([
    readFile(path.join(RAW_DIR, DESCRIPTION_FILE)),
    readFile(path.join(RAW_DIR, NUMERIC_FILE)),
    readFile(path.join(RAW_DIR, CROSSWALK_FILE)),
  ])
  const descriptionRows = rowsFor(path.join(RAW_DIR, DESCRIPTION_FILE), "解説系")
  const numericRows = rowsFor(path.join(RAW_DIR, NUMERIC_FILE), "IPD形式")
  const crosswalkRows = rowsFor(path.join(RAW_DIR, CROSSWALK_FILE), "職業分類対応表")

  const descriptionById = new Map(
    descriptionRows.slice(14).flatMap((row) => {
      const recordNumber = row[2]
      const localName = asText(row[3])
      return typeof recordNumber === "number" && localName
        ? [[recordNumber, {
          localName,
          mhlwClassification: asText(row[4]) || null,
          entryPathJa: asText(row[44]) || null,
          qualificationsJa: row.slice(66, 101).map(asText).filter(Boolean),
        }]]
        : []
    }),
  )
  const numericHeader = numericRows[16]
  if (!numericHeader) throw new Error("Missing Job Tag numeric header row.")
  const numericById = new Map(
    numericRows.slice(18).flatMap((row) => {
      const recordNumber = row[2]
      return typeof recordNumber === "number" ? [[recordNumber, row]] : []
    }),
  )
  const wageCodesByRecord = new Map(
    crosswalkRows.slice(4).flatMap((row) => {
      const recordNumber = row[0]
      const wageCode = String(row[8] ?? "").trim()
      return typeof recordNumber === "number" && /^\d{4}$/.test(wageCode)
        ? [[recordNumber, wageCode]]
        : []
    }),
  )

  const profiles = Array.from(descriptionById.entries()).map(([recordNumber, description]) => {
    const numeric = numericById.get(recordNumber) ?? []
    const skills = topScoredLabels(numeric, numericHeader, 21, 59, 6)
    const knowledge = topScoredLabels(numeric, numericHeader, 99, 131, 5)
    return {
      country: "JP",
      recordNumber,
      sourceCode: `jobtag-${recordNumber}`,
      localName: description.localName,
      nameEn: null,
      nameKo: null,
      translationStatus: "pending",
      mhlwClassification: description.mhlwClassification,
      wageOccupationCode: wageCodesByRecord.get(recordNumber) ?? null,
      entryPathJa: description.entryPathJa,
      qualificationsJa: description.qualificationsJa,
      skills,
      knowledge,
      sourceName: "JILPT Occupational Information Database via job tag",
      sourceUrl: JOBTAG_DOWNLOAD_PAGE,
      sourceVersion: "description 7.01; numeric 7.00; classification crosswalk R8.3",
      retrievedAt: RETRIEVED_AT,
      lastChecked: RETRIEVED_AT.slice(0, 10),
      reviewStatus: "review-required",
    }
  })
  const wageLinks = Object.fromEntries(
    Array.from(wageCodesByRecord.entries()).reduce<Map<string, number[]>>((output, [recordNumber, wageCode]) => {
      const current = output.get(wageCode) ?? []
      current.push(recordNumber)
      output.set(wageCode, current)
      return output
    }, new Map()),
  )
  const translationQueue = profiles.map((profile) => ({
    sourceCode: profile.sourceCode,
    localName: profile.localName,
    nameEn: null,
    nameKo: null,
    translationStatus: "pending",
    sourceUrl: profile.sourceUrl,
  }))
  const snapshots = [
    { fileName: DESCRIPTION_FILE, version: "7.01", hash: sha256(descriptionBody) },
    { fileName: NUMERIC_FILE, version: "7.00", hash: sha256(numericBody) },
    { fileName: CROSSWALK_FILE, version: "R8.3", hash: sha256(crosswalkBody) },
  ].map((file) => ({
    countryCode: "JP",
    sourceName: "JILPT Occupational Information Database via job tag",
    sourceUrl: JOBTAG_DOWNLOAD_PAGE,
    retrievedAt: RETRIEVED_AT,
    lastChecked: RETRIEVED_AT.slice(0, 10),
    method: "official-download",
    reviewStatus: "approved",
    attribution: `Source: JILPT Occupational Information Database, ${file.fileName} ver. ${file.version}, downloaded from job tag (${JOBTAG_DOWNLOAD_PAGE}) and processed by CampCareer.`,
    ...file,
  }))

  await mkdir(DATA_DIR, { recursive: true })
  await Promise.all([
    writeFile(path.join(DATA_DIR, "jp-jobtag-occupation-profiles.json"), `${JSON.stringify(profiles, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-jobtag-wage-links.json"), `${JSON.stringify(wageLinks, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-jobtag-translation-queue.json"), `${JSON.stringify(translationQueue, null, 2)}\n`),
    writeFile(path.join(DATA_DIR, "jp-jobtag-source-snapshots.json"), `${JSON.stringify(snapshots, null, 2)}\n`),
  ])
  console.log(`[jp-jobtag] wrote ${profiles.length} occupation profiles, ${Object.keys(wageLinks).length} wage-code mappings, and ${translationQueue.length} translation review rows.`)
}

main().catch((error) => {
  console.error("[jp-jobtag] failed", error)
  process.exit(1)
})
