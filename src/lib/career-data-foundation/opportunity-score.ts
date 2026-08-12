import {
  FOUNDATION_COMPONENT_MAXIMA,
  FOUNDATION_FORMULA_VERSION,
  type FoundationAvailability,
  type FoundationComponentKey,
  type FoundationDirectness,
} from "./types"

export type FoundationScoreInput = {
  componentKey: FoundationComponentKey
  normalizedValue: number | null
  availability: FoundationAvailability
  directness: FoundationDirectness
  proxyReason?: string | null
  reason?: string | null
  formulaVersion?: string
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value))

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export function scoreFoundationComponent(input: FoundationScoreInput): number | null {
  const formulaVersion = input.formulaVersion ?? FOUNDATION_FORMULA_VERSION
  if (input.availability !== "available" || input.normalizedValue == null) return null
  if (formulaVersion !== FOUNDATION_FORMULA_VERSION) return null

  switch (input.componentKey) {
    case "relative_salary":
      return round2(clamp(5 + (input.normalizedValue - 1) * 10, 0, 10))
    case "projected_growth":
      return round2(clamp(5 + input.normalizedValue / 2, 0, 10))
    case "employment_momentum":
      return round2(clamp(5 + (input.normalizedValue - 1) * 5, 0, 10))
    case "entry_accessibility":
      return round2(clamp(input.normalizedValue, 0, 15))
    default:
      return null
  }
}

export function validateFoundationScoreInput(input: FoundationScoreInput): string[] {
  const errors: string[] = []
  if (input.availability === "unavailable" && input.normalizedValue != null) {
    errors.push("unavailable components must have normalizedValue=null")
  }
  if (input.availability === "unavailable" && !input.reason?.trim()) {
    errors.push("unavailable components require a reason")
  }
  if (input.directness === "proxy" && !input.proxyReason?.trim()) {
    errors.push("proxy components require proxyReason")
  }
  return errors
}

export function calculateFoundationOpportunityScore(inputs: FoundationScoreInput[]): number | null {
  const requiredKeys = Object.keys(FOUNDATION_COMPONENT_MAXIMA) as FoundationComponentKey[]
  const byKey = new Map(inputs.map((input) => [input.componentKey, input]))
  if (byKey.size !== requiredKeys.length || requiredKeys.some((key) => !byKey.has(key))) return null

  let total = 0
  for (const key of requiredKeys) {
    const input = byKey.get(key)
    if (!input || validateFoundationScoreInput(input).length) return null
    const score = scoreFoundationComponent(input)
    if (score == null) return null
    total += score
  }
  return round2(total)
}

export function isFoundationRankable(readiness: {
  decisionReady: boolean
  scoreReady: boolean
  publishReady: boolean
  opportunityScore: number | null
}) {
  return readiness.decisionReady && readiness.scoreReady && readiness.publishReady && readiness.opportunityScore != null
}

export function chooseCareerReadModelSource(input: {
  foundationExists: boolean
  foundationDecisionReady: boolean
  legacyAvailable: boolean
}): "career_data_foundation" | "legacy_country_occupation" | "editorial_only" {
  if (input.foundationExists && input.foundationDecisionReady) return "career_data_foundation"
  if (input.foundationExists) return "editorial_only"
  if (input.legacyAvailable) return "legacy_country_occupation"
  return "editorial_only"
}
