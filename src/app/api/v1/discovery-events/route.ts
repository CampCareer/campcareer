import { NextRequest, NextResponse } from "next/server"
import { getServerAcquisitionContext } from "@/lib/acquisition"
import { hasMeasurementConsent } from "@/lib/analytics-consent-shared"

export const dynamic = "force-dynamic"

const EVENT_NAMES = new Set([
  "route_search_started",
  "route_search_submitted",
  "route_result_viewed",
  "route_external_link_clicked",
  "route_request_submitted",
  "map_opened_from_route",
  "guide_interest_submitted",
  "recommendation_start",
  "recommendation_result_view",
  "report_launch_view",
  "report_launch_interest_submitted",
  "report_workspace_open",
  "career_landing_view",
  "career_search_started",
  "career_search_submitted",
  "career_result_viewed",
  "career_result_unavailable",
  "career_evidence_opened",
  "career_result_saved",
  "career_personalisation_started",
  "career_personalisation_completed",
])
const CONTEXT_KEYS = ["surface", "country", "career", "major", "goal", "report_products", "locale", "route_id", "link_type", "result_status"] as const

export async function POST(request: NextRequest) {
  if (!hasMeasurementConsent(request.headers.get("cookie"))) {
    return new NextResponse(null, { status: 204 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  const value = payload as Record<string, unknown>
  const eventName = typeof value.eventName === "string" ? value.eventName : ""
  if (!EVENT_NAMES.has(eventName)) return NextResponse.json({ error: "Unsupported event" }, { status: 422 })

  const contextInput = value.context && typeof value.context === "object" ? value.context as Record<string, unknown> : {}
  const context = Object.fromEntries(
    CONTEXT_KEYS.flatMap((key) => {
      const item = contextInput[key]
      return typeof item === "string" && item.length > 0 ? [[key, item.slice(0, 80)]] : []
    }),
  )

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    const [{ supabaseAdmin }, acquisition] = await Promise.all([
      import("@/lib/supabase-admin"),
      getServerAcquisitionContext(),
    ])
    const { error } = await supabaseAdmin.from("analytics_events").insert({
      event_name: eventName,
      session_id: acquisition.sessionId,
      path: request.nextUrl.pathname,
      first_path: acquisition.firstPath,
      utm: acquisition.utm,
      context,
      referer: acquisition.referer,
    })
    if (error) console.error(JSON.stringify({ level: "error", msg: "discovery_event_write_failed", event_name: eventName, error: error.message }))
  } catch (error) {
    console.error(JSON.stringify({ level: "error", msg: "discovery_event_write_failed", event_name: eventName, error: error instanceof Error ? error.message : String(error) }))
  }

  return new NextResponse(null, { status: 204 })
}
