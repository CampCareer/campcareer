import { NextRequest, NextResponse } from "next/server"
import { getStudyConcept } from "@/data/study-concepts"
import { isIsoCountryCode } from "@/lib/study-product/countries"
import { attachOriginComparisons } from "@/lib/study-product/origin-comparison"
import { recommendStudyCountries } from "@/lib/study-product/recommendation"
import type { RecommendationInputV3, RecommendationPriority, StudyLocale } from "@/lib/study-product/types"

export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 8_192
const PRIORITIES = new Set<RecommendationPriority>(["CAREER_OUTCOME", "LOWER_COST", "POST_STUDY_OPTIONS"])

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const input = parseInput(payload)
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 422 })

  try {
    const result = recommendStudyCountries(input.value)
    const rankedCountries = await attachOriginComparisons({
      conceptId: input.value.targetConceptId,
      originCountry: input.value.originCountry,
      countries: result.rankedCountries,
    })
    return NextResponse.json({ ...result, rankedCountries }, {
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    })
  } catch {
    return NextResponse.json({ error: "Unable to calculate recommendations" }, { status: 500 })
  }
}

function parseInput(payload: unknown): { ok: true; value: RecommendationInputV3 } | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Body must be an object" }
  const value = payload as Record<string, unknown>
  const locale: StudyLocale = value.locale === "ko-KR" ? "ko-KR" : "en"
  const targetConceptId = typeof value.targetConceptId === "string" ? value.targetConceptId : ""
  const priority = value.priority as RecommendationPriority
  const originCountry = typeof value.originCountry === "string" ? value.originCountry.toUpperCase() : undefined
  const budget = value.firstYearBudget as Record<string, unknown> | undefined

  if (!getStudyConcept(targetConceptId)) return { ok: false, error: "Unknown study concept" }
  if (!PRIORITIES.has(priority)) return { ok: false, error: "Unsupported priority" }
  if (originCountry && !isIsoCountryCode(originCountry)) return { ok: false, error: "Unsupported origin country" }

  if (budget) {
    if (typeof budget.amount !== "number" || !Number.isFinite(budget.amount) || budget.amount <= 0) {
      return { ok: false, error: "Budget must be a positive number" }
    }
    if (typeof budget.currency !== "string" || !/^[A-Za-z]{3}$/.test(budget.currency)) {
      return { ok: false, error: "Budget currency must be an ISO 4217 code" }
    }
  }

  return {
    ok: true,
    value: {
      locale,
      targetConceptId,
      priority,
      ...(originCountry ? { originCountry } : {}),
      ...(budget ? { firstYearBudget: { amount: Math.round(budget.amount as number), currency: String(budget.currency).toUpperCase() } } : {}),
    },
  }
}
