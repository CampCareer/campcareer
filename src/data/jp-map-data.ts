import occupationsRaw from "@/data/jp-official-occupations.json"
import prefectureShortageRaw from "@/data/jp-prefecture-shortage-groups.json"
import rentRaw from "@/data/jp-rent-by-area.json"
import jobTagProfilesRaw from "@/data/jp-jobtag-occupation-profiles.json"
import jobTagWageLinksRaw from "@/data/jp-jobtag-wage-links.json"
import { JP_CITY_AREAS, JP_PREFECTURE_CODES, JP_PREFECTURE_NAMES, type JPPrefectureCode } from "@/app/map/states"

export type JPShortageGroup = {
  prefectureCode: string
  shortageGroupCode: string
  localName: string
  jobOpenings: number
  applicants: number
  openingsToApplicantsRatio: number
  shortageScore: number
  statisticPeriod: string
  sourceUrl: string
  lastChecked: string
}

export type JPHighPayOccupation = {
  occupationCode: string
  localName: string
  hourlyBaseWageYen: number
  annualizedBaseSalaryYen: number
  annualizationMethod: string
  sourceUrl: string
  lastChecked: string
}

export type JPRentArea = {
  areaCode: string
  kind: "prefecture" | "city"
  prefectureCode: string
  nameEn: string
  nameJa: string
  nameKo: string
  medianRentBandLowerJpy: number
  medianRentBandLabel: string
  rentalHouseholds: number
  statisticPeriod: string
  sourceUrl: string
  lastChecked: string
}

export type JPJobTagProfile = {
  recordNumber: number
  sourceCode: string
  localName: string
  nameEn: string | null
  nameKo: string | null
  translationStatus: "pending" | "machine-draft" | "human-reviewed"
  mhlwClassification: string | null
  wageOccupationCode: string | null
  entryPathJa: string | null
  qualificationsJa: string[]
  skills: Array<{ nameJa: string; score: number }>
  knowledge: Array<{ nameJa: string; score: number }>
  sourceUrl: string
  sourceVersion: string
  lastChecked: string
  reviewStatus: "review-required"
}

const allWages = (occupationsRaw as unknown as Array<JPHighPayOccupation & { salarySourceUrl?: string }>).map((row) => ({
  ...row,
  sourceUrl: row.sourceUrl ?? row.salarySourceUrl ?? "https://www.mhlw.go.jp/content/001692996.xlsx",
}))
const allShortage = prefectureShortageRaw as JPShortageGroup[]
const allRents = rentRaw as JPRentArea[]
const allJobTagProfiles = jobTagProfilesRaw as JPJobTagProfile[]
const jobTagWageLinks = jobTagWageLinksRaw as Record<string, number[]>

export const JP_HIGH_PAY_OCCUPATIONS = [...allWages]
  .sort((a, b) => b.hourlyBaseWageYen - a.hourlyBaseWageYen)
  .slice(0, 20)

export const JP_SHORTAGE_BY_PREFECTURE: Record<string, JPShortageGroup[]> = Object.fromEntries(
  JP_PREFECTURE_CODES.map((code) => [
    code,
    allShortage
      .filter((row) => row.prefectureCode === code)
      .sort((a, b) => b.openingsToApplicantsRatio - a.openingsToApplicantsRatio || b.jobOpenings - a.jobOpenings)
      .slice(0, 20),
  ]),
)

export const JP_RENT_BY_PREFECTURE: Record<string, JPRentArea> = Object.fromEntries(
  allRents.filter((row) => row.kind === "prefecture").map((row) => [row.prefectureCode, row]),
)

export const JP_CITIES: JPRentArea[] = allRents
  .filter((row) => row.kind === "city")
  .sort((a, b) => a.prefectureCode.localeCompare(b.prefectureCode) || a.nameEn.localeCompare(b.nameEn))

export const JP_JOBTAG_PROFILES_BY_RECORD: Record<number, JPJobTagProfile> = Object.fromEntries(
  allJobTagProfiles.map((profile) => [profile.recordNumber, profile]),
)

export const JP_JOBTAG_PROFILES_BY_WAGE_CODE: Record<string, JPJobTagProfile[]> = Object.fromEntries(
  Object.entries(jobTagWageLinks).map(([wageCode, recordNumbers]) => [
    wageCode,
    recordNumbers
      .map((recordNumber) => JP_JOBTAG_PROFILES_BY_RECORD[recordNumber])
      .filter((profile): profile is JPJobTagProfile => profile != null),
  ]),
)

export const JP_PREFECTURE_SEO_DATA = JP_PREFECTURE_CODES.map((code) => ({
  code,
  ...JP_PREFECTURE_NAMES[code],
  shortageCount: JP_SHORTAGE_BY_PREFECTURE[code].length,
  rent: JP_RENT_BY_PREFECTURE[code] ?? null,
  cities: JP_CITIES.filter((city) => city.prefectureCode === code),
}))

export function getJPPrefectureSeoData(code: string) {
  return JP_PREFECTURE_SEO_DATA.find((row) => row.code === code) ?? null
}

export function getJPCitySeoData(areaCode: string) {
  const city = JP_CITIES.find((row) => row.areaCode === areaCode)
  if (!city) return null
  return {
    ...city,
    prefecture: JP_PREFECTURE_NAMES[city.prefectureCode as JPPrefectureCode],
    shortage: JP_SHORTAGE_BY_PREFECTURE[city.prefectureCode] ?? [],
  }
}

export const JP_MAP_SOURCE_NOTE = {
  shortage: "MHLW Employment-related indicators by occupation, FY2025 annual average monthly effective job openings and job seekers.",
  wage: "MHLW Wage Structure Basic Statistical Survey hourly baseline. Annual estimate is shown only as hourly baseline × 160 hours/month × 12 months.",
  rent: "Statistics Bureau 2023 Housing and Land Survey. This is the lower edge of the official median private-rental monthly-rent band, not an average rent.",
}

export const JP_CITY_NAME_BY_AREA = JP_CITY_AREAS
