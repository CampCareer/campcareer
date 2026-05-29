import * as dotenv from 'dotenv'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import AdmZip from 'adm-zip'
import * as XLSX from 'xlsx'
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

// institution_id slug → { avg_net_price, graduation_rate }
// Slugs are derived from QILT names (e.g. "The University of Melbourne" → "the-university-of-melbourne")
const HARDCODED_TUITION: Record<string, { avg_net_price: number; graduation_rate: number }> = {
  'the-university-of-melbourne':        { avg_net_price: 42000, graduation_rate: 0.85 },
  'the-university-of-sydney':           { avg_net_price: 44000, graduation_rate: 0.84 },
  'the-australian-national-university': { avg_net_price: 41000, graduation_rate: 0.83 },
  'the-university-of-queensland':       { avg_net_price: 38000, graduation_rate: 0.82 },
  'university-of-new-south-wales':      { avg_net_price: 43000, graduation_rate: 0.84 },
  'monash-university':                  { avg_net_price: 38000, graduation_rate: 0.81 },
  'the-university-of-western-australia':{ avg_net_price: 36000, graduation_rate: 0.80 },
  'the-university-of-adelaide':         { avg_net_price: 35000, graduation_rate: 0.79 },
  'university-of-technology-sydney':    { avg_net_price: 36000, graduation_rate: 0.78 },
  'rmit-university':                    { avg_net_price: 33000, graduation_rate: 0.75 },
  'queensland-university-of-technology':{ avg_net_price: 32000, graduation_rate: 0.76 },
  'university-of-wollongong':           { avg_net_price: 30000, graduation_rate: 0.77 },
  'macquarie-university':               { avg_net_price: 37000, graduation_rate: 0.79 },
  'deakin-university':                  { avg_net_price: 30000, graduation_rate: 0.74 },
  'griffith-university':                { avg_net_price: 29000, graduation_rate: 0.73 },
  'la-trobe-university':                { avg_net_price: 28000, graduation_rate: 0.72 },
  'university-of-newcastle':            { avg_net_price: 28000, graduation_rate: 0.74 },
  'curtin-university':                  { avg_net_price: 30000, graduation_rate: 0.73 },
}
const DEFAULT_TUITION = { avg_net_price: 27000, graduation_rate: 0.70 }

const QILT_ZIP_URL =
  'https://www.qilt.edu.au/docs/default-source/default-document-library/gos_2024_national_report_tables.zip'

// State mapping for Australian universities (QILT data has no state column)
const INSTITUTION_STATE: Record<string, string> = {
  'Australian Catholic University': 'NSW',
  'Avondale University': 'NSW',
  'Bond University': 'QLD',
  'Central Queensland University': 'QLD',
  'Charles Darwin University': 'NT',
  'Charles Sturt University': 'NSW',
  'Curtin University': 'WA',
  'Deakin University': 'VIC',
  'Edith Cowan University': 'WA',
  'Federation University Australia': 'VIC',
  'Flinders University': 'SA',
  'Griffith University': 'QLD',
  'James Cook University': 'QLD',
  'La Trobe University': 'VIC',
  'Macquarie University': 'NSW',
  'Monash University': 'VIC',
  'Murdoch University': 'WA',
  'Queensland University of Technology': 'QLD',
  'RMIT University': 'VIC',
  'Southern Cross University': 'NSW',
  'Swinburne University of Technology': 'VIC',
  'The Australian National University': 'ACT',
  'The University of Adelaide': 'SA',
  'The University of Melbourne': 'VIC',
  'The University of Notre Dame Australia': 'WA',
  'The University of Queensland': 'QLD',
  'The University of South Australia': 'SA',
  'The University of Sydney': 'NSW',
  'The University of Western Australia': 'WA',
  'Torrens University': 'SA',
  'University of Canberra': 'ACT',
  'University of Divinity': 'VIC',
  'University of New England': 'NSW',
  'University of New South Wales': 'NSW',
  'University of Newcastle': 'NSW',
  'University of Southern Queensland': 'QLD',
  'University of Tasmania': 'TAS',
  'University of Technology Sydney': 'NSW',
  'University of the Sunshine Coast': 'QLD',
  'University of Wollongong': 'NSW',
  'Victoria University': 'VIC',
  'Western Sydney University': 'NSW',
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Parses "79.4 (77.4, 81.3)" → 79.4  or  "75,000 (73,900, 76,100)" → 75000
function parseLeadingNumber(raw: string | null | undefined): number | null {
  if (!raw) return null
  const cleaned = String(raw).replace(/,/g, '')
  const match = cleaned.match(/^([\d.]+)/)
  if (!match) return null
  const n = parseFloat(match[1])
  return isNaN(n) ? null : n
}

function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : http.get
    get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadFile(res.headers.location!))
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function main() {
  console.log('Downloading QILT GOS 2024 tables...')
  const zipBuffer = await downloadFile(QILT_ZIP_URL)
  console.log(`Downloaded ${(zipBuffer.length / 1024).toFixed(0)} KB`)

  const zip = new AdmZip(zipBuffer)
  const entry = zip.getEntry('GOS_2024_National_Report_Tables.xlsx')
  if (!entry) throw new Error('xlsx not found inside zip')

  const xlsxBuffer = entry.getData()
  const wb = XLSX.read(xlsxBuffer, { type: 'buffer' })

  // LF_UG_UNI_1Y_INST_CI: institution + FTE% + OE% + LF% + median salary (AUD)
  const ws = wb.Sheets['LF_UG_UNI_1Y_INST_CI']
  if (!ws) throw new Error('Sheet LF_UG_UNI_1Y_INST_CI not found')

  // rows: [null, institution_name, fte_str, oe_str, lf_str, salary_str]
  // data starts at row 5 (0-indexed row 4), skip aggregate rows at end
  const rows = XLSX.utils.sheet_to_json<(string | null)[]>(ws, {
    header: 1,
    defval: null,
  }) as (string | null)[][]

  const SKIP = new Set(['All universities', 'Standard deviation', ''])

  const records: {
    institution_id: string
    name: string
    state: string | null
    city: string
    median_earnings: number | null
    graduation_rate: number | null
    synced_at: string
  }[] = []

  for (const row of rows.slice(4)) {
    const name = row[1]?.toString().trim()
    if (!name || SKIP.has(name)) continue

    const medianEarnings = parseLeadingNumber(row[5])  // Median annual full-time salaries (AUD)

    records.push({
      institution_id: toSlug(name),
      name,
      state: INSTITUTION_STATE[name] ?? null,
      city: '',
      median_earnings: medianEarnings,
      graduation_rate: null, // Not available in GOS data
      synced_at: new Date().toISOString(),
    })
  }

  console.log(`Parsed ${records.length} institutions`)

  const { error } = await supabase
    .from('colleges_au')
    .upsert(records, { onConflict: 'institution_id' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${records.length} rows into colleges_au.`)

  // Step 2: update avg_net_price & graduation_rate
  console.log('\nUpdating avg_net_price and graduation_rate...')
  let updated = 0
  let defaulted = 0

  for (const r of records) {
    const patch = HARDCODED_TUITION[r.institution_id] ?? DEFAULT_TUITION
    const { error: updateError } = await supabase
      .from('colleges_au')
      .update(patch)
      .eq('institution_id', r.institution_id)

    if (updateError) {
      console.error(`  Update failed for ${r.institution_id}: ${updateError.message}`)
      process.exit(1)
    }

    if (HARDCODED_TUITION[r.institution_id]) {
      console.log(`  [named]   ${r.institution_id} → $${patch.avg_net_price} / ${patch.graduation_rate}`)
      updated++
    } else {
      defaulted++
    }
  }
  console.log(`Updated: ${updated} named, ${defaulted} defaulted (avg_net_price: $${DEFAULT_TUITION.avg_net_price}, grad_rate: ${DEFAULT_TUITION.graduation_rate})`)

  // Step 3: refresh materialized view
  console.log('\nRefreshing materialized view roi_explorer_au...')
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (!projectRef) throw new Error('Cannot parse project ref from SUPABASE_URL')

  const refreshRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_au;' }),
    }
  )

  if (!refreshRes.ok) {
    const body = await refreshRes.text()
    console.warn(`  Warning: Could not refresh view (${refreshRes.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_au;')
  } else {
    console.log('  roi_explorer_au refreshed.')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
