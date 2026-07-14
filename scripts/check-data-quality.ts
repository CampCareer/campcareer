import { CORE_DATA_CATEGORIES, SOURCE_REGISTRY, getSourceRegistryCoverageIssues } from "../src/data/source-registry"
import { LAUNCH_COUNTRY_CODES } from "../src/data/launch-countries"
import { scoreCountryExpansion } from "../src/lib/country-expansion-scorecard"
import { buildPolicyChangeReport } from "../src/lib/source-refresh"

const issues = getSourceRegistryCoverageIssues()
const registryCountries = new Set(SOURCE_REGISTRY.map((source) => source.country))

for (const countryCode of LAUNCH_COUNTRY_CODES) {
  if (!registryCountries.has(countryCode)) issues.push(`${countryCode}: missing from source registry`)
}

for (const countryCode of registryCountries) {
  if (!LAUNCH_COUNTRY_CODES.includes(countryCode)) issues.push(`${countryCode}: not in launch-country registry`)
}

const japanRecords = SOURCE_REGISTRY.filter((source) => source.country === "JP")
if (japanRecords.length !== CORE_DATA_CATEGORIES.length) issues.push("JP: missing one or more core source categories")
if (japanRecords.some((source) => source.reviewStatus !== "review-required")) {
  issues.push("JP: source rows must remain review-required until the decision-data review is complete")
}

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
