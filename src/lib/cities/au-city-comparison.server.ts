import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getAuCityProfile, type AuCityProfile } from "@/lib/cities/au-city-profile.server"

export type AuCityComparison = {
  left: AuCityProfile
  right: AuCityProfile
  sharedProgramCount: number
}

async function loadSydneyMelbourneComparison(): Promise<AuCityComparison | null> {
  const [sydney, melbourne, sharedPrograms] = await Promise.all([
    getAuCityProfile("sydney"),
    getAuCityProfile("melbourne"),
    supabaseAdmin
      .from("courses_au")
      .select("id", { count: "exact", head: true })
      .eq("cricos_status", "active")
      .contains("verified_city_slugs", ["sydney", "melbourne"]),
  ])

  if (!sydney || !melbourne) return null
  if (sharedPrograms.error) {
    throw new Error(`Unable to count Sydney and Melbourne shared programs: ${sharedPrograms.error.message}`)
  }

  return {
    left: sydney,
    right: melbourne,
    sharedProgramCount: sharedPrograms.count ?? 0,
  }
}

export const getSydneyMelbourneComparison = cache(loadSydneyMelbourneComparison)
