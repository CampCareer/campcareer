import type { WHVWorkCategory } from "@/data/whv-occupations"

export interface WHVRegion {
  category: "eligible" | "partial" | "none"
  pct: number
  name: string
  workCategories?: WHVWorkCategory[]
}
