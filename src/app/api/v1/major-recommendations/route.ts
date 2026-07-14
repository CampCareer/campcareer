import { NextRequest, NextResponse } from "next/server"
import { BUDGET_BANDS, buildMajorRecommendations, SEARCH_GOALS } from "@/lib/discovery/search-contract"

export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country")?.toUpperCase() ?? ""
  const goal = SEARCH_GOALS.find((item) => item.id === request.nextUrl.searchParams.get("goal"))
  const budgetValue = request.nextUrl.searchParams.get("budget")
  const budget = BUDGET_BANDS.find((item) => item.id === budgetValue)?.id
  if (!goal) return NextResponse.json({ error: "A supported goal is required" }, { status: 422 })
  const response = buildMajorRecommendations({
    countryCode: country,
    ...(request.nextUrl.searchParams.get("state") ? { state: request.nextUrl.searchParams.get("state")!.slice(0, 80) } : {}),
    goal: goal.id,
    ...(budget ? { budget } : {}),
  })
  if (!response) return NextResponse.json({ error: "Unsupported destination country" }, { status: 422 })
  return NextResponse.json(response, { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } })
}
