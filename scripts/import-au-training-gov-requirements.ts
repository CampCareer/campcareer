/**
 * Records Training.gov.au qualification sources for the VET concepts already
 * shown in CampCareer. The NTR's current SPA does not server-render its full
 * qualification text, so each source is deliberately stored as a
 * review-required qualification record rather than guessed from the page.
 *
 * Preview: npx tsx --env-file=.env.local scripts/import-au-training-gov-requirements.ts
 * Apply:   npx tsx --env-file=.env.local scripts/import-au-training-gov-requirements.ts --apply
 */
import { createHash } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { AU_VOCATIONAL_PROGRAM_SHORTLIST } from "../src/data/au-vocational-program-shortlist"

const apply = process.argv.includes("--apply")

function qualificationCode(value: string | undefined) {
  return value?.match(/[A-Z]{3}\d{5}/)?.[0] ?? null
}

async function fetchSource(url: string) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { "user-agent": "CampCareer training-source-refresh/1.0", accept: "text/html,application/xhtml+xml" } })
    return { status: response.status, body: await response.text() }
  } catch (error) { return { status: 0, body: String(error) } } finally { clearTimeout(timer) }
}

async function main() {
  const qualifications = [...new Map(AU_VOCATIONAL_PROGRAM_SHORTLIST.map((item) => {
    const code = qualificationCode(item.courseCode)
    return code ? [code, { code, title: item.title, url: `https://training.gov.au/Training/Details/${code}` }] : null
  }).filter((item): item is [string, { code: string; title: string; url: string }] => Boolean(item))).values()]
  if (qualifications.length !== 12) throw new Error(`Expected 12 VET qualifications, found ${qualifications.length}`)
  const collected = await Promise.all(qualifications.map(async (item) => ({ ...item, ...(await fetchSource(item.url)) })))
  console.log(`${apply ? "IMPORT" : "CHECK "} ${collected.length} Training.gov.au qualification sources.`)
  if (!apply) return

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase environment variables")
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  let inserted = 0
  let refreshed = 0
  let preservedVerified = 0
  for (const item of collected) {
    const { data: existing, error: lookupError } = await supabase.from("regulatory_requirements_au").select("id, review_status").eq("scope_type", "qualification").eq("scope_code", item.code).eq("state_or_territory", "AU").eq("authority_url", item.url).eq("requirement_type", "qualification").order("id", { ascending: false }).limit(1)
    if (lookupError) throw lookupError
    if (existing?.[0]?.review_status === "verified") { preservedVerified += 1; continue }
    const payload = {
      scope_type: "qualification", scope_code: item.code, state_or_territory: "AU", authority_name: "Australian Government National Training Register", authority_url: item.url, requirement_type: "qualification",
      requirement_text: `${item.title}. Training.gov.au qualification source checked automatically (HTTP ${item.status}). Review the current qualification description, packaging rules, any licence or permit language, and RTO delivery scope before presenting this as pathway advice.`,
      source_content_hash: createHash("sha256").update(item.body).digest("hex"), review_status: "review_required", last_checked_at: new Date().toISOString(), reviewer_note: "NTR SPA source captured. Human review required for qualification and licensing interpretation.",
    }
    const { error } = existing?.[0] ? await supabase.from("regulatory_requirements_au").update(payload).eq("id", existing[0].id) : await supabase.from("regulatory_requirements_au").insert(payload)
    if (error) throw error
    existing?.[0] ? refreshed++ : inserted++
  }
  const sourceHash = createHash("sha256").update(collected.map((item) => `${item.code}:${item.status}:${item.body}`).join("\n")).digest("hex")
  const { data: prior, error: priorError } = await supabase.from("data_source_runs").select("id").eq("source_key", "training-gov-vet-qualifications").eq("content_sha256", sourceHash).maybeSingle()
  if (priorError) throw priorError
  if (!prior) {
    const { error } = await supabase.from("data_source_runs").insert({ source_key: "training-gov-vet-qualifications", source_name: "Australian Government National Training Register", source_url: "https://training.gov.au/", content_sha256: sourceHash, completed_at: new Date().toISOString(), status: "review_required", row_counts: { qualifications: collected.length, inserted, refreshed, preservedVerified }, details: { qualificationCodes: collected.map((item) => item.code), httpStatus: Object.fromEntries(collected.map((item) => [item.code, item.status])) } })
    if (error) throw error
  }
  console.log(`Inserted ${inserted}, refreshed ${refreshed}, preserved ${preservedVerified} reviewed Training.gov.au records.`)
}

void main().catch((error) => { console.error("[au-training-gov] failed:", error); process.exitCode = 1 })
