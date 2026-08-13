"use server"

import { createClient } from "@/lib/supabase-server"
import {
  normalizeSavedCareerResultInput,
  toSavedCareerResultWrite,
} from "@/lib/workspace/saved-career-result"

export type CareerResultSaveState =
  | { state: "saved" }
  | { state: "ready"; saved: boolean }
  | { state: "unauthenticated" }
  | { state: "invalid" }
  | { state: "error" }

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  return { supabase, user: error ? null : data.user }
}

export async function getSavedCareerResultState(input: unknown): Promise<CareerResultSaveState> {
  const result = normalizeSavedCareerResultInput(input)
  if (!result) return { state: "invalid" }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { state: "unauthenticated" }

  const { data, error } = await supabase
    .from("saved_career_results")
    .select("id")
    .eq("user_id", user.id)
    .eq("country_code", result.countryCode)
    .eq("occupation_id", result.occupationId)
    .maybeSingle()

  return error ? { state: "error" } : { state: "ready", saved: Boolean(data) }
}

export async function saveCareerResult(input: unknown): Promise<CareerResultSaveState> {
  const result = normalizeSavedCareerResultInput(input)
  if (!result) return { state: "invalid" }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { state: "unauthenticated" }

  const { error } = await supabase
    .from("saved_career_results")
    .upsert(
      { user_id: user.id, ...toSavedCareerResultWrite(result, new Date().toISOString()) },
      { onConflict: "user_id,country_code,occupation_id" },
    )

  return error ? { state: "error" } : { state: "saved" }
}
