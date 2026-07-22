import { getAllAuMajorSignals } from "../src/lib/au-major-signals"
import { assessFieldReportReadiness, hasFieldResearchCoverage, type EvidenceSource } from "../src/lib/au-report-readiness"

const strict = process.argv.includes("--strict")
const signals = getAllAuMajorSignals()
const researchReady = signals.filter(hasFieldResearchCoverage)
const missingTuition = signals.filter((signal) => signal.cost_bachelor_median_aud == null && signal.cost_diploma_median_aud == null)
const missingSalary = signals.filter((signal) => signal.salary_median_aud == null)

function evidenceFor(signal: (typeof signals)[number], match: RegExp): EvidenceSource | null {
  const source = signal.data_sources?.find((item) => match.test(item.name))
  if (!source) return null
  return {
    sourceName: source.name,
    sourceUrl: source.url,
    dataAsOf: source.dataAsOf ?? null,
    lastVerified: source.lastVerified ?? null,
    confidence: source.confidence ?? "low",
    kind: source.kind ?? "estimated",
  }
}

const fieldAssessments = signals.map((signal) => ({
  signal,
  assessment: assessFieldReportReadiness({
    signal,
    sources: {
      tuition: evidenceFor(signal, /CRICOS|tuition/i),
      salary: evidenceFor(signal, /ABS|salary|earnings/i),
      labourMarket: evidenceFor(signal, /Jobs and Skills|JSA|shortage|projection/i),
    },
  }),
}))
const sellable = fieldAssessments.filter(({ assessment }) => assessment.status === "ready")

console.log(`Australia field signals: ${signals.length}`)
console.log(`Discovery-ready field candidates: ${researchReady.length}`)
console.log(`Missing bachelor/diploma tuition: ${missingTuition.length}`)
console.log(`Missing median salary: ${missingSalary.length}`)
console.log(`Commercially sellable field reports: ${sellable.length}`)
if (sellable.length === 0) {
  console.log("Reason: the static aggregate snapshot does not yet carry data-as-of and reviewer dates for each tuition, salary, and labour-market input.")
}

if (researchReady.length > 0) {
  console.log(`Candidate field IDs: ${researchReady.map((signal) => signal.concept_id).join(", ")}`)
}
if (missingTuition.length > 0) {
  console.log(`Tuition backlog: ${missingTuition.map((signal) => signal.concept_id).join(", ")}`)
}
if (missingSalary.length > 0) {
  console.log(`Salary backlog: ${missingSalary.map((signal) => signal.concept_id).join(", ")}`)
}

if (strict) {
  console.error("Commercial release gate is intentionally closed until per-metric evidence records are supplied.")
  process.exitCode = 1
}
