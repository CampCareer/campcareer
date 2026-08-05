import {
  COUNTRY_OPTIONS,
  FIELD_OPTIONS,
  getOptionLabel,
  getPathwaySearchQuery,
  NO_FIELD_STATUS,
  NOT_SURE_FIELD,
  ORIGIN_OPTIONS,
  STATUS_OPTIONS,
} from "@/app/(workspace)/home/home-search-config"
import { getSafeNextPath } from "./safe-next"

export type PathwaySummary = {
  country: string
  field: string
  status: string
}

function getPathwayStatusLabel(status: string) {
  if (status === NO_FIELD_STATUS) return "Exploring options"

  const label = getOptionLabel(STATUS_OPTIONS, status).replace(/^I’m\s+/, "")
  return label ? `${label[0].toUpperCase()}${label.slice(1)}` : ""
}

/** Returns a display-safe summary only for a validated Home result URL. */
export function getPathwaySummaryFromNext(requestedNext: string | null): PathwaySummary | null {
  const next = getSafeNextPath(requestedNext)
  const url = new URL(next, "https://campcareer.local")

  if (url.pathname !== "/home") return null

  const query = getPathwaySearchQuery(url.searchParams)
  if (!query) return null

  const destination = getOptionLabel(COUNTRY_OPTIONS, query.country)
  const origin = getOptionLabel(ORIGIN_OPTIONS, query.origin)

  return {
    country: origin ? `${origin} → ${destination}` : destination,
    field: query.field === NOT_SURE_FIELD.value ? "Field not selected" : getOptionLabel(FIELD_OPTIONS, query.field),
    status: getPathwayStatusLabel(query.status),
  }
}

/** Keeps a validated internal destination while removing the one-time save trigger. */
export function getPathwayBackPath(requestedNext: string | null) {
  const next = getSafeNextPath(requestedNext)
  const url = new URL(next, "https://campcareer.local")

  url.searchParams.delete("save")
  return `${url.pathname}${url.search}${url.hash}`
}
