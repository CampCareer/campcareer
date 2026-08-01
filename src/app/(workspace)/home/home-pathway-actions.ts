"use server"

import { createClient } from "@/lib/supabase-server"
import { normalizeSavedPathwayInput, SAVED_PATHWAY_CONFLICT_COLUMNS, toSavedPathwayWrite } from "./home-pathway-save"

export type PathwaySaveResult =
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

export async function getSavedPathwayState(input: unknown): Promise<PathwaySaveResult> {
  const pathway = normalizeSavedPathwayInput(input)
  if (!pathway) return { state: "invalid" }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { state: "unauthenticated" }

  const { data, error } = await supabase
    .from("saved_pathways")
    .select("status_slug")
    .eq("user_id", user.id)
    .eq("country_code", pathway.country)
    .eq("field_slug", pathway.field)
    .maybeSingle()

  if (error) return { state: "error" }
  return { state: "ready", saved: data?.status_slug === pathway.status }
}

export async function savePathway(input: unknown): Promise<PathwaySaveResult> {
  const pathway = normalizeSavedPathwayInput(input)
  if (!pathway) return { state: "invalid" }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { state: "unauthenticated" }

  const { error } = await supabase
    .from("saved_pathways")
    .upsert(toSavedPathwayWrite(user.id, pathway, new Date().toISOString()), { onConflict: SAVED_PATHWAY_CONFLICT_COLUMNS })

  return error ? { state: "error" } : { state: "saved" }
}
