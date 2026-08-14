import { NextRequest, NextResponse } from "next/server"
import { getCareerMarketInsight } from "@/lib/workspace/career-market-read"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const country = (request.nextUrl.searchParams.get("country") ?? "").trim().toUpperCase()
  const career = (request.nextUrl.searchParams.get("career") ?? "").trim()

  if ((!/^[A-Z]{2}$/.test(country) && country !== "NOT-SURE") || !career) {
    return NextResponse.json({ error: "A country choice and occupation are required." }, { status: 400 })
  }

  try {
    const insight = await getCareerMarketInsight({ countryCode: country, careerId: career })
    if (!insight) return NextResponse.json({ error: "This occupation could not be found." }, { status: 404 })

    // Career Pages now render the structured `campCareerScore` contract.
    // Null the legacy compatibility totals in this UI-facing endpoint so older
    // result components cannot accidentally show them as "Job market score".
    // Historical/internal totals remain preserved in the read model and DB.
    const publicInsight = {
      ...insight,
      profile: insight.profile
        ? {
            ...insight.profile,
            metric: {
              ...insight.profile.metric,
              opportunityScore: null,
            },
          }
        : null,
      recommendations: insight.recommendations.map((recommendation) => ({
        ...recommendation,
        opportunityScore: null,
      })),
    }

    return NextResponse.json(publicInsight)
  } catch (error) {
    console.error("[career-market-insight] read failed", error)
    return NextResponse.json({ error: "Career-market insight could not be loaded." }, { status: 500 })
  }
}
