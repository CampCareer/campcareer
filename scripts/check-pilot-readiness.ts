import { PILOT_SOURCE_REGISTRY, PILOT_DATA_CATEGORIES } from "../src/data/pilot-source-registry"
import { evaluatePilotLaunch } from "../src/lib/pilot-launch-gate"
import { scoreHiddenRoiPath } from "../src/lib/hidden-roi"
import { createPilotSourceSnapshot, preparePilotOccupationImport } from "../src/lib/pilot-source-adapter"

const issues: string[] = []
for (const country of ["KR", "JP", "SG", "FR"] as const) {
  const sourceCount = PILOT_SOURCE_REGISTRY.filter((source) => source.country === country).length
  if (sourceCount !== PILOT_DATA_CATEGORIES.length) issues.push(`${country} has ${sourceCount}/${PILOT_DATA_CATEGORIES.length} pilot source categories`)
  const gate = evaluatePilotLaunch(country, PILOT_SOURCE_REGISTRY, [])
  if (gate.ready) issues.push(`${country} should not launch with zero reviewed occupations`)
}

const missingEvidence = scoreHiddenRoiPath({
  salaryScore: 90, shortageScore: 90, pathwayScore: 90, languageScore: 90, netIncomeScore: 90, stabilityScore: 90,
  salaryEvidence: null, shortageEvidence: null, pathwayEvidence: null, languageEvidence: null,
})
if (missingEvidence.eligible || missingEvidence.score !== null) issues.push("Hidden ROI paths must not score without required evidence")

const snapshot = createPilotSourceSnapshot({
  source: PILOT_SOURCE_REGISTRY[0],
  body: "official source fixture",
  retrievedAt: "2026-07-09T00:00:00.000Z",
  summary: "Fixture snapshot",
})
if (snapshot.contentHash.length !== 64) issues.push("Pilot source snapshots must use SHA-256 hashes")

const importRow = preparePilotOccupationImport({
  country: "JP",
  sourceCode: "fixture",
  iscoCode: "2512",
  nameEn: "Fixture occupation",
  nameKo: "검토 직업",
  localName: "テスト職業",
  medianSalary: 1,
  shortageScore: 1,
  salaryScore: 1,
  pathwayScore: 1,
  languageScore: 1,
  netIncomeScore: 1,
  stabilityScore: 1,
  salaryEvidence: { sourceUrl: "https://example.com/salary", lastChecked: "2026-07-09", reviewStatus: "approved" },
  shortageEvidence: { sourceUrl: "https://example.com/shortage", lastChecked: "2026-07-09", reviewStatus: "approved" },
  pathwayEvidence: { sourceUrl: "https://example.com/pathway", lastChecked: "2026-07-09", reviewStatus: "approved" },
  languageEvidence: { sourceUrl: "https://example.com/language", lastChecked: "2026-07-09", reviewStatus: "approved" },
})
if (importRow.reviewStatus !== "review-required") issues.push("Occupation imports must require human review")

const rawJapanGate = evaluatePilotLaunch("JP", PILOT_SOURCE_REGISTRY, [importRow])
if (rawJapanGate.rawOccupationCount !== 1 || rawJapanGate.occupationCount !== 0 || rawJapanGate.ready) {
  issues.push("Review-required imports must count as collected work but never as launch-ready occupations")
}

if (issues.length > 0) {
  console.error("[pilot-readiness] failed")
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log("[pilot-readiness] pilot sources complete; no unreviewed country is indexable.")
