import {
  COUNTRY_OPTIONS,
  FIELD_OPTIONS,
  getHomeSearchQuery,
  getOptionLabel,
  NO_FIELD_STATUS,
  NOT_SURE_FIELD,
  STATUS_OPTIONS,
  toHomeSearchQuery,
  type FormValues,
  type SearchParamsLike,
} from "./home-search-config"

export type HomeMode = "result" | "dashboard" | "explore"

export type SavedPathwayRecord = {
  id: number
  country_code: string
  field_slug: string
  status_slug: string
  updated_at: string
}

export type DashboardPathway = {
  id: number
  values: FormValues
  countryLabel: string
  fieldLabel: string
  statusLabel: string
  updatedAt: string
  href: string
}

export const PATHWAY_STAGES = [
  { status: NO_FIELD_STATUS, label: "Choose a field" },
  { status: "choosing-school", label: "Choose a school" },
  { status: "preparing-application", label: "Prepare application" },
  { status: "preparing-visa", label: "Prepare visa" },
] as const

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

export function getHomeMode(searchParams: SearchParamsLike, isAuthenticated: boolean): HomeMode {
  if (getHomeSearchQuery(searchParams)) return "result"
  if (isAuthenticated && searchParams.get("mode") === "explore") return "explore"
  return isAuthenticated ? "dashboard" : "explore"
}

export function toDashboardPathway(record: SavedPathwayRecord): DashboardPathway | null {
  const values = getHomeSearchQuery(new URLSearchParams({
    country: record.country_code,
    field: record.field_slug,
    status: record.status_slug,
  }))
  if (!values) return null

  const statusText = getOptionLabel(STATUS_OPTIONS, values.status).replace(/^I’m\s+/, "")

  return {
    id: record.id,
    values,
    countryLabel: getOptionLabel(COUNTRY_OPTIONS, values.country),
    fieldLabel: values.field === NOT_SURE_FIELD.value ? "Field not selected" : getOptionLabel(FIELD_OPTIONS, values.field),
    statusLabel: values.status === NO_FIELD_STATUS ? "Exploring fields" : `${statusText.charAt(0).toUpperCase()}${statusText.slice(1)}`,
    updatedAt: record.updated_at,
    href: `/home?${toHomeSearchQuery(values).toString()}`,
  }
}

/** Converts server-fetched saved pathways into safe, newest-first Dashboard data. */
export function toDashboardPathways(records: readonly SavedPathwayRecord[]) {
  return records
    .map(toDashboardPathway)
    .filter((pathway): pathway is DashboardPathway => pathway !== null)
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
}

export function getStageIndex(status: string) {
  return PATHWAY_STAGES.findIndex((stage) => stage.status === status)
}

export function formatPathwayDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date)
}
