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

// EUR — RTB / Daft.ie Rental Report 2025 (monthly median)
const CITIES = [
  { name: 'Dublin',    province: 'Leinster', rent_median: 2450, cost_of_living_index: 97 },
  { name: 'Cork',      province: 'Munster',  rent_median: 1800, cost_of_living_index: 80 },
  { name: 'Galway',    province: 'Connacht', rent_median: 1650, cost_of_living_index: 77 },
  { name: 'Limerick',  province: 'Munster',  rent_median: 1450, cost_of_living_index: 72 },
  { name: 'Waterford', province: 'Leinster', rent_median: 1250, cost_of_living_index: 67 },
  { name: 'Drogheda',  province: 'Leinster', rent_median: 1400, cost_of_living_index: 70 },
  { name: 'Kilkenny',  province: 'Leinster', rent_median: 1200, cost_of_living_index: 65 },
  { name: 'Sligo',     province: 'Connacht', rent_median: 1100, cost_of_living_index: 62 },
  { name: 'Athlone',   province: 'Leinster', rent_median: 1150, cost_of_living_index: 63 },
  { name: 'Wexford',   province: 'Leinster', rent_median: 1200, cost_of_living_index: 64 },
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
