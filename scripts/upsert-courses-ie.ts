/**
 * Upserts Qualifax Level 8 course data into courses_ie,
 * and expands colleges_ie with institutions not yet in the table.
 *
 * Prerequisites:
 *   1. Run supabase/migrations/20260530_courses_ie.sql in Supabase SQL Editor first.
 *   2. qualifax_raw.json must exist in the project root (run scraper_qualifax.py first).
 *
 * Run: npx ts-node scripts/upsert-courses-ie.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Types ─────────────────────────────────────────────────────────────────────

interface QualifaxRecord {
  title: string
  nfq_level: number
  course_type: string
  course_code: string | null
  url: string
  college: string
  location: string
  duration_years: number | null
  cao_points_2025: number | null
  institution_id: string | null
}

interface CollegeRow {
  institution_id: string
  name: string
  region: string
  city: string
  median_earnings: number
  graduation_rate: number
  avg_net_price: number
  school_type: 'public' | 'private'
  synced_at: string
}

// ── Province / city mapping ───────────────────────────────────────────────────

function cityToProvince(city: string): string {
  const c = city.toLowerCase()
  if (/letterkenny|donegal|cavan|monaghan/.test(c)) return 'Ulster'
  if (/galway|sligo|castlebar|mayo|roscommon|leitrim/.test(c)) return 'Connacht'
  if (/cork|limerick|waterford|tralee|tipperary|thurles|ennis|clare|kerry/.test(c)) return 'Munster'
  return 'Leinster'  // Dublin, Wicklow, Meath, Louth, Kilkenny, Carlow, Wexford, Westmeath, Laois, Offaly, Kildare, Longford, Athlone
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Qualifax→colleges_ie name matching ───────────────────────────────────────

// Known exact mappings: Qualifax name (lower) → existing institution_id in colleges_ie
const QUALIFAX_TO_EXISTING_ID: Record<string, string> = {
  'tu dublin - technological university dublin': 'technological-university-dublin',
  'maynooth university':          'maynooth-university',
  'trinity college dublin':       'trinity-college-dublin',
  'university college cork':      'university-college-cork',
  'university of galway':         'nui-galway',          // renamed from NUI Galway 2022
  'national university of ireland galway': 'nui-galway',
  'nui galway':                   'nui-galway',
  'university college dublin':    'university-college-dublin',
  'dublin city university':       'dublin-city-university',
  'university of limerick':       'university-of-limerick',
  'rcsi university of medicine and health sciences': 'rcsi-university-of-medicine-and-health-sciences',
  'technological university dublin': 'technological-university-dublin',
}

// ── New colleges to add to colleges_ie ───────────────────────────────────────
// Estimates based on HEA Graduate Outcomes, IUA fee surveys, and QS rankings.
// median_earnings: EUR, ~1 year post-graduation (HEA GOS 2022 proxy)
// avg_net_price:   EUR/year, international undergraduate 2024-25
// graduation_rate: 6-year completion rate proxy

const NEW_COLLEGES: Omit<CollegeRow, 'synced_at'>[] = [
  // ── South East Technological University (SETU) ─────────────────────────────
  { institution_id: 'setu-waterford',    name: 'SETU - Waterford Campus',   region: 'Munster',  city: 'Waterford',   median_earnings: 31000, graduation_rate: 0.80, avg_net_price: 13500, school_type: 'public' },
  { institution_id: 'setu-carlow',       name: 'SETU - Carlow Campus',      region: 'Leinster', city: 'Carlow',      median_earnings: 30000, graduation_rate: 0.79, avg_net_price: 13000, school_type: 'public' },
  { institution_id: 'setu-wexford',      name: 'SETU - Wexford Campus',     region: 'Leinster', city: 'Wexford',     median_earnings: 29000, graduation_rate: 0.78, avg_net_price: 12500, school_type: 'public' },
  // ── Technological University of the Shannon (TUS) ─────────────────────────
  { institution_id: 'tus-limerick',      name: 'TUS - Limerick Campuses',   region: 'Munster',  city: 'Limerick',    median_earnings: 31000, graduation_rate: 0.80, avg_net_price: 13500, school_type: 'public' },
  { institution_id: 'tus-athlone',       name: 'TUS - Athlone Campus',      region: 'Leinster', city: 'Athlone',     median_earnings: 30000, graduation_rate: 0.79, avg_net_price: 13000, school_type: 'public' },
  { institution_id: 'tus-thurles',       name: 'TUS - Thurles Campus',      region: 'Munster',  city: 'Thurles',     median_earnings: 29000, graduation_rate: 0.77, avg_net_price: 12000, school_type: 'public' },
  // ── Atlantic Technological University (ATU) ───────────────────────────────
  { institution_id: 'atu-galway',        name: 'ATU - Galway Campuses',     region: 'Connacht', city: 'Galway',      median_earnings: 31500, graduation_rate: 0.81, avg_net_price: 13500, school_type: 'public' },
  { institution_id: 'atu-sligo',         name: 'ATU - Sligo Campus',        region: 'Connacht', city: 'Sligo',       median_earnings: 30000, graduation_rate: 0.79, avg_net_price: 13000, school_type: 'public' },
  { institution_id: 'atu-donegal',       name: 'ATU - Donegal Campuses',    region: 'Ulster',   city: 'Letterkenny', median_earnings: 29500, graduation_rate: 0.78, avg_net_price: 12500, school_type: 'public' },
  { institution_id: 'atu-mayo',          name: 'ATU - Mayo Campus',         region: 'Connacht', city: 'Castlebar',   median_earnings: 29000, graduation_rate: 0.77, avg_net_price: 12000, school_type: 'public' },
  { institution_id: 'atu-st-angelas',    name: "ATU - St. Angela's",        region: 'Connacht', city: 'Sligo',       median_earnings: 29000, graduation_rate: 0.78, avg_net_price: 12000, school_type: 'public' },
  // ── Munster Technological University (MTU) ────────────────────────────────
  { institution_id: 'mtu-cork',          name: 'MTU - Cork Campuses',       region: 'Munster',  city: 'Cork',        median_earnings: 32000, graduation_rate: 0.82, avg_net_price: 14000, school_type: 'public' },
  { institution_id: 'mtu-kerry',         name: 'MTU - Kerry Campus',        region: 'Munster',  city: 'Tralee',      median_earnings: 30000, graduation_rate: 0.79, avg_net_price: 13000, school_type: 'public' },
  // ── Other public ─────────────────────────────────────────────────────────
  { institution_id: 'dundalk-institute-of-technology', name: 'Dundalk  Institute of Technology', region: 'Leinster', city: 'Dundalk', median_earnings: 30500, graduation_rate: 0.80, avg_net_price: 13000, school_type: 'public' },
  { institution_id: 'mary-immaculate-college',   name: 'Mary Immaculate College',   region: 'Munster',  city: 'Limerick', median_earnings: 31000, graduation_rate: 0.84, avg_net_price: 12000, school_type: 'public' },
  { institution_id: 'institute-of-art-design-and-technology', name: 'Institute of Art  Design & Technology', region: 'Leinster', city: 'Dun Laoghaire', median_earnings: 28000, graduation_rate: 0.80, avg_net_price: 12500, school_type: 'public' },
  { institution_id: 'national-college-of-art-and-design', name: 'National College of Art & Design', region: 'Leinster', city: 'Dublin', median_earnings: 27000, graduation_rate: 0.79, avg_net_price: 12000, school_type: 'public' },
  { institution_id: 'marino-institute-of-education', name: 'Marino Institute of Education', region: 'Leinster', city: 'Dublin', median_earnings: 31000, graduation_rate: 0.83, avg_net_price: 11500, school_type: 'public' },
  // ── Private ───────────────────────────────────────────────────────────────
  { institution_id: 'griffith-college-dublin', name: 'Griffith College Dublin', region: 'Leinster', city: 'Dublin',  median_earnings: 29000, graduation_rate: 0.78, avg_net_price: 12000, school_type: 'private' },
  { institution_id: 'griffith-college-cork',   name: 'Griffith College Cork',   region: 'Munster',  city: 'Cork',    median_earnings: 28000, graduation_rate: 0.77, avg_net_price: 11500, school_type: 'private' },
  { institution_id: 'dublin-business-school',  name: 'Dublin Business School',  region: 'Leinster', city: 'Dublin',  median_earnings: 28000, graduation_rate: 0.76, avg_net_price: 11500, school_type: 'private' },
  { institution_id: 'national-college-of-ireland', name: 'National College of Ireland', region: 'Leinster', city: 'Dublin', median_earnings: 28500, graduation_rate: 0.77, avg_net_price: 11000, school_type: 'private' },
  { institution_id: 'cct-college-dublin',      name: 'CCT College Dublin',      region: 'Leinster', city: 'Dublin',  median_earnings: 27000, graduation_rate: 0.74, avg_net_price: 11000, school_type: 'private' },
  { institution_id: 'american-college-dublin', name: 'American College Dublin', region: 'Leinster', city: 'Dublin',  median_earnings: 27000, graduation_rate: 0.73, avg_net_price: 20000, school_type: 'private' },
  { institution_id: 'carlow-college-st-patricks', name: "Carlow College - St. Patrick's", region: 'Leinster', city: 'Carlow', median_earnings: 28000, graduation_rate: 0.80, avg_net_price: 10500, school_type: 'private' },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const rawPath = path.resolve(__dirname, '../qualifax_raw.json')
  if (!fs.existsSync(rawPath)) {
    console.error('qualifax_raw.json not found. Run scraper_qualifax.py first.')
    process.exit(1)
  }

  const raw: QualifaxRecord[] = JSON.parse(fs.readFileSync(rawPath, 'utf-8'))
  console.log(`Loaded ${raw.length} Qualifax records from qualifax_raw.json\n`)

  // ── Step 1: Load existing colleges_ie ───────────────────────────────────────

  const { data: existingColleges, error: ceErr } = await supabase
    .from('colleges_ie')
    .select('institution_id, name')
  if (ceErr) { console.error('colleges_ie load error:', ceErr.message); process.exit(1) }

  const existingIds = new Set(existingColleges!.map((c) => c.institution_id))
  const existingNameToId = new Map(existingColleges!.map((c) => [c.name.toLowerCase(), c.institution_id]))
  console.log(`colleges_ie has ${existingIds.size} existing institutions`)

  // ── Step 2: Expand colleges_ie with new institutions ────────────────────────

  const toInsert = NEW_COLLEGES.filter((c) => !existingIds.has(c.institution_id))
  console.log(`Adding ${toInsert.length} new institutions to colleges_ie...`)

  if (toInsert.length > 0) {
    const rows: CollegeRow[] = toInsert.map((c) => ({
      ...c,
      synced_at: new Date().toISOString(),
    }))
    const { error: insErr } = await supabase
      .from('colleges_ie')
      .upsert(rows, { onConflict: 'institution_id' })
    if (insErr) { console.error('colleges_ie insert error:', insErr.message); process.exit(1) }
    toInsert.forEach((c) => {
      existingIds.add(c.institution_id)
      existingNameToId.set(c.name.toLowerCase(), c.institution_id)
      console.log(`  ✓ ${c.name} (${c.region}, ${c.city})`)
    })
  }

  // ── Step 3: Resolve institution_id for each Qualifax record ─────────────────

  function resolveInstitutionId(collegeName: string): string | null {
    const key = collegeName.toLowerCase().trim()
    // 1. Known exact mapping
    if (QUALIFAX_TO_EXISTING_ID[key]) return QUALIFAX_TO_EXISTING_ID[key]
    // 2. existingNameToId exact
    if (existingNameToId.has(key)) return existingNameToId.get(key)!
    // 3. Slug-based match
    const slug = toSlug(collegeName)
    if (existingIds.has(slug)) return slug
    // 4. Partial contains match
    for (const [name, id] of Array.from(existingNameToId.entries())) {
      if (name.includes(key) || key.includes(name)) return id
    }
    return null
  }

  // ── Step 4: Upsert courses_ie ────────────────────────────────────────────────

  console.log('\nUpserting courses_ie...')

  const courseRows = raw.map((r) => ({
    course_code:     r.course_code ?? null,
    title:           r.title,
    nfq_level:       r.nfq_level,
    course_type:     r.course_type,
    college_name:    r.college,
    institution_id:  resolveInstitutionId(r.college),
    city:            r.location ?? null,
    duration_years:  r.duration_years ?? null,
    cao_points_2025: r.cao_points_2025 ?? null,
    qualifax_url:    r.url,
    synced_at:       new Date().toISOString(),
  }))

  const BATCH = 200
  let inserted = 0
  for (let i = 0; i < courseRows.length; i += BATCH) {
    const batch = courseRows.slice(i, i + BATCH)
    const { error } = await supabase
      .from('courses_ie')
      .upsert(batch, { onConflict: 'qualifax_url' })
    if (error) { console.error(`  Batch ${i / BATCH + 1} error:`, error.message); process.exit(1) }
    inserted += batch.length
    process.stdout.write(`  ${inserted}/${courseRows.length}\r`)
  }

  const matched   = courseRows.filter((r) => r.institution_id).length
  const withPts   = courseRows.filter((r) => r.cao_points_2025).length
  console.log(`\n✅ courses_ie upsert 완료: ${courseRows.length}개`)
  console.log(`   colleges_ie 매칭: ${matched}/${courseRows.length} (${Math.round(matched * 100 / courseRows.length)}%)`)
  console.log(`   CAO Points 보유:  ${withPts}/${courseRows.length} (${Math.round(withPts * 100 / courseRows.length)}%)`)

  // ── Step 5: Refresh roi_explorer_ie ─────────────────────────────────────────

  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('\n⚠️  Cannot parse project ref. Run manually:')
    console.warn('   REFRESH MATERIALIZED VIEW roi_explorer_ie;')
    return
  }

  console.log('\nRefreshing materialized view roi_explorer_ie...')
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_ie;' }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    console.warn(`  ⚠️  View refresh failed (${res.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_ie;')
  } else {
    console.log('  ✓ roi_explorer_ie refreshed')
  }
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1) })
