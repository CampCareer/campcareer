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

// EUR — Daft.ie / Numbeo 2024 estimates
const CITIES = [
  { name: 'Dublin',   province: 'Leinster',  rent_median: 2200, cost_of_living_index: 95 },
  { name: 'Cork',     province: 'Munster',   rent_median: 1600, cost_of_living_index: 78 },
  { name: 'Galway',   province: 'Connacht',  rent_median: 1500, cost_of_living_index: 75 },
  { name: 'Limerick', province: 'Munster',   rent_median: 1300, cost_of_living_index: 70 },
  { name: 'Waterford',province: 'Leinster',  rent_median: 1100, cost_of_living_index: 65 },
]

async function main() {
  const rows = CITIES.map(({ name, province, rent_median, cost_of_living_index }) => ({
    city_slug: `${name.toLowerCase().replace(/\s+/g, '-')}-ie`,
    name,
    region: province,          // cities_ie uses `region` (stores province name)
    rent_median,
    cost_of_living_index,
    synced_at: new Date().toISOString(),
  }))

  console.log(`Upserting ${rows.length} cities into cities_ie...`)

  const { error } = await supabase
    .from('cities_ie')
    .upsert(rows, { onConflict: 'city_slug' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into cities_ie.`)
  for (const r of rows) {
    console.log(
      `  ${r.city_slug} | region: ${r.region} | rent: €${r.rent_median} | col_index: ${r.cost_of_living_index}`
    )
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
