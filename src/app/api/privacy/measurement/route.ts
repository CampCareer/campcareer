import { NextRequest, NextResponse } from "next/server"
import { hasMeasurementConsent } from "@/lib/analytics-consent-shared"

const OPTIONAL_MEASUREMENT_COOKIES = [
  "cc_sid",
  "cc_first_path",
  "cc_utm_source",
  "cc_utm_medium",
  "cc_utm_campaign",
  "cc_utm_term",
  "cc_utm_content",
]

const THIRTY_DAYS = 60 * 60 * 24 * 30

type MeasurementContext = {
  firstPath: string
  utm: Record<string, string>
}

function contextFromReferer(request: NextRequest): MeasurementContext {
  const referer = request.headers.get("referer")
  if (!referer) return { firstPath: "/", utm: {} }

  try {
    const url = new URL(referer)
    if (url.origin !== request.nextUrl.origin) return { firstPath: "/", utm: {} }
    const utm = Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].flatMap((key) => {
        const value = url.searchParams.get(key)
        return value ? [[key, value.slice(0, 180)]] : []
      }),
    )
    return { firstPath: url.pathname, utm }
  } catch {
    return { firstPath: "/", utm: {} }
  }
}

async function measurementContext(request: NextRequest): Promise<MeasurementContext> {
  const fallback = contextFromReferer(request)
  try {
    const body = await request.json() as { pathname?: unknown; search?: unknown }
    if (typeof body.pathname !== "string" || !body.pathname.startsWith("/")) return fallback

    const firstPath = body.pathname.slice(0, 500)
    const params = new URLSearchParams(typeof body.search === "string" ? body.search.slice(0, 1200) : "")
    const utm = Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].flatMap((key) => {
        const value = params.get(key)
        return value ? [[key, value.slice(0, 180)]] : []
      }),
    )
    return { firstPath, utm }
  } catch {
    return fallback
  }
}

function setOptionalMeasurementCookies(response: NextResponse, request: NextRequest, context: MeasurementContext) {
  const options = { path: "/", maxAge: THIRTY_DAYS, sameSite: "lax" as const, httpOnly: true }
  if (!request.cookies.get("cc_sid")?.value) response.cookies.set("cc_sid", crypto.randomUUID(), options)
  if (!request.cookies.get("cc_first_path")?.value) response.cookies.set("cc_first_path", context.firstPath, options)

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = context.utm[key]
    if (value && !request.cookies.get(`cc_${key}`)?.value) response.cookies.set(`cc_${key}`, value.slice(0, 180), options)
  }
}

/** Creates optional measurement identifiers only after the browser has consented. */
export async function POST(request: NextRequest) {
  if (!hasMeasurementConsent(request.headers.get("cookie"))) {
    return new NextResponse(null, { status: 204 })
  }

  const response = new NextResponse(null, { status: 204 })
  setOptionalMeasurementCookies(response, request, await measurementContext(request))
  return response
}

/**
 * Removes only CampCareer cookies that exist for optional measurement.
 * Authentication and the visitor's `cc_analytics_consent=denied` choice remain.
 */
export async function DELETE() {
  const response = new NextResponse(null, { status: 204 })

  for (const name of OPTIONAL_MEASUREMENT_COOKIES) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      httpOnly: true,
    })
  }

  return response
}
