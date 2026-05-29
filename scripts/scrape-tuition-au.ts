/**
 * Updates avg_net_price (AUD) in colleges_au.
 *
 * - Sydney & UNSW: live-scraped from official fees pages via Playwright
 * - All others: researched values (midpoint of published bachelor's fee ranges)
 *
 * Sources: studyabroadaide.com, uhomes.com, mycoursefinder.com (2025 data)
 *
 * Run: SUPABASE_ACCESS_TOKEN=sbp_xxx npx ts-node scripts/scrape-tuition-au.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Researched fallback data (bachelor's fee midpoint, AUD, 2025) ─────────────
const RESEARCHED: Record<string, number> = {
  'the-university-of-sydney':            58000,  // 49,200–65,900
  'university-of-new-south-wales':       53000,  // 46,500–58,500
  'the-university-of-melbourne':         46000,  // 40,000–81,000 (excl. medicine)
  'the-australian-national-university':  55000,  // 46,700–62,500
  'the-university-of-queensland':        52000,  // 45,800–58,100
  'monash-university':                   52000,  // 44,600–59,600
  'the-university-of-western-australia': 48000,  // 42,500–53,700
  'the-university-of-adelaide':          38000,  // 36,000–40,000
  'university-of-technology-sydney':     41000,  // 35,300–47,200
  'rmit-university':                     45000,  // 41,700–49,000
  'queensland-university-of-technology': 44000,  // 39,800–48,600
  'university-of-wollongong':            29000,  // 24,500–33,900
  'macquarie-university':                44000,  // 41,200–46,700
  'deakin-university':                   41000,  // 37,500–45,000
  'griffith-university':                 41000,  // 37,000–45,000
  'la-trobe-university':                 39000,  // 35,800–43,000
  'university-of-newcastle':             42000,  // 36,500–48,300
  'curtin-university':                   40000,  // 37,500–43,400
  'australian-catholic-university':      40000,  // 28,700–52,600
  'avondale-university':                 45000,  // 37,900–51,200
  'bond-university':                     49000,  // 48,000–50,100
  'central-queensland-university':       28000,  // 19,000–37,000
  'charles-darwin-university':           35000,  // 29,800–39,400
  'charles-sturt-university':            29000,  // 24,600–33,000 (excl. medical outliers)
  'edith-cowan-university':              41000,  // 39,300–42,900
  'federation-university-australia':     38000,  // 31,800–43,500
  'flinders-university':                 42000,  // 35,700–47,300
  'james-cook-university':               36000,  // 35,700–36,900
  'murdoch-university':                  31000,  // 25,700–35,500
  'southern-cross-university':           31000,  // 26,000–36,000
  'swinburne-university-of-technology':  41000,  // 34,200–47,400
  'the-university-of-notre-dame-australia': 40000, // 33,600–45,600
  'the-university-of-south-australia':   36000,  // estimated ~36,000
  'torrens-university':                  27000,  // 26,800
  'university-of-canberra':              37000,  // 35,000–38,000
  'university-of-divinity':              18000,  // 17,500
  'university-of-new-england':           29000,  // 26,900–31,600
  'university-of-southern-queensland':   31000,  // 26,400–35,300
  'university-of-tasmania':              40000,  // 38,300–42,000
  'university-of-the-sunshine-coast':    27000,  // 24,400–29,600
  'victoria-university':                 31000,
  'western-sydney-university':           35000,  // 31,000–39,000
}

// ── Scraping targets (live) ────────────────────────────────────────────────────
const SCRAPE_TARGETS: Record<string, { url: string; uocMultiplier?: number }> = {
  'the-university-of-sydney': {
    url: 'https://www.sydney.edu.au/study/fees-and-loans/international-student-tuition-fees.html',
  },
  'university-of-new-south-wales': {
    url: 'https://www.unsw.edu.au/student/managing-your-studies/fees/international',
    uocMultiplier: 48,
  },
}

function extractAudAmounts(text: string, uocMultiplier?: number): number[] {
  const raw = Array.from(
    text.matchAll(/(?:A\$|AUD\s?|\$)([\d,]+(?:\.\d+)?)/gi),
    (m) => parseFloat((m as RegExpMatchArray)[1].replace(/,/g, ''))
  )
  const amounts = uocMultiplier ? raw.map((v) => Math.round(v * uocMultiplier)) : raw
  return amounts.filter((v) => v >= 18_000 && v <= 80_000)
}

function median(arr: number[]): number {
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 !== 0 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}

async function scrapeAll(): Promise<Record<string, number>> {
  const scraped: Record<string, number> = {}
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-AU',
  })

  for (const [id, { url, uocMultiplier }] of Object.entries(SCRAPE_TARGETS)) {
    const page = await context.newPage()
    process.stdout.write(`  Scraping ${id}... `)
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 })
      await page.waitForTimeout(2_000)
      const text = await page.locator('body').innerText()
      const amounts = extractAudAmounts(text, uocMultiplier)
      if (amounts.length > 0) {
        const fee = median(amounts)
        console.log(`$${fee.toLocaleString()} (scraped)`)
        scraped[id] = fee
      } else {
        console.log('no amounts found → using researched value')
      }
    } catch (e) {
      console.log(`failed (${(e as Error).message.split('\n')[0]}) → using researched value`)
    }
    await page.close()
  }

  await browser.close()
  return scraped
}

async function main() {
  console.log('Scraping live fee pages...')
  const scraped = await scrapeAll()

  // Merge: scraped takes priority over researched
  const final: Record<string, number> = { ...RESEARCHED, ...scraped }

  console.log(`\nUpdating ${Object.keys(final).length} universities in colleges_au...`)
  let updated = 0
  for (const [institution_id, avg_net_price] of Object.entries(final)) {
    const source = scraped[institution_id] ? 'scraped' : 'researched'
    const { error } = await supabase
      .from('colleges_au')
      .update({ avg_net_price, synced_at: new Date().toISOString() })
      .eq('institution_id', institution_id)

    if (error) {
      console.error(`  ✗ ${institution_id}: ${error.message}`)
    } else {
      console.log(`  ✓ ${institution_id} → $${avg_net_price.toLocaleString()} [${source}]`)
      updated++
    }
  }
  console.log(`\nUpdated ${updated} rows.`)

  // Refresh materialized view
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (projectRef && process.env.SUPABASE_ACCESS_TOKEN) {
    console.log('\nRefreshing roi_explorer_au...')
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_au;' }),
      }
    )
    console.log(res.ok ? '  Refreshed.' : `  Warning: ${await res.text()}`)
  } else {
    console.log('\nSkipping view refresh (no SUPABASE_ACCESS_TOKEN).')
    console.log('Run manually: REFRESH MATERIALIZED VIEW roi_explorer_au;')
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
