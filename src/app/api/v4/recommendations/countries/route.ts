import { NextRequest, NextResponse } from "next/server"
import { getCanonicalCareer } from "@/data/career-comparison-catalog"
import { isIsoCountryCode } from "@/lib/study-product/countries"
import { recommendCareerCountriesV4 } from "@/lib/study-product/career-recommendation-v4"
import type { RecommendationInputV4, RecommendationPriority, StudyLocale } from "@/lib/study-product/types"

export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 8_192
const PRIORITIES = new Set<RecommendationPriority>([
  "CAREER_OUTCOME", "LOWER_COST", "POST_STUDY_OPTIONS",
])

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
    return NextResponse.json(recommendCareerCountriesV4(input.value), {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return NextResponse.json({ error: "Unable to calculate career comparison" }, { status: 500 })
  }
}

function parseInput(payload: unknown): { ok: true; value: RecommendationInputV4 } | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Body must be an object" }
  const value = payload as Record<string, unknown>
  const locale: StudyLocale = value.locale === "ko-KR" ? "ko-KR" : "en"
  const targetCareerId = typeof value.targetCareerId === "string" ? value.targetCareerId : ""
  const priority = value.priority as RecommendationPriority
  const originCountry = typeof value.originCountry === "string" ? value.originCountry.toUpperCase() : undefined
  const budget = value.firstYearBudget as Record<string, unknown> | undefined

  if (!getCanonicalCareer(targetCareerId)) return { ok: false, error: "Unknown canonical career" }
  if (!PRIORITIES.has(priority)) return { ok: false, error: "Unsupported priority" }
  if (originCountry && !isIsoCountryCode(originCountry)) return { ok: false, error: "Unsupported origin country" }
  if (budget && (
    typeof budget.amount !== "number" || !Number.isFinite(budget.amount) || budget.amount <= 0 ||
    typeof budget.currency !== "string" || !/^[A-Za-z]{3}$/.test(budget.currency)
  )) return { ok: false, error: "Budget must contain a positive amount and ISO 4217 currency" }

  return {
    ok: true,
    value: {
      locale,
      targetCareerId,
      priority,
      ...(originCountry ? { originCountry } : {}),
      ...(budget ? { firstYearBudget: { amount: Math.round(budget.amount as number), currency: String(budget.currency).toUpperCase() } } : {}),
    },
  }
}
