export const COUNTRY_COMPARISON_MISSING_VALUE = "Not available" as const

export const COUNTRY_COMPARISON_VALUE_TYPES = [
  "official",
  "verified",
  "range",
  "estimate",
  "derived",
  "unavailable",
] as const

export type CountryComparisonValueType = (typeof COUNTRY_COMPARISON_VALUE_TYPES)[number]

export const COUNTRY_COMPARISON_VERIFICATION_STATUSES = [
  "verified",
  "needs-review",
  "unavailable",
] as const

export type CountryComparisonVerificationStatus = (typeof COUNTRY_COMPARISON_VERIFICATION_STATUSES)[number]

export type CountryComparisonSourceType = string

export type SourceReference = {
  id: string
  label: string
  url: string
  sourceType: CountryComparisonSourceType
  reviewedAt: string | null
  effectiveYear: number | null
  verificationStatus: CountryComparisonVerificationStatus
}

export type MoneyValue = {
  currency: string | null
  amount: number | null
  min: number | null
  max: number | null
  period: "week" | "month" | "year" | "total" | "one-time" | null
  effectiveYear: number | null
  valueType: CountryComparisonValueType
  sourceIds: readonly string[]
}

export type DurationValue = {
  value: number | null
  min: number | null
  max: number | null
  unit: "day" | "week" | "month" | "year" | null
  valueType: CountryComparisonValueType
  sourceIds: readonly string[]
}

export type TextValue = {
  value: string | null
  valueType: CountryComparisonValueType
  effectiveYear: number | null
  sourceIds: readonly string[]
}

export function isCountryComparisonValueType(value: string): value is CountryComparisonValueType {
  return (COUNTRY_COMPARISON_VALUE_TYPES as readonly string[]).includes(value)
}

export function areSourceIdsKnown(
  sourceIds: readonly string[],
  sources: readonly SourceReference[],
): boolean {
  const knownIds = new Set(sources.map((source) => source.id))
  return sourceIds.every((sourceId) => knownIds.has(sourceId))
}

export function resolveSourceReferences(
  sourceIds: readonly string[],
  sources: readonly SourceReference[],
): SourceReference[] {
  const sourcesById = new Map(sources.map((source) => [source.id, source]))
  return sourceIds.flatMap((sourceId) => {
    const source = sourcesById.get(sourceId)
    return source ? [source] : []
  })
}
