import { getHomeSearchQuery, toHomeSearchQuery, type FormValues } from "./home-search-config"

export type SavedPathwayInput = Pick<FormValues, "country" | "field" | "status">
export const SAVED_PATHWAY_CONFLICT_COLUMNS = "user_id,country_code,field_slug"

export type SavedPathwayWrite = {
  user_id: string
  country_code: string
  field_slug: string
  status_slug: string
  updated_at: string
}

export function normalizeSavedPathwayInput(input: unknown): SavedPathwayInput | null {
  if (!input || typeof input !== "object") return null

  const candidate = input as Partial<SavedPathwayInput>
  if (typeof candidate.country !== "string" || typeof candidate.field !== "string" || typeof candidate.status !== "string") return null

  return getHomeSearchQuery(new URLSearchParams({
    country: candidate.country,
    field: candidate.field,
    status: candidate.status,
  }))
}

/** The unique saved-path identity is user + country + field; status is updateable progress. */
export function toSavedPathwayWrite(userId: string, pathway: SavedPathwayInput, updatedAt: string): SavedPathwayWrite {
  return {
    user_id: userId,
    country_code: pathway.country,
    field_slug: pathway.field,
    status_slug: pathway.status,
    updated_at: updatedAt,
  }
}

export function getPathwayHomePath(input: SavedPathwayInput, includeSaveRequest = false) {
  const params = toHomeSearchQuery(input)
  if (includeSaveRequest) params.set("save", "1")
  return `/home?${params.toString()}`
}

export function getPathwayLoginPath(input: SavedPathwayInput) {
  return `/login?next=${encodeURIComponent(getPathwayHomePath(input, true))}`
}
