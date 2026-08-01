import { VISA_CATALOG, type VisaEntry } from "@/lib/workspace/visa-catalog"
import type { FormValues } from "./home-search-config"

export type VisaRouteVerificationStatus = "verified" | "needs-review" | "not-available"

export type VisaRouteFixture = {
  id: string
  name: string
  category: string
  purpose: string
  intendedApplicant: string
  keyCondition: string
  costLabel: string
  timingLabel: string
  verificationStatus: VisaRouteVerificationStatus
  sourceLabel?: string
  sourceUrl?: string
  lastVerified?: string
}

export type VisaRequirement = {
  id: string
  label: string
  description: string
  status: "required" | "varies" | "check-official-source"
  sourceLabel?: string
  lastVerified?: string
}

export type VisaDocument = {
  id: string
  label: string
  description: string
  requirementStatus: "required" | "may-be-required" | "verify"
}

export type VisaStep = {
  id: string
  order: number
  title: string
  description: string
  phase: "current" | "next" | "later"
}

export type VisaImportantCheck = {
  id: string
  title: string
  description: string
}

export type VisaResultsFixture = {
  country: "AU"
  field: "nursing"
  status: "preparing-visa"
  title: string
  description: string
  routes: readonly VisaRouteFixture[]
  requirements: readonly VisaRequirement[]
  documents: readonly VisaDocument[]
  costAndTiming: readonly { label: string; value: string }[]
  timeline: readonly VisaStep[]
  importantChecks: readonly VisaImportantCheck[]
}

function getAustraliaCatalogRoute(name: string): VisaEntry {
  const route = VISA_CATALOG.find((entry) => entry.countryCode === "AU" && entry.name === name)
  if (!route) throw new Error(`Missing Australia visa catalog route: ${name}`)
  return route
}

const studentVisa = getAustraliaCatalogRoute("Student visa")
const temporaryGraduateVisa = getAustraliaCatalogRoute("Temporary Graduate")

function toRouteFixture(id: string, entry: VisaEntry, intendedApplicant: string): VisaRouteFixture {
  return {
    id,
    name: entry.name,
    category: `${entry.kind} route`,
    purpose: entry.note,
    intendedApplicant,
    keyCondition: "Confirm current eligibility with the issuing authority.",
    costLabel: "Check official source",
    timingLabel: "Check official source",
    verificationStatus: "needs-review",
    sourceLabel: entry.authority,
    sourceUrl: entry.url,
  }
}

/**
 * Planning-only visa fixtures. Route names and source URLs come from the
 * existing workspace visa catalogue; applicant-specific facts are withheld.
 */
export const HOME_VISA_RESULTS_FIXTURES: readonly VisaResultsFixture[] = [
  {
    country: "AU",
    field: "nursing",
    status: "preparing-visa",
    title: "Prepare your visa pathway for Australia",
    description: "Review visa routes, eligibility, documents, costs and application steps before you apply.",
    routes: [
      toRouteFixture("student-visa", studentVisa, "Applicants planning full-time study at a registered Australian institution."),
      toRouteFixture("temporary-graduate", temporaryGraduateVisa, "Applicants exploring a work pathway after finishing studies."),
    ],
    requirements: [
      { id: "relevant-route", label: "Relevant visa route", description: "The route depends on your study or work plans and circumstances.", status: "check-official-source", sourceLabel: "Home Affairs" },
      { id: "current-eligibility", label: "Current eligibility rules", description: "Eligibility requirements can change and must be checked with the issuing authority.", status: "check-official-source", sourceLabel: "Home Affairs" },
      { id: "study-evidence", label: "Study or post-study evidence", description: "The evidence needed varies by the route you are considering.", status: "varies" },
      { id: "applicant-circumstances", label: "Applicant circumstances", description: "Requirements can vary by applicant and visa route.", status: "varies" },
    ],
    documents: [
      { id: "identity", label: "Identity documents", description: "May be required — confirm the current document list.", requirementStatus: "may-be-required" },
      { id: "study-employment", label: "Study or employment evidence", description: "May be required for the route you are considering.", requirementStatus: "may-be-required" },
      { id: "financial", label: "Financial evidence", description: "Confirm whether evidence is required for your application.", requirementStatus: "verify" },
      { id: "health-insurance", label: "Health or insurance documents", description: "Requirements may vary by applicant and route.", requirementStatus: "may-be-required" },
      { id: "declarations", label: "Supporting declarations", description: "Confirm any required declarations with the issuing authority.", requirementStatus: "verify" },
      { id: "additional", label: "Additional documents requested by authorities", description: "Additional evidence may be requested during an application.", requirementStatus: "verify" },
    ],
    costAndTiming: [
      { label: "Application fee", value: "Check official source" },
      { label: "Additional applicant costs", value: "Check official source" },
      { label: "Health or insurance costs", value: "Check official source" },
      { label: "Expected processing status", value: "Check official source" },
      { label: "Recommended application timing", value: "Varies by route and applicant" },
      { label: "Last verified date", value: "Not yet verified" },
    ],
    timeline: [
      { id: "identify-route", order: 1, title: "Identify the relevant visa route", description: "Use the official route information to understand the category you need to check.", phase: "later" },
      { id: "check-eligibility", order: 2, title: "Check current eligibility rules", description: "Review the current requirements with the issuing authority.", phase: "current" },
      { id: "confirm-documents", order: 3, title: "Confirm official document requirements", description: "Confirm which documents apply to your route and circumstances.", phase: "next" },
      { id: "prepare-evidence", order: 4, title: "Prepare supporting evidence", description: "Prepare the evidence requested for the official application process.", phase: "later" },
      { id: "submit-officially", order: 5, title: "Submit through the official channel", description: "Use the current official process for the route you choose.", phase: "later" },
      { id: "respond-requests", order: 6, title: "Respond to additional requests", description: "Follow any additional requests from the issuing authority.", phase: "later" },
      { id: "review-decision", order: 7, title: "Review the decision and next obligations", description: "Review the decision and current obligations from official guidance.", phase: "later" },
    ],
    importantChecks: [
      { id: "rules-change", title: "Rules may change", description: "Recheck the current route information before you apply." },
      { id: "fees", title: "Verify fees before payment", description: "Use the official route page for current fee information." },
      { id: "documents", title: "Check document requirements", description: "Document requirements can vary by route and applicant." },
      { id: "processing", title: "Confirm official processing information", description: "Do not rely on estimated processing times from this planning view." },
      { id: "freshness", title: "Review the verification status", description: "This planning fixture has no current verification date; use the official source." },
    ],
  },
]

export function getVisaResultsFixture(query: FormValues) {
  return HOME_VISA_RESULTS_FIXTURES.find((fixture) => (
    fixture.country === query.country
    && fixture.field === query.field
    && fixture.status === query.status
  )) ?? null
}

export function toggleComparedVisaRoute(
  selectedIds: readonly string[],
  routeId: string,
  availableRouteIds: readonly string[]
) {
  if (!availableRouteIds.includes(routeId)) return [...selectedIds]
  if (selectedIds.includes(routeId)) return selectedIds.filter((id) => id !== routeId)
  if (selectedIds.length >= 3) return [...selectedIds]
  return [...selectedIds, routeId]
}

export function hasComparableVisaRoutes(selectedIds: readonly string[]) {
  return selectedIds.length >= 2
}

export function countCheckedVisaDocuments(checkedIds: readonly string[], availableDocumentIds: readonly string[]) {
  return checkedIds.filter((id) => availableDocumentIds.includes(id)).length
}

export function getApplicationPreparationValues(fixture: VisaResultsFixture): FormValues {
  return { country: fixture.country, field: fixture.field, status: "preparing-application" }
}
