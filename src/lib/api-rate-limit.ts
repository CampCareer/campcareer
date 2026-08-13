import { createHmac } from "node:crypto"
import { NextResponse } from "next/server"

// This module is imported only by Route Handlers. Keep the service-role client
// lazy so route-level request-shape tests can exercise safe early exits without
// loading server-only credentials in a plain Node test process.

type RateLimitConfig = {
  endpoint: string
  limit: number
  windowSeconds: number
}

type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429 | 503; retryAfterSeconds: number }

function clientNetworkIdentifier(request: Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown"
}

function rateLimitSecret() {
  return process.env.API_RATE_LIMIT_SECRET
    ?? process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? "campcareer-rate-limit-local-development-only"
}

export function requestRateLimitFingerprint(request: Request) {
  const network = clientNetworkIdentifier(request)
  const userAgent = request.headers.get("user-agent") ?? "unknown"
  return createHmac("sha256", rateLimitSecret()).update(`${network}|${userAgent}`).digest("hex")
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

/**
 * Durable per-visitor request limits. The PostgreSQL function increments the
 * bucket atomically, so serverless instances cannot each grant a fresh quota.
 */
export async function enforceRateLimit(request: Request, config: RateLimitConfig): Promise<RateLimitResult> {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase-admin")
    const { data, error } = await supabaseAdmin.rpc("enforce_api_rate_limit", {
      p_endpoint: config.endpoint,
      p_fingerprint: requestRateLimitFingerprint(request),
      p_limit: config.limit,
      p_window_seconds: config.windowSeconds,
    })
    if (error) {
      console.error("[rate-limit] enforcement unavailable", config.endpoint, error.message)
      return { ok: false, status: 503, retryAfterSeconds: 60 }
    }
    return data === true
      ? { ok: true }
      : { ok: false, status: 429, retryAfterSeconds: config.windowSeconds }
  } catch (error) {
    console.error("[rate-limit] enforcement failed", config.endpoint, error)
    return { ok: false, status: 503, retryAfterSeconds: 60 }
  }
}

export function rateLimitResponse(result: Extract<RateLimitResult, { ok: false }>) {
  const unavailable = result.status === 503
  return NextResponse.json(
    { error: unavailable ? "Service is temporarily unavailable" : "Too many requests. Please try again later." },
    {
      status: result.status,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(result.retryAfterSeconds),
      },
    },
  )
}
