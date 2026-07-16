/** Validates that every published AU occupation has an exact OSCA profile. */
import { readFile } from "node:fs/promises"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import type { AuOscaOccupationProfile } from "./import-au-osca-content"

type Snapshot = { occupations: AuOscaOccupationProfile[] }

async function main() {
  const raw = await readFile(path.resolve("src/data/au-osca-occupation-profiles.json"), "utf8")
  const snapshot = JSON.parse(raw) as Snapshot
  const profiles = new Map(snapshot.occupations.map((profile) => [profile.code, profile]))
  if (profiles.size !== snapshot.occupations.length) throw new Error("OSCA snapshot has duplicate occupation codes")

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase
    .from("occupations_au")
    .select("anzsco_code, occupation_en")
    .not("anzsco_code", "is", null)
  if (error) throw error

  const occupations = data ?? []
  const missing = occupations.filter((occupation) => !profiles.has(occupation.anzsco_code))
  const titleMismatches = occupations
    .map((occupation) => ({ occupation, profile: profiles.get(occupation.anzsco_code) }))
    .filter((item) => item.profile && item.profile.title !== item.occupation.occupation_en)

  if (missing.length || titleMismatches.length) {
    throw new Error(JSON.stringify({
      missing: missing.slice(0, 20),
      titleMismatches: titleMismatches.slice(0, 20).map(({ occupation, profile }) => ({ code: occupation.anzsco_code, database: occupation.occupation_en, osca: profile?.title })),
    }, null, 2))
  }

  console.log(`[au-osca] ${occupations.length} published AU occupations have exact OSCA profiles.`)
}

void main()
