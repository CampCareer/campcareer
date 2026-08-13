import { NextRequest, NextResponse } from "next/server"
import { getPartner } from "@/lib/partners"
import { getServerAcquisitionContext } from "@/lib/acquisition"
import { hasMeasurementConsent } from "@/lib/analytics-consent-shared"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, props: { params: Promise<{ partner: string }> }) {
  const params = await props.params;
  const partner = getPartner(params.partner)
  if (!partner) return new NextResponse("Not found", { status: 404 })

  if (hasMeasurementConsent(request.headers.get("cookie"))) {
    const acquisition = await getServerAcquisitionContext()
    const { error } = await supabaseAdmin.from("analytics_events").insert({
      event_name: "affiliate_click",
      session_id: acquisition.sessionId,
      path: request.nextUrl.pathname,
      first_path: acquisition.firstPath,
      utm: acquisition.utm,
      context: { partner: partner.id },
      referer: acquisition.referer,
    })

    if (error) console.error(JSON.stringify({ level: "error", msg: "affiliate_click_write_failed", partner: partner.id, error: error.message }))
  }
  return NextResponse.redirect(partner.href, 307)
}
