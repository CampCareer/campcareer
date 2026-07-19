import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const TYPES = new Set(["course", "registration", "fees", "admission"])
function json(body: Record<string, unknown>, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }) }
function isHttpsUrl(value: unknown): value is string { try { return typeof value === "string" && value.length <= 500 && new URL(value).protocol === "https:" } catch { return false } }

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Invalid request origin." }, 403)
  const body = await request.json().catch(() => null)
  const programmeKey = typeof body?.programmeKey === "string" ? body.programmeKey.trim() : ""
  const type = body?.evidenceType
  const officialUrl = typeof body?.officialUrl === "string" ? body.officialUrl.trim() : ""
  const note = typeof body?.note === "string" ? body.note.trim() : ""
  if (programmeKey.length < 2 || programmeKey.length > 180 || !TYPES.has(type) || !isHttpsUrl(officialUrl) || note.length > 600) return json({ error: "Add a programme name, evidence type and an HTTPS official source link." }, 400)
  const supabase = await createClient(); const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return json({ error: "Sign in to save official evidence." }, 401)
  const { data, error: upsertError } = await supabaseAdmin.from("programme_evidence").upsert({ user_id: user.id, programme_key: programmeKey, evidence_type: type, official_url: officialUrl, note }, { onConflict: "user_id,programme_key,evidence_type" }).select("id, programme_key, evidence_type, official_url, note, created_at").single()
  if (upsertError) { console.error("[programme-evidence] upsert failed", upsertError.message); return json({ error: "We could not save this official link." }, 500) }
  return json({ ok: true, evidence: data }, 201)
}

export async function DELETE(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Invalid request origin." }, 403)
  const body = await request.json().catch(() => null); const id = typeof body?.id === "string" ? body.id : ""
  if (!id) return json({ error: "Evidence id is required." }, 400)
  const supabase = await createClient(); const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return json({ error: "Sign in to manage official evidence." }, 401)
  const { data: owned } = await supabase.from("programme_evidence").select("id").eq("id", id).eq("user_id", user.id).maybeSingle()
  if (!owned) return json({ error: "Evidence was not found." }, 404)
  const { error: deleteError } = await supabaseAdmin.from("programme_evidence").delete().eq("id", id).eq("user_id", user.id)
  if (deleteError) return json({ error: "We could not remove this evidence." }, 500)
  return json({ ok: true })
}
