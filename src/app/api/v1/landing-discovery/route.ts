import { NextRequest, NextResponse } from "next/server"
import { buildLandingDiscovery, isLandingGoal } from "@/lib/discovery/landing-discovery"

export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country") ?? "everywhere"
  const major = request.nextUrl.searchParams.get("major") ?? "anything"
  const goal = request.nextUrl.searchParams.get("goal") ?? ""

  if (!isLandingGoal(goal)) {
    return NextResponse.json({ error: "A supported goal is required" }, { status: 422 })
  }

  try {
    return NextResponse.json(buildLandingDiscovery({ country, major, goal }), {
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to build discovery results"
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
