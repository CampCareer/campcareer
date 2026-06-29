import type { WHVWorkCategory } from "@/data/whv-occupations"

export interface WHVRegion {
  category: "eligible" | "partial" | "none"
  pct: number
  name: string
  workCategories?: WHVWorkCategory[]
}

export interface RegionEmployer {
  name: string
  category: "mine" | "hotel" | "farm" | "factory"
  town: string
  description: string
  seekUrl: string
  mapsQuery: string
  websiteUrl: string
  postcode: number | string
}
