import { getSchoolResultsFixture, type SchoolProgramFixture } from "./home-school-fixtures"
import type { FormValues } from "./home-search-config"

export type ApplicationRequirement = {
  id: string
  label: string
  description: string
  status: "required" | "varies" | "not-verified"
  sourceLabel?: string
}

export type ApplicationDocument = {
  id: string
  label: string
  description?: string
}

export type ApplicationStep = {
  id: string
  order: number
  title: string
  description: string
  phase: "current" | "next" | "later"
}

export type ApplicationResultsFixture = {
  country: "AU"
  field: "nursing"
  status: "preparing-application"
  title: string
  description: string
  requirements: readonly ApplicationRequirement[]
  documents: readonly ApplicationDocument[]
  timeline: readonly ApplicationStep[]
  programs: readonly SchoolProgramFixture[]
  careerOutcome: {
    title: string
    workSettings: string
    registration: string
    salaryStatus: string
  }
}

const reviewedNursingPrograms = getSchoolResultsFixture({
  country: "AU",
  field: "nursing",
  status: "choosing-school",
})?.programs ?? []

/**
 * Local preparation fixture based on the reviewed Nursing program records.
 * It is a planning aid, not a submission tracker or live provider search.
 */
export const HOME_APPLICATION_RESULTS_FIXTURES: readonly ApplicationResultsFixture[] = [
  {
    country: "AU",
    field: "nursing",
    status: "preparing-application",
    title: "Prepare your Nursing application for Australia",
    description: "Review entry requirements, documents, English conditions and application steps before you apply.",
    requirements: [
      { id: "academic-qualification", label: "Academic qualification", description: "Provider entry criteria vary by program.", status: "varies", sourceLabel: "Reviewed provider details" },
      { id: "english-language", label: "English language requirement", description: "English evidence is required; scores vary by program.", status: "varies", sourceLabel: "Reviewed provider details" },
      { id: "program-prerequisites", label: "Program prerequisites", description: "Check each program’s current prerequisite subjects.", status: "varies" },
      { id: "clinical-placement", label: "Clinical placement eligibility", description: "Placement requirements are confirmed by the provider.", status: "varies" },
      { id: "identity-residency", label: "Identity and residency documents", description: "Prepare the documents requested for your application.", status: "required" },
      { id: "professional-registration", label: "Professional registration pathway", description: "Study eligibility and professional registration are separate checks.", status: "not-verified" },
    ],
    documents: [
      { id: "passport", label: "Passport or identity document", description: "Use the document requested by the provider." },
      { id: "transcripts", label: "Academic transcripts", description: "Include records requested for your entry assessment." },
      { id: "graduation-certificate", label: "Graduation certificate", description: "If applicable to your education background." },
      { id: "english-test", label: "English test result", description: "Confirm the accepted test and score with each program." },
      { id: "personal-statement", label: "Personal statement", description: "Only if requested by the program." },
      { id: "resume", label: "Resume or CV", description: "Only if requested by the program." },
      { id: "supporting-documents", label: "Supporting program documents", description: "Check each program’s application page." },
    ],
    timeline: [
      { id: "choose-program", order: 1, title: "Choose your program", description: "Compare the reviewed program options and select those you intend to apply to.", phase: "next" },
      { id: "check-requirements", order: 2, title: "Check entry requirements", description: "Confirm the current requirements with each provider.", phase: "next" },
      { id: "prepare-documents", order: 3, title: "Prepare documents", description: "Gather the documents required for the programs you choose.", phase: "current" },
      { id: "submit-application", order: 4, title: "Submit application", description: "Submit through the provider’s current application process.", phase: "later" },
      { id: "review-offer", order: 5, title: "Receive and review the offer", description: "Review the offer and any conditions directly from the provider.", phase: "later" },
      { id: "prepare-visa", order: 6, title: "Prepare for the visa stage", description: "After an offer, review the visa preparation steps.", phase: "later" },
    ],
    programs: reviewedNursingPrograms,
    careerOutcome: {
      title: "Registered Nurse",
      workSettings: "Employment settings can include hospital, community and aged-care services.",
      registration: "Professional registration is required; verify current AHPRA/NMBA requirements.",
      salaryStatus: "Salary data is being prepared.",
    },
  },
]

export function getApplicationResultsFixture(query: FormValues) {
  return HOME_APPLICATION_RESULTS_FIXTURES.find((fixture) => (
    fixture.country === query.country
    && fixture.field === query.field
    && fixture.status === query.status
  )) ?? null
}

export function toggleApplicationShortlist(
  selectedIds: readonly string[],
  programId: string,
  availableProgramIds: readonly string[]
) {
  if (!availableProgramIds.includes(programId)) return [...selectedIds]
  if (selectedIds.includes(programId)) return selectedIds.filter((id) => id !== programId)
  if (selectedIds.length >= 3) return [...selectedIds]
  return [...selectedIds, programId]
}

export function countCheckedDocuments(checkedIds: readonly string[], availableDocumentIds: readonly string[]) {
  return checkedIds.filter((id) => availableDocumentIds.includes(id)).length
}

export function getSchoolComparisonValues(fixture: ApplicationResultsFixture): FormValues {
  return { country: fixture.country, field: fixture.field, status: "choosing-school" }
}

export function getVisaPreparationValues(fixture: ApplicationResultsFixture): FormValues {
  return { country: fixture.country, field: fixture.field, status: "preparing-visa" }
}
