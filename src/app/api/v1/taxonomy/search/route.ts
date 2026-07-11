import { NextRequest, NextResponse } from "next/server"
import {
  getLocalizedConceptLabel,
  normalizeTaxonomyQuery,
  STUDY_CONCEPTS,
} from "@/data/study-concepts"
import { getMapOccupations, isMapCountry, MAP_COUNTRIES } from "@/lib/map-slugs"
import type { TaxonomySearchResult } from "@/lib/study-product/types"

export const dynamic = "force-dynamic"

const MAX_QUERY_LENGTH = 80
const MAX_RESULTS = 20

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("q") ?? ""
  const locale = request.nextUrl.searchParams.get("locale") === "ko-KR" ? "ko-KR" : "en"
  const destination = (request.nextUrl.searchParams.get("destination") ?? "").toLowerCase()

  if (rawQuery.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "Query is too long" }, { status: 400 })
  }
  if (destination && !isMapCountry(destination)) {
    return NextResponse.json({ error: "Unsupported destination" }, { status: 400 })
  }

  const query = normalizeTaxonomyQuery(rawQuery)
  const curated = searchCurated(query, locale)
  let results = curated.slice(0, MAX_RESULTS)

  if (query.length >= 2 && results.length < 8) {
    const occupationResults = await searchOccupations(query, locale, destination)
    results = [...results, ...occupationResults]
      .filter((item, index, all) => all.findIndex((candidate) => candidate.conceptId === item.conceptId) === index)
      .slice(0, MAX_RESULTS)
  }

  return NextResponse.json(
    { results, queryMatched: results.length > 0 },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    },
  )
}

function searchCurated(query: string, locale: "en" | "ko-KR"): TaxonomySearchResult[] {
  return STUDY_CONCEPTS
    .map((concept) => {
      const label = getLocalizedConceptLabel(concept, locale)
      const labels = locale === "ko-KR"
        ? [concept.labelKo, concept.label, ...concept.aliasesKo, ...concept.aliases]
        : [concept.label, ...concept.aliases, concept.labelKo, ...concept.aliasesKo]
      const normalizedLabels = labels.map((value) => ({ value, normalized: normalizeTaxonomyQuery(value) }))
      const best = query
        ? normalizedLabels
            .map((value) => ({ ...value, score: matchScore(value.normalized, query) }))
            .sort((a, b) => b.score - a.score)[0]
        : { value: label, normalized: normalizeTaxonomyQuery(label), score: 1 }
      return { concept, label, best }
    })
    .filter(({ best }) => best.score > 0)
    .sort((a, b) => b.best.score - a.best.score || a.label.localeCompare(b.label))
    .map(({ concept, label, best }) => ({
      conceptId: concept.id,
      slug: concept.slug,
      kind: concept.kind,
      label,
      secondaryLabel: concept.description,
      ...(normalizeTaxonomyQuery(best.value) !== normalizeTaxonomyQuery(label) && { matchedAlias: best.value }),
      officialCodes: concept.officialCodes ?? [],
      coverageByCountry: concept.coverageByCountry,
      recommendable: Boolean(concept.legacyField),
    }))
}

async function searchOccupations(
  query: string,
  locale: "en" | "ko-KR",
  destination: string,
): Promise<TaxonomySearchResult[]> {
  const countries = destination ? [destination] : [...MAP_COUNTRIES]
  const rows = await Promise.all(
    countries.map(async (country) => {
      if (!isMapCountry(country)) return []
      try {
        return await getMapOccupations(country)
      } catch {
        return []
      }
    }),
  )

  return rows
    .flat()
    .map((occupation) => {
      const names = [occupation.name, occupation.localName ?? "", occupation.code]
      const score = Math.max(...names.map((name) => matchScore(normalizeTaxonomyQuery(name), query)))
      return { occupation, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.occupation.name.localeCompare(b.occupation.name))
    .slice(0, 12)
    .map(({ occupation }) => ({
      conceptId: `occupation:${occupation.country}:${occupation.code}`,
      slug: occupation.slug,
      kind: "TRADE_PATHWAY" as const,
      label: locale === "ko-KR" && occupation.localName ? occupation.localName : occupation.name,
      secondaryLabel: `${occupation.countryName} · ${occupation.codeLabel} ${occupation.code}`,
      ...(occupation.localName && locale !== "ko-KR" ? { matchedAlias: occupation.localName } : {}),
      officialCodes: [{
        country: occupation.country.toUpperCase(),
        system: occupation.codeLabel,
        version: occupation.dataSource.lastChecked,
        code: occupation.code,
      }],
      coverageByCountry: { [occupation.country.toUpperCase()]: "PROFILE_READY" },
      recommendable: false,
      exploreHref: occupation.path,
    }))
}

function matchScore(value: string, query: string) {
  if (!query) return 1
  if (value === query) return 100
  if (value.startsWith(query)) return 80
  if (value.split(" ").some((token) => token.startsWith(query))) return 65
  if (value.includes(query)) return 45
  return 0
}
