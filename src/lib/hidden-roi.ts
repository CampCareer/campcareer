export type RoiEvidence = {
  sourceUrl: string
  lastChecked: string
  reviewStatus: "approved" | "review-required"
}

export type ImmigrationViableRoiInput = {
  salaryScore: number | null
  shortageScore: number | null
  pathwayScore: number | null
  languageScore: number | null
  netIncomeScore: number | null
  stabilityScore: number | null
  salaryEvidence: RoiEvidence | null
  shortageEvidence: RoiEvidence | null
  pathwayEvidence: RoiEvidence | null
  languageEvidence: RoiEvidence | null
}

export type HiddenRoiResult = {
  score: number | null
  eligible: boolean
  missing: string[]
  warnings: string[]
}

const WEIGHTS = {
  salaryScore: 25,
  shortageScore: 25,
  pathwayScore: 20,
  languageScore: 10,
  netIncomeScore: 10,
  stabilityScore: 10,
} as const

function normalized(value: number | null) {
  return value !== null && value >= 0 && value <= 100 ? value : null
}

export function scoreHiddenRoiPath(input: ImmigrationViableRoiInput): HiddenRoiResult {
  const required = [
    ["salary", input.salaryScore, input.salaryEvidence],
    ["shortage", input.shortageScore, input.shortageEvidence],
    ["foreign-worker pathway", input.pathwayScore, input.pathwayEvidence],
    ["local-language requirement", input.languageScore, input.languageEvidence],
  ] as const
  const missing = required
    .filter(([, score, evidence]) => normalized(score) === null || !evidence?.sourceUrl)
    .map(([label]) => label)

  if (missing.length > 0) return { score: null, eligible: false, missing, warnings: [] }

  const values = Object.entries(WEIGHTS).map(([key, weight]) => ({
    key: key as keyof typeof WEIGHTS,
    weight,
    value: normalized(input[key as keyof typeof WEIGHTS]),
  }))
  const weightedTotal = values.reduce((total, item) => total + ((item.value ?? 0) * item.weight) / 100, 0)
  const warnings = [input.pathwayEvidence, input.languageEvidence]
    .filter((evidence) => evidence?.reviewStatus === "review-required")
    .map(() => "Policy or language evidence needs human review before an application decision.")

  return {
    score: Math.round(weightedTotal),
    eligible: warnings.length === 0 && weightedTotal >= 75,
    missing: [],
    warnings,
  }
}
