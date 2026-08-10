import {
  CITIZENSHIP_OPTIONS,
  COUNTRY_OPTIONS,
  getHomeFieldLabel,
  getHomeSearchQuery,
  getOptionLabel,
  hasOption,
  NO_FIELD_STATUS,
  NOT_SURE_FIELD,
  STATUS_OPTIONS,
  toHomeSearchQuery,
  type PathwaySearchValues,
  type SearchParamsLike,
} from "./home-search-config"
import { getOverviewSearchQuery } from "./home-overview-config"

export type HomeMode = "result" | "dashboard" | "explore"

export type SavedPathwayRecord = {
  id: number
  origin_country_code?: string | null
  country_code: string
  field_slug: string
  status_slug: string
  updated_at: string
}

export type DashboardPathway = {
  id: number
  values: PathwaySearchValues
  originLabel: string
  countryLabel: string
  fieldLabel: string
  statusLabel: string
  routeLabel: string
  updatedAt: string
  href: string
  isComplete: boolean
}

export type PathwayStage = {
  id: string
  label: string
}

type PathwayAction = { label: string; anchor: string }

export type StatusActionConfig = {
  primaryLabel: string
  primaryAnchor: string
  actions: readonly PathwayAction[]
}

export const STATUS_ACTIONS: Record<string, StatusActionConfig> = {
  [NO_FIELD_STATUS]: {
    primaryLabel: "Continue exploring fields",
    primaryAnchor: "#fields-to-explore",
    actions: [
      { label: "Explore fields", anchor: "#fields-to-explore" },
      { label: "Compare field options", anchor: "#field-comparison" },
      { label: "Choose a field", anchor: "#choose-field" },
    ],
  },
  "choosing-school": {
    primaryLabel: "Compare programs",
    primaryAnchor: "#programs",
    actions: [
      { label: "Compare programs", anchor: "#programs" },
      { label: "Review tuition and duration", anchor: "#program-comparison" },
      { label: "Check entry requirements", anchor: "#requirements" },
    ],
  },
  "preparing-application": {
    primaryLabel: "Continue application preparation",
    primaryAnchor: "#entry-requirements",
    actions: [
      { label: "Review entry requirements", anchor: "#entry-requirements" },
      { label: "Complete the document checklist", anchor: "#document-checklist" },
      { label: "Shortlist programs", anchor: "#programs" },
    ],
  },
  "already-qualified": {
    primaryLabel: "Check qualification recognition",
    primaryAnchor: "#key-requirements",
    actions: [
      { label: "Review recognition requirements", anchor: "#key-requirements" },
      { label: "Check the main risks", anchor: "#main-risks" },
      { label: "Verify official sources", anchor: "#official-sources" },
    ],
  },
  "looking-for-job": {
    primaryLabel: "Review employment route",
    primaryAnchor: "#key-requirements",
    actions: [
      { label: "Confirm work eligibility", anchor: "#key-requirements" },
      { label: "Review sponsorship risks", anchor: "#main-risks" },
      { label: "Verify official sources", anchor: "#official-sources" },
    ],
  },
  "preparing-visa": {
    primaryLabel: "Continue visa preparation",
    primaryAnchor: "#visa-pathways",
    actions: [
      { label: "Compare visa routes", anchor: "#visa-pathways" },
      { label: "Verify current eligibility", anchor: "#eligibility" },
      { label: "Complete the visa checklist", anchor: "#visa-checklist" },
    ],
  },
}

const FIELD_EXPLORATION_STAGES: readonly PathwayStage[] = [
  { id: "goal", label: "Define your destination" },
  { id: "field", label: "Compare fields" },
  { id: "routes", label: "Review realistic routes" },
  { id: "decision", label: "Choose a direction" },
]

const STUDY_ROUTE_STAGES: readonly PathwayStage[] = [
  { id: "eligibility", label: "Check eligibility" },
  { id: "program", label: "Compare programs" },
  { id: "application", label: "Prepare application" },
  { id: "visa", label: "Prepare visa" },
  { id: "study", label: "Complete the program" },
  { id: "career", label: "Enter the target career" },
]

const QUALIFICATION_ROUTE_STAGES: readonly PathwayStage[] = [
  { id: "qualification", label: "Confirm your qualification" },
  { id: "recognition", label: "Check recognition" },
  { id: "registration", label: "Complete registration or licensing" },
  { id: "employment", label: "Find suitable employers" },
  { id: "work-route", label: "Confirm the work route" },
]

const EMPLOYMENT_ROUTE_STAGES: readonly PathwayStage[] = [
  { id: "eligibility", label: "Confirm work eligibility" },
  { id: "employers", label: "Target suitable employers" },
  { id: "applications", label: "Apply for roles" },
  { id: "sponsorship", label: "Secure sponsorship if required" },
  { id: "visa", label: "Prepare the work visa" },
]

export function getPathwayStages(status: string): readonly PathwayStage[] {
  if (status === NO_FIELD_STATUS) return FIELD_EXPLORATION_STAGES
  if (status === "already-qualified") return QUALIFICATION_ROUTE_STAGES
  if (status === "looking-for-job") return EMPLOYMENT_ROUTE_STAGES
  return STUDY_ROUTE_STAGES
}

export function getStageIndex(status: string) {
  if (status === NO_FIELD_STATUS) return 1
  if (status === "choosing-school") return 1
  if (status === "preparing-application") return 2
  if (status === "preparing-visa") return 3
  if (status === "already-qualified") return 1
  if (status === "looking-for-job") return 2
  return 0
}

export function getPathwayRouteLabel(values: Pick<PathwaySearchValues, "field" | "status">) {
  const fieldLabel = values.field === NOT_SURE_FIELD.value
    ? "Career direction"
    : getHomeFieldLabel(values.field) || "Target career"

  if (values.status === NO_FIELD_STATUS) return "Compare fields → review realistic routes → choose a direction"
  if (values.status === "already-qualified") return `${fieldLabel} qualification → recognition → registration → employment`
  if (values.status === "looking-for-job") return `${fieldLabel} eligibility → employer search → sponsorship or work visa`
  return `${fieldLabel} program → application → visa → career entry`
}

export function getHomeMode(searchParams: SearchParamsLike, isAuthenticated: boolean): HomeMode {
  if (getOverviewSearchQuery(searchParams) || getHomeSearchQuery(searchParams)) return "result"
  if (isAuthenticated && searchParams.get("mode") === "explore") return "explore"
  return isAuthenticated ? "dashboard" : "explore"
}

export function toDashboardPathway(record: SavedPathwayRecord): DashboardPathway | null {
  const core = getHomeSearchQuery(new URLSearchParams({
    country: record.country_code,
    field: record.field_slug,
    status: record.status_slug,
  }))
  if (!core) return null

  const origin = record.origin_country_code?.toUpperCase() ?? ""
  const isComplete = hasOption(CITIZENSHIP_OPTIONS, origin)
  const values: PathwaySearchValues = {
    origin: isComplete ? origin : "",
    ...core,
  }
  const statusText = getOptionLabel(STATUS_OPTIONS, values.status).replace(/^I’m\s+/, "")
  const prefill = new URLSearchParams({
    mode: "explore",
    country: values.country,
    field: values.field,
    status: values.status,
  })

  return {
    id: record.id,
    values,
    originLabel: isComplete ? getOptionLabel(CITIZENSHIP_OPTIONS, values.origin) : "Citizenship not set",
    countryLabel: getOptionLabel(COUNTRY_OPTIONS, values.country),
    fieldLabel: values.field === NOT_SURE_FIELD.value ? "Field not selected" : getHomeFieldLabel(values.field),
    statusLabel: values.status === NO_FIELD_STATUS ? "Exploring options" : `${statusText.charAt(0).toUpperCase()}${statusText.slice(1)}`,
    routeLabel: getPathwayRouteLabel(values),
    updatedAt: record.updated_at,
    href: isComplete ? `/home?${toHomeSearchQuery(values).toString()}` : `/home?${prefill.toString()}`,
    isComplete,
  }
}

/** Converts server-fetched saved pathways into safe, newest-first Dashboard data. */
export function toDashboardPathways(records: readonly SavedPathwayRecord[]) {
  return records
    .map(toDashboardPathway)
    .filter((pathway): pathway is DashboardPathway => pathway !== null)
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
}

export function formatPathwayDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date)
}
