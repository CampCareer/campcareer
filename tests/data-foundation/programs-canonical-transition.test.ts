import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"
import {
  AU_NURSING_PROGRAM_MAPPINGS,
  getAuNursingProgramMapping,
  toAuNursingProgramCompareItem,
  unavailableAuNursingProgramCompareItem,
} from "@/lib/data-foundation/compare-adapters/au-nursing-programmes"
import { toCanonicalProgramCountryCode, toProductCountryDisplayName } from "@/lib/data-foundation/country-normalization"
import type { ProgramCompareSourceReference } from "@/lib/data-foundation/program-compare-contract"

const source: ProgramCompareSourceReference = {
  organisation: "Example provider",
  title: "Official programme page",
  url: "https://example.edu/programme",
  reviewedAt: "2026-07-30",
  verificationStatus: "verified",
}

test("AU nursing product IDs resolve to the fixed canonical identities", () => {
  assert.deepEqual(AU_NURSING_PROGRAM_MAPPINGS.map((mapping) => mapping.productProgramId), [
    "qut-bachelor-nursing",
    "unisc-bachelor-nursing-science",
    "unisc-graduate-entry-nursing-science",
  ])
  assert.equal(getAuNursingProgramMapping("qut-bachelor-nursing")?.canonicalProgrammeId, "bbdeafda-00c5-4786-bcc9-b3874ad19ae1")
  assert.equal(getAuNursingProgramMapping("unknown-program"), null)
})

test("country normalization keeps UK product input on GB canonical identity", () => {
  assert.equal(toCanonicalProgramCountryCode("UK"), "GB")
  assert.equal(toCanonicalProgramCountryCode("United Kingdom"), "GB")
  assert.equal(toCanonicalProgramCountryCode("GB"), "GB")
  assert.equal(toProductCountryDisplayName("GB"), "United Kingdom")
  assert.equal(toCanonicalProgramCountryCode("England"), null)
})

test("AU adapter emits a generic null-safe DTO without nursing-only fields", () => {
  const item = toAuNursingProgramCompareItem({
    productProgramId: "qut-bachelor-nursing",
    canonicalProgrammeId: "bbdeafda-00c5-4786-bcc9-b3874ad19ae1",
    canonicalOfferingId: "5752e851-fbb4-4da7-ba00-22fecef50bec",
    institutionId: "institution-1",
    institutionName: "Example University",
    institutionShortName: "Example",
    programmeName: "Bachelor of Nursing",
    qualification: "Bachelor Degree",
    campusId: "campus-1",
    campusName: "Main campus",
    cityName: "Brisbane",
    regionName: "QLD",
    durationMonths: 36,
    tuition: { amount: 43500, currency: "AUD", basis: "annual", referenceYear: 2026, reviewedAt: "2026-07-30", sources: [source] },
    entryRequirements: "Recognised equivalent",
    sources: [source],
    reviewedAt: "2026-07-30",
  })
  assert.equal(item.dataStatus, "available")
  assert.equal(item.duration.displayValue, "3 years")
  assert.equal(item.tuition.displayValue, "AUD 43,500 / annual")
  assert.equal("professionalOutcome" in item, false)
  assert.equal("accreditation" in item, false)
  assert.equal(item.sources[0]?.url, source.url)
})

test("missing canonical values remain unavailable rather than zero or fixture values", () => {
  const item = toAuNursingProgramCompareItem({
    productProgramId: "unisc-bachelor-nursing-science",
    canonicalProgrammeId: "programme",
    canonicalOfferingId: "offering",
    institutionId: null,
    institutionName: null,
    institutionShortName: null,
    programmeName: null,
    qualification: null,
    campusId: null,
    campusName: null,
    cityName: null,
    regionName: null,
    durationMonths: null,
    tuition: null,
    entryRequirements: null,
    sources: [],
    reviewedAt: null,
  })
  assert.equal(item.duration.value, null)
  assert.equal(item.tuition.value, null)
  assert.equal(item.duration.status, "unavailable")
  assert.equal(item.tuition.status, "unavailable")
  assert.ok(item.missingFields.includes("internationalTuition"))
  assert.equal(unavailableAuNursingProgramCompareItem("unknown", "invalid_product_program_id").errorCode, "invalid_product_program_id")
})

test("programs runtime imports canonical adapter instead of the Home fixture", () => {
  const page = readFileSync(join(process.cwd(), "src/app/(workspace)/compare/[mode]/page.tsx"), "utf8")
  const legacyPage = readFileSync(join(process.cwd(), "src/app/(workspace)/compare/page.tsx"), "utf8")
  const matrix = readFileSync(join(process.cwd(), "src/app/(workspace)/compare/programs-compare-matrix.tsx"), "utf8")
  assert.match(page, /AU_NURSING_PROGRAM_COMPARE_REPOSITORY/)
  assert.match(legacyPage, /permanentRedirect/)
  assert.doesNotMatch(page, /home-school-fixtures|australia-nursing/)
  assert.doesNotMatch(legacyPage, /home-school-fixtures|australia-nursing/)
  assert.doesNotMatch(matrix, /home-school-fixtures|australia-nursing/)
})
