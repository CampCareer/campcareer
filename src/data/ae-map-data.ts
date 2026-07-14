import sourceSnapshotsRaw from "@/data/ae-source-snapshots.json"
import shortageOccupationsRaw from "@/data/ae-shortage-occupations.json"
import highIncomeOccupationsRaw from "@/data/ae-high-income-occupations.json"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export type UAEReviewStatus = "approved" | "review-required"

export type UAESourceSnapshot = {
  category: string
  sourceName: string
  sourceUrl: string
  datasetUrls: string[]
  contentHash: string | null
  retrievedAt: string | null
  lastChecked: string
  method: "official-api" | "official-download" | "official-web"
  licenseStatus: string
  reviewStatus: UAEReviewStatus
  status: "cataloged" | "ingested" | "pending"
}

export type UAEEmirate = {
  country: "AE"
  code: string
  nameEn: string
  nameKo: string
  lat: number
  lng: number
  areaSqkm: number
  sourceCode: string
  lastChecked: string
  reviewStatus: UAEReviewStatus
}

const EMIRATES_DATA: UAEEmirate[] = [
  { country: "AE", code: "AUH", nameEn: "Abu Dhabi", nameKo: "아부다비", lat: 23.772214, lng: 53.712257, areaSqkm: 59333.59, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
  { country: "AE", code: "DXB", nameEn: "Dubai", nameKo: "두바이", lat: 24.975350, lng: 55.331787, areaSqkm: 4035.66, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
  { country: "AE", code: "SHJ", nameEn: "Sharjah", nameKo: "샤르자", lat: 25.130335, lng: 55.824145, areaSqkm: 2565.81, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
  { country: "AE", code: "AJM", nameEn: "Ajman", nameKo: "아즈만", lat: 25.403478, lng: 55.540689, areaSqkm: 254.54, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
  { country: "AE", code: "UAQ", nameEn: "Umm Al Quwain", nameKo: "움알콰인", lat: 25.486058, lng: 55.691919, areaSqkm: 702.49, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
  { country: "AE", code: "RAK", nameEn: "Ras Al Khaimah", nameKo: "라스알카이마", lat: 25.711847, lng: 55.993192, areaSqkm: 2454.46, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
  { country: "AE", code: "FUJ", nameEn: "Fujairah", nameKo: "푸자이라", lat: 25.434322, lng: 56.233659, areaSqkm: 1580.40, sourceCode: "HDX-COD-AB-ARE", lastChecked: "2026-07-14", reviewStatus: "approved" },
]

const sourceSnapshots = sourceSnapshotsRaw as UAESourceSnapshot[]

export const AE_EMIRATES = EMIRATES_DATA
export const AE_SOURCE_SNAPSHOTS = sourceSnapshots

export const AE_SHORTAGE_OCCUPATIONS = shortageOccupationsRaw
export const AE_HIGH_INCOME_OCCUPATIONS = highIncomeOccupationsRaw

export const AE_EMIRATE_BY_CODE = new Map(AE_EMIRATES.map((e) => [e.code, e]))

export function getUAEEmirate(code: string): UAEEmirate | null {
  return AE_EMIRATE_BY_CODE.get(code) ?? null
}

export function isUAEEmirateIndexable(emirate: UAEEmirate): boolean {
  return isCountrySearchIndexable("AE")
    && emirate.reviewStatus === "approved"
    && Boolean(emirate.code && emirate.nameEn && emirate.nameKo)
}

export const AE_GEOJSON_URL = "/ae-emirates.geojson"
