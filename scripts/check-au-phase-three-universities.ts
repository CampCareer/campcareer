/**
 * Checks that the phase-three cohort remains the 32 non-top-10 Australian
 * universities in the local provider directory. This verifies scope and
 * provider-domain ownership without treating bot-blocked catalogue pages as
 * broken links.
 *
 * Run: npx tsx --env-file=.env.local scripts/check-au-phase-three-universities.ts
 */
import { createClient } from "@supabase/supabase-js"
import { AU_PHASE_THREE_UNIVERSITY_CATALOGUES } from "../src/data/au-phase-three-university-catalogues"

function matchesProviderDomain(catalogueUrl: string, providerUrl: string) {
  const catalogueHost = new URL(catalogueUrl).hostname.replace(/^www\./, "").toLowerCase()
  const providerHost = new URL(providerUrl).hostname.replace(/^www\./, "").toLowerCase()
  return catalogueHost === providerHost || catalogueHost.endsWith(`.${providerHost}`) || providerHost.endsWith(`.${catalogueHost}`)
}

async function main() {
  if (AU_PHASE_THREE_UNIVERSITY_CATALOGUES.length !== 32) {
    throw new Error(`Expected 32 phase-three universities, found ${AU_PHASE_THREE_UNIVERSITY_CATALOGUES.length}`)
  }
  const uniqueIds = new Set(AU_PHASE_THREE_UNIVERSITY_CATALOGUES.map((item) => item.institutionId))
  if (uniqueIds.size !== AU_PHASE_THREE_UNIVERSITY_CATALOGUES.length) throw new Error("Duplicate institution IDs in phase-three cohort")

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Missing Supabase environment variables")
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data: providers, error } = await supabase
    .from("colleges_au")
    .select("institution_id, name, website_url")
    .in("institution_id", [...uniqueIds])
  if (error) throw error
  if (providers?.length !== 32) throw new Error(`Expected 32 matching colleges_au providers, found ${providers?.length ?? 0}`)

  const providerById = new Map((providers ?? []).map((provider) => [provider.institution_id as string, provider]))
  for (const catalogue of AU_PHASE_THREE_UNIVERSITY_CATALOGUES) {
    const provider = providerById.get(catalogue.institutionId)
    if (!provider?.website_url || !matchesProviderDomain(catalogue.programmesUrl, provider.website_url as string)) {
      throw new Error(`Provider-domain check failed for ${catalogue.institutionId}: ${catalogue.programmesUrl}`)
    }
    console.log(`OK ${provider.name} → ${catalogue.programmesUrl}`)
  }
  console.log("[au-phase-three] 32 university catalogues are scoped and provider-domain verified.")
}

void main().catch((error) => {
  console.error("[au-phase-three] failed:", error)
  process.exitCode = 1
})
