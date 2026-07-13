import occupationsRaw from "@/data/dk-occupations.json"
import regionsRaw from "@/data/dk-regions.json"
import citiesRaw from "@/data/dk-cities.json"
import universitiesRaw from "@/data/dk-universities.json"
import snapshotsRaw from "@/data/dk-source-snapshots.json"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export type DKReviewStatus = "approved" | "review-required"

export type DKOccupation = {
  dosCode: string
  nameEn: string
  nameKo: string
  medianSalaryDkk: number
  employmentThousands: number
  shortageRating: number
  regionCodes: string[]
  relatedField: string
  sourceYear: string
  reviewStatus: DKReviewStatus
}

export type DKRegion = {
  code: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: {
    monthlyDkk: number
    weeklyDkk: number
    period: string
    definition: string
    status: "available" | "unavailable"
  }
  topShortage: string[]
  lastChecked: string
  reviewStatus: DKReviewStatus
}

export type DKCity = {
  code: string
  regionCode: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: { monthlyDkk: number | null; status: "available" | "unavailable" }
  lastChecked: string
  reviewStatus: DKReviewStatus
}

export type DKUniversity = {
  country: "DK"
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
  reviewStatus: DKReviewStatus
  relatedFields: string[]
}

export const DK_OCCUPATIONS = occupationsRaw as DKOccupation[]
export const DK_REGIONS = regionsRaw as DKRegion[]
export const DK_CITIES = citiesRaw as DKCity[]
export const DK_UNIVERSITIES = universitiesRaw as DKUniversity[]
export const DK_SOURCE_SNAPSHOTS = snapshotsRaw as Array<{
  category: string
  sourceName: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: DKReviewStatus
}>

export const DK_OCCUPATION_BY_CODE = new Map(DK_OCCUPATIONS.map((item) => [item.dosCode, item]))

export const DK_SHORTAGE_BY_REGION = Object.fromEntries(
  DK_REGIONS.map((region) => [
    region.code,
    region.topShortage.map((code) => DK_OCCUPATION_BY_CODE.get(code)).filter(Boolean) as DKOccupation[],
  ]),
) as Record<string, DKOccupation[]>

export const DK_HIGH_PAY_BY_REGION = Object.fromEntries(
  DK_REGIONS.map((region) => [
    region.code,
    DK_OCCUPATIONS.filter((occ) => occ.regionCodes.includes(region.code))
      .sort((a, b) => b.medianSalaryDkk - a.medianSalaryDkk)
      .slice(0, 10),
  ]),
) as Record<string, DKOccupation[]>

export function getDKRegion(value: string): DKRegion | null {
  return DK_REGIONS.find((item) => item.code === value || item.slug === value) ?? null
}

export function getDKOccupation(value: string): DKOccupation | null {
  return DK_OCCUPATIONS.find((item) => item.dosCode === value) ?? null
}

export function isDKOccupationIndexable(item: DKOccupation): boolean {
  return isCountrySearchIndexable("DK") && item.reviewStatus === "approved" && Boolean(item.nameEn && item.nameKo && item.regionCodes.length > 0)
}

export function isDKRegionIndexable(item: DKRegion): boolean {
  return isCountrySearchIndexable("DK") && item.reviewStatus === "approved" && Boolean(item.rent.monthlyDkk && item.lastChecked)
}

export function isDKCityIndexable(item: DKCity): boolean {
  return isCountrySearchIndexable("DK") && item.reviewStatus === "approved" && Number.isFinite(item.lat) && Number.isFinite(item.lng)
}

export function dkJobSearchUrl(occupation: Pick<DKOccupation, "nameEn">, region?: DKRegion | null): string {
  const params = new URLSearchParams({ q: [occupation.nameEn, region?.nameEn].filter(Boolean).join(" ") })
  return `https://jobnet.dk/Jobsoegning?${params.toString()}`
}
