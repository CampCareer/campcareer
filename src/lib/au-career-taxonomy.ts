import snapshot from "@/data/au-career-taxonomy-au.json"
import { AU_CAREER_CATEGORY_BY_ID, type AuCareerCategoryId } from "@/data/au-career-categories"

type TaxonomyEntry = {
  oscaCode: string
  categoryId: AuCareerCategoryId
  subcategoryId: string
  confidence: "rule-mapped"
}

const entries = (snapshot as { occupations: TaxonomyEntry[] }).occupations
const byOscaCode = new Map(entries.map((entry) => [entry.oscaCode, entry]))

export function getAuCareerTaxonomy(oscaCode: string) {
  const entry = byOscaCode.get(oscaCode)
  if (!entry) return null
  return { ...entry, category: AU_CAREER_CATEGORY_BY_ID.get(entry.categoryId)! }
}
