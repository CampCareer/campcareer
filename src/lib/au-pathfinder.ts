import { AU_CONCEPT_OCCUPATIONS } from "@/data/au-major-occupation-map"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getAllAuMajorSignals, type AuMajorSignal } from "@/lib/au-major-signals"
import type { StudyConcept } from "@/lib/study-product/types"

export type AuPathfinderGoal = "income" | "security" | "residency" | "lower-cost"
export type AuPathfinderBudget = "lower" | "balanced" | "investment"
export type AuPathfinderTimeline = "fast" | "standard" | "flexible"
export type AuPathfinderStudyStage = "school" | "degree" | "career"
export type AuPathfinderCategory = (typeof STUDY_CATEGORIES)[number]["id"]

export type AuPathfinderProfile = {
  goal: AuPathfinderGoal
  budget: AuPathfinderBudget
  timeline: AuPathfinderTimeline
  studyStage: AuPathfinderStudyStage
  category: AuPathfinderCategory | "any"
}

type Factor = "salary" | "outlook" | "shortage" | "residency" | "cost" | "duration" | "studyFit"

export type AuPathfinderReason = {
  factor: Factor
  value: number | null
}

export type RankedAuPathway = {
  concept: StudyConcept
  score: number
  reasons: AuPathfinderReason[]
  salaryMedianAud: number | null
  shortagePct: number | null
  outlook2035Pct: number | null
  prScore: number | null
  annualTuitionAud: number | null
  durationYears: number | null
  evidenceCount: number
}

type RuleWeights = Record<Factor, number>

const SIGNALS = new Map(getAllAuMajorSignals().map((signal) => [signal.concept_id, signal]))
const PATHWAYS = new Map(AU_CONCEPT_OCCUPATIONS.map((pathway) => [pathway.conceptId, pathway]))

const BASE_WEIGHTS: Record<AuPathfinderGoal, RuleWeights> = {
  income: { salary: 45, outlook: 20, shortage: 10, residency: 10, cost: 5, duration: 5, studyFit: 5 },
  security: { salary: 10, outlook: 25, shortage: 30, residency: 15, cost: 5, duration: 5, studyFit: 10 },
  residency: { salary: 5, outlook: 15, shortage: 25, residency: 30, cost: 5, duration: 10, studyFit: 10 },
  "lower-cost": { salary: 5, outlook: 10, shortage: 10, residency: 10, cost: 35, duration: 20, studyFit: 10 },
}

export const DEFAULT_AU_PATHFINDER_PROFILE: AuPathfinderProfile = {
  goal: "income",
  budget: "balanced",
  timeline: "flexible",
  studyStage: "school",
  category: "any",
}

export function isAuPathfinderGoal(value: string | undefined): value is AuPathfinderGoal {
  return value === "income" || value === "security" || value === "residency" || value === "lower-cost"
}

export function isAuPathfinderBudget(value: string | undefined): value is AuPathfinderBudget {
  return value === "lower" || value === "balanced" || value === "investment"
}

export function isAuPathfinderTimeline(value: string | undefined): value is AuPathfinderTimeline {
  return value === "fast" || value === "standard" || value === "flexible"
}

export function isAuPathfinderStudyStage(value: string | undefined): value is AuPathfinderStudyStage {
  return value === "school" || value === "degree" || value === "career"
}

export function isAuPathfinderCategory(value: string | undefined): value is AuPathfinderCategory {
  return Boolean(value && STUDY_CATEGORIES.some((category) => category.id === value))
}

export function profileFromSearchParams(input: Record<string, string | undefined>): AuPathfinderProfile {
  const landingGoal = input.goal
  const category = isAuPathfinderCategory(input.category) ? input.category : "any"
  return {
    goal: isAuPathfinderGoal(input.pathGoal)
      ? input.pathGoal
      : landingGoal === "low-cost"
        ? "lower-cost"
        : landingGoal === "immigration"
          ? "residency"
          : "income",
    budget: isAuPathfinderBudget(input.budget) ? input.budget : "balanced",
    timeline: isAuPathfinderTimeline(input.timeline) ? input.timeline : "flexible",
    studyStage: isAuPathfinderStudyStage(input.stage) ? input.stage : "school",
    category,
  }
}

export function rankAustralianPathways(profile: AuPathfinderProfile): RankedAuPathway[] {
  const candidates = STUDY_CONCEPTS
    .filter((concept) => profile.category === "any" || concept.category === profile.category)
    .map((concept) => toCandidate(concept))

  const weights = weightsFor(profile)
  const salaryValues = candidates.map((candidate) => candidate.signal?.salary_median_aud ?? null)
  const outlookValues = candidates.map((candidate) => candidate.signal?.outlook_2035_change_pct ?? null)
  const shortageValues = candidates.map((candidate) => candidate.signal?.shortage_national_pct ?? null)
  const residencyValues = candidates.map((candidate) => candidate.signal?.pr_score ?? null)
  const costValues = candidates.map((candidate) => candidate.annualTuitionAud)
  const durationValues = candidates.map((candidate) => candidate.durationYears)

  return candidates
    .map((candidate) => {
      const values: Record<Factor, number> = {
        salary: normalize(candidate.signal?.salary_median_aud ?? null, salaryValues),
        outlook: normalize(candidate.signal?.outlook_2035_change_pct ?? null, outlookValues),
        shortage: normalize(candidate.signal?.shortage_national_pct ?? null, shortageValues),
        residency: normalize(candidate.signal?.pr_score ?? null, residencyValues),
        cost: normalize(candidate.annualTuitionAud, costValues, true),
        duration: normalize(candidate.durationYears, durationValues, true),
        studyFit: studyFit(profile.studyStage, candidate.qualifications),
      }
      const score = Math.round(Object.entries(weights).reduce((total, [factor, weight]) => total + values[factor as Factor] * weight, 0))
      const signal = candidate.signal
      const reasons = topReasons({ weights, values, candidate })
      const evidenceCount = [
        signal?.salary_median_aud,
        signal?.shortage_national_pct,
        signal?.outlook_2035_change_pct,
        signal?.pr_score,
        candidate.annualTuitionAud,
        candidate.durationYears,
      ].filter((value) => value != null).length

      return {
        concept: candidate.concept,
        score,
        reasons,
        salaryMedianAud: signal?.salary_median_aud ?? null,
        shortagePct: signal?.shortage_national_pct ?? null,
        outlook2035Pct: signal?.outlook_2035_change_pct ?? null,
        prScore: signal?.pr_score ?? null,
        annualTuitionAud: candidate.annualTuitionAud,
        durationYears: candidate.durationYears,
        evidenceCount,
      }
    })
    .sort((left, right) => right.score - left.score || right.evidenceCount - left.evidenceCount || left.concept.label.localeCompare(right.concept.label))
}

export function ruleWeightSummary(profile: AuPathfinderProfile) {
  const weights = weightsFor(profile)
  return (Object.entries(weights) as Array<[Factor, number]>)
    .filter(([, weight]) => weight > 0)
    .sort(([, left], [, right]) => right - left)
}

function toCandidate(concept: StudyConcept) {
  const signal = SIGNALS.get(concept.id) ?? null
  const pathway = PATHWAYS.get(concept.id)
  return {
    concept,
    signal,
    qualifications: pathway?.qualificationTypes ?? [],
    annualTuitionAud: signal?.cost_bachelor_median_aud ?? signal?.cost_diploma_median_aud ?? null,
    durationYears: signal?.cost_duration_years ?? (pathway ? pathway.durationYears.max : null),
  }
}

function weightsFor(profile: AuPathfinderProfile): RuleWeights {
  const weights = { ...BASE_WEIGHTS[profile.goal] }
  if (profile.budget === "lower") {
    transfer(weights, "salary", "cost", 8)
    transfer(weights, "residency", "cost", 4)
  }
  if (profile.budget === "investment") transfer(weights, "cost", "salary", 5)
  if (profile.timeline === "fast") {
    transfer(weights, "outlook", "duration", 8)
    transfer(weights, "residency", "duration", 4)
  }
  return weights
}

function transfer(weights: RuleWeights, from: Factor, to: Factor, amount: number) {
  const moved = Math.min(weights[from], amount)
  weights[from] -= moved
  weights[to] += moved
}

function normalize(value: number | null, values: Array<number | null>, inverted = false) {
  if (value == null) return 0.5
  const available = values.filter((item): item is number => item != null)
  if (available.length === 0) return 0.5
  const min = Math.min(...available)
  const max = Math.max(...available)
  if (min === max) return 1
  const normalized = (value - min) / (max - min)
  return inverted ? 1 - normalized : normalized
}

function studyFit(stage: AuPathfinderStudyStage, qualifications: string[]) {
  if (qualifications.length === 0) return 0.5
  const list = qualifications.join(" ").toLowerCase()
  if (stage === "school") return /bachelor|diploma|certificate|apprenticeship/.test(list) ? 1 : 0.6
  if (stage === "degree") return /master|graduate/.test(list) ? 1 : 0.55
  return /graduate|certificate|diploma/.test(list) ? 1 : 0.65
}

function topReasons({
  weights,
  values,
  candidate,
}: {
  weights: RuleWeights
  values: Record<Factor, number>
  candidate: ReturnType<typeof toCandidate>
}): AuPathfinderReason[] {
  const signal = candidate.signal
  const possible: AuPathfinderReason[] = [
    { factor: "salary", value: signal?.salary_median_aud ?? null },
    { factor: "outlook", value: signal?.outlook_2035_change_pct ?? null },
    { factor: "shortage", value: signal?.shortage_national_pct ?? null },
    { factor: "residency", value: signal?.pr_score ?? null },
    { factor: "cost", value: candidate.annualTuitionAud },
    { factor: "duration", value: candidate.durationYears },
    { factor: "studyFit", value: values.studyFit === 1 ? 1 : null },
  ]

  return possible
    .filter((reason) => reason.value != null)
    .sort((left, right) => (values[right.factor] * weights[right.factor]) - (values[left.factor] * weights[left.factor]))
    .slice(0, 3)
}

export function signalForConcept(conceptId: string): AuMajorSignal | null {
  return SIGNALS.get(conceptId) ?? null
}
