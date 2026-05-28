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

type College = {
  id: string
  median_earnings: number
  avg_net_price: number
  graduation_rate: number
  enrollment: number
}

type City = {
  id: string
  rent_median: number
}

type Snapshot = {
  college_id: string
  city_id: string
  program_id: null
  roi_score: number
  payback_years: number
  net_salary: number
  breakdown: {
    annual_earnings: number
    annual_rent: number
    living_cost: number
    net_salary: number
    total_tuition: number
    graduation_rate: number
  }
}

async function fetchAll<T>(
  table: string,
  select: string,
  filters: Record<string, string>,
): Promise<T[]> {
  const PAGE = 1000
  let from = 0
  const results: T[] = []

  while (true) {
    let query = supabase.from(table).select(select).range(from, from + PAGE - 1)
    for (const [col, val] of Object.entries(filters)) {
      query = query.eq(col, val)
    }

    const { data, error } = await query
    if (error) throw new Error(`${table} fetch error: ${error.message}`)

    results.push(...(data as T[]))
    if (data.length < PAGE) break
    from += PAGE
  }

  return results
}

function calcSnapshot(college: College, city: City): Snapshot | null {
  const annual_earnings = college.median_earnings
  const annual_rent = city.rent_median * 12
  const living_cost = annual_rent * 0.4
  const net_salary = annual_earnings - annual_rent - living_cost
  const total_tuition = college.avg_net_price * 4
  const graduation_rate = college.graduation_rate

  if (net_salary <= 0 || total_tuition <= 0) return null

  const roi_score = Math.round(((net_salary * graduation_rate) / total_tuition) * 100 * 100) / 100
  const payback_years = Math.round(total_tuition / net_salary)

  return {
    college_id: college.id,
    city_id: city.id,
    program_id: null,
    roi_score,
    payback_years,
    net_salary: Math.round(net_salary),
    breakdown: {
      annual_earnings,
      annual_rent: Math.round(annual_rent),
      living_cost: Math.round(living_cost),
      net_salary: Math.round(net_salary),
      total_tuition,
      graduation_rate,
    },
  }
}

async function main() {
  console.log('Clearing roi_snapshots...')
  const { error: delError } = await supabase
    .from('roi_snapshots')
    .delete()
    .not('id', 'is', null)
  if (delError) {
    console.error('Delete error:', delError.message)
    process.exit(1)
  }
  console.log('  Cleared.')

  console.log('Fetching CA colleges...')
  const allColleges = await fetchAll<College & { median_earnings: number | null; avg_net_price: number | null; graduation_rate: number | null; enrollment: number | null }>(
    'colleges',
    'id,median_earnings,avg_net_price,graduation_rate,enrollment',
    { state: 'CA' },
  )
  const colleges = allColleges.filter(
    (c) =>
      c.median_earnings != null && c.median_earnings >= 20000 &&
      c.avg_net_price   != null && c.avg_net_price   >= 1000  && c.avg_net_price <= 80000 &&
      c.graduation_rate != null && c.graduation_rate >= 0.1 &&
      c.enrollment      != null && c.enrollment      >= 100,
  ) as College[]
  console.log(`  ${colleges.length} colleges after quality filter (out of ${allColleges.length})`)

  console.log('Fetching CA cities...')
  const allCities = await fetchAll<City & { rent_median: number | null }>(
    'cities',
    'id,rent_median',
    { state: 'CA' },
  )
  const cities = allCities.filter((c) => c.rent_median != null) as City[]
  console.log(`  ${cities.length} cities with rent data (out of ${allCities.length})`)

  console.log('Calculating ROI snapshots...')
  const snapshots: Snapshot[] = []
  for (const college of colleges) {
    for (const city of cities) {
      const snapshot = calcSnapshot(college, city)
      if (snapshot) snapshots.push(snapshot)
    }
  }
  console.log(`  ${snapshots.length} valid snapshots (skipped ${colleges.length * cities.length - snapshots.length} with net_salary ≤ 0)`)

  const BATCH = 500
  let upserted = 0
  console.log('Upserting to roi_snapshots...')

  for (let i = 0; i < snapshots.length; i += BATCH) {
    const chunk = snapshots.slice(i, i + BATCH)
    const { error } = await supabase
      .from('roi_snapshots')
      .upsert(chunk, { onConflict: 'college_id,city_id' })

    if (error) {
      console.error('Upsert error:', error.message)
      process.exit(1)
    }

    upserted += chunk.length
    process.stdout.write(`\r  ${upserted} / ${snapshots.length}`)
  }

  console.log(`\nDone. Saved ${upserted} ROI snapshots.`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
