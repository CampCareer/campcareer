import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// CAD — Statistics Canada / CMHC Q1 2025 (2-bedroom asking rent)
const CITIES = [
  { name: 'Toronto',       province: 'ON', rent_median: 2690, cost_of_living_index: 90 },
  { name: 'Vancouver',     province: 'BC', rent_median: 3170, cost_of_living_index: 96 },
  { name: 'Montreal',      province: 'QC', rent_median: 1930, cost_of_living_index: 75 },
  { name: 'Calgary',       province: 'AB', rent_median: 1897, cost_of_living_index: 78 },
  { name: 'Ottawa',        province: 'ON', rent_median: 2490, cost_of_living_index: 82 },
  { name: 'Edmonton',      province: 'AB', rent_median: 1573, cost_of_living_index: 72 },
  { name: 'Winnipeg',      province: 'MB', rent_median: 1450, cost_of_living_index: 67 },
  { name: 'Halifax',       province: 'NS', rent_median: 1900, cost_of_living_index: 74 },
  { name: 'Quebec City',   province: 'QC', rent_median: 1400, cost_of_living_index: 64 },
  { name: 'Waterloo',      province: 'ON', rent_median: 1950, cost_of_living_index: 76 },
]

async function main() {
  const rows = CITIES.map(({ name, province, rent_median, cost_of_living_index }) => ({
    city_slug: `${name.toLowerCase().replace(/\s+/g, '-')}-${province.toLowerCase()}`,
    name,
    province,
    rent_median,
    cost_of_living_index,
    synced_at: new Date().toISOString(),
  }))

  console.log(`Upserting ${rows.length} cities into cities_ca...`)

  const { error } = await supabase
    .from('cities_ca')
    .upsert(rows, { onConflict: 'city_slug' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into cities_ca.`)
  for (const r of rows) {
    console.log(
      `  ${r.city_slug} | rent: $${r.rent_median} | col_index: ${r.cost_of_living_index}`
    )
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
