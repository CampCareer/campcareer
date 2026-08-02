import {
  COUNTRY_COMPARISON_MISSING_VALUE,
  type DurationValue,
  type MoneyValue,
  type SourceReference,
  type TextValue,
} from "@/data/country-comparison/contracts"
import { getCountryCompareCities, type CountryCompareCity } from "@/data/country-comparison/locations"

export const CAREER_COMPARE_COUNTRY = "AU" as const
export const CAREER_COMPARE_PROFILE = "starting-from-scratch" as const
export const CAREER_COMPARE_MAX_CAREERS = 3
export const CAREER_COMPARE_MIN_CAREERS = 2
export const CAREER_COMPARE_MISSING_VALUE = COUNTRY_COMPARISON_MISSING_VALUE

export const CAREER_COMPARE_IDS = [
  "registered-nurse",
  "software-engineer",
  "early-childhood-teacher",
] as const

export type CareerCompareId = (typeof CAREER_COMPARE_IDS)[number]
export type CareerCompareProfile = typeof CAREER_COMPARE_PROFILE

export type CareerCodeMapping = {
  system: string
  version: string
  code: string
  relation: "exact" | "broader" | "narrower" | "related"
}

export type RegistrationRequirement = "required" | "not-required" | "conditional" | "unknown"

export type RegistrationValue = {
  value: RegistrationRequirement | null
  sourceIds: readonly string[]
} | null

export type CareerPathway = {
  typicalEducationRoute: TextValue | null
  typicalEntryQualification: TextValue | null
  studyDuration: DurationValue | null
  qualificationOutcome: TextValue | null
}

export type CareerRegistration = {
  requirement: RegistrationValue
  authority: TextValue | null
  process: TextValue | null
  scope: TextValue | null
}

export type CareerStudyCost = {
  annualTuition: MoneyValue | null
  estimatedTotalTuition: MoneyValue | null
  mandatoryStudyCosts: MoneyValue | null
}

export type CareerOutcome = {
  startingIncome: MoneyValue | null
  typicalEarnings: MoneyValue | null
  incomeBasis: TextValue | null
  employmentOutlook: TextValue | null
  shortageStatus: TextValue | null
  geographicScope: TextValue | null
}

export type CareerTime = {
  timeToProfessionalEntry: DurationValue | null
  registrationOrOnboardingTime: DurationValue | null
}

export type AustraliaCareerComparison = {
  id: CareerCompareId
  label: string
  countryCode: typeof CAREER_COMPARE_COUNTRY
  codeMappings: readonly CareerCodeMapping[]
  pathway: CareerPathway
  registration: CareerRegistration
  studyCost: CareerStudyCost
  outcome: CareerOutcome
  time: CareerTime
  sourceIds: readonly string[]
  reviewedAt: string | null
}

export type AustraliaCareerCompareCity = Pick<CountryCompareCity, "citySlug" | "cityName" | "regionName">

export type CareerLocationContext = {
  countryCode: typeof CAREER_COMPARE_COUNTRY
  citySlug: string | null
  displayLabel: string
  scope: "national" | "city"
}

const unavailableMoney = (): MoneyValue => ({
  currency: null,
  amount: null,
  min: null,
  max: null,
  period: null,
  effectiveYear: null,
  valueType: "unavailable",
  sourceIds: [],
})

const unavailableDuration = (): DurationValue => ({
  value: null,
  min: null,
  max: null,
  unit: null,
  valueType: "unavailable",
  sourceIds: [],
})

const emptyPathway = (): CareerPathway => ({
  typicalEducationRoute: null,
  typicalEntryQualification: null,
  studyDuration: unavailableDuration(),
  qualificationOutcome: null,
})

const emptyRegistration = (): CareerRegistration => ({
  requirement: null,
  authority: null,
  process: null,
  scope: null,
})

const emptyStudyCost = (): CareerStudyCost => ({
  annualTuition: unavailableMoney(),
  estimatedTotalTuition: unavailableMoney(),
  mandatoryStudyCosts: unavailableMoney(),
})

const emptyOutcome = (): CareerOutcome => ({
  startingIncome: unavailableMoney(),
  typicalEarnings: unavailableMoney(),
  incomeBasis: null,
  employmentOutlook: null,
  shortageStatus: null,
  geographicScope: null,
})

const emptyTime = (): CareerTime => ({
  timeToProfessionalEntry: unavailableDuration(),
  registrationOrOnboardingTime: unavailableDuration(),
})

function career(id: CareerCompareId, label: string): AustraliaCareerComparison {
  return {
    id,
    label,
    countryCode: CAREER_COMPARE_COUNTRY,
    // Official code adapters are intentionally empty until a separately
    // reviewed AU data-ingestion step is approved.
    codeMappings: [],
    pathway: emptyPathway(),
    registration: emptyRegistration(),
    studyCost: emptyStudyCost(),
    outcome: emptyOutcome(),
    time: emptyTime(),
    sourceIds: [],
    reviewedAt: null,
  }
}

/**
 * Contract-only AU catalog. It deliberately contains no occupational,
 * tuition, wage, demand, or city-cost facts.
 */
export const AU_CAREER_COMPARISON_CATALOG: readonly AustraliaCareerComparison[] = [
  career("registered-nurse", "Registered Nurse"),
  career("software-engineer", "Software Engineer"),
  career("early-childhood-teacher", "Early Childhood Teacher"),
]

export const AU_CAREER_COMPARISON_BY_ID = new Map(
  AU_CAREER_COMPARISON_CATALOG.map((careerItem) => [careerItem.id, careerItem]),
)

export const AU_CAREER_COMPARE_CITIES: readonly AustraliaCareerCompareCity[] = getCountryCompareCities(CAREER_COMPARE_COUNTRY).map((city) => ({
  citySlug: city.citySlug,
  cityName: city.cityName,
  regionName: city.regionName,
}))

export function getAustraliaCareerComparison(id: string) {
  return AU_CAREER_COMPARISON_BY_ID.get(id as CareerCompareId) ?? null
}

export function getAustraliaCareerCity(citySlug: string | null): AustraliaCareerCompareCity | null {
  if (!citySlug) return null
  return AU_CAREER_COMPARE_CITIES.find((city) => city.citySlug === citySlug.trim().toLowerCase()) ?? null
}

export function buildCareerLocationContext(citySlug: string | null): CareerLocationContext {
  const city = getAustraliaCareerCity(citySlug)
  if (!city) return { countryCode: CAREER_COMPARE_COUNTRY, citySlug: null, displayLabel: "Australia · National view", scope: "national" }
  return { countryCode: CAREER_COMPARE_COUNTRY, citySlug: city.citySlug, displayLabel: `Australia · ${city.cityName}`, scope: "city" }
}

export type CareerSourceBundle = readonly SourceReference[]
