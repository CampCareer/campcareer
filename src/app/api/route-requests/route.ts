import { createHmac } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { isIsoCountryCode } from "@/lib/study-product/countries"
import { normalizeCountryCode, normalizeRouteField, type RouteGoal } from "@/lib/route-search"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 4_096
const MAX_REQUESTS_PER_HOUR = 8
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

type RequestKind = "route_research" | "guide_interest"

type ParsedRequest = {
  citizenshipCode: string
  destinationCode: string
  goal: RouteGoal
  field: string
  locale: "en" | "ko"
  requestKind: RequestKind
  notificationEmail: string | null
  notificationConsent: boolean
}

function accepted() {
  // A uniform response prevents the form from becoming an email-address or
  // anti-spam oracle. The browser can always continue its honest flow.
  return NextResponse.json({ accepted: true }, { status: 202, headers: NO_STORE_HEADERS })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parseInput(value: unknown): { input: ParsedRequest | null; honeypot: boolean } {
  if (!isRecord(value)) return { input: null, honeypot: false }
  const honeypot = typeof value.company === "string" && value.company.trim().length > 0
  const citizenshipCode = normalizeCountryCode(typeof value.citizenship === "string" ? value.citizenship : "")
  const destinationCode = normalizeCountryCode(typeof value.destination === "string" ? value.destination : "")
  const goal = value.goal === "study" || value.goal === "work" || value.goal === "study-to-work" ? value.goal : null
  const field = normalizeRouteField(typeof value.field === "string" ? value.field : "")
  const locale = value.locale === "en" ? "en" : "ko"
  const requestKind: RequestKind = value.requestKind === "guide_interest" ? "guide_interest" : "route_research"
  const notificationConsent = value.notificationConsent === true
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : ""
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320

  if (!isIsoCountryCode(citizenshipCode) || !isIsoCountryCode(destinationCode) || !goal || !field || field.length > 80) {
    return { input: null, honeypot }
  }
  if ((notificationConsent || requestKind === "guide_interest") && !hasValidEmail) return { input: null, honeypot }
  if (requestKind === "guide_interest" && !notificationConsent) return { input: null, honeypot }

  return {
    honeypot,
    input: {
      citizenshipCode,
      destinationCode,
      goal,
      field,
      locale,
      requestKind,
      notificationEmail: notificationConsent ? email : null,
      notificationConsent,
    },
  }
}

function fingerprint(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const userAgent = request.headers.get("user-agent") ?? "unknown"
  const secret = process.env.ROUTE_REQUEST_FINGERPRINT_SECRET
    ?? process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? "route-request-local-development-only"
  return createHmac("sha256", secret).update(`${clientIp}|${userAgent}`).digest("hex")
}

function allowRequest(key: string) {
  const now = Date.now()
  const current = rateBuckets.get(key)
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60 * 60 * 1_000 })
    return true
  }
  if (current.count >= MAX_REQUESTS_PER_HOUR) return false
  current.count += 1
  if (rateBuckets.size > 2_000) {
    for (const [bucketKey, bucket] of rateBuckets) if (bucket.resetAt <= now) rateBuckets.delete(bucketKey)
  }
  return true
}

function sourcePath(request: NextRequest) {
  const referer = request.headers.get("referer")
  if (!referer) return "/"
  try {
    const url = new URL(referer)
    return url.pathname.slice(0, 500) || "/"
  } catch {
    return "/"
  }
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0")
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) return accepted()

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return accepted()
  }

  const parsed = parseInput(payload)
  const requestFingerprint = fingerprint(request)
  if (parsed.honeypot || !parsed.input || !allowRequest(requestFingerprint)) return accepted()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return accepted()

  try {
    const { supabaseAdmin } = await import("@/lib/supabase-admin")
    const { error } = await supabaseAdmin
      .from("route_search_requests")
      .upsert({
        citizenship_code: parsed.input.citizenshipCode,
        destination_code: parsed.input.destinationCode,
        route_goal: parsed.input.goal,
        field_normalized: parsed.input.field,
        request_kind: parsed.input.requestKind,
        locale: parsed.input.locale,
        notification_email: parsed.input.notificationEmail,
        notification_consent: parsed.input.notificationConsent,
        notification_consent_at: parsed.input.notificationConsent ? new Date().toISOString() : null,
        notification_consent_version: parsed.input.notificationConsent ? "route-notification-v1" : null,
        request_fingerprint: requestFingerprint,
        source_path: sourcePath(request),
      }, {
        onConflict: "request_fingerprint,citizenship_code,destination_code,route_goal,field_normalized,request_kind",
        ignoreDuplicates: true,
      })
    if (error) console.error("[route-requests] write failed:", error.message)
  } catch (error) {
    console.error("[route-requests] unexpected failure:", error)
  }

  return accepted()
}
