import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"

const MAX_SUBMISSIONS_PER_DAY = 5
const VALID_KINDS = new Set(["review", "correction", "source"])

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

function isSafePath(value: unknown): value is string {
  return typeof value === "string" && value.length >= 1 && value.length <= 500 && value.startsWith("/") && !value.startsWith("//")
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 500) return false
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin")
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return json({ error: "Invalid request origin." }, 403)
  }

  const body = await request.json().catch(() => null)
  const kind = body?.kind
  const targetPath = body?.targetPath
  const targetLabel = typeof body?.targetLabel === "string" ? body.targetLabel.trim() : ""
  const description = typeof body?.description === "string" ? body.description.trim() : ""
  const sourceUrl = typeof body?.sourceUrl === "string" && body.sourceUrl.trim() ? body.sourceUrl.trim() : null

  if (!VALID_KINDS.has(kind) || !isSafePath(targetPath) || targetLabel.length > 180 || description.length < 30 || description.length > 3000) {
    return json({ error: "Please provide a contribution type, page path and a description between 30 and 3,000 characters." }, 400)
  }
  if ((kind === "source" && !sourceUrl) || (sourceUrl && !isHttpUrl(sourceUrl))) {
    return json({ error: "Add a valid official or primary source URL." }, 400)
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return json({ error: "Sign in to submit a contribution." }, 401)

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count, error: countError } = await supabase
    .from("contribution_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since)
  if (countError) {
    console.error("[contributions] rate-limit query failed", countError.message)
    return json({ error: "Contributions are temporarily unavailable. Please try again later." }, 503)
  }
  if ((count ?? 0) >= MAX_SUBMISSIONS_PER_DAY) {
    return json({ error: "You can submit up to five contributions per day. Please try again tomorrow." }, 429)
  }

  const { data, error: insertError } = await supabase
    .from("contribution_submissions")
    .insert({
      user_id: user.id,
      kind,
      target_path: targetPath,
      target_label: targetLabel,
      description,
      source_url: sourceUrl,
      status: "pending",
    })
    .select("id, status, created_at")
    .single()

  if (insertError) {
    console.error("[contributions] insert failed", insertError.message)
    return json({ error: "We could not save your contribution. Please try again." }, 500)
  }

  return json({ ok: true, contribution: data }, 201)
}
