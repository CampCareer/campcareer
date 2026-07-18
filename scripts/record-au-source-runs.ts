/**
 * Records immutable, hash-addressed AU source snapshots before or after an
 * import. This makes a refresh auditable without copying large government
 * workbooks into the web deployment.
 *
 * Preview: npx tsx --env-file=.env.local scripts/record-au-source-runs.ts
 * Write:   npx tsx --env-file=.env.local scripts/record-au-source-runs.ts --apply
 */
import { createHash } from "node:crypto"
import { access, readFile, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

const downloads = "/Users/yehunlee/Downloads"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const apply = process.argv.includes("--apply")

type Source = {
  key: string
  name: string
  url: string
  file: string
  publishedAt?: string
}

const sources: Source[] = [
  {
    key: "jsa-occupation-profiles",
    name: "Jobs and Skills Australia Occupation Profiles",
    url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupation-profiles",
    file: path.join(downloads, "Occupation profiles data - February 2026.xlsx"),
    publishedAt: "2026-02-01",
  },
  {
    key: "jsa-training-pathways",
    name: "Jobs and Skills Australia Training Occupation Pathways",
    url: "https://www.jobsandskills.gov.au/data/skills-and-training/training-occupation-pathways",
    file: path.join(downloads, "training_occupation_pathways_version_1.0.xlsx"),
  },
  {
    key: "jsa-shortage-drivers",
    name: "Jobs and Skills Australia Occupation Shortage Drivers",
    url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
    file: path.join(downloads, "2025 OSD downloadable Tables and Figures.xlsx"),
    publishedAt: "2025-01-01",
  },
  {
    key: "jsa-employment-projections",
    name: "Jobs and Skills Australia Employment Projections",
    url: "https://www.jobsandskills.gov.au/data/employment-projections",
    file: path.join(downloads, "employment_projections_-_may_2025_to_may_2035.xlsx"),
    publishedAt: "2025-05-01",
  },
  {
    key: "jsa-internet-vacancies",
    name: "Jobs and Skills Australia Internet Vacancy Index",
    url: "https://www.jobsandskills.gov.au/data/internet-vacancy-index",
    file: path.join(downloads, "internet_vacancies_anzsco4_occupations_states_and_territories_-_may_2026.xlsx"),
    publishedAt: "2026-05-01",
  },
  {
    key: "jsa-nero",
    name: "Jobs and Skills Australia NERO",
    url: "https://www.jobsandskills.gov.au/data/nero",
    file: path.join(downloads, "2026-06_nero", "2026-06_shiny_df.csv"),
    publishedAt: "2026-06-15",
  },
  {
    key: "jsa-occupation-shortage-list",
    name: "Jobs and Skills Australia Occupation Shortage List",
    url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
    file: path.join(downloads, "2025 Occupation Shortage List - 6 digit ANZSCO and OSCA.xlsx"),
    publishedAt: "2025-01-01",
  },
  {
    key: "home-affairs-csol",
    name: "Department of Home Affairs Core Skills Occupation List",
    url: "https://immi.homeaffairs.gov.au/Documents/core-sol.pdf",
    file: path.join(root, "src/data/au-csol-priority-occupations.json"),
  },
  {
    key: "cricos-courses",
    name: "CRICOS Courses export",
    url: "https://cricos.education.gov.au/",
    file: path.join(root, "cricos_2026_04.xlsx"),
    publishedAt: "2026-04-01",
  },
]

async function exists(file: string) {
  try { await access(file); return true } catch { return false }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (apply && (!url || !key)) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  const supabase = apply ? createClient(url!, key!, { auth: { persistSession: false } }) : null

  for (const source of sources) {
    if (!(await exists(source.file))) {
      console.warn(`SKIP  ${source.key}: file not found (${source.file})`)
      continue
    }
    const [content, fileInfo] = await Promise.all([readFile(source.file), stat(source.file)])
    const contentHash = createHash("sha256").update(content).digest("hex")
    console.log(`${apply ? "RECORD" : "CHECK "} ${source.key} · ${(fileInfo.size / 1024 / 1024).toFixed(1)} MB · ${contentHash.slice(0, 12)}`)
    if (!supabase) continue

    const { data: previous, error: lookupError } = await supabase
      .from("data_source_runs")
      .select("id")
      .eq("source_key", source.key)
      .eq("content_sha256", contentHash)
      .maybeSingle()
    if (lookupError) throw lookupError
    if (previous) continue

    const { error: insertError } = await supabase.from("data_source_runs").insert({
      source_key: source.key,
      source_name: source.name,
      source_url: source.url,
      local_path: source.file,
      content_sha256: contentHash,
      published_at: source.publishedAt ?? null,
      completed_at: new Date().toISOString(),
      status: "imported",
      details: { bytes: fileInfo.size, importer: "manual-or-local-refresh" },
    })
    if (insertError) throw insertError
  }
}

void main().catch((error) => {
  console.error("[au-source-runs] failed:", error)
  process.exitCode = 1
})
