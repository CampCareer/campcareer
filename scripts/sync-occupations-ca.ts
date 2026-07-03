import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

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

const DATA_PATH = path.resolve(__dirname, '../src/data/ca-occupation-wages.json')

interface CaOccupation {
  noc_code: string
  title_en: string
  median_wage_cad: number | null
  low_wage_cad: number | null
  high_wage_cad: number | null
  average_wage_cad: number | null
  q1_wage_cad: number | null
  q3_wage_cad: number | null
  data_source: string | null
  is_annual: boolean
}

function printMigrationSQL(): void {
  console.log('='.repeat(60))
  const sql = fs.readFileSync(
    path.resolve(__dirname, '../supabase/migrations/20260703000000_occupations_ca.sql'),
    'utf-8',
  )
  console.log(sql)
  console.log('='.repeat(60))
  console.log()
  console.log('After running the SQL, re-run this script to seed the data.')
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8')
  const occupations: CaOccupation[] = JSON.parse(raw)

  console.log(`Loaded ${occupations.length} occupations from ${DATA_PATH}`)

  const rows = occupations.map((o) => ({
    noc_code: o.noc_code,
    occupation_en: o.title_en,
    median_salary_cad: o.median_wage_cad,
    low_wage_cad: o.low_wage_cad,
    high_wage_cad: o.high_wage_cad,
    average_wage_cad: o.average_wage_cad,
    q1_wage_cad: o.q1_wage_cad,
    q3_wage_cad: o.q3_wage_cad,
    data_source: o.data_source,
    confidence: o.data_source === '2021 Census' || o.data_source === 'Canadian Institute for Health Information' ? 'verified' : 'estimate',
    last_verified: new Date().toISOString(),
  }))

  const BATCH = 100
  let upserted = 0
  let tableMissing = false

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase
      .from('occupations_ca')
      .upsert(batch, { onConflict: 'noc_code', ignoreDuplicates: false })

    if (error) {
      if (error.message && error.message.includes('Could not find the table')) {
        if (!tableMissing) {
          tableMissing = true
          console.log('Table occupations_ca does not exist.')
          console.log()
          console.log('Please run the following SQL in your Supabase dashboard SQL Editor:')
          printMigrationSQL()
        }
      } else {
        console.error(`Batch ${i / BATCH} failed:`, error.message)
      }
      continue
    }
    upserted += batch.length
    console.log(`Upserted ${upserted}/${rows.length} occupations...`)
  }

  if (tableMissing) {
    console.log('No data was inserted. Run the migration SQL first, then try again.')
    process.exit(1)
  }

  console.log(`Done. Upserted ${upserted} occupations into occupations_ca.`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
