import { NextRequest, NextResponse } from "next/server"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import { getHomeOverviewData } from "@/lib/workspace/home-overview-read"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const country = (request.nextUrl.searchParams.get("country") ?? "").toUpperCase()
  const category = request.nextUrl.searchParams.get("category") ?? ""
  const destinationExplorer = request.nextUrl.searchParams.get("view") === "destination"
  const countryIsSupported = LAUNCH_COUNTRIES.some((item) => item.code === country)
  const categoryIsSupported = category === "not-sure" || STUDY_CATEGORIES.some((item) => item.id === category)

  if (!countryIsSupported || !categoryIsSupported) {
    return NextResponse.json({ error: "Unsupported Overview query" }, { status: 400 })
  }

  try {
    const data = await getHomeOverviewData(country, category as (typeof STUDY_CATEGORIES)[number]["id"] | "not-sure", { destinationExplorer })
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" },
    })
  } catch {
    return NextResponse.json({ error: "Overview data is temporarily unavailable" }, { status: 503 })
  }
}
