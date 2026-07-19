/**
 * Captures auditable TEQSA National Register search links for all providers
 * in colleges_au. A reachable search page is evidence to review, not an
 * automatic declaration that a provider or course is currently registered.
 *
 * Preview: npx tsx --env-file=.env.local scripts/import-au-teqsa-provider-checks.ts
 * Apply:   npx tsx --env-file=.env.local scripts/import-au-teqsa-provider-checks.ts --apply
 */
import { createHash } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

const apply = process.argv.includes("--apply")
const registerUrl = "https://www.teqsa.gov.au/national-register/search"

async function fetchCheck(providerName: string) {
  const url = `${registerUrl}?search_api_fulltext=${encodeURIComponent(providerName)}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { "user-agent": "CampCareer TEQSA source refresh/1.0", accept: "text/html,application/xhtml+xml" } })
    const body = await response.text()
    return { url, status: response.status, body }
  } catch (error) { return { url, status: 0, body: String(error) } } finally { clearTimeout(timer) }
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase environment variables")
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const { data: providers, error } = await supabase.from("colleges_au").select("institution_id, name").order("institution_id")
  if (error) throw error
  const collected = await Promise.all((providers ?? []).map(async (provider) => {
    const result = await fetchCheck(provider.name as string)
    const searchReachable = result.status >= 200 && result.status < 300
    return { institutionId: provider.institution_id as string, name: provider.name as string, ...result, searchReachable, contentHash: createHash("sha256").update(result.body).digest("hex") }
  }))
  console.log(`${apply ? "IMPORT" : "CHECK "} ${collected.length} TEQSA provider searches; ${collected.filter((item) => item.searchReachable).length} search endpoints reachable and all remain review-required.`)
  if (!apply) return
  const sourceHash = createHash("sha256").update(`teqsa-search-links-v2\n${collected.map((item) => `${item.institutionId}:${item.status}:${item.contentHash}`).join("\n")}`).digest("hex")
  const { data: prior, error: priorError } = await supabase.from("data_source_runs").select("id").eq("source_key", "teqsa-provider-register-checks").eq("content_sha256", sourceHash).maybeSingle()
  if (priorError) throw priorError
  if (prior) { console.log("TEQSA provider snapshot unchanged."); return }
  const { error: insertError } = await supabase.from("data_source_runs").insert({ source_key: "teqsa-provider-register-checks", source_name: "TEQSA National Register", source_url: registerUrl, content_sha256: sourceHash, completed_at: new Date().toISOString(), status: "review_required", row_counts: { providers: collected.length, searchEndpointsReachable: collected.filter((item) => item.searchReachable).length }, details: { providerChecks: collected.map((item) => ({ institutionId: item.institutionId, providerName: item.name, searchUrl: item.url, httpStatus: item.status, searchEndpointReachable: item.searchReachable, contentHash: item.contentHash })), note: "A search-link response is not a registration finding; open the exact TEQSA result and review it manually." } })
  if (insertError) throw insertError
  console.log(`Recorded TEQSA review snapshot for ${collected.length} providers.`)
}

void main().catch((error) => { console.error("[au-teqsa] failed:", error); process.exitCode = 1 })
