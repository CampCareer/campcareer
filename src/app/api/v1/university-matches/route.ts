import { NextRequest, NextResponse } from "next/server"
import { BUDGET_BANDS, buildUniversityMatches } from "@/lib/discovery/search-contract"

export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  const budget = BUDGET_BANDS.find((item) => item.id === request.nextUrl.searchParams.get("budget"))
  if (!budget) return NextResponse.json({ error: "A supported budget is required" }, { status: 422 })
  const response = buildUniversityMatches({
    countryCode: request.nextUrl.searchParams.get("country")?.toUpperCase() ?? "",
    career: request.nextUrl.searchParams.get("career") ?? "",
    budget: budget.id,
    ...(request.nextUrl.searchParams.get("city") ? { city: request.nextUrl.searchParams.get("city")!.slice(0, 100) } : {}),
  })
  if (!response) return NextResponse.json({ error: "country, career, and budget must be supported" }, { status: 422 })
  return NextResponse.json(response, { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } })
}
