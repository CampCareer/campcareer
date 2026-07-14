import { NextRequest, NextResponse } from "next/server"
import { buildCountryRankings, parseSearchIntent } from "@/lib/discovery/search-contract"

export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  const intent = parseSearchIntent({
    career: request.nextUrl.searchParams.get("career"),
    budget: request.nextUrl.searchParams.get("budget"),
    goal: request.nextUrl.searchParams.get("goal"),
    currency: request.nextUrl.searchParams.get("currency"),
  })
  if (!intent) {
    return NextResponse.json({ error: "career, budget, goal, and a valid currency are required" }, { status: 422 })
  }
  return NextResponse.json(buildCountryRankings(intent), {
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  })
}
