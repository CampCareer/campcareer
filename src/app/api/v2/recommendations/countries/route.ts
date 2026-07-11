import { NextRequest, NextResponse } from "next/server"
import { getStudyConcept } from "@/data/study-concepts"
import { ORIGIN_PROFILES, recommendStudyCountries } from "@/lib/study-product/recommendation"
import type { RecommendationInputV2, RecommendationPriority, StudyLocale } from "@/lib/study-product/types"

export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 8_192
const PRIORITIES = new Set<RecommendationPriority>([
  "CAREER_OUTCOME",
  "LOWER_COST",
  "POST_STUDY_OPTIONS",
])

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
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
    return NextResponse.json(recommendStudyCountries(input.value), {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return NextResponse.json({ error: "Unable to calculate recommendations" }, { status: 500 })
  }
}

function parseInput(payload: unknown):
  | { ok: true; value: RecommendationInputV2 }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Body must be an object" }
  const value = payload as Record<string, unknown>
  const locale: StudyLocale = value.locale === "ko-KR" ? "ko-KR" : "en"
  const originCountry = typeof value.originCountry === "string" ? value.originCountry.toUpperCase() : ""
  const targetConceptId = typeof value.targetConceptId === "string" ? value.targetConceptId : ""
  const priority = value.priority as RecommendationPriority
  const budget = value.firstYearBudget as Record<string, unknown> | undefined

  if (!(originCountry in ORIGIN_PROFILES)) return { ok: false, error: "Unsupported origin country" }
  if (!getStudyConcept(targetConceptId)) return { ok: false, error: "Unknown study concept" }
  if (!PRIORITIES.has(priority)) return { ok: false, error: "Unsupported priority" }
  if (!budget || typeof budget.amount !== "number" || !Number.isFinite(budget.amount) || budget.amount <= 0) {
    return { ok: false, error: "Budget must be a positive number" }
  }
  const expectedCurrency = ORIGIN_PROFILES[originCountry as keyof typeof ORIGIN_PROFILES].currency
  if (budget.currency !== expectedCurrency) return { ok: false, error: "Budget currency does not match origin" }

  return {
    ok: true,
    value: {
      locale,
      originCountry,
      targetConceptId,
      firstYearBudget: { amount: Math.round(budget.amount), currency: expectedCurrency },
      priority,
    },
  }
}
