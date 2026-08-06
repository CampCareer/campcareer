import { NextRequest, NextResponse } from "next/server"
import { getCountryOccupationProfile } from "@/lib/workspace/country-occupation-read"

export async function GET(request: NextRequest) {
  const country = (request.nextUrl.searchParams.get("country") ?? "").trim().toUpperCase()
  const career = (request.nextUrl.searchParams.get("career") ?? "").trim()

  if (!/^[A-Z]{2}$/.test(country) || !career) {
    return NextResponse.json(
      { error: "A two-letter country and career id are required." },
      { status: 400 }
    )
  }

  try {
    const profile = await getCountryOccupationProfile(country, career)
    if (!profile) return NextResponse.json({ profile: null }, { status: 404 })
    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[occupation-profile] read failed", error)
    return NextResponse.json({ error: "Occupation profile could not be loaded." }, { status: 500 })
  }
}
