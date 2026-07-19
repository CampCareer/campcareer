import { NextResponse } from "next/server"
import { RESEARCH_FOUNDATION_PROGRAM_ID, meetsResearchFoundationRequirements, type ResearchFoundationEvidence } from "@/lib/programs/research-foundation"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin")
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) return json({ error: "Invalid request origin." }, 403)

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return json({ error: "Sign in to complete this programme." }, 401)

  const [preferenceResult, careerResult, providerResult, courseResult] = await Promise.all([
    supabase.from("user_preferences").select("completed_at").eq("id", user.id).maybeSingle(),
    supabase.from("saved_occupations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("saved_universities").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("saved_courses").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ])

  if (preferenceResult.error || careerResult.error || providerResult.error || courseResult.error) {
    console.error("[research-foundation] evidence lookup failed", {
      preference: preferenceResult.error?.message,
      career: careerResult.error?.message,
      provider: providerResult.error?.message,
      course: courseResult.error?.message,
    })
    return json({ error: "We could not verify your planning records. Please try again." }, 503)
  }

  const evidence: ResearchFoundationEvidence = {
    program_version: 1,
    direction_completed: Boolean(preferenceResult.data?.completed_at),
    saved_careers: careerResult.count ?? 0,
    saved_providers: providerResult.count ?? 0,
    saved_courses: courseResult.count ?? 0,
    verified_at: new Date().toISOString(),
  }

  if (!meetsResearchFoundationRequirements(evidence)) {
    return json({ error: "Complete the four planning requirements before confirming this programme.", evidence }, 409)
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("program_completions")
    .select("id, program_id, evidence, completed_at")
    .eq("user_id", user.id)
    .eq("program_id", RESEARCH_FOUNDATION_PROGRAM_ID)
    .maybeSingle()
  if (existingError) {
    console.error("[research-foundation] completion lookup failed", existingError.message)
    return json({ error: "Programme completion is temporarily unavailable." }, 503)
  }
  if (existing) return json({ ok: true, completion: existing, alreadyCompleted: true })

  const { data: completion, error: insertError } = await supabaseAdmin
    .from("program_completions")
    .insert({ user_id: user.id, program_id: RESEARCH_FOUNDATION_PROGRAM_ID, evidence })
    .select("id, program_id, evidence, completed_at")
    .single()
  if (insertError) {
    if (insertError.code === "23505") {
      const { data: concurrentCompletion } = await supabaseAdmin
        .from("program_completions")
        .select("id, program_id, evidence, completed_at")
        .eq("user_id", user.id)
        .eq("program_id", RESEARCH_FOUNDATION_PROGRAM_ID)
        .maybeSingle()
      if (concurrentCompletion) return json({ ok: true, completion: concurrentCompletion, alreadyCompleted: true })
    }
    console.error("[research-foundation] completion insert failed", insertError.message)
    return json({ error: "We could not record your programme completion. Please try again." }, 500)
  }

  return json({ ok: true, completion, alreadyCompleted: false }, 201)
}
