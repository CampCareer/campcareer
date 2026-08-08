export type CaProgramPublicationTier = "A" | "B" | "C"
export type CaProgramPgwpState = "eligible" | "ineligible" | "unknown"

export type CaProgramHoldReason =
  | "missing_title"
  | "missing_institution"
  | "missing_source"
  | "missing_source_date"
  | "missing_dli"
  | "international_ineligible"
  | "excluded_non_core"
  | "suspended"
  | "not_accepting"
  | "pending_review"
  | "cancelled"
  | "legacy"
  | "closed_delivery"
  | "ambiguous_parent"
  | "admission_non_core"
  | "admission_unverified"
  | "admission_closed_or_restricted"

export type CaProgramPublicationInput = {
  title: string | null
  institutionId: string | null
  sourceUrl: string | null
  sourceAsOf: string | null
  collectedAt: string | null
  sourceStatus: string | null
  officialProgramUrl: string | null
  matchedDliNumber: string | null
  internationalStudentsEligible: boolean | null
  internationalProgramAdmissionStatus: string | null
  irccProgramEligible: boolean | null
}

export type CaProgramPublicationDecision = {
  tier: CaProgramPublicationTier
  holdReason: CaProgramHoldReason | null
  pgwpState: CaProgramPgwpState
  indexableDetail: boolean
}

const text = (value: string | null) => value?.trim() ?? ""
const normalized = (value: string | null) => text(value).toLowerCase()

function sourceHoldReason(sourceStatus: string | null): CaProgramHoldReason | null {
  const status = normalized(sourceStatus)
  if (!status) return null

  if (status.includes("excluded_")) return "excluded_non_core"
  if (status.includes("suspended")) return "suspended"
  if (status.includes("not_accepting")) return "not_accepting"
  if (status.includes("pending_review")) return "pending_review"
  if (status.includes("cancelled")) return "cancelled"
  if (status.includes("legacy_")) return "legacy"
  if (status.includes("one_time_delivery_closed")) return "closed_delivery"
  if (status.includes("parent_program_multiple_credentials")) return "ambiguous_parent"

  return null
}

function admissionHoldReason(admissionStatus: string | null): CaProgramHoldReason | null {
  const status = normalized(admissionStatus)
  if (!status) return "admission_unverified"

  if (status.includes("not_assessed_non_core")) return "admission_non_core"

  const unverified = [
    "not_yet_verified",
    "not verified",
    "should_be_checked",
    "check_current_intake_availability",
    "availability_separate",
    "dli_and_study_permit_eligibility_not_verified",
  ]

  if (unverified.some((marker) => status.includes(marker))) {
    return "admission_unverified"
  }

  const closedOrRestricted = [
    "suspended",
    "cancelled",
    "not_accepting",
    "not currently",
    "not_current",
    "unavailable",
    "restricted_not_open",
    "temporarily_paused",
    "not_eligible_for_study_permit",
    "legacy_program",
  ]

  if (closedOrRestricted.some((marker) => status.includes(marker))) {
    return "admission_closed_or_restricted"
  }

  return null
}

export function caProgramPgwpState(irccProgramEligible: boolean | null): CaProgramPgwpState {
  if (irccProgramEligible === true) return "eligible"
  if (irccProgramEligible === false) return "ineligible"
  return "unknown"
}

export function classifyCaProgramPublication(
  input: CaProgramPublicationInput,
): CaProgramPublicationDecision {
  let holdReason: CaProgramHoldReason | null = null

  if (!text(input.title)) holdReason = "missing_title"
  else if (!text(input.institutionId)) holdReason = "missing_institution"
  else if (!text(input.sourceUrl)) holdReason = "missing_source"
  else if (!text(input.sourceAsOf) && !text(input.collectedAt)) holdReason = "missing_source_date"
  else if (!text(input.matchedDliNumber)) holdReason = "missing_dli"
  else if (input.internationalStudentsEligible !== true) holdReason = "international_ineligible"
  else holdReason = sourceHoldReason(input.sourceStatus) ?? admissionHoldReason(input.internationalProgramAdmissionStatus)

  const pgwpState = caProgramPgwpState(input.irccProgramEligible)

  if (holdReason) {
    return {
      tier: "C",
      holdReason,
      pgwpState,
      indexableDetail: false,
    }
  }

  if (text(input.officialProgramUrl)) {
    return {
      tier: "A",
      holdReason: null,
      pgwpState,
      indexableDetail: true,
    }
  }

  return {
    tier: "B",
    holdReason: null,
    pgwpState,
    indexableDetail: false,
  }
}
