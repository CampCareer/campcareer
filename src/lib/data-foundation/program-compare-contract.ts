import type { CanonicalCountryCode } from "@/lib/data-foundation/country-normalization"

export const PROGRAM_COMPARE_VALUE_STATUSES = [
  "available",
  "unavailable",
  "unresolved",
  "not_applicable",
  "review_required",
] as const

export type ProgramCompareValueStatus = (typeof PROGRAM_COMPARE_VALUE_STATUSES)[number]

export type ProgramCompareSourceReference = {
  organisation: string
  title: string
  url: string
  reviewedAt: string | null
  verificationStatus: "verified" | "needs-review" | "unavailable"
}

export type ProgramCompareValue<T> = {
  value: T | null
  status: ProgramCompareValueStatus
  displayValue: string | null
  referenceYear: number | null
  currency: string | null
  basis: string | null
  sources: readonly ProgramCompareSourceReference[]
}

export type ProgramCompareInstitution = {
  canonicalInstitutionId: string | null
  name: string
  shortName: string | null
}

export type ProgramCompareLocation = {
  canonicalLocationId: string | null
  campusName: string | null
  cityName: string | null
  regionName: string | null
  countryCode: CanonicalCountryCode | null
}

export type ProgramCompareItem = {
  productProgramId: string
  canonicalProgrammeId: string | null
  canonicalOfferingId: string | null
  countryCode: CanonicalCountryCode | null
  countryDisplayName: string | null
  institution: ProgramCompareInstitution | null
  programme: { name: string | null } | null
  qualification: ProgramCompareValue<string>
  locations: readonly ProgramCompareLocation[]
  duration: ProgramCompareValue<number>
  tuition: ProgramCompareValue<number>
  internationalAvailability: ProgramCompareValue<boolean>
  sources: readonly ProgramCompareSourceReference[]
  reviewedAt: string | null
  missingFields: readonly string[]
  dataStatus: ProgramCompareValueStatus
  errorCode: "invalid_product_program_id" | "unresolved_product_program_id" | "canonical_programme_not_found" | "canonical_offering_not_found" | "unsupported_country" | "canonical_data_unavailable" | "server_data_error" | null
}

export type ProgramCompareRepository = {
  resolveProductProgramId: (productProgramId: string) => Promise<{
    status: "resolved" | "unresolved"
    canonicalProgrammeId: string | null
    canonicalOfferingId: string | null
    errorCode: ProgramCompareItem["errorCode"]
  }>
  getProgramCompareItem: (canonicalProgrammeId: string, canonicalOfferingId: string) => Promise<ProgramCompareItem | null>
  getProgramCompareItems: (productProgramIds: readonly string[]) => Promise<readonly ProgramCompareItem[]>
}

export function unavailableProgramCompareValue<T>(status: ProgramCompareValueStatus = "unavailable"): ProgramCompareValue<T> {
  return {
    value: null,
    status,
    displayValue: null,
    referenceYear: null,
    currency: null,
    basis: null,
    sources: [],
  }
}

export function formatProgramCompareValue(value: ProgramCompareValue<unknown>, fallback = "Unavailable") {
  if (value.status === "review_required") return "Review required"
  if (value.status !== "available" || value.displayValue === null) return fallback
  return value.displayValue
}
