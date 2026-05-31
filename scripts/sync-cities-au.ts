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

// ABS 2025 최신 수치 (주당 중간 월세 × 4.33)
const CITIES = [
  { name: 'Sydney',      state: 'NSW', rent_median: 2817, cost_of_living_index: 96 },
  { name: 'Melbourne',   state: 'VIC', rent_median: 2383, cost_of_living_index: 88 },
  { name: 'Brisbane',    state: 'QLD', rent_median: 2513, cost_of_living_index: 85 },
  { name: 'Perth',       state: 'WA',  rent_median: 2656, cost_of_living_index: 90 },
  { name: 'Adelaide',    state: 'SA',  rent_median: 1863, cost_of_living_index: 76 },
  { name: 'Canberra',    state: 'ACT', rent_median: 2817, cost_of_living_index: 88 },
  { name: 'Hobart',      state: 'TAS', rent_median: 1863, cost_of_living_index: 75 },
  { name: 'Darwin',      state: 'NT',  rent_median: 2383, cost_of_living_index: 82 },
  { name: 'Gold Coast',  state: 'QLD', rent_median: 2600, cost_of_living_index: 84 },
  { name: 'Newcastle',   state: 'NSW', rent_median: 2253, cost_of_living_index: 79 },
]

async function main() {
  const rows = CITIES.map(({ name, state, rent_median, cost_of_living_index }) => ({
    city_slug: `${name.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`,
    name,
    state,
    rent_median,
    cost_of_living_index,
    synced_at: new Date().toISOString(),
  }))

  console.log(`Upserting ${rows.length} cities into cities_au...`)

  const { error } = await supabase
    .from('cities_au')
    .upsert(rows, { onConflict: 'city_slug' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into cities_au.`)
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
