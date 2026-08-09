import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import sitemap from "../src/app/sitemap"
import { AU_PROGRAMMATIC_STUDY_PAGES } from "../src/lib/programs/au-programmatic-seo"
import { INDEXABLE_AU_PROGRAMS } from "../src/lib/programs/program-routes"
import { AU_OCCUPATION_STATE_PAGES } from "../src/lib/workspace/au-occupation-state-seo"
import { INDEXABLE_OCCUPATION_PROFILES } from "../src/lib/workspace/occupation-routes"
import { getCompletedVisaCatalog } from "../src/lib/workspace/visa-catalog-complete"
import { getIndexableVisaRoutes } from "../src/lib/workspace/visa-routes"
import { INDEXABLE_INSTITUTION_PATHS } from "../src/lib/institutions/institution-seo"
import { canonicalCompareModeFromLegacyType } from "../src/lib/compare-routes"
import { SITE_URL } from "../src/lib/seo-routes.mjs"

function sitemapUrls() {
  return sitemap().map((entry) => entry.url)
}

test("final SEO publication inventories remain intentionally bounded", () => {
  assert.equal(INDEXABLE_AU_PROGRAMS.length, 53)
  assert.equal(INDEXABLE_OCCUPATION_PROFILES.length, 16)
  assert.equal(AU_PROGRAMMATIC_STUDY_PAGES.length, 42)
  assert.equal(AU_OCCUPATION_STATE_PAGES.length, 40)
  assert.equal(INDEXABLE_INSTITUTION_PATHS.length, 74)

  const visaRoutes = getIndexableVisaRoutes(getCompletedVisaCatalog())
  assert.ok(visaRoutes.length >= 100)
  assert.equal(new Set(visaRoutes.map((route) => route.path)).size, visaRoutes.length)
})

test("sitemap contains every explicit SEO inventory exactly once", () => {
  const urls = sitemapUrls()
  const urlSet = new Set(urls)
  assert.equal(urlSet.size, urls.length)

  for (const program of INDEXABLE_AU_PROGRAMS) {
    assert.ok(urls.some((url) => url.startsWith(`${SITE_URL}/programs/au/${program.id}-`)))
  }
  for (const page of AU_PROGRAMMATIC_STUDY_PAGES) assert.ok(urlSet.has(`${SITE_URL}${page.path}`))
  for (const page of AU_OCCUPATION_STATE_PAGES) assert.ok(urlSet.has(`${SITE_URL}${page.path}`))
  for (const path of INDEXABLE_INSTITUTION_PATHS) assert.ok(urlSet.has(`${SITE_URL}${path}`))

  assert.ok(urlSet.has(`${SITE_URL}/programs`))
  assert.ok(urlSet.has(`${SITE_URL}/programs?country=CA`))
  assert.ok(urlSet.has(`${SITE_URL}/institutions`))
  assert.ok(urlSet.has(`${SITE_URL}/institutions/au`))
  assert.ok(urlSet.has(`${SITE_URL}/institutions/ca`))
  assert.ok(urlSet.has(`${SITE_URL}/cities/au/sydney`))
  assert.ok(urlSet.has(`${SITE_URL}/cities/au/adelaide`))
  assert.ok(!urls.some((url) => url.includes("/compare/programs")))
  assert.ok(!urls.some((url) => url.includes("/compare/careers")))
})

test("legacy compare modes map to canonical path modes including cities", () => {
  assert.equal(canonicalCompareModeFromLegacyType(null), "programs")
  assert.equal(canonicalCompareModeFromLegacyType("program"), "programs")
  assert.equal(canonicalCompareModeFromLegacyType("country"), "countries")
  assert.equal(canonicalCompareModeFromLegacyType("city"), "cities")
  assert.equal(canonicalCompareModeFromLegacyType("career"), "careers")
  assert.equal(canonicalCompareModeFromLegacyType("unknown"), null)
})

test("route pages enforce canonical redirects and strict indexing gates", () => {
  const programs = readFileSync("src/app/(workspace)/programs/page.tsx", "utf8")
  const auProgramDetail = readFileSync("src/app/(workspace)/programs/au/[program]/page.tsx", "utf8")
  const caProgramDetail = readFileSync("src/app/(workspace)/programs/ca/[program]/page.tsx", "utf8")
  const occupation = readFileSync("src/app/(workspace)/occupation/page.tsx", "utf8")
  const visaExplorer = readFileSync("src/app/(workspace)/visas/visas-explorer.tsx", "utf8")
  const compareLegacy = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
  const compareCanonical = readFileSync("src/app/(workspace)/compare/[mode]/page.tsx", "utf8")

  assert.ok(programs.includes("queryWithoutCountry"))
  assert.ok(programs.includes("permanentRedirect"))
  assert.ok(programs.includes("searchCaPrograms"))
  assert.ok(programs.includes("CaProgramsSidebar"))
  assert.ok(auProgramDetail.includes("isIndexableAuProgramId"))
  assert.ok(auProgramDetail.includes("permanentRedirect(canonicalPath)"))
  assert.ok(caProgramDetail.includes("program.indexableDetail"))
  assert.ok(caProgramDetail.includes("permanentRedirect(canonicalPath)"))
  assert.ok(occupation.includes("getIndexableOccupationRoute"))
  assert.ok(occupation.includes("permanentRedirect(canonicalRoute.path)"))
  assert.ok(visaExplorer.includes("visaCanonicalPath"))
  assert.ok(compareLegacy.includes("permanentRedirect"))
  assert.ok(compareCanonical.includes('["programs", "countries", "cities", "careers"]'))
})

test("institutions and city fallback pages declare canonical behavior", () => {
  const institutions = readFileSync("src/app/(workspace)/institutions/page.tsx", "utf8")
  const country = readFileSync("src/app/(workspace)/institutions/[country]/page.tsx", "utf8")
  const detail = readFileSync("src/app/(workspace)/institutions/[country]/[institution]/page.tsx", "utf8")
  const cityFallback = readFileSync("src/app/(workspace)/cities/au/[city]/page.tsx", "utf8")

  assert.ok(institutions.includes('canonical: "/institutions"'))
  assert.ok(country.includes("/institutions/${countryCode.toLowerCase()}"))
  assert.ok(detail.includes("institutionDetailPath"))
  assert.ok(detail.includes("permanentRedirect(canonicalPath)"))
  assert.ok(cityFallback.includes("auCityPath"))
  assert.ok(cityFallback.includes("permanentRedirect(path)"))
})
