/**
 * Seeds Netherlands data into Supabase: colleges_nl table + roi_explorer_nl view.
 *
 * Run with access token for view operations:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' scripts/seed-nl-data.ts
 *
 * Without access token, only upserts college data (table must already exist).
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface CollegeSeed {
  institution_id: string
  name: string
  city: string
  province: string
  lat: number
  lng: number
  qs_rank: number
  website: string
  tuition: number
  median_earnings: number
  graduation_rate: number
  rent_median: number
  cost_of_living_index: number
}

function loadColleges(): CollegeSeed[] {
  const raw = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/nl-colleges.json'), 'utf-8'))
  const cities = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/nl-cities.json'), 'utf-8'))
  const cityRents = new Map<string, { rent_median: number; cost_of_living_index: number }>()
  for (const c of cities) {
    cityRents.set(c.name, { rent_median: c.rent_median ?? 1000, cost_of_living_index: c.cost_of_living_index ?? 65 })
  }

  const earningsByRank = (qs: number): number => {
    if (qs <= 50) return 70000
    if (qs <= 100) return 65000
    if (qs <= 150) return 58000
    if (qs <= 200) return 53000
    if (qs <= 300) return 48000
    return 43000
  }

  return raw.map((c: any) => {
    const cityData = cityRents.get(c.city) ?? { rent_median: 1000, cost_of_living_index: 65 }
    return {
      institution_id: c.institution_id,
      name: c.name,
      city: c.city,
      province: c.province,
      lat: c.lat,
      lng: c.lng,
      qs_rank: c.qs_rank,
      website: c.website,
      tuition: 15000,
      median_earnings: earningsByRank(c.qs_rank),
      graduation_rate: 0.82,
      rent_median: cityData.rent_median,
      cost_of_living_index: cityData.cost_of_living_index,
    }
  })
}

async function upsertColleges(rows: CollegeSeed[]): Promise<boolean> {
  console.log(`Upserting ${rows.length} colleges...`)
  const { error } = await supabase.from('colleges_nl').upsert(rows, {
    onConflict: 'institution_id',
    ignoreDuplicates: false,
  })
  if (error) {
    console.error('  Failed:', error.message)
    return false
  }
  console.log('  Done.')
  return true
}

async function refreshView() {
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN
  if (!projectRef || !accessToken) {
    console.log('\nSkipping view refresh (no SUPABASE_ACCESS_TOKEN).')
    console.log('  Run manually in Supabase SQL Editor: REFRESH MATERIALIZED VIEW roi_explorer_nl;')
    return
  }

  console.log('\nRefreshing roi_explorer_nl...')
  // First try to create the view if it doesn't exist
  const createSql = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/20260708000000_colleges_nl.sql'), 'utf-8')

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_nl;' }),
    },
  )
  if (!res.ok) {
    const body = await res.text()
    console.warn(`  Warning: Could not refresh view (${res.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_nl;')
  } else {
    console.log('  roi_explorer_nl refreshed.')
  }
}

async function main() {
  const rows = loadColleges()
  const ok = await upsertColleges(rows)
  if (ok) await refreshView()
}

main().catch(console.error)
