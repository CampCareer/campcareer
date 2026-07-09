import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const EVENT_NAME_RE = /^[a-z][a-z0-9_]{1,63}$/

function clean(value: unknown, maxLength: number): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxLength) : null
}

function cleanContext(value: unknown, maxEntries = 16): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, item]) => /^[a-z][a-z0-9_]{0,63}$/.test(key) && ["string", "number", "boolean"].includes(typeof item))
      .slice(0, maxEntries)
      .map(([key, item]) => [key, typeof item === "string" ? item.slice(0, 180) : item as number | boolean]),
  )
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const eventName = clean(body.eventName, 64)
  if (!eventName || !EVENT_NAME_RE.test(eventName)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from("analytics_events").insert({
    event_name: eventName,
    session_id: clean(body.sessionId, 80),
    path: clean(body.path, 500),
    first_path: clean(body.firstPath, 500),
    utm: cleanContext(body.utm, 5),
    context: cleanContext(body.params),
    referer: clean(request.headers.get("referer"), 500),
  })

  if (error) {
    console.error("[analytics] event write failed:", error.message)
    // Analytics must never turn a user interaction into a visible failure.
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: true })
}
