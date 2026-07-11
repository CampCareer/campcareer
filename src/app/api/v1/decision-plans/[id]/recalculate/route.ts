import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { recommendStudyCountries } from "@/lib/study-product/recommendation"
import type { RecommendationInputV2 } from "@/lib/study-product/types"

export const dynamic = "force-dynamic"

export async function POST(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const { data: plan } = await supabase
    .from("decision_plans")
    .select("id, current_version")
    .eq("id", params.id)
    .single()
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  const { data: current } = await supabase
    .from("decision_plan_versions")
    .select("input_json")
    .eq("plan_id", params.id)
    .eq("version", plan.current_version)
    .single()
  if (!current) return NextResponse.json({ error: "Plan version not found" }, { status: 404 })

  try {
    const result = recommendStudyCountries(current.input_json as unknown as RecommendationInputV2)
    const nextVersion = Number(plan.current_version) + 1
    const { error: versionError } = await supabaseAdmin.from("decision_plan_versions").insert({
      plan_id: params.id,
      user_id: user.id,
      version: nextVersion,
      input_json: result.input,
      result_snapshot: result,
      engine_version: result.engineVersion,
      data_version: result.dataVersion,
      generated_at: result.generatedAt,
    })
    if (versionError) throw versionError

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("decision_plans")
      .update({ current_version: nextVersion, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .eq("current_version", plan.current_version)
      .select("id")
      .single()
    if (updateError || !updated) {
      await supabaseAdmin.from("decision_plan_versions").delete().eq("plan_id", params.id).eq("version", nextVersion)
      throw new Error("Plan changed while recalculating")
    }

    return NextResponse.json({ ok: true, version: nextVersion }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[plans] recalculate failed", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Unable to recalculate plan" }, { status: 500 })
  }
}
