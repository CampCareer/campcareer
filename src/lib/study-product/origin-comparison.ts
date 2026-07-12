import "server-only"

import { supabaseAdmin } from "@/lib/supabase-admin"
import type { CountryRecommendation, OriginComparison } from "@/lib/study-product/types"

const FX_AS_OF = "2026-07-10"
const ECB_PER_EUR: Record<string, number> = {
  EUR: 1,
  USD: 1.143,
  GBP: 0.85155,
  AUD: 1.6447,
  CAD: 1.6177,
  INR: 108.9665,
  KRW: 1720.12,
  PHP: 70.378,
  SGD: 1.4757,
}
const WAGE_MAX_AGE_MS = 36 * 31 * 24 * 60 * 60 * 1000
const HOUSING_MAX_AGE_MS = 18 * 31 * 24 * 60 * 60 * 1000

type Mapping = { canonical_career_id: string; country_code: string; relation: "exact"; last_verified_at: string; review_status: "APPROVED" | "STALE" | "REVIEW_REQUIRED" }
type Compensation = { canonical_career_id: string; country_code: string; annual_gross_amount: number | string; currency: string; as_of: string; last_verified_at: string; review_status: "APPROVED" | "STALE" | "REVIEW_REQUIRED" }
type Housing = { country_code: string; monthly_amount: number | string; currency: string; as_of: string; last_verified_at: string; review_status: "APPROVED" | "STALE" | "REVIEW_REQUIRED" }
type Coverage = { destination_country: string; status: "READY" | "UNAVAILABLE" | "REVIEW_REQUIRED"; last_verified_at: string }

export async function attachOriginComparisons({
  conceptId,
  originCountry,
  countries,
}: {
  conceptId: string
  originCountry?: string
  countries: CountryRecommendation[]
}): Promise<CountryRecommendation[]> {
  if (!originCountry) return countries
  const destinationCodes = countries.map((country) => country.countryCode)
  if (destinationCodes.length === 0) return countries

  try {
    const countryCodes = [...new Set([originCountry, ...destinationCodes])]
    const [mappingsResponse, compensationResponse, housingResponse, coverageResponse] = await Promise.all([
      supabaseAdmin.from("concept_career_mappings").select("canonical_career_id,country_code,relation,last_verified_at,review_status").eq("concept_id", conceptId).in("country_code", countryCodes).eq("relation", "exact").eq("review_status", "APPROVED"),
      supabaseAdmin.from("career_compensation_observations").select("canonical_career_id,country_code,annual_gross_amount,currency,as_of,last_verified_at,review_status").in("country_code", countryCodes).eq("review_status", "APPROVED").order("last_verified_at", { ascending: false }),
      supabaseAdmin.from("housing_cost_observations").select("country_code,monthly_amount,currency,as_of,last_verified_at,review_status").in("country_code", countryCodes).eq("housing_type", "SHARED_STUDENT").eq("review_status", "APPROVED").order("last_verified_at", { ascending: false }),
      supabaseAdmin.from("country_comparison_coverage").select("destination_country,status,last_verified_at").eq("concept_id", conceptId).eq("origin_country", originCountry).in("destination_country", destinationCodes),
    ])

    if (mappingsResponse.error || compensationResponse.error || housingResponse.error || coverageResponse.error) return unavailable(countries, originCountry)
    const mappings = (mappingsResponse.data ?? []) as Mapping[]
    const compensation = (compensationResponse.data ?? []) as Compensation[]
    const housing = (housingResponse.data ?? []) as Housing[]
    const coverage = (coverageResponse.data ?? []) as Coverage[]

    return countries.map((country) => ({
      ...country,
      originComparison: calculateCountryComparison({
        originCountry,
        destinationCountry: country.countryCode,
        mappings,
        compensation,
        housing,
        coverage,
      }),
    }))
  } catch {
    return unavailable(countries, originCountry)
  }
}

function calculateCountryComparison({ originCountry, destinationCountry, mappings, compensation, housing, coverage }: {
  originCountry: string
  destinationCountry: string
  mappings: Mapping[]
  compensation: Compensation[]
  housing: Housing[]
  coverage: Coverage[]
}): OriginComparison {
  const coverageRow = coverage.find((row) => row.destination_country === destinationCountry)
  if (coverageRow?.status !== "READY" || !isFresh(coverageRow.last_verified_at, WAGE_MAX_AGE_MS)) return unavailableOne(originCountry, destinationCountry)

  const originCareers = mappings.filter((mapping) => mapping.country_code === originCountry).map((mapping) => mapping.canonical_career_id)
  const career = mappings.find((mapping) => mapping.country_code === destinationCountry && originCareers.includes(mapping.canonical_career_id))?.canonical_career_id
  if (!career) return unavailableOne(originCountry, destinationCountry)

  const originSalary = compensation.find((row) => row.country_code === originCountry && row.canonical_career_id === career && isFresh(row.as_of, WAGE_MAX_AGE_MS) && isFresh(row.last_verified_at, WAGE_MAX_AGE_MS))
  const destinationSalary = compensation.find((row) => row.country_code === destinationCountry && row.canonical_career_id === career && isFresh(row.as_of, WAGE_MAX_AGE_MS) && isFresh(row.last_verified_at, WAGE_MAX_AGE_MS))
  const originHousing = housing.find((row) => row.country_code === originCountry && isFresh(row.as_of, HOUSING_MAX_AGE_MS) && isFresh(row.last_verified_at, HOUSING_MAX_AGE_MS))
  const destinationHousing = housing.find((row) => row.country_code === destinationCountry && isFresh(row.as_of, HOUSING_MAX_AGE_MS) && isFresh(row.last_verified_at, HOUSING_MAX_AGE_MS))
  if (!originSalary || !destinationSalary || !originHousing || !destinationHousing) return unavailableOne(originCountry, destinationCountry)

  const salaryDifferenceUsd = toUsd(destinationSalary.annual_gross_amount, destinationSalary.currency) - toUsd(originSalary.annual_gross_amount, originSalary.currency)
  const monthlyHousingDifferenceUsd = toUsd(destinationHousing.monthly_amount, destinationHousing.currency) - toUsd(originHousing.monthly_amount, originHousing.currency)
  if (!Number.isFinite(salaryDifferenceUsd) || !Number.isFinite(monthlyHousingDifferenceUsd)) return unavailableOne(originCountry, destinationCountry)

  return {
    status: "READY",
    originCountry,
    destinationCountry,
    careerMappingRelation: "exact",
    salaryDifferenceUsd: Math.round(salaryDifferenceUsd),
    monthlyHousingDifferenceUsd: Math.round(monthlyHousingDifferenceUsd),
    housingAdjustedDifferenceUsd: Math.round(salaryDifferenceUsd - monthlyHousingDifferenceUsd * 12),
    currencyAsOf: FX_AS_OF,
    lastVerifiedAt: [originSalary.last_verified_at, destinationSalary.last_verified_at, originHousing.last_verified_at, destinationHousing.last_verified_at].sort().at(0),
  }
}

function toUsd(amount: number | string, currency: string) {
  const rate = ECB_PER_EUR[currency]
  if (!rate) return Number.NaN
  return Number(amount) / rate * ECB_PER_EUR.USD
}

function isFresh(value: string, maxAgeMs: number) {
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) && timestamp >= Date.now() - maxAgeMs
}

function unavailable(countries: CountryRecommendation[], originCountry: string) {
  return countries.map((country) => ({ ...country, originComparison: unavailableOne(originCountry, country.countryCode) }))
}

function unavailableOne(originCountry: string, destinationCountry: string): OriginComparison {
  return {
    status: "UNAVAILABLE",
    originCountry,
    destinationCountry,
    reason: "An exact occupation, wage and housing comparison has not passed verification for this country pair yet.",
  }
}
