import type { SourceRecord } from "@/data/source-registry"

export type SourceSnapshot = {
  source: Pick<SourceRecord, "country" | "category" | "sourceName" | "sourceUrl">
  fetchedAt: string
  contentHash: string
  summary: string
}

export type PolicyChangeReport = {
  country: SourceRecord["country"]
  sourceUrl: string
  previousHash: string
  currentHash: string
  detectedAt: string
  summary: string
  status: "review-required"
}

// Policy changes are deliberately reports, not publish instructions. A human
// must compare the official source and update the product data intentionally.
export function buildPolicyChangeReport(previous: SourceSnapshot, current: SourceSnapshot): PolicyChangeReport | null {
  if (previous.source.category !== "visa-pathway" || current.source.category !== "visa-pathway") return null
  if (previous.source.country !== current.source.country || previous.contentHash === current.contentHash) return null

  return {
    country: current.source.country,
    sourceUrl: current.source.sourceUrl,
    previousHash: previous.contentHash,
    currentHash: current.contentHash,
    detectedAt: current.fetchedAt,
    summary: current.summary,
    status: "review-required",
  }
}
