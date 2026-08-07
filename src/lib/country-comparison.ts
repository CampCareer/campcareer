import {
  getCountryCompareCity,
  getCountryCompareCities,
  getCountryCompareCountry,
  type CountryCompareCity,
  type CountryCompareCode,
} from "@/data/country-comparison/locations"
import {
  REGISTERED_NURSE_COMPARE_GOAL,
  REGISTERED_NURSE_COMPARE_PROFILE,
  type CountryCompareGoal,
  type CountryCompareProfile,
} from "@/data/country-comparison/registered-nurse"
import {
  CANONICAL_COUNTRY_CODES,
  toCanonicalCountryCode,
  toProductCountryCode,
} from "@/lib/data-foundation/entity-aliases"

export const COUNTRY_COMPARE_TYPE = "country" as const
export const COUNTRY_COMPARE_MAX_LOCATIONS = 3
export const COUNTRY_COMPARE_MIN_LOCATIONS = 2

export type CountryCompareLocation = {
  countryCode: CountryCompareCode
  citySlug: string
}

export type CountryCompareSlot = {
  countryCode: CountryCompareCode | null
  citySlug: string | null
  optional: boolean
}

export type CountryComparisonContextState = "supported" | "unsupported"

export type CountryComparisonState = {
  type: typeof COUNTRY_COMPARE_TYPE
  contextState: CountryComparisonContextState
  goal: CountryCompareGoal | null
  profile: CountryCompareProfile | null
  locations: readonly CountryCompareLocation[]
}

export type ComparisonPageType = "program" | "country" | "career" | "unsupported"

export function resolveComparisonPageType(rawType: string | null): ComparisonPageType {
  if (rawType === null || rawType === "program") return "program"
  if (rawType === COUNTRY_COMPARE_TYPE) return "country"
  if (rawType === "career") return "career"
  return "unsupported"
}

export function toExternalIsoCountryCode(countryCode: CountryCompareCode): "AU" | "IE" | "GB" {
  return toCanonicalCountryCode(countryCode)!
}

export function fromExternalIsoCountryCode(value: string): CountryCompareCode | null {
  const normalized = value.trim().toUpperCase()
  if (!(CANONICAL_COUNTRY_CODES as readonly string[]).includes(normalized)) return null
  return toProductCountryCode(normalized) as CountryCompareCode
}

function parseLocationPair(rawPair: string): CountryCompareLocation | null {
  const separatorIndex = rawPair.indexOf(":")
  if (separatorIndex < 1) return null

  const countryCode = rawPair.slice(0, separatorIndex).trim().toUpperCase()
  const citySlug = rawPair.slice(separatorIndex + 1).trim().toLowerCase()
  if (!countryCode || !citySlug) return null

  const country = getCountryCompareCountry(countryCode)
  const city = getCountryCompareCity(countryCode, citySlug)
  if (!country || !city) return null

  return { countryCode: country.productCode, citySlug: city.citySlug }
}

export function normalizeCountryLocations(rawLocations: string | null): CountryCompareLocation[] {
  if (!rawLocations) return []

  const locations: CountryCompareLocation[] = []
  const usedCountries = new Set<CountryCompareCode>()
  for (const rawPair of rawLocations.split(",")) {
    const location = parseLocationPair(rawPair)
    if (!location || usedCountries.has(location.countryCode)) continue
    usedCountries.add(location.countryCode)
    locations.push(location)
    if (locations.length >= COUNTRY_COMPARE_MAX_LOCATIONS) break
  }
  return locations
}

export function parseCountryComparisonState(searchParams: Pick<URLSearchParams, "get">): CountryComparisonState {
  const goal = searchParams.get("goal")
  const profile = searchParams.get("profile")
  const validGoal = goal === REGISTERED_NURSE_COMPARE_GOAL ? goal : null
  const validProfile = profile === REGISTERED_NURSE_COMPARE_PROFILE ? profile : null
  const contextState: CountryComparisonContextState = validGoal && validProfile ? "supported" : "unsupported"

  return {
    type: COUNTRY_COMPARE_TYPE,
    contextState,
    goal: validGoal,
    profile: validProfile,
    locations: contextState === "supported" ? normalizeCountryLocations(searchParams.get("locations")) : [],
  }
}

export function serializeCountryLocations(locations: readonly CountryCompareLocation[]): string {
  return normalizeCountryLocations(locations.map((location) => `${location.countryCode}:${location.citySlug}`).join(","))
    .map((location) => `${location.countryCode}:${location.citySlug}`)
    .join(",")
}

export function buildCountryCompareHref(locations: readonly CountryCompareLocation[] = []): string {
  const serializedLocations = serializeCountryLocations(locations)
  const base = `/compare?type=${COUNTRY_COMPARE_TYPE}&goal=${REGISTERED_NURSE_COMPARE_GOAL}&profile=${REGISTERED_NURSE_COMPARE_PROFILE}`
  return serializedLocations ? `${base}&locations=${serializedLocations}` : base
}

export function slotsFromCountryLocations(locations: readonly CountryCompareLocation[]): CountryCompareSlot[] {
  const slots: CountryCompareSlot[] = locations.map((location) => ({
    countryCode: location.countryCode,
    citySlug: location.citySlug,
    optional: false,
  }))
  while (slots.length < COUNTRY_COMPARE_MIN_LOCATIONS) {
    slots.push({ countryCode: null, citySlug: null, optional: false })
  }
  return slots
}

export function completeCountryLocations(slots: readonly CountryCompareSlot[]): CountryCompareLocation[] {
  return normalizeCountryLocations(
    slots
      .filter((slot): slot is CountryCompareSlot & { countryCode: CountryCompareCode; citySlug: string } => Boolean(slot.countryCode && slot.citySlug))
      .map((slot) => `${slot.countryCode}:${slot.citySlug}`)
      .join(","),
  )
}

export function replaceCountryInSlot(
  slots: readonly CountryCompareSlot[],
  index: number,
  countryCode: CountryCompareCode,
): CountryCompareSlot[] {
  if (index < 0 || index >= slots.length) return [...slots]
  if (slots.some((slot, slotIndex) => slotIndex !== index && slot.countryCode === countryCode)) return [...slots]
  return slots.map((slot, slotIndex) => slotIndex === index
    ? { countryCode, citySlug: null, optional: slot.optional }
    : { ...slot })
}

export function replaceCityInSlot(
  slots: readonly CountryCompareSlot[],
  index: number,
  city: CountryCompareCity,
): CountryCompareSlot[] {
  if (index < 0 || index >= slots.length) return [...slots]
  const slot = slots[index]
  if (slot.countryCode !== city.countryCode) return [...slots]
  return slots.map((current, slotIndex) => slotIndex === index
    ? { ...current, citySlug: city.citySlug, optional: false }
    : { ...current })
}

export function removeCountrySlot(slots: readonly CountryCompareSlot[], index: number): CountryCompareSlot[] {
  if (index < 0 || index >= slots.length) return [...slots]
  const next = slots.filter((_, slotIndex) => slotIndex !== index).map((slot) => ({ ...slot }))
  while (next.length < COUNTRY_COMPARE_MIN_LOCATIONS) {
    next.push({ countryCode: null, citySlug: null, optional: false })
  }
  return next
}

export function addCountrySlot(slots: readonly CountryCompareSlot[]): CountryCompareSlot[] {
  if (slots.length >= COUNTRY_COMPARE_MAX_LOCATIONS) return [...slots]
  return [...slots.map((slot) => ({ ...slot })), { countryCode: null, citySlug: null, optional: true }]
}

export function cancelEmptyCountrySlot(slots: readonly CountryCompareSlot[], index: number): CountryCompareSlot[] {
  if (index < 0 || index >= slots.length || slots[index].countryCode || !slots[index].optional) return [...slots]
  return slots.filter((_, slotIndex) => slotIndex !== index).map((slot) => ({ ...slot }))
}

export function getCountryCompareCityOption(countryCode: CountryCompareCode, citySlug: string | null) {
  return citySlug ? getCountryCompareCity(countryCode, citySlug) : null
}

export { getCountryCompareCities }
