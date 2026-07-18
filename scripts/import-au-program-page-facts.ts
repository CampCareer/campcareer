/**
 * Imports field-level facts verified from an institution's own course page.
 * It intentionally accepts only curated records: automatic page extraction is
 * not sufficiently reliable for visa, entry or tuition claims.
 *
 * Preview: npx tsx --env-file=.env.local scripts/import-au-program-page-facts.ts
 * Apply:   npx tsx --env-file=.env.local scripts/import-au-program-page-facts.ts --apply
 */
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

type Fact = {
  institutionId: string
  courseCode: string
  fieldKey: "annual_tuition_aud" | "english_requirement" | "entry_requirements" | "intakes" | "campus" | "duration" | "application_deadline"
  value: unknown
  sourceUrl: string
  effectiveFrom?: string
  effectiveTo?: string
  reviewerNote?: string
}

const apply = process.argv.includes("--apply")
const sourceFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data/curated/au/program-page-facts.json")

function sameProviderDomain(programmeUrl: string, providerUrl: string) {
  const programmeHost = new URL(programmeUrl).hostname.replace(/^www\./, "").toLowerCase()
  const providerHost = new URL(providerUrl).hostname.replace(/^www\./, "").toLowerCase()
  return programmeHost === providerHost || programmeHost.endsWith(`.${providerHost}`) || providerHost.endsWith(`.${programmeHost}`)
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  const facts = JSON.parse(await readFile(sourceFile, "utf8")) as Fact[]
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  for (const fact of facts) {
    if (!fact.sourceUrl.startsWith("https://")) throw new Error(`Only HTTPS source URLs are accepted: ${fact.sourceUrl}`)
    const { data: provider, error: providerError } = await supabase
      .from("colleges_au").select("website_url").eq("institution_id", fact.institutionId).maybeSingle()
    if (providerError || !provider?.website_url) throw new Error(`Missing provider website: ${fact.institutionId}`)
    if (!sameProviderDomain(fact.sourceUrl, provider.website_url)) throw new Error(`Provider-domain check failed: ${fact.sourceUrl}`)
    const { data: course, error: courseError } = await supabase
      .from("courses_au").select("id, title").eq("institution_id", fact.institutionId).eq("course_code", fact.courseCode).maybeSingle()
    if (courseError || !course) throw new Error(`Missing CRICOS course: ${fact.institutionId}/${fact.courseCode}`)

    console.log(`${apply ? "IMPORT" : "CHECK "} ${course.title} · ${fact.fieldKey}`)
    if (!apply) continue
    const { error } = await supabase.from("program_page_facts_au").insert({
      course_id: course.id,
      field_key: fact.fieldKey,
      value: fact.value,
      source_url: fact.sourceUrl,
      effective_from: fact.effectiveFrom ?? null,
      effective_to: fact.effectiveTo ?? null,
      review_status: "verified",
      reviewed_at: new Date().toISOString(),
      reviewer_note: fact.reviewerNote ?? "Verified against provider course page",
    })
    if (error) throw error
  }
  console.log(`${apply ? "Imported" : "Validated"} ${facts.length} provider-page facts.`)
}

void main().catch((error) => {
  console.error("[au-program-page-facts] failed:", error)
  process.exitCode = 1
})
