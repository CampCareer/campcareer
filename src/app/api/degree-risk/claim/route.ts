import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin")
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) return json({ error: "Invalid request origin." }, 403)

  const payload = await request.json().catch(() => null)
  const assessmentId = typeof payload?.assessmentId === "string" ? payload.assessmentId : ""
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(assessmentId)) return json({ error: "Invalid assessment." }, 400)

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return json({ error: "Sign in to save this result." }, 401)

  const { data, error } = await supabaseAdmin
    .from("assessments")
    .update({ user_id: user.id })
    .eq("id", assessmentId)
    .is("user_id", null)
    .select("id")
    .maybeSingle()
  if (error) {
    console.error("[degree-risk] assessment claim failed", error.message)
    return json({ error: "We could not save this result." }, 503)
  }

  return json({ ok: true, claimed: Boolean(data) })
}
