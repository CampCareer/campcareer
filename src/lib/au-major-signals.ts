// ── Type ─────────────────────────────────────────────────────────────────────

export interface AuMajorSignal {
  concept_id: string
  country: string
  shortage_national_pct: number | null
  shortage_states_affected: number | null
  on_csol_pct: number | null
  outlook_2030_change_pct: number | null
  outlook_2035_change_pct: number | null
  outlook_direction: string | null
  salary_min_aud: number | null
  salary_max_aud: number | null
  salary_median_aud: number | null
  cost_bachelor_median_aud: number | null
  cost_diploma_median_aud: number | null
  cost_duration_years: number | null
  pr_score: number | null
  pr_note: string | null
  ai_exposure_band: string | null
  ai_note: string | null
  occupation_count: number | null
  representative_occupations: Array<{
    oscaCode: string
    label: string
    labelKo: string
  }> | null
  data_sources: Array<{
    name: string
    url: string
    /** Underlying publication/dataset date. Required before a paid report can use the fact. */
    dataAsOf?: string | null
    /** CampCareer review date for this exact source-to-metric mapping. */
    lastVerified?: string | null
    confidence?: "high" | "medium" | "low"
    kind?: "observed" | "calculated" | "estimated"
  }> | null
  last_verified: string | null
}

// ── Snapshot queries ────────────────────────────────────────────────────────
// Static data from au-major-signals.json.
// Server-side Supabase queries can be added in a separate server-only module.

import snapshot from "@/data/au-major-signals.json"
import { STUDY_CONCEPTS } from "@/data/study-concepts"

type SnapshotFile = {
  signals: AuMajorSignal[]
  generatedAt: string
}

const SNAPSHOT = snapshot as SnapshotFile

/**
 * Return all AU major signals from the static snapshot.
 */
export function getAllAuMajorSignals(): AuMajorSignal[] {
  return SNAPSHOT.signals.filter((s) => s.country === "AU")
}

/**
 * Return a single concept's signal from the static snapshot.
 */
export function getAuMajorSignal(conceptId: string): AuMajorSignal | null {
  return (
    SNAPSHOT.signals.find(
      (s) => s.concept_id === conceptId && s.country === "AU",
    ) ?? null
  )
}

/**
 * Alias used by discovery-search-clients.tsx
 */
export function getAuMajorSignalsSnapshot(): AuMajorSignal[] {
  return getAllAuMajorSignals()
}

export function getAuMajorSignalSnapshot(
  conceptId: string,
): AuMajorSignal | null {
  return getAuMajorSignal(conceptId)
}

// ── Display helpers ──────────────────────────────────────────────────────────

export type ShortageLevel = "critical" | "high" | "moderate" | "low" | "none"

export function shortageLevel(pct: number | null): ShortageLevel {
  if (pct == null) return "none"
  if (pct >= 80) return "critical"
  if (pct >= 50) return "high"
  if (pct >= 25) return "moderate"
  if (pct > 0) return "low"
  return "none"
}

export function shortageLabel(level: ShortageLevel, isKo: boolean): string {
  const labels: Record<ShortageLevel, { en: string; ko: string }> = {
    critical: { en: "Critical Shortage", ko: "심각한 부족" },
    high: { en: "High Shortage", ko: "높은 부족" },
    moderate: { en: "Moderate Shortage", ko: "보통 부족" },
    low: { en: "Some Shortage", ko: "일부 부족" },
    none: { en: "No Shortage", ko: "부족 없음" },
  }
  return isKo ? labels[level].ko : labels[level].en
}

export function shortageColor(level: ShortageLevel): string {
  const colors: Record<ShortageLevel, string> = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    moderate: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-yellow-50 text-yellow-700 border-yellow-200",
    none: "bg-slate-50 text-slate-500 border-slate-200",
  }
  return colors[level]
}

export function formatSalaryRange(
  min: number | null,
  max: number | null,
): string {
  if (min == null && max == null) return ""
  if (min == null) return `A$${(max! / 1000).toFixed(0)}K+`
  if (max == null) return `A$${(min / 1000).toFixed(0)}K+`
  return `A$${(min / 1000).toFixed(0)}K–${(max / 1000).toFixed(0)}K`
}

export function formatOutlook(pct: number | null): string {
  if (pct == null) return ""
  const sign = pct > 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}

/**
 * Map an ROI `field_name` (from the roi_explorer_au table) to a STUDY_CONCEPT id.
 * Uses the `roiSearchTerm` on each concept plus alias matching.
 */
export function fieldNameToConceptId(fieldName: string): string | null {
  const normalised = fieldName.trim().toLowerCase()
  // Direct roiSearchTerm match
  for (const c of STUDY_CONCEPTS) {
    if (c.roiSearchTerm && c.roiSearchTerm.toLowerCase() === normalised) return c.id
  }
  // Alias / label match
  for (const c of STUDY_CONCEPTS) {
    if (
      c.label.toLowerCase() === normalised ||
      c.aliases.some((a) => a.toLowerCase() === normalised)
    )
      return c.id
  }
  // Substring fallback
  for (const c of STUDY_CONCEPTS) {
    if (c.label.toLowerCase().includes(normalised) || normalised.includes(c.label.toLowerCase())) return c.id
  }
  return null
}

export function prBadge(score: number | null): {
  label: string
  className: string
} {
  if (score == null) return { label: "—", className: "bg-slate-50 text-slate-400" }
  if (score >= 85)
    return {
      label: "Excellent PR",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    }
  if (score >= 70)
    return {
      label: "Strong PR",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    }
  if (score >= 55)
    return {
      label: "Moderate PR",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    }
  return {
    label: "Limited PR",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  }
}
