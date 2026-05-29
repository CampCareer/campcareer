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

// GBP — Numbeo / ONS 2024 estimates
const CITIES = [
  { name: 'London',       region: 'London',        rent_median: 2200, cost_of_living_index: 98 },
  { name: 'Manchester',   region: 'North West',    rent_median: 1100, cost_of_living_index: 75 },
  { name: 'Birmingham',   region: 'West Midlands', rent_median: 1000, cost_of_living_index: 72 },
  { name: 'Edinburgh',    region: 'Scotland',      rent_median: 1300, cost_of_living_index: 80 },
  { name: 'Bristol',      region: 'South West',    rent_median: 1200, cost_of_living_index: 78 },
  { name: 'Leeds',        region: 'Yorkshire',     rent_median:  900, cost_of_living_index: 70 },
  { name: 'Glasgow',      region: 'Scotland',      rent_median: 1000, cost_of_living_index: 72 },
  { name: 'Nottingham',   region: 'East Midlands', rent_median:  850, cost_of_living_index: 68 },
  { name: 'Sheffield',    region: 'Yorkshire',     rent_median:  800, cost_of_living_index: 66 },
  { name: 'Liverpool',    region: 'North West',    rent_median:  850, cost_of_living_index: 68 },
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
