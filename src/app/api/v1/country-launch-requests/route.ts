import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { getLaunchCountry, isLaunchCountry } from "@/data/launch-countries"
import { enforceRateLimit, hasSameOrigin, rateLimitResponse } from "@/lib/api-rate-limit"
import { sendEmail } from "@/lib/email/send"
import { getFeedbackAdminClient, readJsonBody } from "@/lib/feedback-server"
import { isPublicProductCountry } from "@/lib/product-scope"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_REQUEST_BYTES = 2_048
const NOTIFICATION_TO = process.env.COUNTRY_LAUNCH_NOTIFICATION_TO ?? "campcareer99@gmail.com"
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }
const PUBLIC_COUNTS_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
}

type CountryLaunchRequestBody = {
  countryCode?: unknown
  browserRequestId?: unknown
}

function json(body: Record<string, unknown>, status = 200, headers = NO_STORE_HEADERS) {
  return NextResponse.json(body, { status, headers })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isBrowserRequestId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function countryLaunchInterestEmail(countryName: string, countryCode: string) {
  return {
    to: NOTIFICATION_TO,
    subject: `[CampCareer] New ${countryName} launch request`,
    html: `<main style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5"><h1 style="font-size:20px">New country demand signal</h1><p>Someone requested an earlier CampCareer launch for <strong>${countryName}</strong> (${countryCode}).</p><p>This is a deduplicated launch-request signal from the public Australia-first homepage.</p></main>`,
  }
}

export async function GET() {
  const supabase = getFeedbackAdminClient()
  if (!supabase) return json({ ok: false, code: "UNAVAILABLE", error: "Service unavailable" }, 503)

  const { data, error } = await supabase
    .from("country_launch_requests")
    .select("country_code")
    .not("country_code", "eq", "AU")

  if (error) return json({ ok: false, code: "QUERY_FAILED", error: "Unable to fetch counts" }, 500)

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.country_code] = (counts[row.country_code] ?? 0) + 1
  }

  return json({ ok: true, counts }, 200, PUBLIC_COUNTS_CACHE_HEADERS)
}

export async function POST(request: Request) {
  try {
    if (!hasSameOrigin(request)) return json({ ok: false, code: "INVALID_ORIGIN", error: "Invalid request origin" }, 403)
    const rateLimit = await enforceRateLimit(request, { endpoint: "country_launch_request", limit: 8, windowSeconds: 60 * 60 })
    if (!rateLimit.ok) return rateLimitResponse(rateLimit)
    const parsedBody = await readJsonBody(request, MAX_REQUEST_BYTES)
    if (!parsedBody.ok) return json({ ok: false, code: parsedBody.code, error: parsedBody.error }, parsedBody.status)
    if (!isRecord(parsedBody.data)) return json({ ok: false, code: "INVALID_REQUEST", error: "Invalid request body" }, 400)

    const body = parsedBody.data as CountryLaunchRequestBody
    const countryCode = typeof body.countryCode === "string" ? body.countryCode.toUpperCase() : ""
    if (!isLaunchCountry(countryCode)) {
      return json({ ok: false, code: "UNKNOWN_COUNTRY", error: "Unknown country" }, 400)
    }
    if (isPublicProductCountry(countryCode)) {
      return json({ ok: false, code: "COUNTRY_AVAILABLE", error: "This country is already available" }, 400)
    }
    if (!isBrowserRequestId(body.browserRequestId)) {
      return json({ ok: false, code: "INVALID_REQUEST_ID", error: "Invalid request identifier" }, 400)
    }

    const supabase = getFeedbackAdminClient()
    if (!supabase) {
      return json({ ok: false, code: "REQUESTS_UNAVAILABLE", error: "Requests are temporarily unavailable. Please try again later." }, 503)
    }

    const country = getLaunchCountry(countryCode)
    if (!country) return json({ ok: false, code: "UNKNOWN_COUNTRY", error: "Unknown country" }, 400)

    // Only a SHA-256 digest of a browser-generated UUID is stored. We never
    // collect a visitor email address, IP address, or user-agent for this flow.
    const requestFingerprint = createHash("sha256").update(body.browserRequestId).digest("hex")
    const row = { country_code: country.code, request_fingerprint: requestFingerprint, surface: "home_country_grid" }
    const { data: inserted, error: insertError } = await supabase
      .from("country_launch_requests")
      .upsert(row, { onConflict: "country_code,request_fingerprint", ignoreDuplicates: true })
      .select("id, notification_sent_at")

    if (insertError) {
      console.error("[country-launch-requests] failed to save request:", insertError.message)
      return json({ ok: false, code: "REQUEST_NOT_SAVED", error: "Unable to save request" }, 500)
    }

    let requestRecord = inserted?.[0] ?? null
    if (!requestRecord) {
      const { data: existing, error: existingError } = await supabase
        .from("country_launch_requests")
        .select("id, notification_sent_at")
        .eq("country_code", country.code)
        .eq("request_fingerprint", requestFingerprint)
        .maybeSingle()
      if (existingError || !existing) {
        console.error("[country-launch-requests] failed to resolve duplicate request:", existingError?.message)
        return json({ ok: false, code: "REQUEST_NOT_SAVED", error: "Unable to save request" }, 500)
      }
      requestRecord = existing
    }

    if (!requestRecord.notification_sent_at) {
      try {
        await sendEmail(countryLaunchInterestEmail(country.name, country.code))
        const { error: notificationUpdateError } = await supabase
          .from("country_launch_requests")
          .update({ notification_sent_at: new Date().toISOString() })
          .eq("id", requestRecord.id)
        if (notificationUpdateError) {
          console.error("[country-launch-requests] failed to mark notification sent:", notificationUpdateError.message)
        }
      } catch (error) {
        console.error("[country-launch-requests] notification failed:", error)
        return json({ ok: false, code: "NOTIFICATION_FAILED", error: "Unable to send request" }, 503)
      }
    }

    return json({ ok: true })
  } catch (error) {
    console.error("[country-launch-requests] unexpected error:", error)
    return json({ ok: false, code: "REQUEST_FAILED", error: "Unable to save request" }, 500)
  }
}
