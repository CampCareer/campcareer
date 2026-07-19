/**
 * Fetches a small, high-impact state-regulator source set and stores it as
 * review-required evidence. It never turns a scraped rule into public advice.
 *
 * Preview: npx tsx --env-file=.env.local scripts/import-au-regulatory-requirements.ts
 * Apply:   npx tsx --env-file=.env.local scripts/import-au-regulatory-requirements.ts --apply
 */
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

type Seed = { scopeCode: string; state: string; authorityName: string; authorityUrl: string; requirementType: "licence" | "registration" }
const apply = process.argv.includes("--apply")
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

async function fetchText(url: string) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { "user-agent": "CampCareer regulatory-source-refresh/1.0", accept: "text/html,application/xhtml+xml" } })
    const body = await response.text()
    return { status: response.status, body, finalUrl: response.url }
  } finally { clearTimeout(timer) }
}

function stripHtml(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

function extractReviewText(html: string, blocked: boolean) {
  if (blocked) return "Automated retrieval was blocked or timed out. Open the cited regulator page and verify licence class, qualification, supervised-work, experience, mutual-recognition and renewal requirements."
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  const sentences = stripHtml(html).split(/(?<=[.!?])\s+/).filter((sentence) => /licen[cs]|registr|qualif|apprent|supervis|eligib|must|experience|mutual recognition/i.test(sentence)).slice(0, 8)
  return [title ? `Source page: ${title}.` : "", ...sentences].filter(Boolean).join(" ").slice(0, 2200) || "The source was retrieved but automated text extraction found no reliable requirement excerpt. Review the cited regulator page manually."
}

async function main() {
  const seeds = JSON.parse(await readFile(path.join(root, "data/curated/au/state-regulator-sources.json"), "utf8")) as Seed[]
  if (seeds.length !== 17) throw new Error(`Expected 17 regulatory source seeds, found ${seeds.length}`)
  const collected = await Promise.all(seeds.map(async (seed) => {
    try {
      const result = await fetchText(seed.authorityUrl)
      const blocked = result.status < 200 || result.status >= 300 || result.body.length < 4000
      return { ...seed, ...result, blocked, contentHash: createHash("sha256").update(result.body).digest("hex") }
    } catch (error) {
      return { ...seed, status: 0, body: String(error), finalUrl: seed.authorityUrl, blocked: true, contentHash: createHash("sha256").update(String(error)).digest("hex") }
    }
  }))
  console.log(`${apply ? "IMPORT" : "CHECK "} ${collected.length} regulatory sources; ${collected.filter((item) => item.blocked).length} require manual source review after a blocked fetch.`)
  if (!apply) return

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase environment variables")
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  let inserted = 0
  let updated = 0
  let preservedVerified = 0
  for (const item of collected) {
    const { data: existing, error: lookupError } = await supabase.from("regulatory_requirements_au").select("id, review_status").eq("scope_type", "occupation").eq("scope_code", item.scopeCode).eq("state_or_territory", item.state).eq("authority_url", item.authorityUrl).eq("requirement_type", item.requirementType).order("id", { ascending: false }).limit(1)
    if (lookupError) throw lookupError
    if (existing?.[0]?.review_status === "verified") { preservedVerified += 1; continue }
    const payload = { scope_type: "occupation", scope_code: item.scopeCode, state_or_territory: item.state, authority_name: item.authorityName, authority_url: item.authorityUrl, requirement_type: item.requirementType, requirement_text: extractReviewText(item.body, item.blocked), source_content_hash: item.contentHash, review_status: "review_required", last_checked_at: new Date().toISOString(), reviewer_note: item.blocked ? "Automatic fetch blocked; source URL queued for human review." : "Automatically extracted source text; human review required before publication." }
    const row = existing?.[0]
    const { error } = row ? await supabase.from("regulatory_requirements_au").update(payload).eq("id", row.id) : await supabase.from("regulatory_requirements_au").insert(payload)
    if (error) throw error
    row ? updated++ : inserted++
  }
  console.log(`Inserted ${inserted}, refreshed ${updated}, preserved ${preservedVerified} human-verified regulatory records.`)
}

void main().catch((error) => { console.error("[au-regulatory] failed:", error); process.exitCode = 1 })
