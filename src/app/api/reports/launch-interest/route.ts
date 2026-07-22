import { NextRequest, NextResponse } from "next/server"
import { getServerAcquisitionContext } from "@/lib/acquisition"
import { reportLaunchConfirmationEmail } from "@/lib/email/templates"
import { reportLaunchConfirmUrl, reportLaunchUnsubscribeUrl } from "@/lib/email/links"
import { sendEmail } from "@/lib/email/send"
import {
  canResendReportLaunchConfirmation,
  parseReportLaunchInterest,
  productLabels,
} from "@/lib/report-launch-interest"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }
const MAX_BODY_BYTES = 4_096
const CONSENT_VERSION = "report-launch-interest-v1"

type InterestRow = {
  id: string
  confirmed: boolean
  confirmed_at: string | null
  unsubscribed_at: string | null
  confirmation_token: string
  confirmation_sent_at: string | null
}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS })
}

async function readBody(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return null
  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return null
  try { return JSON.parse(raw) } catch { return null }
}

export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get("origin")
  if (requestOrigin && requestOrigin !== request.nextUrl.origin) return json({ error: "Invalid request origin." }, 403)

  const payload = await readBody(request)
  const parsed = parseReportLaunchInterest(payload)
  if (!parsed.ok) {
    if (parsed.code === "bot_detected") return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS })
    return json({ error: parsed.code }, 422)
  }
  if (!process.env.RESEND_API_KEY) return json({ error: "launch_updates_unavailable" }, 503)

  const { email, productIds, locale, sourcePath } = parsed.value
  const now = new Date()
  const nowIso = now.toISOString()
  const retentionExpiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
  const acquisition = await getServerAcquisitionContext()
  const { data: current, error: currentError } = await supabaseAdmin
    .from("report_launch_interests")
    .select("id, confirmed, confirmed_at, unsubscribed_at, confirmation_token, confirmation_sent_at")
    .eq("email", email)
    .maybeSingle()

  if (currentError) {
    console.error("[report-launch] interest lookup failed", currentError.message)
    return json({ error: "launch_updates_unavailable" }, 503)
  }

  const existing = current as InterestRow | null
  const activeConfirmed = Boolean(existing?.confirmed && !existing.unsubscribed_at)
  const needsNewConfirmation = !activeConfirmed && Boolean(!existing || existing.unsubscribed_at || canResendReportLaunchConfirmation(existing.confirmation_sent_at, now))
  const confirmationToken = !existing || existing.unsubscribed_at ? crypto.randomUUID() : existing.confirmation_token
  const row = {
    email,
    report_product_ids: productIds,
    locale,
    source_path: sourcePath,
    consent_at: nowIso,
    consent_version: CONSENT_VERSION,
    confirmation_token: confirmationToken,
    confirmation_sent_at: needsNewConfirmation ? nowIso : existing?.confirmation_sent_at ?? null,
    confirmed: activeConfirmed,
    confirmed_at: activeConfirmed ? existing?.confirmed_at ?? nowIso : null,
    unsubscribed_at: null,
    acquisition_session_id: acquisition.sessionId,
    first_path: acquisition.firstPath,
    utm: acquisition.utm,
    retention_expires_at: retentionExpiresAt,
    updated_at: nowIso,
  }

  const mutation = existing
    ? supabaseAdmin.from("report_launch_interests").update(row).eq("id", existing.id)
    : supabaseAdmin.from("report_launch_interests").insert(row)
  const { error: mutationError } = await mutation
  if (mutationError) {
    console.error("[report-launch] interest save failed", mutationError.message)
    return json({ error: "launch_updates_unavailable" }, 503)
  }

  if (request.cookies.get("cc_analytics_consent")?.value === "granted") {
    const { error: eventError } = await supabaseAdmin.from("analytics_events").insert({
      event_name: "report_launch_interest_submitted",
      session_id: acquisition.sessionId,
      path: request.nextUrl.pathname,
      first_path: acquisition.firstPath,
      utm: acquisition.utm,
      context: { report_products: productIds.join(",") },
      referer: acquisition.referer,
    })
    if (eventError && eventError.code !== "42P01") console.error("[report-launch] analytics write failed", eventError.message)
  }

  if (!needsNewConfirmation) {
    return json({ ok: true, alreadyConfirmed: activeConfirmed, confirmationEmailSent: false })
  }

  try {
    const message = reportLaunchConfirmationEmail({
      locale,
      products: productLabels(productIds, locale),
      confirmUrl: reportLaunchConfirmUrl(confirmationToken),
      unsubscribeUrl: reportLaunchUnsubscribeUrl(confirmationToken),
    })
    await sendEmail({ to: email, ...message })
  } catch (error) {
    await supabaseAdmin
      .from("report_launch_interests")
      .update({ confirmation_sent_at: null, updated_at: new Date().toISOString() })
      .eq("email", email)
    console.error("[report-launch] confirmation email failed", error)
    return json({ error: "confirmation_send_failed" }, 503)
  }

  return json({ ok: true, alreadyConfirmed: false, confirmationEmailSent: true })
}
