import {
  CITIZENSHIP_OPTIONS,
  getHomeSearchQuery,
  hasOption,
  toHomeSearchQuery,
  type FormValues,
} from "./home-search-config"

export type SavedPathwayInput = FormValues & { origin?: string }
export const SAVED_PATHWAY_CONFLICT_COLUMNS = "user_id,origin_country_code,country_code,field_slug"

export type SavedPathwayWrite = {
  user_id: string
  origin_country_code: string | null
  country_code: string
  field_slug: string
  status_slug: string
  updated_at: string
}

export function normalizeSavedPathwayInput(input: unknown): SavedPathwayInput | null {
  if (!input || typeof input !== "object") return null

  const candidate = input as Partial<SavedPathwayInput>
  if (typeof candidate.country !== "string" || typeof candidate.field !== "string" || typeof candidate.status !== "string") return null

  const core = getHomeSearchQuery(new URLSearchParams({
    country: candidate.country,
    field: candidate.field,
    status: candidate.status,
  }))
  if (!core) return null

  // Undefined is accepted only for legacy records and tests. An explicit blank
  // origin comes from an old result URL and must be completed before a new save.
  if (candidate.origin === undefined) return core
  if (typeof candidate.origin !== "string" || candidate.origin === "") return null

  const origin = candidate.origin.toUpperCase()
  if (!hasOption(CITIZENSHIP_OPTIONS, origin)) return null
  return { origin, ...core }
}

/** The saved-path identity is user + origin + destination + field; status is updateable progress. */
export function toSavedPathwayWrite(userId: string, pathway: SavedPathwayInput, updatedAt: string): SavedPathwayWrite {
  return {
    user_id: userId,
    origin_country_code: pathway.origin || null,
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
