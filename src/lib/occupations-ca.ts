import caOccupationsRaw from "@/data/ca-occupation-wages.json"

export interface OccupationCA {
  noc_code: string
  title_en: string
  median_wage_cad: number
  low_wage_cad: number | null
  high_wage_cad: number | null
  average_wage_cad: number | null
  q1_wage_cad: number | null
  q3_wage_cad: number | null
  data_source: string | null
}

export type OccupationCategory = "shortage" | "pay"

const ALL: OccupationCA[] = caOccupationsRaw as unknown as OccupationCA[]

export function getAllOccupations(): OccupationCA[] {
  return ALL
}

export function getOccupationByNoc(nocCode: string): OccupationCA | undefined {
  return ALL.find((o) => o.noc_code === nocCode)
}

export function getOccupationsByCategory(
  category: OccupationCategory,
  limit = 12,
): OccupationCA[] {
  const sorted = [...ALL].sort((a, b) => {
    if (category === "pay") {
      return b.median_wage_cad - a.median_wage_cad
    }
    return b.median_wage_cad - a.median_wage_cad
  })
  return sorted.slice(0, limit)
}

export function getHighPayOccupations(limit = 12): OccupationCA[] {
  return [...ALL]
    .sort((a, b) => b.median_wage_cad - a.median_wage_cad)
    .slice(0, limit)
}
