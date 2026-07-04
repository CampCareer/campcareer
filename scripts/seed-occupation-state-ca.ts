/**
 * occupation_state_ca 테이블 seed 데이터 생성
 * - ca-occupation-province-sample.json 의 실제 주별 임금
 * - national median × province multiplier (직접 계산한 비율) 로 나머지 보강
 * - shortage_rating 은 전국 데이터를 모든 주에 복사
 *
 * 사용법: npx tsx scripts/seed-occupation-state-ca.ts
 * 출력: src/data/ca-occupation-state.json
 */
import fs from "fs"
import path from "path"

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
}

interface ProvinceEntry {
  noc_code: string
  median_wage_cad: number
  low_wage_cad: number | null
  high_wage_cad: number | null
  shortage_rating: number | null
  data_source: string
}

type ProvinceData = Record<string, ProvinceEntry[]>

const WAGES_PATH = path.resolve("src/data/ca-occupation-wages.json")
const SAMPLE_PATH = path.resolve("src/data/ca-occupation-province-sample.json")
const SHORTAGE_PATH = path.resolve("src/data/ca-shortage-ratings.json")
const OUTPUT_PATH = path.resolve("src/data/ca-occupation-state.json")

const CODE_FIX: Record<string, string> = { PEI: "PE", YK: "YT", NWT: "NT" }
const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"]

// Computed province wage multipliers from sample data comparison
const PROV_MULTIPLIERS: Record<string, number> = {
  AB: 1.153, BC: 1.015, MB: 1.025, NB: 0.978, NL: 1.028,
  NS: 1.013, NT: 1.290, NU: 1.396, ON: 1.023, PE: 0.950,
  QC: 1.045, SK: 1.043, YT: 1.162,
}

const wages: WageEntry[] = JSON.parse(fs.readFileSync(WAGES_PATH, "utf-8"))
const sample: Record<string, Array<{ noc_code: string; title: string; median_wage_cad: number }>> =
  JSON.parse(fs.readFileSync(SAMPLE_PATH, "utf-8"))
const shortage: ShortageEntry[] = JSON.parse(fs.readFileSync(SHORTAGE_PATH, "utf-8"))

const shortageMap = new Map(shortage.map((s) => [s.noc_code, s.shortage_rating]))
const wageMap = new Map(wages.map((w) => [w.noc_code, w]))

// Build per-province sample lookups
const sampleMap: Record<string, Map<string, number>> = {}
for (const [rawCode, occs] of Object.entries(sample)) {
  const prov = CODE_FIX[rawCode] ?? rawCode
  sampleMap[prov] = new Map(occs.map((o) => [o.noc_code, o.median_wage_cad]))
}

const result: ProvinceData = {}

for (const prov of PROVINCES) {
  const provData: ProvinceEntry[] = []
  const provSample = sampleMap[prov] ?? new Map()
  const mult = PROV_MULTIPLIERS[prov] ?? 1.0

  for (const w of wages) {
    const sampleWage = provSample.get(w.noc_code)
    let median: number
    let low: number | null = null
    let high: number | null = null
    let source: string

    if (sampleWage != null) {
      median = sampleWage
      source = "ESDC Job Bank province sample"
    } else if (w.median_wage_cad != null) {
      median = Math.round(w.median_wage_cad * mult)
      source = "National × province multiplier"
    } else {
      continue // skip if no wage data at all
    }

    if (w.low_wage_cad != null) low = Math.round(w.low_wage_cad * mult)
    if (w.high_wage_cad != null) high = Math.round(w.high_wage_cad * mult)

    provData.push({
      noc_code: w.noc_code,
      median_wage_cad: median,
      low_wage_cad: low,
      high_wage_cad: high,
      shortage_rating: shortageMap.get(w.noc_code) ?? null,
      data_source: source,
    })
  }

  result[prov] = provData
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2))
console.log(`Wrote state data for ${PROVINCES.length} provinces, ${wages.length} occupations each`)

// Stats
for (const prov of PROVINCES) {
  const d = result[prov]
  const fromSample = d.filter((e) => e.data_source.includes("province sample")).length
  const fromMult = d.filter((e) => e.data_source.includes("multiplier")).length
  const avgWage = Math.round(d.reduce((s, e) => s + e.median_wage_cad, 0) / d.length)
  console.log(`  ${prov}: ${d.length} occ, ${fromSample} sampled, ${fromMult} multiplied, avg C$${avgWage.toLocaleString()}`)
}
