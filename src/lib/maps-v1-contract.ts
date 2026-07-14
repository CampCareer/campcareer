import { getLaunchCountry } from "@/data/launch-countries"

/**
 * Stable public contract for country-level map bundles. A discovery-ready map
 * is intentionally different from a decision-ready career comparison: it can
 * expose geography and navigation before every numeric source row is cleared
 * for a ranking.
 */
export type CountryReadiness = "decision_ready" | "discovery" | "review_required"
export type EvidenceStatus = "verified" | "needs_review" | "unavailable"

export type MapEvidenceReference = {
  status: EvidenceStatus
  sourceName?: string
  sourceUrl?: string
  asOf?: string
  lastVerifiedAt?: string
  note?: string
}

export type MapsV1Envelope<TData = unknown> = {
  country: string
  data: TData
  evidence: MapEvidenceReference[]
  readiness: CountryReadiness
  methodologyVersion: string
  generatedAt: string
  dataVersion: string
}

export const MAPS_V1_METHODOLOGY_VERSION = "maps-v1"
export const MAP_COUNTRY_BUNDLE_VERSION = "map-country-bundle-2026-07-14"

export function getCountryReadiness(country: string): CountryReadiness {
  const profile = getLaunchCountry(country)
  if (profile?.publicationStage === "DECISION_READY") return "decision_ready"
  if (profile?.mapReady) return "discovery"
  return "review_required"
}

export function getMapBundleAsOf(dataVersion: string): string {
  return dataVersion.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? "unknown"
}

export function buildMapsV1Envelope<TData>(input: {
  country: string
  data: TData
  dataVersion: string
  evidence: MapEvidenceReference[]
  generatedAt?: string
}): MapsV1Envelope<TData> {
  return {
    country: input.country.toUpperCase(),
    data: input.data,
    evidence: input.evidence,
    readiness: getCountryReadiness(input.country),
    methodologyVersion: MAPS_V1_METHODOLOGY_VERSION,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    dataVersion: input.dataVersion,
  }
}

/**
 * Older country bundles carry provenance on individual rows, not yet in one
 * normalized API table. State that limitation explicitly instead of attaching
 * a made-up source URL or implying every visible number is decision-ready.
 */
export function getCountryBundleEvidence(dataVersion: string): MapEvidenceReference[] {
  const asOf = getMapBundleAsOf(dataVersion)
  return [{
    status: "needs_review",
    sourceName: "CampCareer map bundle registry",
    sourceUrl: "/methodology",
    asOf,
    lastVerifiedAt: asOf,
    note: "This discovery bundle preserves row-level source metadata where available. It is not a decision-ready comparison publication.",
  }]
}
