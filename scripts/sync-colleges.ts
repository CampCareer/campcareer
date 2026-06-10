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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'
const FIELDS = [
  'id',
  'school.name',
  'school.state',
  'school.city',
  'school.school_url',
  'school.ownership',
  'latest.admissions.admission_rate.overall',
  'latest.student.size',
  'latest.cost.avg_net_price.overall',
  'latest.completion.rate_suppressed.overall',
  'latest.earnings.10_yrs_after_entry.median',
].join(',')

type OwnershipCode = 1 | 2 | 3

const OWNERSHIP_MAP: Record<OwnershipCode, string> = {
  1: 'public',
  2: 'private_nonprofit',
  3: 'private_forprofit',
}

interface ScorecardResult {
  id: number
  'school.name': string
  'school.state': string
  'school.city': string
  'school.school_url': string | null
  'school.ownership': OwnershipCode
  'latest.admissions.admission_rate.overall': number | null
  'latest.student.size': number | null
  'latest.cost.avg_net_price.overall': number | null
  'latest.completion.rate_suppressed.overall': number | null
  'latest.earnings.10_yrs_after_entry.median': number | null
}

async function fetchPage(page: number, perPage: number = 100): Promise<{ results: ScorecardResult[]; total: number }> {
  const params = new URLSearchParams({
    api_key: API_KEY!,
    fields: FIELDS,
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

function transform(raw: ScorecardResult) {
  return {
    unit_id: String(raw.id),
    name: raw['school.name'],
    state: raw['school.state'],
    city: raw['school.city'],
    // Scorecard는 스킴 없는 호스트만 줄 때가 있음 — https로 정규화
    website_url: raw['school.school_url']
      ? (raw['school.school_url'].startsWith('http') ? raw['school.school_url'] : `https://${raw['school.school_url']}`)
      : null,
    school_type: OWNERSHIP_MAP[raw['school.ownership']] ?? null,
    admission_rate: raw['latest.admissions.admission_rate.overall'],
    enrollment: raw['latest.student.size'],
    avg_net_price: raw['latest.cost.avg_net_price.overall'],
    graduation_rate: raw['latest.completion.rate_suppressed.overall'],
    median_earnings: raw['latest.earnings.10_yrs_after_entry.median'],
  }
}

async function main() {
  const PER_PAGE = 100
  let page = 0
  let total = Infinity
  let synced = 0

  console.log('Starting College Scorecard sync (all US)...')

  while (page * PER_PAGE < total) {
    const { results, total: fetchedTotal } = await fetchPage(page, PER_PAGE)

    if (page === 0) {
      total = fetchedTotal
      console.log(`Total records to sync: ${total}`)
    }

    if (results.length === 0) break

    const rows = results.map(transform)

    const { error } = await supabase
      .from('colleges_us')
      .upsert(rows, { onConflict: 'unit_id' })

    if (error) {
      console.error(`Upsert error on page ${page}:`, error.message)
      process.exit(1)
    }

    synced += rows.length
    console.log(`Page ${page + 1}: upserted ${rows.length} rows (total: ${synced}/${total})`)

    page++
  }

  console.log(`Done. Synced ${synced} colleges.`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
