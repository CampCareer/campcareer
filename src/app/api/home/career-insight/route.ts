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
    return NextResponse.json(insight)
  } catch (error) {
    console.error("[career-market-insight] read failed", error)
    return NextResponse.json({ error: "Career-market insight could not be loaded." }, { status: 500 })
  }
}
