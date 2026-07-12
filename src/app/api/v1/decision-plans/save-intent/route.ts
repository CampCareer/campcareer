import { NextRequest, NextResponse } from "next/server"
import { getStudyConcept } from "@/data/study-concepts"
import { isIsoCountryCode } from "@/lib/study-product/countries"
import { createPlanSaveIntent } from "@/lib/study-product/plan-service"
import type { RecommendationInputV3, RecommendationPriority, StudyLocale } from "@/lib/study-product/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PRIORITIES = new Set<RecommendationPriority>(["CAREER_OUTCOME", "LOWER_COST", "POST_STUDY_OPTIONS"])

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > 8_192) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const input = parseInput(body)
  if (!input) return NextResponse.json({ error: "Invalid recommendation input" }, { status: 422 })

  try {
    const intent = await createPlanSaveIntent(input)
    return NextResponse.json(intent, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[plans] save intent failed", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Unable to prepare plan save" }, { status: 500 })
  }
}

function parseInput(value: unknown): RecommendationInputV3 | null {
  if (!value || typeof value !== "object") return null
  const body = value as Record<string, unknown>
  const origin = typeof body.originCountry === "string" ? body.originCountry.toUpperCase() : undefined
  const conceptId = typeof body.targetConceptId === "string" ? body.targetConceptId : ""
  const budget = body.firstYearBudget as Record<string, unknown> | undefined
  const priority = body.priority as RecommendationPriority
  const locale: StudyLocale = body.locale === "ko-KR" ? "ko-KR" : "en"
  if (!getStudyConcept(conceptId) || !PRIORITIES.has(priority)) return null
  if (origin && !isIsoCountryCode(origin)) return null
  if (budget && (typeof budget.amount !== "number" || !Number.isFinite(budget.amount) || budget.amount <= 0 || typeof budget.currency !== "string" || !/^[A-Za-z]{3}$/.test(budget.currency))) return null
  return {
    locale,
    targetConceptId: conceptId,
    priority,
    ...(origin ? { originCountry: origin } : {}),
    ...(budget ? { firstYearBudget: { amount: Math.round(budget.amount as number), currency: String(budget.currency).toUpperCase() } } : {}),
  }
}
