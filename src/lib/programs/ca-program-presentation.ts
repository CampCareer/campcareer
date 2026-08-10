import type {
  CaProgramPgwpState,
  CaProgramPublicationTier,
} from "@/lib/programs/ca-publish-policy"

export type CaAdmissionTone = "positive" | "caution" | "negative" | "neutral"

export type CaAdmissionPresentation = {
  label: string
  detail: string | null
  tone: CaAdmissionTone
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

const MONTH_LABELS: Record<string, string> = {
  jan: "January",
  january: "January",
  feb: "February",
  february: "February",
  mar: "March",
  march: "March",
  apr: "April",
  april: "April",
  may: "May",
  jun: "June",
  june: "June",
  jul: "July",
  july: "July",
  aug: "August",
  august: "August",
  sep: "September",
  sept: "September",
  september: "September",
  oct: "October",
  october: "October",
  nov: "November",
  november: "November",
  dec: "December",
  december: "December",
}

function dateFromToken(value: string) {
  const match = value.match(/^(20\d{2})_(\d{2})_(\d{2})$/)
  if (!match) return null
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : DATE_FORMATTER.format(date)
}

function addUnique(target: string[], value: string | null) {
  if (value && !target.includes(value)) target.push(value)
}

function termLabels(status: string) {
  const terms: string[] = []
  const patterns: Array<[RegExp, (match: RegExpExecArray) => string]> = [
    [/fall_(20\d{2})/g, (match) => `Fall ${match[1]}`],
    [/winter_(20\d{2})/g, (match) => `Winter ${match[1]}`],
    [/spring_(20\d{2})/g, (match) => `Spring ${match[1]}`],
    [/summer_(20\d{2})/g, (match) => `Summer ${match[1]}`],
    [/(?:^|_)september_(20\d{2})(?:_|$)/g, (match) => `September ${match[1]}`],
    [/(?:^|_)january_(20\d{2})(?:_|$)/g, (match) => `January ${match[1]}`],
    [/(?:^|_)may_(20\d{2})(?:_|$)/g, (match) => `May ${match[1]}`],
    [/(?:^|_)sep_(20\d{2})(?:_|$)/g, (match) => `September ${match[1]}`],
    [/(?:^|_)jan_(20\d{2})(?:_|$)/g, (match) => `January ${match[1]}`],
  ]

  for (const [pattern, label] of patterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(status))) addUnique(terms, label(match))
  }

  return terms
}

function deadlineLabel(status: string) {
  const match = status.match(/(?:deadline|closes|until)_((?:20\d{2})_\d{2}_\d{2})/)
  const formatted = match ? dateFromToken(match[1]) : null
  return formatted ? `Deadline ${formatted}` : null
}

function openingLabel(status: string) {
  const match = status.match(/(?:opens|opening)_([a-z]+)_(20\d{2})/)
  if (!match) return null
  const month = MONTH_LABELS[match[1]]
  return month ? `Opens ${month} ${match[2]}` : null
}

export function caPgwpLabel(state: CaProgramPgwpState) {
  if (state === "eligible") return "PGWP eligible"
  if (state === "ineligible") return "PGWP ineligible"
  return "PGWP not confirmed"
}

export function caPublicationEvidenceLabel(tier: CaProgramPublicationTier) {
  return tier === "A" ? "Official program page verified" : "Reviewed publication record"
}

export function formatCaEvidenceDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : DATE_FORMATTER.format(date)
}

export function caAdmissionPresentation(value: string | null): CaAdmissionPresentation {
  if (!value) {
    return {
      label: "Admission evidence reviewed",
      detail: null,
      tone: "neutral",
    }
  }

  const status = value.toLowerCase()
  const details: string[] = []
  const terms = termLabels(status)
  if (terms.length) details.push(terms.join(", "))
  addUnique(details, deadlineLabel(status))
  addUnique(details, openingLabel(status))

  if (status.includes("program_specific_deadline_applies")) addUnique(details, "Program-specific deadline applies")
  if (status.includes("capacity_applies")) addUnique(details, "Capacity applies")
  if (status.includes("seat_available") || status.includes("space_permitting")) addUnique(details, "Subject to available space")
  if (status.includes("apply_early")) addUnique(details, "Apply early")
  if (status.includes("flexible_learning")) addUnique(details, "Flexible learning")
  if (status.includes("prehealth_required")) addUnique(details, "Pre-health requirement applies")
  if (status.includes("late_applications_accepted")) addUnique(details, "Late applications accepted")
  if (status.includes("outside_canada_opening_soon")) addUnique(details, "Outside-Canada applications opening soon")
  if (status.includes("post_baccalaureate_program_declaration_after_admission")) {
    addUnique(details, "Program declaration follows university admission")
  }
  if (status.includes("major_declared_after_first_year")) addUnique(details, "Major declared after first year")
  if (status.includes("major_or_honours_declared_after_24_credits")) {
    addUnique(details, "Major or honours declared after 24 credits")
  }
  if (status.includes("admitted_students_may_enter_any_term")) addUnique(details, "Admitted students may enter any term")
  if (status.includes("hcap_employment_pathway")) addUnique(details, "HCAP employment pathway")

  let label = "Admission evidence reviewed"
  let tone: CaAdmissionTone = "neutral"

  if (status.includes("no_intake")) {
    label = "No international intake"
    tone = "negative"
  } else if (status.includes("admissions_on_hold") || status.includes("admission_on_hold")) {
    label = "International admissions on hold"
    tone = "caution"
  } else if (status.includes("restricted") || status.includes("not_general_international_entry")) {
    label = "Restricted international entry"
    tone = "caution"
    addUnique(details, "Not a general international entry route")
  } else if (status.includes("application_cycle_opens_") || status.includes("opening_soon")) {
    label = "Application cycle opens later"
    tone = "neutral"
  } else if (status.includes("potentially_accepting") || status.includes("space_permitting")) {
    label = "Seat-dependent international availability"
    tone = "caution"
  } else if (status.includes("planned_international_spaces")) {
    label = "International spaces planned"
    tone = "neutral"
  } else if (status.includes("international_application_path")) {
    label = "International application path published"
    tone = "neutral"
  } else if (status.includes("waitlisted") || status.includes("limited")) {
    label = "International availability limited"
    tone = "caution"
  } else if (
    status.includes("application_open") ||
    status.includes("applications_open") ||
    status.includes("accepting_international_applications") ||
    status.includes("currently_accepting") ||
    status.includes("international_apply_") ||
    status.includes("international_open") ||
    status.includes("open_international") ||
    status.includes("next_intake_open") ||
    status.includes("entry_open") ||
    status.includes("windows_open") ||
    status.includes("international_winter_2027_open") ||
    status.includes("late_applications_accepted")
  ) {
    label = "International applications open"
    tone = "positive"
  } else if (
    status.includes("international_available") ||
    status.includes("international_availability") ||
    status.includes("next_available") ||
    status.includes("international_students_accepted")
  ) {
    label = "International intake available"
    tone = "positive"
  } else if (
    status.includes("program_list") ||
    status.includes("current_list") ||
    status.includes("listed_current") ||
    status.includes("listed_for_international_intake") ||
    status.includes("international_program_listed") ||
    status.includes("international_intake_listed") ||
    status.includes("school_pgwp_aligned")
  ) {
    label = "Current international program listing"
    tone = "neutral"
  }

  return {
    label,
    detail: details.length ? details.join(" · ") : null,
    tone,
  }
}
