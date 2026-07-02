import "server-only"
import { readFileSync } from "fs"
import { join } from "path"

interface RawUSOcc {
  occ_code: string
  occ_title: string
  tot_emp: number
  median_wage: number
  pct_change: number
  annual_openings: number
  shortage_score: number
}

type RawData = {
  shortageByState: Record<string, RawUSOcc[]>
  highPayByState: Record<string, RawUSOcc[]>
}

const _cache: { data: { byCode: Map<string, USOccDetail>; codes: string[] } | null } = { data: null }

function load(): { byCode: Map<string, USOccDetail>; codes: string[] } {
  if (_cache.data) return _cache.data

  const filePath = join(process.cwd(), "src/data/us-occupation-state.json")
  let raw: string
  try {
    raw = readFileSync(filePath, "utf-8")
  } catch (e) {
    console.error(`[us-occupation-detail] failed to read ${filePath}:`, e)
    return { byCode: new Map(), codes: [] }
  }
  const parsed: RawData = JSON.parse(raw)

  const stateEntries: { state: string; occ: RawUSOcc; list: "shortage" | "highPay" }[] = []
  for (const [state, occs] of Object.entries(parsed.shortageByState)) {
    for (const occ of occs) stateEntries.push({ state, occ, list: "shortage" })
  }
  for (const [state, occs] of Object.entries(parsed.highPayByState)) {
    for (const occ of occs) stateEntries.push({ state, occ, list: "highPay" })
  }

  const byCode = new Map<string, USOccDetail>()
  for (const { state, occ, list } of stateEntries) {
    let d = byCode.get(occ.occ_code)
    if (!d) {
      d = {
        occ_code: occ.occ_code,
        occ_title: occ.occ_title,
        states: [],
        shortageStates: [],
        highPayStates: [],
      }
      byCode.set(occ.occ_code, d)
    }
    d.states.push({
      state,
      median_wage: occ.median_wage,
      tot_emp: occ.tot_emp,
      pct_change: occ.pct_change,
      annual_openings: occ.annual_openings,
      shortage_score: occ.shortage_score,
    })
    if (list === "shortage") d.shortageStates.push(state)
    if (list === "highPay") d.highPayStates.push(state)
  }

  _cache.data = { byCode, codes: Array.from(byCode.keys()) }
  return _cache.data
}

type USStateEntry = {
  state: string
  median_wage: number
  tot_emp: number
  pct_change: number
  annual_openings: number
  shortage_score: number
}

export type USOccDetail = {
  occ_code: string
  occ_title: string
  states: USStateEntry[]
  shortageStates: string[]
  highPayStates: string[]
}

export type USOccPageData = {
  occ_code: string
  occ_title: string
  median_wage: number
  shortage_score: number
  pct_change: number
  annual_openings: number
  tot_emp: number
  shortageStates: string[]
  highPayStates: string[]
  onetUrl: string
  blsUrl: string
}

function weightedAvg(items: USStateEntry[], field: keyof USStateEntry): number {
  const total = items.reduce((s, i) => s + i.tot_emp, 0)
  if (total === 0) return 0
  return items.reduce((s, i) => s + (i[field] as number) * i.tot_emp, 0) / total
}

const US_STATE_NAME: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
  PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  "66": "Guam", "72": "Puerto Rico", "78": "Virgin Islands",
}

export function getUSOccCodes(): string[] {
  return load().codes
}

export function getUSOccDetail(code: string): USOccPageData | null {
  const d = load().byCode.get(code)
  if (!d) return null
  const w = weightedAvg(d.states, "median_wage")
  return {
    occ_code: d.occ_code,
    occ_title: d.occ_title,
    median_wage: Math.round(w),
    shortage_score: Math.round(weightedAvg(d.states, "shortage_score")),
    pct_change: Math.round(weightedAvg(d.states, "pct_change") * 10) / 10,
    annual_openings: Math.round(weightedAvg(d.states, "annual_openings")),
    tot_emp: d.states.reduce((s, i) => s + i.tot_emp, 0),
    shortageStates: d.shortageStates.map((c) => US_STATE_NAME[c] ?? c).sort(),
    highPayStates: d.highPayStates.map((c) => US_STATE_NAME[c] ?? c).sort(),
    onetUrl: `https://www.onetonline.org/link/summary/${d.occ_code}.00`,
    blsUrl: `https://www.bls.gov/oes/current/oes${d.occ_code.replace("-", "")}.htm`,
  }
}
