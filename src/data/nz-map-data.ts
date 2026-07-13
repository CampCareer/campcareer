import occupationsRaw from "@/data/nz-occupations.json"
import regionsRaw from "@/data/nz-regions.json"
import citiesRaw from "@/data/nz-cities.json"
import universitiesRaw from "@/data/nz-universities.json"
import snapshotsRaw from "@/data/nz-source-snapshots.json"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export type NZReviewStatus = "approved" | "review-required"

export type NZOccupation = {
  anzscoCode: string
  nameEn: string
  nameKo: string
  medianSalaryNzd: number
  employmentThousands: number
  shortageRating: number
  regionCodes: string[]
  relatedField: string
  sourceYear: string
  reviewStatus: NZReviewStatus
}

export type NZRegion = {
  code: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: {
    monthlyNzd: number
    weeklyNzd: number
    period: string
    definition: string
    status: "available" | "unavailable"
  }
  topShortage: string[]
  lastChecked: string
  reviewStatus: NZReviewStatus
}

export type NZCity = {
  code: string
  regionCode: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: { monthlyNzd: number | null; status: "available" | "unavailable" }
  lastChecked: string
  reviewStatus: NZReviewStatus
}

export type NZUniversity = {
  country: "NZ"
  slug: string
  nameEn: string
  nameKo: string
  institutionType: string
  officialUrl: string
  cityName: string
  regionCode: string
  lat: number
  lng: number
  worldRanking: number | null
  sourceUrl: string
  lastChecked: string
  reviewStatus: NZReviewStatus
  relatedFields: string[]
}

// The prior seed has useful labels and locations but no reproducible source
// rows for its salary/shortage figures. Keep it available for editorial repair
// only; no seed row may regain approved status at runtime.
export const NZ_OCCUPATIONS = (occupationsRaw as NZOccupation[]).map((item) => ({
  ...item,
  reviewStatus: "review-required" as const,
}))
export const NZ_REGIONS = regionsRaw as NZRegion[]
export const NZ_CITIES = citiesRaw as NZCity[]
export const NZ_UNIVERSITIES = universitiesRaw as NZUniversity[]
export const NZ_SOURCE_SNAPSHOTS = (snapshotsRaw as Array<{
  category: string
  sourceName: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: NZReviewStatus
}>).map((snapshot) => ({ ...snapshot, reviewStatus: "review-required" as const }))

export const NZ_OCCUPATION_BY_CODE = new Map(NZ_OCCUPATIONS.map((item) => [item.anzscoCode, item]))

export const NZ_SHORTAGE_BY_REGION = Object.fromEntries(
  NZ_REGIONS.map((region) => [
    region.code,
    region.topShortage.map((code) => NZ_OCCUPATION_BY_CODE.get(code)).filter(Boolean) as NZOccupation[],
  ]),
) as Record<string, NZOccupation[]>

export const NZ_HIGH_PAY_BY_REGION = Object.fromEntries(
  NZ_REGIONS.map((region) => [
    region.code,
    NZ_OCCUPATIONS.filter((occ) => occ.regionCodes.includes(region.code))
      .sort((a, b) => b.medianSalaryNzd - a.medianSalaryNzd)
      .slice(0, 10),
  ]),
) as Record<string, NZOccupation[]>

export function getNZRegion(value: string): NZRegion | null {
  return NZ_REGIONS.find((item) => item.code === value || item.slug === value) ?? null
}

export function getNZOccupation(value: string): NZOccupation | null {
  return NZ_OCCUPATIONS.find((item) => item.anzscoCode === value) ?? null
}

export function isNZOccupationIndexable(item: NZOccupation): boolean {
  return isCountrySearchIndexable("NZ") && item.reviewStatus === "approved" && Boolean(item.nameEn && item.nameKo && item.regionCodes.length > 0)
}

export function isNZRegionIndexable(item: NZRegion): boolean {
  return isCountrySearchIndexable("NZ") && item.reviewStatus === "approved" && Boolean(item.rent.monthlyNzd && item.lastChecked)
}

export function isNZCityIndexable(item: NZCity): boolean {
  return isCountrySearchIndexable("NZ") && item.reviewStatus === "approved" && Number.isFinite(item.lat) && Number.isFinite(item.lng)
}

export function nzJobSearchUrl(occupation: Pick<NZOccupation, "nameEn">, region?: NZRegion | null): string {
  const params = new URLSearchParams({ search: [occupation.nameEn, region?.nameEn].filter(Boolean).join(" ") })
  return `https://www.seek.co.nz/${occupation.nameEn.toLowerCase().replace(/\s+/g, "-")}-jobs?${params.toString()}`
}
