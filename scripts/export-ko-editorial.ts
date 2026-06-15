// Export the English editorial free-text (risk_summary, ai_note) for every
// majors row to docs/ko-editorial-export.csv. This is the source file for the
// human Korean translation pass; the translated values come back as an UPDATE
// seed keyed by row_pk (= majors.id). Read-only — touches no data.
//
//   npx ts-node scripts/export-ko-editorial.ts
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
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

// Canonical display order, then slug — purely for a tidy review file.
const COUNTRY_ORDER = ['US', 'CA', 'UK', 'AU', 'IE']

// RFC-4180 field escaping: quote if the value contains a comma, quote, CR or LF;
// escape embedded quotes by doubling them.
function csvField(value: unknown): string {
  const s = value == null ? '' : String(value)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

async function main() {
  const { data, error } = await supabase
    .from('majors')
    .select('id, country, slug, risk_summary, ai_note')

  if (error) {
    console.error('Query failed:', error.message)
    process.exit(1)
  }
  const rows = data ?? []

  rows.sort((a, b) => {
    const c = COUNTRY_ORDER.indexOf(a.country) - COUNTRY_ORDER.indexOf(b.country)
    return c !== 0 ? c : String(a.slug).localeCompare(String(b.slug))
  })

  const header = ['row_pk', 'country', 'slug', 'risk_summary', 'ai_note']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push([r.id, r.country, r.slug, r.risk_summary, r.ai_note].map(csvField).join(','))
  }

  const outPath = path.resolve(__dirname, '../docs/ko-editorial-export.csv')
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8')

  console.log(`Wrote ${rows.length} rows → ${outPath}`)
  console.log(`Columns: ${header.join(', ')}`)
}

main()
