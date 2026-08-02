import {
  unavailableProgramCompareValue,
  type ProgramCompareItem,
  type ProgramCompareSourceReference,
} from "@/lib/data-foundation/program-compare-contract"

export const AU_NURSING_PROGRAM_IDS = [
  "qut-bachelor-nursing",
  "unisc-bachelor-nursing-science",
  "unisc-graduate-entry-nursing-science",
] as const

export type AuNursingProductProgramId = (typeof AU_NURSING_PROGRAM_IDS)[number]

export type AuNursingProgramMapping = {
  productProgramId: AuNursingProductProgramId
  canonicalProgrammeId: string
  canonicalOfferingId: string
  officialUrl: string
}

export const AU_NURSING_PROGRAM_MAPPINGS: readonly AuNursingProgramMapping[] = [
  {
    productProgramId: "qut-bachelor-nursing",
    canonicalProgrammeId: "bbdeafda-00c5-4786-bcc9-b3874ad19ae1",
    canonicalOfferingId: "5752e851-fbb4-4da7-ba00-22fecef50bec",
    officialUrl: "https://www.qut.edu.au/courses/bachelor-of-nursing",
  },
  {
    productProgramId: "unisc-bachelor-nursing-science",
    canonicalProgrammeId: "a447d9d2-1bfa-4617-b96a-55c57a0c3bbe",
    canonicalOfferingId: "30858c5f-be6c-4573-af8e-40af5d708796",
    officialUrl: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science",
  },
  {
    productProgramId: "unisc-graduate-entry-nursing-science",
    canonicalProgrammeId: "d9e32d19-6223-4354-9544-dd1ac55a2caf",
    canonicalOfferingId: "eb1f1e5f-62e7-4e8a-9f36-84daadb3d54b",
    officialUrl: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science-graduate-entry",
  },
] as const

export type AuNursingCanonicalInput = {
  productProgramId: AuNursingProductProgramId
  canonicalProgrammeId: string
  canonicalOfferingId: string
  institutionId: string | null
  institutionName: string | null
  institutionShortName: string | null
  programmeName: string | null
  qualification: string | null
  campusId: string | null
  campusName: string | null
  cityName: string | null
  regionName: string | null
  durationMonths: number | null
  tuition: {
    amount: number
    currency: string
    basis: string
    referenceYear: number | null
    reviewedAt: string | null
    sources: readonly ProgramCompareSourceReference[]
  } | null
  entryRequirements: string | null
  sources: readonly ProgramCompareSourceReference[]
  reviewedAt: string | null
}

const MAPPING_BY_PRODUCT_ID = new Map(AU_NURSING_PROGRAM_MAPPINGS.map((mapping) => [mapping.productProgramId, mapping]))

export function getAuNursingProgramMapping(productProgramId: string): AuNursingProgramMapping | null {
  return MAPPING_BY_PRODUCT_ID.get(productProgramId as AuNursingProductProgramId) ?? null
}

export function isAuNursingProductProgramId(value: string): value is AuNursingProductProgramId {
  return MAPPING_BY_PRODUCT_ID.has(value as AuNursingProductProgramId)
}

function missingFields(input: AuNursingCanonicalInput): string[] {
  const missing: string[] = []
  if (!input.institutionName) missing.push("institution")
  if (!input.programmeName) missing.push("programme")
  if (!input.qualification) missing.push("qualification")
  if (!input.campusName && !input.cityName) missing.push("location")
  if (input.durationMonths === null) missing.push("duration")
  if (!input.tuition) missing.push("internationalTuition")
  if (!input.entryRequirements) missing.push("entryRequirements")
  if (input.sources.length === 0) missing.push("officialSource")
  return missing
}

export function toAuNursingProgramCompareItem(input: AuNursingCanonicalInput): ProgramCompareItem {
  const duration = input.durationMonths === null
    ? unavailableProgramCompareValue<number>()
    : {
        ...unavailableProgramCompareValue<number>(),
        value: input.durationMonths,
        status: "available" as const,
        displayValue: `${input.durationMonths / 12 % 1 === 0 ? input.durationMonths / 12 : (input.durationMonths / 12).toFixed(1)} years`,
        referenceYear: null,
        sources: input.sources,
      }
  const tuition = input.tuition === null
    ? unavailableProgramCompareValue<number>()
    : {
        ...unavailableProgramCompareValue<number>(),
        value: input.tuition.amount,
        status: "available" as const,
        displayValue: `${input.tuition.currency} ${input.tuition.amount.toLocaleString("en-AU")} / ${input.tuition.basis}`,
        referenceYear: input.tuition.referenceYear,
        currency: input.tuition.currency,
        basis: input.tuition.basis,
        sources: input.tuition.sources,
      }
  const qualification = input.qualification === null
    ? unavailableProgramCompareValue<string>()
    : { ...unavailableProgramCompareValue<string>(), value: input.qualification, status: "available" as const, displayValue: input.qualification, sources: input.sources }
  const internationalAvailability = {
    ...unavailableProgramCompareValue<boolean>(),
    value: true,
    status: "available" as const,
    displayValue: "Available for international students",
    sources: input.sources,
  }
  return {
    productProgramId: input.productProgramId,
    canonicalProgrammeId: input.canonicalProgrammeId,
    canonicalOfferingId: input.canonicalOfferingId,
    countryCode: "AU",
    countryDisplayName: "Australia",
    institution: input.institutionName
      ? { canonicalInstitutionId: input.institutionId, name: input.institutionName, shortName: input.institutionShortName }
      : null,
    programme: { name: input.programmeName },
    qualification,
    locations: [{ canonicalLocationId: input.campusId, campusName: input.campusName, cityName: input.cityName, regionName: input.regionName, countryCode: "AU" }],
    duration,
    tuition,
    internationalAvailability,
    sources: input.sources,
    reviewedAt: input.reviewedAt,
    missingFields: missingFields(input),
    dataStatus: missingFields(input).length === 0 ? "available" : "review_required",
    errorCode: null,
  }
}

export function unavailableAuNursingProgramCompareItem(productProgramId: string, errorCode: ProgramCompareItem["errorCode"]): ProgramCompareItem {
  const value = unavailableProgramCompareValue
  return {
    productProgramId,
    canonicalProgrammeId: null,
    canonicalOfferingId: null,
    countryCode: "AU",
    countryDisplayName: "Australia",
    institution: null,
    programme: null,
    qualification: value<string>("unresolved"),
    locations: [],
    duration: value<number>("unresolved"),
    tuition: value<number>("unresolved"),
    internationalAvailability: value<boolean>("unresolved"),
    sources: [],
    reviewedAt: null,
    missingFields: ["canonicalProgrammeId", "canonicalOfferingId", "institution", "programme", "qualification", "location", "duration", "internationalTuition", "officialSource"],
    dataStatus: "unresolved",
    errorCode,
  }
}
