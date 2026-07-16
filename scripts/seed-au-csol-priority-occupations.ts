/**
 * Publishes the reviewed CSOL-linked OSCA occupations to occupations_au.
 * It preserves unknown labour-market values as null and only marks the
 * source-supported CSOL relationship.
 */
import { createClient } from "@supabase/supabase-js"
import candidates from "../src/data/au-csol-priority-occupations.json"

type Candidate = {
  oscaCode: string
  anzscoV13Codes: string[]
  title: string
  skillLevel: number | null
  registrationOrLicensing: string | null
}

type Manifest = {
  source: { name: string; csolUrl: string; correspondenceUrl: string; retrievedAt: string }
  csolAnzscoV13Codes: string[]
  occupations: Candidate[]
}

const manifest = candidates as Manifest
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")

const supabase = createClient(url, key, { auth: { persistSession: false } })
const verifiedDate = manifest.source.retrievedAt.slice(0, 10)

async function main() {
  const rows = manifest.occupations.map((occupation) => ({
    anzsco_code: occupation.oscaCode,
    anzsco_v13: occupation.anzscoV13Codes[0] ?? null,
    occupation_en: occupation.title,
    occupation_ko: null,
    shortage_rating: null,
    on_csol: true,
    median_salary_aud: null,
    related_broad_field: null,
    related_narrow_field: null,
    pr_note_ko: null,
    confidence: "official-profile-and-csol",
    source_name: manifest.source.name,
    source_url: manifest.source.csolUrl,
    last_verified: verifiedDate,
  }))

  const { data: existing, error: existingError } = await supabase.from("occupations_au").select("anzsco_code")
  if (existingError) throw existingError
  const existingCodes = new Set((existing ?? []).map((occupation) => occupation.anzsco_code))
  const newRows = rows.filter((occupation) => !existingCodes.has(occupation.anzsco_code))

  for (let offset = 0; offset < newRows.length; offset += 100) {
    const { error } = await supabase.from("occupations_au").insert(newRows.slice(offset, offset + 100))
    if (error) throw error
  }

  // The prior 395 rows already include OSCA -> ANZSCO v1.3 mappings. Mark
  // their CSOL relationship as well so old and newly published rows agree.
  for (let offset = 0; offset < manifest.csolAnzscoV13Codes.length; offset += 100) {
    const { error } = await supabase
      .from("occupations_au")
      .update({ on_csol: true })
      .in("anzsco_v13", manifest.csolAnzscoV13Codes.slice(offset, offset + 100))
    if (error) throw error
  }

  const { count, error: countError } = await supabase
    .from("occupations_au")
    .select("id", { count: "exact", head: true })
  if (countError) throw countError
  console.log(`[au-csol] added ${newRows.length} CSOL-linked occupations and synced CSOL flags; occupations_au now has ${count ?? "unknown"} rows.`)
}

void main().catch((error) => {
  console.error("[au-csol] sync failed:", error)
  process.exitCode = 1
})
