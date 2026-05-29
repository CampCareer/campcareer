import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!API_KEY) console.error('  - COLLEGE_SCORECARD_API_KEY')
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools.json'

// Actual field name is `latest.programs.cip_4_digit` (underscore, not dot)
// `all_programs_nested=true` is required to return the full array
const FIELDS = ['id', 'latest.programs.cip_4_digit'].join(',')

interface ProgramEarnings {
  highest?: {
    '2_yr'?: { overall_median_earnings?: number | null }
    '3_yr'?: { overall_median_earnings?: number | null }
  }
  '5_yr'?: { overall_median_earnings?: number | null }
  '4_yr'?: { overall_median_earnings_national?: number | null }
}

interface ScorecardProgram {
  code: string
  title: string
  earnings?: ProgramEarnings
  employment_rate?: number | null
  credential?: { level: number; title: string }
}

interface ScorecardResult {
  id: number
  'latest.programs.cip_4_digit': ScorecardProgram[] | null
}

function getMedianEarnings(earnings?: ProgramEarnings): number | null {
  if (!earnings) return null
  return (
    earnings.highest?.['2_yr']?.overall_median_earnings ??
    earnings.highest?.['3_yr']?.overall_median_earnings ??
    earnings['5_yr']?.overall_median_earnings ??
    earnings['4_yr']?.overall_median_earnings_national ??
    null
  )
}

async function fetchPage(
  page: number,
  perPage = 100
): Promise<{ results: ScorecardResult[]; total: number }> {
  const params = new URLSearchParams({
    api_key: API_KEY!,
    fields: FIELDS,
    all_programs_nested: 'true',
    per_page: String(perPage),
    page: String(page),
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return {
    results: data.results ?? [],
    total: data.metadata?.total ?? 0,
  }
}

// Load full unit_id → id mapping from colleges table upfront
async function loadCollegeIdMap(): Promise<Map<string, string | number>> {
  const map = new Map<string, string | number>()
  let from = 0
  const batchSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('colleges_us')
      .select('id, unit_id')
      .range(from, from + batchSize - 1)

    if (error) throw new Error(`Failed to load colleges: ${error.message}`)
    if (!data || data.length === 0) break

    for (const row of data) {
      map.set(String(row.unit_id), row.id)
    }

    if (data.length < batchSize) break
    from += batchSize
  }

  return map
}

async function main() {
  console.log('Loading college ID map from Supabase...')
  const collegeIdMap = await loadCollegeIdMap()
  console.log(`Loaded ${collegeIdMap.size} colleges.`)

  const PER_PAGE = 100
  let page = 0
  let total = Infinity
  let totalUpserted = 0
  let skippedNull = 0
  let skippedNoCollege = 0

  console.log('Starting programs sync from College Scorecard (nationwide)...')

  while (page * PER_PAGE < total) {
    const { results, total: fetchedTotal } = await fetchPage(page, PER_PAGE)

    if (page === 0) {
      total = fetchedTotal
      console.log(`Total schools to process: ${total}`)
    }

    if (results.length === 0) break

    const rows: {
      college_id: string | number
      cip_code: string
      field_name: string
      median_earnings: number
      employment_rate: number | null
    }[] = []

    for (const school of results) {
      const collegeId = collegeIdMap.get(String(school.id))
      if (!collegeId) {
        skippedNoCollege++
        continue
      }

      const programs = school['latest.programs.cip_4_digit'] ?? []
      for (const program of programs) {
        const medianEarnings = getMedianEarnings(program.earnings)
        if (medianEarnings === null) {
          skippedNull++
          continue
        }

        rows.push({
          college_id: collegeId,
          cip_code: program.code,
          field_name: program.title,
          median_earnings: medianEarnings,
          employment_rate: program.employment_rate ?? null,
        })
      }
    }

    // Deduplicate by college_id+cip_code within the batch, keeping highest median_earnings
    const dedupMap = new Map<string, typeof rows[0]>()
    for (const row of rows) {
      const key = `${row.college_id}:${row.cip_code}`
      const existing = dedupMap.get(key)
      if (!existing || row.median_earnings > existing.median_earnings) {
        dedupMap.set(key, row)
      }
    }
    const dedupedRows = Array.from(dedupMap.values())

    if (dedupedRows.length > 0) {
      const { error } = await supabase
        .from('programs_us')
        .upsert(dedupedRows, { onConflict: 'college_id,cip_code' })

      if (error) {
        console.error(`Upsert error on page ${page}:`, error.message)
        process.exit(1)
      }

      totalUpserted += dedupedRows.length
    }

    const totalPages = Math.ceil(total / PER_PAGE)
    console.log(
      `Page ${page + 1}/${totalPages}: upserted ${dedupedRows.length} programs` +
        ` (total: ${totalUpserted}, skipped_null: ${skippedNull}, no_college: ${skippedNoCollege})`
    )

    page++

    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  console.log(
    `\nDone. Synced ${totalUpserted} programs.` +
      ` Skipped ${skippedNull} (null earnings), ${skippedNoCollege} schools (not in DB).`
  )
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
