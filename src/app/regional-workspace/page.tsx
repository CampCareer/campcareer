import { getAUMapData } from "@/lib/map-data"
import { getStudyConcept } from "@/data/study-concepts"
import { LANDING_GOALS } from "@/lib/discovery/landing-discovery"
import { getCountrySource } from "@/data/source-registry"
import { regionalDiscoveryFor } from "@/data/regional-discovery"
import { getJobSearchLink } from "@/data/job-search-links"
import { RegionalWorkspace } from "@/components/regional-workspace/regional-workspace"
import { STATE_NAMES } from "@/app/map/states"

export const revalidate = 86400

type WorkspaceSearchParams = Record<string, string | string[] | undefined>

const FIELD_JOB_KEYWORDS: Record<string, readonly string[]> = {
  "computer-science": ["software", "programmer", "developer", "ICT"],
  "data-analytics": ["data", "analyst", "statistician"],
  cybersecurity: ["security", "ICT"],
  nursing: ["nurs"],
  "aged-care": ["aged", "care", "support"],
  "allied-health": ["therap", "health"],
  engineering: ["engineer"],
  "civil-engineering": ["civil engineer"],
  "mechanical-engineering": ["mechanical engineer"],
  "business-analytics": ["analyst", "management"],
  accounting: ["account"],
  "early-childhood": ["early childhood", "child care"],
  carpentry: ["carpenter", "joiner"],
  plumbing: ["plumber"],
  welding: ["welder", "metal"],
  "electrical-trade": ["electrician"],
  "environmental-science": ["environment"],
  agriculture: ["farm", "agricultur"],
}

function one(value: string | string[] | undefined) {
  return typeof value === "string" ? value : ""
}

export default async function RegionalWorkspacePage({ searchParams }: { searchParams: Promise<WorkspaceSearchParams> }) {
  const query = await searchParams
  const country = one(query.country).toUpperCase() || "AU"
  const requestedState = one(query.state).toUpperCase()
  const requestedCity = one(query.city)
  const major = one(query.major) || "anything"
  const goal = one(query.goal) || "high-income"
  const region = regionalDiscoveryFor(country).find((item) => item.code === requestedState && item.city.toLowerCase() === requestedCity.toLowerCase()) ?? regionalDiscoveryFor(country)[0]

  if (country !== "AU" || !region) return <main className="mx-auto min-h-screen max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">CampCareer ROI workspace</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">This regional workspace is being prepared.</h1><p className="mt-4 text-slate-600">Australia is the first launch market for the dedicated study-to-career workspace.</p></main>

  const scope = one(query.scope) === "state" ? "state" : "city"
  const jobOrder = one(query.jobOrder) === "salary" ? "salary" : "demand"
  const csolOnly = one(query.csol) === "1"
  const data = await getAUMapData()
  const stateUniversities = data.auRankedColleges.filter((university) => university.college_state === region.code).sort((a, b) => a.qsRank - b.qsRank)
  const cityUniversities = stateUniversities.filter((university) => university.city_name.toLowerCase() === region.city.toLowerCase())
  const useCityResults = scope === "city" && cityUniversities.length > 0
  const universities = (useCityResults ? cityUniversities : stateUniversities).slice(0, 6).map((university) => ({ name: university.college_name, city: university.city_name, rank: university.qsRank, website: university.website }))
  const studyConcept = getStudyConcept(major)
  const stateCareers = data.shortageByState[region.code] ?? []
  const keywords = FIELD_JOB_KEYWORDS[major] ?? []
  const fieldCareers = keywords.length ? stateCareers.filter((occupation) => keywords.some((keyword) => occupation.occupation_en.toLowerCase().includes(keyword))) : []
  const candidateCareers = fieldCareers.length ? fieldCareers : stateCareers
  const careers = candidateCareers.filter((occupation) => !csolOnly || occupation.on_csol).sort((a, b) => jobOrder === "salary" ? (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0) : b.state_shortage_rating - a.state_shortage_rating || (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0)).slice(0, 6).map((occupation) => ({ code: occupation.anzsco_code, title: occupation.occupation_en, salary: occupation.median_salary_aud, shortage: occupation.state_shortage_rating, csol: occupation.on_csol, searchUrl: getJobSearchLink(occupation.anzsco_code.slice(0, 4))?.seek_url ?? null }))
  const goalLabel = LANDING_GOALS.find((item) => item.id === goal)?.label ?? goal
  const rentSource = getCountrySource("AU", "rent")

  return <RegionalWorkspace params={{ country, state: region.code, city: region.city, major, goal, scope, jobOrder, csolOnly }} stateName={STATE_NAMES[region.code as keyof typeof STATE_NAMES]} majorLabel={studyConcept?.label ?? "Any field"} goalLabel={goalLabel} universities={universities} universityNote={useCityResults ? `Located in ${region.city}` : `No ranked ${region.city} result is listed; showing ${STATE_NAMES[region.code as keyof typeof STATE_NAMES]} options.`} jobs={careers} jobNote={fieldCareers.length ? `Filtered to ${studyConcept?.label ?? "your selected field"} using occupation title keywords.` : "No exact reviewed field-to-occupation crosswalk is available, so state-level demand is shown."} rentSource={{ name: rentSource.sourceName, url: rentSource.sourceUrl, checkedAt: rentSource.lastChecked }} />
}
