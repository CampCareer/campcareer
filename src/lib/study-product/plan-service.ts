import "server-only"

import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { recommendStudyCountries } from "@/lib/study-product/recommendation"
import type { RecommendationInputV3 } from "@/lib/study-product/types"

export function createClaimToken() {
  const token = randomBytes(32).toString("base64url")
  return { token, hash: hashClaimToken(token) }
}

export function hashClaimToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function claimTokenMatches(token: string, expectedHash: string) {
  const actual = Buffer.from(hashClaimToken(token), "hex")
  const expected = Buffer.from(expectedHash, "hex")
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function createPlanSaveIntent(input: RecommendationInputV3) {
  const result = recommendStudyCountries(input)
  const { token, hash } = createClaimToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabaseAdmin
    .from("plan_save_intents")
    .insert({
      claim_token_hash: hash,
      locale: result.input.locale,
      origin_country: result.input.originCountry,
      target_concept_id: result.input.targetConceptId,
      input_json: result.input,
      result_snapshot: result,
      engine_version: result.engineVersion,
      data_version: result.dataVersion,
      expires_at: expiresAt,
    })
    .select("id, expires_at")
    .single()

  if (error) throw new Error(error.message)
  return { intentId: data.id as string, claimToken: token, expiresAt: data.expires_at as string }
}

export async function claimPlanSaveIntent({
  intentId,
  claimToken,
  userId,
}: {
  intentId: string
  claimToken: string
  userId: string
}) {
  const { data: intent, error } = await supabaseAdmin
    .from("plan_save_intents")
    .select("*")
    .eq("id", intentId)
    .single()

  if (error || !intent) throw new Error("Save link is invalid")
  if (!claimTokenMatches(claimToken, intent.claim_token_hash as string)) throw new Error("Save link is invalid")
  if (new Date(intent.expires_at as string).getTime() <= Date.now()) throw new Error("Save link has expired")

  const { data: existing } = await supabaseAdmin
    .from("decision_plans")
    .select("id, user_id")
    .eq("save_intent_id", intentId)
    .maybeSingle()

  if (existing) {
    if (existing.user_id !== userId) throw new Error("This save link has already been used")
    return existing.id as string
  }

  const { data: plan, error: planError } = await supabaseAdmin
    .from("decision_plans")
    .insert({
      user_id: userId,
      locale: intent.locale,
      origin_country: intent.origin_country,
      target_concept_id: intent.target_concept_id,
      current_version: 1,
      save_intent_id: intentId,
    })
    .select("id")
    .single()
  if (planError || !plan) throw new Error(planError?.message ?? "Unable to create plan")

  const result = intent.result_snapshot as Record<string, unknown>
  const { error: versionError } = await supabaseAdmin
    .from("decision_plan_versions")
    .insert({
      plan_id: plan.id,
      user_id: userId,
      version: 1,
      input_json: intent.input_json,
      result_snapshot: intent.result_snapshot,
      engine_version: intent.engine_version,
      data_version: intent.data_version,
      generated_at: typeof result.generatedAt === "string" ? result.generatedAt : new Date().toISOString(),
    })
  if (versionError) {
    await supabaseAdmin.from("decision_plans").delete().eq("id", plan.id)
    throw new Error(versionError.message)
  }

  await supabaseAdmin
    .from("plan_save_intents")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", intentId)
    .is("consumed_at", null)

  return plan.id as string
}
