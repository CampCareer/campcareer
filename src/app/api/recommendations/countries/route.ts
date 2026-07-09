import { NextRequest, NextResponse } from "next/server"
import {
  getRecommendationLabels,
  parseRecommendationInput,
  recommendCountries,
} from "@/lib/country-recommendation"

export function GET(req: NextRequest) {
  const input = parseRecommendationInput({
    field: req.nextUrl.searchParams.get("field"),
    budget: req.nextUrl.searchParams.get("budget"),
    goal: req.nextUrl.searchParams.get("goal"),
    risk: req.nextUrl.searchParams.get("risk"),
    language: req.nextUrl.searchParams.get("language"),
  })

  const recommendations = recommendCountries(input)

  return NextResponse.json(
    {
      input,
      labels: getRecommendationLabels(input),
      recommendations,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  )
}
