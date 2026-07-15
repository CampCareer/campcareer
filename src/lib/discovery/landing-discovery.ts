import {
  COUNTRY_ROI_DATA_META,
  COUNTRY_ROI_INSIGHTS,
  type FieldKey,
} from "@/data/country-roi-mvp"
import { getStudyConcept } from "@/data/study-concepts"
import { getLaunchCountry } from "@/data/launch-countries"

export const LANDING_GOALS = [
  { id: "high-income", label: "High graduate salary", scoreKey: "salary" },
  { id: "low-cost", label: "Lower study cost", scoreKey: "low-cost" },
  { id: "immigration", label: "Post-study work & immigration", scoreKey: "immigration" },
] as const

export type LandingGoalId = (typeof LANDING_GOALS)[number]["id"]

export type LandingDiscoveryInput = {
  country: string
  major: string
  goal: LandingGoalId
}

export type LandingDiscoveryCountry = {
  rank: number
  code: string
  slug: string
  name: string
  selected: boolean
  score: number
  firstSalary: string
  initialBudget: string
  policy: string
  bestMajors: string[]
  why: string
  evidenceAsOf: string
}

export type LandingDiscoveryResult = {
  input: LandingDiscoveryInput
  major: { id: string; label: string; hasDedicatedSignal: boolean } | null
  goal: (typeof LANDING_GOALS)[number]
  selectedCountry: LandingDiscoveryCountry | null
  ranked: LandingDiscoveryCountry[]
  similar: LandingDiscoveryCountry[]
  note: string
  generatedAt: string
}

export function isLandingGoal(value: string): value is LandingGoalId {
  return LANDING_GOALS.some((goal) => goal.id === value)
}

/**
 * This is a country-level discovery order, not a claim that a particular
 * student will earn a particular salary or obtain a visa. Exact
 * career-country rankings continue to require the V4 evidence gate.
 */
export function buildLandingDiscovery(input: LandingDiscoveryInput): LandingDiscoveryResult {
  const goal = LANDING_GOALS.find((item) => item.id === input.goal)
  if (!goal) throw new Error("Unsupported landing goal")

  const concept = input.major === "anything" ? null : getStudyConcept(input.major)
  if (input.major !== "anything" && !concept) throw new Error("Unknown study concept")

  const preferredCode = input.country === "everywhere" ? null : getLaunchCountry(input.country)?.code ?? null
  if (input.country !== "everywhere" && !preferredCode) throw new Error("Unsupported country")

  const goalKey = goal.scoreKey
  const field = concept?.legacyField
  const ranked = COUNTRY_ROI_INSIGHTS
    .map((country) => {
      const fieldSignal = field ? country.score[field] : null
      const goalSignal = country.goalFit[goalKey]
      const score = fieldSignal === null ? goalSignal : Math.round(fieldSignal * 0.65 + goalSignal * 0.35)
      const selected = country.code === preferredCode
      return {
        rank: 0,
        code: country.code,
        slug: country.slug,
        name: country.name,
        selected,
        score,
        firstSalary: country.salaries.first,
        initialBudget: country.initialBudget,
        policy: country.policy,
        bestMajors: country.bestMajors,
        why: buildWhy({ field, goal: input.goal, countryName: country.name, bestMajors: country.bestMajors }),
        evidenceAsOf: COUNTRY_ROI_DATA_META.lastUpdated,
      }
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .map((country, index) => ({ ...country, rank: index + 1 }))

  const selectedCountry = ranked.find((country) => country.selected) ?? null
  const similar = selectedCountry
    ? ranked.filter((country) => !country.selected && Math.abs(country.score - selectedCountry.score) <= 4).slice(0, 3)
    : ranked.slice(0, 3)

  return {
    input,
    major: concept ? { id: concept.id, label: concept.label, hasDedicatedSignal: Boolean(field) } : null,
    goal,
    selectedCountry,
    ranked,
    similar,
    note: concept && !field
      ? "This is a destination-level signal for your goal. Exact outcome evidence for this specific major is still being reviewed."
      : "Directional destination signals based on reviewed country-level salary, cost, and post-study data. Verify programme and eligibility details before deciding.",
    generatedAt: new Date().toISOString(),
  }
}

function buildWhy({
  field,
  goal,
  countryName,
  bestMajors,
}: {
  field: FieldKey | undefined
  goal: LandingGoalId
  countryName: string
  bestMajors: string[]
}) {
  if (field) {
    const goalText = goal === "high-income" ? "graduate salary" : goal === "low-cost" ? "study cost" : "post-study options"
    return `${countryName} combines a strong ${field} signal with a favourable ${goalText} signal.`
  }
  if (goal === "high-income") return `${countryName} stands out for graduate earning signals; explore ${bestMajors.slice(0, 2).join(" and ")}.`
  if (goal === "low-cost") return `${countryName} has a comparatively lower reviewed entry-cost signal; explore ${bestMajors.slice(0, 2).join(" and ")}.`
  return `${countryName} has a comparatively strong post-study pathway signal; explore ${bestMajors.slice(0, 2).join(" and ")}.`
}
