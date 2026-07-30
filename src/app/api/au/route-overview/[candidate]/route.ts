import { NextResponse } from "next/server"
import { getAuRouteOverview } from "@/lib/route-overview"

export const dynamic = "force-dynamic"

/** Public result data: current JSA snapshot facts only, with no user inputs. */
export async function GET(_: Request, { params }: { params: Promise<{ candidate: string }> }) {
  const { candidate } = await params
  const result = await getAuRouteOverview(candidate)
  if (!result) return NextResponse.json({ error: "Unknown route candidate" }, { status: 404 })

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
  })
}
