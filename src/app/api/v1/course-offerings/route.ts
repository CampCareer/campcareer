import { NextRequest, NextResponse } from "next/server"
import { getStudyConcept } from "@/data/study-concepts"
import {
  getOfficialCourseRegistry,
  getVerifiedCourseOfferings,
} from "@/lib/study-product/course-offerings"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const conceptId = request.nextUrl.searchParams.get("conceptId") ?? ""
  const country = (request.nextUrl.searchParams.get("country") ?? "").toUpperCase()
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20)

  if (!getStudyConcept(conceptId)) {
    return NextResponse.json({ error: "Unknown study concept" }, { status: 404 })
  }
  if (!/^[A-Z]{2}$/.test(country)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 })
  }
  if (!Number.isFinite(limit) || limit < 1 || limit > 20) {
    return NextResponse.json({ error: "Limit must be between 1 and 20" }, { status: 400 })
  }

  const offerings = await getVerifiedCourseOfferings(conceptId, country, limit)
  const registry = getOfficialCourseRegistry(country)

  return NextResponse.json(
    { offerings, registry, count: offerings.length },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  )
}
