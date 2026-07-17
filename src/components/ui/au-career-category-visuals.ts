import type { LucideIcon } from "lucide-react"
import { ChartNoAxesCombined, Code2, Cog, ConciergeBell, GraduationCap, Hammer, HeartPulse, Leaf, Palette, Plane } from "lucide-react"

export type AuCareerCategoryVisual = {
  Icon: LucideIcon
  tone: string
}

// This is the single visual system for Australia’s ten career categories.
// Jobs, major discovery and the landing search all consume this mapping.
export const AU_CAREER_CATEGORY_VISUALS: Record<number, AuCareerCategoryVisual> = {
  1: { Icon: Hammer, tone: "bg-amber-50 text-amber-700" },
  2: { Icon: HeartPulse, tone: "bg-rose-50 text-rose-700" },
  3: { Icon: Code2, tone: "bg-sky-50 text-sky-700" },
  4: { Icon: Cog, tone: "bg-indigo-50 text-indigo-700" },
  5: { Icon: ChartNoAxesCombined, tone: "bg-violet-50 text-violet-700" },
  6: { Icon: GraduationCap, tone: "bg-fuchsia-50 text-fuchsia-700" },
  7: { Icon: Leaf, tone: "bg-emerald-50 text-emerald-700" },
  8: { Icon: Palette, tone: "bg-pink-50 text-pink-700" },
  9: { Icon: ConciergeBell, tone: "bg-orange-50 text-orange-700" },
  10: { Icon: Plane, tone: "bg-cyan-50 text-cyan-700" },
}

const STUDY_CATEGORY_TO_AU_CATEGORY_ID: Record<string, number> = {
  trades: 1,
  health: 2,
  technology: 3,
  engineering: 4,
  business: 5,
  education: 6,
  environment: 7,
  design: 8,
  hospitality: 9,
  transport: 10,
}

const AU_CATEGORY_ICON_TO_ID: Record<string, number> = {
  hammer: 1,
  "heart-pulse": 2,
  code: 3,
  cog: 4,
  chart: 5,
  "graduation-cap": 6,
  leaf: 7,
  palette: 8,
  "concierge-bell": 9,
  plane: 10,
}

export function getAuCareerCategoryVisual(categoryId: number) {
  return AU_CAREER_CATEGORY_VISUALS[categoryId] ?? AU_CAREER_CATEGORY_VISUALS[3]
}

export function getStudyCategoryVisual(category: string) {
  return getAuCareerCategoryVisual(STUDY_CATEGORY_TO_AU_CATEGORY_ID[category] ?? 3)
}

export function getAuCareerCategoryVisualByIcon(icon: string) {
  return getAuCareerCategoryVisual(AU_CATEGORY_ICON_TO_ID[icon] ?? 3)
}
