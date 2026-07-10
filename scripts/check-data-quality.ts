import { CORE_DATA_CATEGORIES, SOURCE_REGISTRY, getSourceRegistryCoverageIssues } from "../src/data/source-registry"
import { scoreCountryExpansion } from "../src/lib/country-expansion-scorecard"
import { buildPolicyChangeReport } from "../src/lib/source-refresh"

const issues = getSourceRegistryCoverageIssues()

for (const source of SOURCE_REGISTRY) {
  if (!source.sourceUrl.startsWith("https://")) issues.push(`${source.country}:${source.category} does not use HTTPS`)
  if (Number.isNaN(Date.parse(source.retrievedAt)) || Number.isNaN(Date.parse(source.lastChecked))) {
    issues.push(`${source.country}:${source.category} has an invalid source date`)
  }
}

const thresholdCheck = scoreCountryExpansion("fixture", {
  koreanSearchDemand: 30,
  pathwayClarity: 20,
  officialDataAccess: 17,
  affiliateFit: 7,
  seoDifficulty: 8,
  evidenceUrls: ["https://example.com/evidence"],
})
if (!thresholdCheck.qualifies) issues.push("Country expansion threshold calculation failed")

const policyReport = buildPolicyChangeReport(
  {
    source: { country: "IE", category: "visa-pathway", sourceName: "Irish Immigration Service", sourceUrl: "https://example.com/old" },
    fetchedAt: "2026-07-01T00:00:00.000Z",
    contentHash: "old",
    summary: "Old rule",
  },
  {
    source: { country: "IE", category: "visa-pathway", sourceName: "Irish Immigration Service", sourceUrl: "https://example.com/new" },
    fetchedAt: "2026-07-09T00:00:00.000Z",
    contentHash: "new",
    summary: "New rule",
  },
)
if (policyReport?.status !== "review-required") issues.push("Policy change reports must require human review")

if (issues.length > 0) {
  console.error("[data-quality] failed")
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

const countryCount = new Set(SOURCE_REGISTRY.map((source) => source.country)).size
console.log(`[data-quality] ${SOURCE_REGISTRY.length} source records cover ${CORE_DATA_CATEGORIES.length} required categories across ${countryCount} countries.`)
