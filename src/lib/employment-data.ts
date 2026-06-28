import "server-only"
import { readFileSync } from "fs"
import path from "path"
import { unstable_cache } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { SA4_BY_STATE } from "@/data/sa4-regions"
import { EMPLOYMENT_OCCUPATIONS } from "@/data/employment-occupations"
import { JOB_SEARCH_LINKS } from "@/data/job-search-links"
import type { StateCode } from "@/app/map/states"

export interface CourseLink {
  id: number
  title: string
  institution_name: string | null
  tuition_fee_aud: number | null
  duration_years: number | null
  url: string | null
}

export interface StateEmploymentOccupation {
  rank: number
  a4: string
  name: string
  emp: number
  seek_url: string | null
  broad_field: string | null
  median_salary_aud: number | null
  estimated_state_salary_aud: number | null
  representative_osca_code: string | null
  courses: CourseLink[]
}

export type StateSalaryMult = Record<string, Record<string, number>>

// --- 순수 NERO 집계 (DB 없음) ---

function loadNeroData(): Record<string, { a4: string; name: string; emp: number }[]> {
  const raw = readFileSync(path.join(process.cwd(), "public/nero-sa4.json"), "utf-8")
  return JSON.parse(raw)
}

export function aggregateStateEmployment(stateCode: StateCode): StateEmploymentOccupation[] {
  const neroData = loadNeroData()
  const sa4Regions = SA4_BY_STATE[stateCode]
  if (!sa4Regions) return []

  const agg = new Map<string, { a4: string; name: string; emp: number }>()
  for (const region of sa4Regions) {
    const occs = neroData[region.code] ?? []
    for (const occ of occs) {
      const existing = agg.get(occ.a4)
      if (existing) {
        existing.emp += occ.emp
      } else {
        agg.set(occ.a4, { a4: occ.a4, name: occ.name, emp: occ.emp })
      }
    }
  }

  const sorted = Array.from(agg.values()).sort((a, b) => b.emp - a.emp)

  return sorted.map((occ, i) => {
    const mapping = EMPLOYMENT_OCCUPATIONS.find((m) => m.a4 === occ.a4)
    const jobLink = JOB_SEARCH_LINKS.find((l) => l.a4 === occ.a4)
    return {
      rank: i + 1,
      a4: occ.a4,
      name: occ.name,
      emp: occ.emp,
      seek_url: jobLink?.seek_url ?? null,
      broad_field: mapping?.broad_field ?? null,
      median_salary_aud: null,
      estimated_state_salary_aud: null,
      representative_osca_code: mapping?.representative_osca_code ?? null,
      courses: [],
    }
  })
}

// --- Supabase 보강 (salary + state multiplier) ---

async function fetchAll<T>(table: string, columns: string): Promise<T[]> {
  const PAGE = 1000
  const all: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(columns)
      .range(from, from + PAGE - 1)
    if (error) {
      console.error(`[employment-data] ${table} fetch failed:`, error)
      break
    }
    const rows = (data ?? []) as T[]
    all.push(...rows)
    if (rows.length < PAGE) break
  }
  return all
}

export interface EmploymentPageData {
  occupations: StateEmploymentOccupation[]
  stateCode: StateCode
}

async function fetchEmploymentDataUncached(stateCode: StateCode): Promise<EmploymentPageData> {
  const base = aggregateStateEmployment(stateCode)

  // Fetch salary data + state multiplier
  const [occupations, multRows] = await Promise.all([
    fetchAll<{
      anzsco_code: string
      median_salary_aud: number | null
    }>("occupations_au", "anzsco_code, median_salary_aud"),
    supabaseAdmin
      .from("state_salary_multiplier")
      .select("state, anzsco_1digit, multiplier")
      .then((r) => (r.data ?? []) as { state: string; anzsco_1digit: string; multiplier: number }[]),
  ])

  // Build salary map by OSCA code
  const salaryByCode = new Map<string, number>()
  for (const o of occupations) {
    if (o.anzsco_code && o.median_salary_aud != null) {
      salaryByCode.set(o.anzsco_code, o.median_salary_aud)
    }
  }

  // Build state multiplier map: { state: { anzsco_1digit: multiplier } }
  const stateSalaryMult: StateSalaryMult = {}
  for (const row of multRows) {
    if (!stateSalaryMult[row.state]) stateSalaryMult[row.state] = {}
    stateSalaryMult[row.state][row.anzsco_1digit] = Number(row.multiplier)
  }

  const enriched = base.map((occ) => {
    const code = occ.representative_osca_code
    const nationalSalary = code ? salaryByCode.get(code) ?? null : null

    let estimatedStateSalary: number | null = null
    if (nationalSalary != null && code) {
      const anzsco1digit = code.charAt(0)
      const mult = stateSalaryMult[stateCode]?.[anzsco1digit] ?? 1
      estimatedStateSalary = Math.round(nationalSalary * mult)
    }

    return {
      ...occ,
      median_salary_aud: nationalSalary,
      estimated_state_salary_aud: estimatedStateSalary,
      courses: [],
    }
  })

  return { occupations: enriched, stateCode }
}

const getEmploymentDataCached = unstable_cache(
  async (stateCode: string) => fetchEmploymentDataUncached(stateCode as StateCode),
  ["employment-data"],
  { revalidate: 86400 },
)

export async function getEmploymentPageData(stateCode: StateCode): Promise<EmploymentPageData> {
  return getEmploymentDataCached(stateCode)
}
