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

// GBP — ONS / Homelet Rental Index 2025 (monthly median)
const CITIES = [
  { name: 'London',       region: 'London',        rent_median: 2700, cost_of_living_index: 99 },
  { name: 'Manchester',   region: 'North West',    rent_median: 1350, cost_of_living_index: 78 },
  { name: 'Birmingham',   region: 'West Midlands', rent_median:  950, cost_of_living_index: 72 },
  { name: 'Edinburgh',    region: 'Scotland',      rent_median: 1600, cost_of_living_index: 83 },
  { name: 'Bristol',      region: 'South West',    rent_median: 1550, cost_of_living_index: 82 },
  { name: 'Leeds',        region: 'Yorkshire',     rent_median: 1050, cost_of_living_index: 72 },
  { name: 'Glasgow',      region: 'Scotland',      rent_median: 1150, cost_of_living_index: 74 },
  { name: 'Nottingham',   region: 'East Midlands', rent_median:  950, cost_of_living_index: 68 },
  { name: 'Sheffield',    region: 'Yorkshire',     rent_median:  900, cost_of_living_index: 67 },
  { name: 'Liverpool',    region: 'North West',    rent_median:  950, cost_of_living_index: 69 },
]

async function main() {
  const rows = CITIES.map(({ name, region, rent_median, cost_of_living_index }) => ({
    city_slug: `${name.toLowerCase().replace(/\s+/g, '-')}-uk`,
    name,
    region,
    rent_median,
    cost_of_living_index,
    synced_at: new Date().toISOString(),
  }))

  console.log(`Upserting ${rows.length} cities into cities_uk...`)

  const { error } = await supabase
    .from('cities_uk')
    .upsert(rows, { onConflict: 'city_slug' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into cities_uk.`)
  for (const r of rows) {
    console.log(
      `  ${r.city_slug} | region: ${r.region} | rent: £${r.rent_median} | col_index: ${r.cost_of_living_index}`
    )
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
