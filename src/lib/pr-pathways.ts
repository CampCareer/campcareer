import "server-only"
import { createClient } from "@/lib/supabase-server"
import { type CountryCode, type PrPathway } from "@/lib/degree-risk"

/**
 * Fetch verified PR pathways (public.country_pr_pathways), keyed by country.
 * Server-only. Returns an empty map on error so the timeline degrades to its
 * estimate fallback rather than breaking the result page.
 */
export async function fetchPrPathways(): Promise<Partial<Record<CountryCode, PrPathway>>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("country_pr_pathways").select("*")
    if (error) {
      console.error("[pr-pathways] query failed:", error.message)
      return {}
    }
    const map: Partial<Record<CountryCode, PrPathway>> = {}
    for (const r of (data ?? []) as PrPathway[]) map[r.country] = r
    return map
  } catch (err) {
    console.error("[pr-pathways] fetch threw:", err)
    return {}
  }
}
