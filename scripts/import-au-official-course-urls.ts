/**
 * Imports only manually verified official programme pages for AU courses.
 *
 * The seed list is intentionally curated rather than guessed from a title:
 * universities may retire or rename courses, and several block automated
 * crawling. A URL is accepted only when its domain belongs to the provider's
 * known website and the course code + provider pair exists in CRICOS data.
 *
 * Preview: npx tsx --env-file=.env.local scripts/import-au-official-course-urls.ts
 * Apply:   npx tsx --env-file=.env.local scripts/import-au-official-course-urls.ts --apply
 */

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

type SeedRow = {
  institutionId: string
  courseCode: string
  url: string
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const seedPath = path.join(root, "data/curated/au/official-course-urls.json")
const source = "Provider course page, manually verified"
const apply = process.argv.includes("--apply")

function isProviderDomain(programmeUrl: string, providerUrl: string) {
  const programmeHost = new URL(programmeUrl).hostname.replace(/^www\./, "").toLowerCase()
  const providerHost = new URL(providerUrl).hostname.replace(/^www\./, "").toLowerCase()
  return programmeHost === providerHost || programmeHost.endsWith(`.${providerHost}`) || providerHost.endsWith(`.${programmeHost}`)
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

  const seeds = JSON.parse(await readFile(seedPath, "utf8")) as SeedRow[]
  const supabase = createClient(url, key)
  const providerIds = [...new Set(seeds.map((row) => row.institutionId))]
  const { data: providers, error: providerError } = await supabase
    .from("colleges_au")
    .select("institution_id, website_url")
    .in("institution_id", providerIds)

  if (providerError) throw providerError
  const providerById = new Map((providers ?? []).map((provider) => [provider.institution_id as string, provider.website_url as string | null]))

  let imported = 0
  for (const seed of seeds) {
    const programmeUrl = new URL(seed.url)
    if (programmeUrl.protocol !== "https:") throw new Error(`Only HTTPS programme URLs are allowed: ${seed.url}`)

    const providerUrl = providerById.get(seed.institutionId)
    if (!providerUrl || !isProviderDomain(seed.url, providerUrl)) {
      throw new Error(`Provider-domain check failed for ${seed.institutionId} / ${seed.courseCode}: ${seed.url}`)
    }

    const { data: courses, error: courseError } = await supabase
      .from("courses_au")
      .select("id, title")
      .eq("institution_id", seed.institutionId)
      .eq("course_code", seed.courseCode)

    if (courseError) throw courseError
    if (!courses || courses.length !== 1) throw new Error(`Expected one CRICOS course for ${seed.institutionId} / ${seed.courseCode}; found ${courses?.length ?? 0}`)

    const course = courses[0]
    console.log(`${apply ? "IMPORT" : "CHECK "} ${seed.courseCode} · ${course.title} → ${seed.url}`)
    if (!apply) continue

    const { error: updateError } = await supabase
      .from("courses_au")
      .update({
        official_course_url: seed.url,
        official_url_status: "verified",
        official_url_checked_at: new Date().toISOString(),
        official_url_source: source,
      })
      .eq("id", course.id)
    if (updateError) throw updateError
    imported += 1
  }

  console.log(apply ? `Imported ${imported} verified provider programme URLs.` : `Validated ${seeds.length} rows. Re-run with --apply to write.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
