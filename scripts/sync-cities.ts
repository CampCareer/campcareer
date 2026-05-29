import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const CENSUS_API_KEY = process.env.CENSUS_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!CENSUS_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!CENSUS_API_KEY) console.error('  - CENSUS_API_KEY (https://api.census.gov/data/key_signup.html)')
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Census ACS 5-Year Estimates (2022)
// B19013_001E = Median household income
// B25064_001E = Median gross rent
const CENSUS_BASE = 'https://api.census.gov/data/2022/acs/acs5'

// 2022 national median gross rent used as the 100-point baseline
const NATIONAL_MEDIAN_RENT = 1096

const TARGET_STATES: Array<{ abbr: string; fips: string }> = [
  { abbr: 'AL', fips: '01' },
  { abbr: 'AK', fips: '02' },
  { abbr: 'AZ', fips: '04' },
  { abbr: 'AR', fips: '05' },
  { abbr: 'CA', fips: '06' },
  { abbr: 'CO', fips: '08' },
  { abbr: 'CT', fips: '09' },
  { abbr: 'DE', fips: '10' },
  { abbr: 'DC', fips: '11' },
  { abbr: 'FL', fips: '12' },
  { abbr: 'GA', fips: '13' },
  { abbr: 'HI', fips: '15' },
  { abbr: 'ID', fips: '16' },
  { abbr: 'IL', fips: '17' },
  { abbr: 'IN', fips: '18' },
  { abbr: 'IA', fips: '19' },
  { abbr: 'KS', fips: '20' },
  { abbr: 'KY', fips: '21' },
  { abbr: 'LA', fips: '22' },
  { abbr: 'ME', fips: '23' },
  { abbr: 'MD', fips: '24' },
  { abbr: 'MA', fips: '25' },
  { abbr: 'MI', fips: '26' },
  { abbr: 'MN', fips: '27' },
  { abbr: 'MS', fips: '28' },
  { abbr: 'MO', fips: '29' },
  { abbr: 'MT', fips: '30' },
  { abbr: 'NE', fips: '31' },
  { abbr: 'NV', fips: '32' },
  { abbr: 'NH', fips: '33' },
  { abbr: 'NJ', fips: '34' },
  { abbr: 'NM', fips: '35' },
  { abbr: 'NY', fips: '36' },
  { abbr: 'NC', fips: '37' },
  { abbr: 'ND', fips: '38' },
  { abbr: 'OH', fips: '39' },
  { abbr: 'OK', fips: '40' },
  { abbr: 'OR', fips: '41' },
  { abbr: 'PA', fips: '42' },
  { abbr: 'RI', fips: '44' },
  { abbr: 'SC', fips: '45' },
  { abbr: 'SD', fips: '46' },
  { abbr: 'TN', fips: '47' },
  { abbr: 'TX', fips: '48' },
  { abbr: 'UT', fips: '49' },
  { abbr: 'VT', fips: '50' },
  { abbr: 'VA', fips: '51' },
  { abbr: 'WA', fips: '53' },
  { abbr: 'WV', fips: '54' },
  { abbr: 'WI', fips: '55' },
  { abbr: 'WY', fips: '56' },
]

// Place-type suffixes the Census appends to city names
const PLACE_TYPE_SUFFIX =
  /\s+(city|town|village|borough|CDP|municipality|township|charter township|unified government|city and county|consolidated city|city and borough|balance)\s*$/i

function parseName(censusName: string): string {
  const placePart = censusName.split(',')[0]
  return placePart.replace(PLACE_TYPE_SUFFIX, '').trim()
}

function toSlug(name: string, state: string): string {
  return (
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
    '-' +
    state.toLowerCase()
  )
}

// Census returns -666666666 for suppressed/missing values
function parseNum(raw: string): number | null {
  const n = parseInt(raw, 10)
  return n > 0 ? n : null
}

type CensusRow = [string, string, string, string, string]
// [NAME, B19013_001E, B25064_001E, state_fips, place_fips]

async function fetchState(abbr: string, fips: string) {
  const params = new URLSearchParams({
    get: 'NAME,B19013_001E,B25064_001E',
    for: 'place:*',
    in: `state:${fips}`,
    key: CENSUS_API_KEY!,
  })

  const res = await fetch(`${CENSUS_BASE}?${params}`)
  if (!res.ok) {
    throw new Error(`Census API error: ${res.status} ${res.statusText}`)
  }

  const [_header, ...rows]: CensusRow[] = await res.json()

  return rows.map((row) => {
    const name = parseName(row[0])
    const income = parseNum(row[1])
    const rent = parseNum(row[2])
    const colIndex =
      rent != null
        ? Math.round((rent / NATIONAL_MEDIAN_RENT) * 1000) / 10
        : null

    return {
      city_slug: toSlug(name, abbr),
      name,
      state: abbr,
      cost_of_living_index: colIndex,
      rent_median: rent,
      synced_at: new Date().toISOString(),
    }
  })
}

async function main() {
  console.log('Starting Census ACS cities sync...')

  let totalSynced = 0
  const BATCH = 500

  for (const { abbr, fips } of TARGET_STATES) {
    console.log(`Fetching places for state: ${abbr}...`)
    const rows = await fetchState(abbr, fips)
    console.log(`  Fetched ${rows.length} places`)

    // Deduplicate by city_slug — prefer rows with rent data
    const seen = new Map<string, typeof rows[0]>()
    for (const row of rows) {
      const existing = seen.get(row.city_slug)
      if (!existing || (row.rent_median != null && existing.rent_median == null)) {
        seen.set(row.city_slug, row)
      }
    }
    const deduped = Array.from(seen.values())
    console.log(`  After dedup: ${deduped.length} unique slugs`)

    for (let i = 0; i < deduped.length; i += BATCH) {
      const chunk = deduped.slice(i, i + BATCH)
      const { error } = await supabase
        .from('cities_us')
        .upsert(chunk, { onConflict: 'city_slug' })

      if (error) {
        console.error('Upsert error:', error.message)
        process.exit(1)
      }

      totalSynced += chunk.length
      console.log(`  Upserted ${Math.min(i + BATCH, deduped.length)} / ${deduped.length}`)
    }
  }

  console.log(`Done. Synced ${totalSynced} cities.`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
