import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const WAGES_PATH = path.resolve("src/data/ca-occupation-wages.json")
const OUTPUT_PATH = path.resolve("src/data/ca-shortage-ratings.json")

interface WageEntry {
  noc_code: string
  title_en: string
  median_wage_cad: number | null
  low_wage_cad: number | null
  high_wage_cad: number | null
  data_source: string | null
  is_annual: boolean
}

interface ShortageEntry {
  noc_code: string
  shortage_rating: number
  confidence: "high" | "medium" | "low"
  rationale: string
}

const wages: WageEntry[] = JSON.parse(fs.readFileSync(WAGES_PATH, "utf-8"))

const catWages: Record<string, number[]> = {}
for (const w of wages) {
  const cat = w.noc_code[0]
  if (!catWages[cat]) catWages[cat] = []
  if (w.median_wage_cad) catWages[cat].push(w.median_wage_cad)
}
const median = (arr: number[]) => {
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}
const catMedian: Record<string, number> = {}
for (const [cat, vals] of Object.entries(catWages)) {
  catMedian[cat] = median(vals)
}

const NOC_PREFIX_TO_RATING: Record<string, { base: number; label: string }> = {
  "0": { base: 3, label: "Management" },
  "1": { base: 2, label: "Business, finance and administration" },
  "2": { base: 3, label: "Natural and applied sciences" },
  "3": { base: 4, label: "Health" },
  "4": { base: 2, label: "Education, law and social services" },
  "5": { base: 1, label: "Art, culture and recreation" },
  "6": { base: 1, label: "Sales and service" },
  "7": { base: 3, label: "Trades, transport and equipment operators" },
  "8": { base: 2, label: "Natural resources and agriculture" },
  "9": { base: 2, label: "Manufacturing and utilities" },
}

const KNOWN_HIGH_SHORTAGE: Record<string, number> = {
  "31100": 5, "31101": 5, "31102": 5,
  "31300": 5, "31301": 5, "31302": 5,
  "32101": 4, "32102": 4,
  "31103": 4, "31200": 4, "31201": 4, "31202": 4, "31203": 4, "31204": 4,
  "31303": 4,
  "32100": 4, "32103": 4, "32104": 4, "32109": 4,
  "32200": 4, "32201": 4,
  "33100": 4, "33101": 4, "33102": 4,
  "21231": 4, "21221": 4, "21220": 4, "21211": 4, "21210": 4,
  "21223": 4, "21222": 4, "21230": 4, "21232": 4, "21233": 4, "21234": 4,
  "72200": 4, "72201": 4, "72202": 4, "72203": 4, "72204": 4, "72205": 4,
  "72206": 4, "72300": 4, "72301": 4, "72302": 4, "72310": 4, "72311": 4,
  "72400": 4, "72401": 4, "72402": 4, "72403": 4, "72404": 4, "72405": 4,
  "72406": 4, "72410": 4, "72411": 4, "72420": 4, "72421": 4, "72422": 4,
  "72423": 4, "72500": 4, "72501": 4, "72502": 4, "72600": 4, "72700": 4,
  "72701": 4, "72702": 4, "73100": 4, "73101": 4, "73102": 4, "73110": 4,
  "73111": 4, "73112": 4, "73113": 4, "73200": 4, "73201": 4, "73202": 4,
  "73300": 4, "73301": 4, "73302": 4, "73400": 4, "73401": 4, "73402": 4,
}

const results: ShortageEntry[] = []

for (const w of wages) {
  const cat = w.noc_code[0]
  const info = NOC_PREFIX_TO_RATING[cat] ?? { base: 2, label: "Other" }
  let rating = info.base
  let rationale = `${info.label} category, base rating ${rating}`
  let confidence: "high" | "medium" | "low" = "medium"

  if (KNOWN_HIGH_SHORTAGE[w.noc_code] != null) {
    rating = KNOWN_HIGH_SHORTAGE[w.noc_code]
    rationale = `Known high-shortage occupation (NOC ${w.noc_code})`
    confidence = "high"
  }

  if (w.median_wage_cad) {
    // Occupations with wage significantly above category median → likely shortage
    if (catMedian[cat]) {
      const ratio = w.median_wage_cad / catMedian[cat]
      if (ratio > 2.5) {
        rating = Math.min(5, rating + 2)
        rationale += `; wage ${ratio.toFixed(1)}x category median`
        confidence = "medium"
      } else if (ratio > 1.8) {
        rating = Math.min(5, rating + 1)
        rationale += `; wage ${ratio.toFixed(1)}x category median`
        confidence = "medium"
      } else if (ratio < 0.4) {
        rating = Math.max(1, rating - 1)
        rationale += `; wage ${ratio.toFixed(1)}x category median`
      }
    }

    // Healthcare/NOC 3 gets an additional boost
    if (cat === "3" && KNOWN_HIGH_SHORTAGE[w.noc_code] == null) {
      rating = Math.max(rating, 4)
      rationale += "; health sector shortage"
      confidence = "high"
    }
  }

  rating = Math.max(1, Math.min(5, Math.round(rating)))

  results.push({
    noc_code: w.noc_code,
    shortage_rating: rating,
    confidence,
    rationale,
  })
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
console.log(`Wrote ${results.length} shortage ratings to ${OUTPUT_PATH}`)

// Stats
const byRating: Record<number, number> = {}
for (const r of results) {
  byRating[r.shortage_rating] = (byRating[r.shortage_rating] ?? 0) + 1
}
for (let i = 1; i <= 5; i++) {
  console.log(`  rating ${i}: ${byRating[i] ?? 0} occupations`)
}
