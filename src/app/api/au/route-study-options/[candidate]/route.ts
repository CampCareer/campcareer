import { NextRequest, NextResponse } from "next/server"
import { AU_STATE_CODES, getAuRouteStudyOptions } from "@/lib/route-study-options"

export const dynamic = "force-dynamic"

/** Public result data: only provider-verified links and reviewed programme facts. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ candidate: string }> }) {
  const { candidate } = await params
  const state = request.nextUrl.searchParams.get("state")?.toUpperCase() ?? null
  const rawLimit = Number(request.nextUrl.searchParams.get("limit") ?? 20)

  if (state && !(AU_STATE_CODES as readonly string[]).includes(state)) {
    return NextResponse.json({ error: "Invalid Australian state" }, { status: 400 })
  }
  if (!Number.isInteger(rawLimit) || rawLimit < 1 || rawLimit > 20) {
    return NextResponse.json({ error: "Limit must be between 1 and 20" }, { status: 400 })
  }

  const result = await getAuRouteStudyOptions(candidate, state, rawLimit)
  if (!result) return NextResponse.json({ error: "Unknown route candidate" }, { status: 404 })
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
  })
}
