import {
  AU_CAREER_COMPARISON_BY_ID,
  AU_CAREER_COMPARISON_CATALOG,
  CAREER_COMPARE_COUNTRY,
  CAREER_COMPARE_MAX_CAREERS,
  CAREER_COMPARE_PROFILE,
  getAustraliaCareerCity,
  buildCareerLocationContext,
  type AustraliaCareerComparison,
  type CareerCompareId,
  type CareerLocationContext,
} from "@/data/career-comparison/australia"

export const CAREER_COMPARE_TYPE = "career" as const

export type CareerComparisonSearchParams = Pick<URLSearchParams, "get">
export type CareerComparisonContextState = "supported" | "unsupported"

export type CareerComparisonState = {
  type: typeof CAREER_COMPARE_TYPE
  contextState: CareerComparisonContextState
  countryCode: typeof CAREER_COMPARE_COUNTRY | null
  profile: typeof CAREER_COMPARE_PROFILE | null
  citySlug: string | null
  location: CareerLocationContext
  careerIds: readonly CareerCompareId[]
  careers: readonly AustraliaCareerComparison[]
}

export function normalizeCareerIds(raw: string | readonly string[] | null): CareerCompareId[] {
  const values = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : []
  const selected: CareerCompareId[] = []
  for (const value of values) {
    const id = value.trim() as CareerCompareId
    if (!id || selected.includes(id) || !AU_CAREER_COMPARISON_BY_ID.has(id)) continue
    selected.push(id)
    if (selected.length >= CAREER_COMPARE_MAX_CAREERS) break
  }
  return selected
}

export function appendCareer(careerIds: readonly CareerCompareId[], careerId: string) {
  return normalizeCareerIds([...careerIds, careerId])
}

export function replaceCareerAtIndex(careerIds: readonly CareerCompareId[], index: number, careerId: string) {
  if (index < 0 || index >= careerIds.length || !AU_CAREER_COMPARISON_BY_ID.has(careerId as CareerCompareId)) {
    return normalizeCareerIds(careerIds)
  }
  if (careerIds.some((id, currentIndex) => currentIndex !== index && id === careerId)) return normalizeCareerIds(careerIds)
  const next = [...careerIds]
  next[index] = careerId as CareerCompareId
  return normalizeCareerIds(next)
}

export function removeCareerAtIndex(careerIds: readonly CareerCompareId[], index: number) {
  if (index < 0 || index >= careerIds.length) return normalizeCareerIds(careerIds)
  return normalizeCareerIds(careerIds.filter((_, currentIndex) => currentIndex !== index))
}

export function getCareerCompareOptions(selectedIds: readonly CareerCompareId[], currentId?: CareerCompareId) {
  return AU_CAREER_COMPARISON_CATALOG.map((career) => ({
    id: career.id,
    label: career.label,
    disabled: career.id !== currentId && selectedIds.includes(career.id),
  }))
}

export function getCareerSelectionStatusMessage(selectedCount: number) {
  if (selectedCount === 0) return "Select two careers to start comparing."
  if (selectedCount === 1) return "Select one more career to compare."
  return `${Math.min(selectedCount, CAREER_COMPARE_MAX_CAREERS)} careers`
}

export function normalizeCareerCity(rawCity: string | null) {
  const city = getAustraliaCareerCity(rawCity?.trim().toLowerCase() ?? null)
  return city?.citySlug ?? null
}

export function parseCareerComparisonState(searchParams: CareerComparisonSearchParams): CareerComparisonState {
  const country = searchParams.get("country")?.trim().toUpperCase() ?? null
  const profile = searchParams.get("profile")?.trim() ?? null
  const contextState: CareerComparisonContextState = country === CAREER_COMPARE_COUNTRY && profile === CAREER_COMPARE_PROFILE
    ? "supported"
    : "unsupported"
  const citySlug = contextState === "supported" ? normalizeCareerCity(searchParams.get("city")) : null
  const careerIds = contextState === "supported" ? normalizeCareerIds(searchParams.get("careers")) : []

  return {
    type: CAREER_COMPARE_TYPE,
    contextState,
    countryCode: contextState === "supported" ? CAREER_COMPARE_COUNTRY : null,
    profile: contextState === "supported" ? CAREER_COMPARE_PROFILE : null,
    citySlug,
    location: buildCareerLocationContext(citySlug),
    careerIds,
    careers: careerIds.map((id) => AU_CAREER_COMPARISON_BY_ID.get(id)).filter((career): career is AustraliaCareerComparison => Boolean(career)),
  }
}

export function buildCareerCompareHref(
  citySlug: string | null = null,
  careerIds: readonly CareerCompareId[] = [],
) {
  const city = normalizeCareerCity(citySlug)
  const ids = normalizeCareerIds(careerIds)
  const base = `/compare?type=${CAREER_COMPARE_TYPE}&country=${CAREER_COMPARE_COUNTRY}${city ? `&city=${city}` : ""}&profile=${CAREER_COMPARE_PROFILE}`
  return ids.length ? `${base}&careers=${ids.join(",")}` : base
}

export function getCareerCompareLocationLabel(citySlug: string | null) {
  return buildCareerLocationContext(normalizeCareerCity(citySlug)).displayLabel
}

export function getCareerById(id: string) {
  return AU_CAREER_COMPARISON_BY_ID.get(id as CareerCompareId) ?? null
}
