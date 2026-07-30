import { NextRequest, NextResponse } from "next/server"
import { AU_STATE_CODES, parseAuState } from "@/data/au-route-study-contract"
import { getAuRouteJobs } from "@/lib/route-jobs"

export const dynamic = "force-dynamic"

/** Public result data: official JSA aggregates plus exact search titles only. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ candidate: string }> }) {
  const { candidate } = await params
  const rawState = request.nextUrl.searchParams.get("state")
  if (rawState && !parseAuState(rawState)) {
    return NextResponse.json({ error: `State must be one of: ${AU_STATE_CODES.join(", ")}` }, { status: 400 })
  }

  const result = await getAuRouteJobs(candidate, rawState)
  if (!result) return NextResponse.json({ error: "Unknown route candidate" }, { status: 404 })
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
  })
}
