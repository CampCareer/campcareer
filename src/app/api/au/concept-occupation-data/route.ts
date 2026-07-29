import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { AU_CONCEPT_OCCUPATIONS, type AuConceptOccupations } from "@/data/au-major-occupation-map"

export const dynamic = "force-dynamic"

function median(values: number[]) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

/**
 * POST /api/au/concept-occupation-data
 * Body: { concepts: string[] }  — array of concept IDs (e.g. ["nursing", "computer-science"])
 *
 * Returns aggregated occupation data for each concept:
 * - representative occupations (OSCA code, label, shortage, salary, CSOL)
 * - national shortage percentage
 * - median salary range
 * - state breakdown (shortage rating per state)
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const concepts: string[] = body.concepts ?? []

  if (!Array.isArray(concepts) || concepts.length === 0) {
    return NextResponse.json({ error: "concepts array is required" }, { status: 400 })
  }

  // Limit to 10 concepts per request
  const limited = concepts.slice(0, 10)

  // Build concept → OSCA codes mapping
  const conceptMap = new Map<string, AuConceptOccupations>()
  for (const mapping of AU_CONCEPT_OCCUPATIONS) {
    if (limited.includes(mapping.conceptId)) {
      conceptMap.set(mapping.conceptId, mapping)
    }
  }

  const allOscaCodes = new Set<string>()
  for (const mapping of conceptMap.values()) {
    for (const code of mapping.oscaCodes) allOscaCodes.add(code)
  }

  if (allOscaCodes.size === 0) {
    return NextResponse.json({ concepts: {} })
  }

  const { data: occRows, error: occError } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, anzsco_v13, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, related_broad_field, pr_note_ko")
    .in("anzsco_code", Array.from(allOscaCodes))

  if (occError) return NextResponse.json({ error: occError.message }, { status: 500 })

  const occByOscaCode = new Map<string, NonNullable<typeof occRows>[number]>()
  for (const row of occRows ?? []) {
    if (row.anzsco_code) occByOscaCode.set(row.anzsco_code, row)
  }

  let stateRows: Array<{ anzsco_code: string; state: string; shortage_rating: number }> = []
  if (allOscaCodes.size > 0) {
    const { data, error } = await supabaseAdmin
      .from("occupation_state_au")
      .select("anzsco_code, state, shortage_rating")
      .in("anzsco_code", Array.from(allOscaCodes))
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    stateRows = data ?? []
  }

  const stateByOsca = new Map<string, Map<string, number>>()
  for (const row of stateRows ?? []) {
    if (!row.anzsco_code) continue
    if (!stateByOsca.has(row.anzsco_code)) stateByOsca.set(row.anzsco_code, new Map())
    stateByOsca.get(row.anzsco_code)!.set(row.state, row.shortage_rating)
  }

  // Build response per concept
  const result: Record<string, {
    representativeOccupations: Array<{
      oscaCode: string
      label: string
      labelKo: string
      shortageRating: number | null
      medianSalary: number | null
      onCsol: boolean
      confidence: string | null
      stateShortage: Record<string, number>
    }>
    nationalShortagePct: number
    medianSalaryMin: number | null
    medianSalaryMax: number | null
    medianSalaryMedian: number | null
    csolCount: number
    totalOccupations: number
  }> = {}

  for (const [conceptId, mapping] of conceptMap) {
    const occupations = mapping.oscaCodes.flatMap((oscaCode) => {
      const occ = occByOscaCode.get(oscaCode)
      if (!occ) return []
      const stateShortage: Record<string, number> = {}
      const stateMap = stateByOsca.get(oscaCode)
      if (stateMap) {
        for (const [state, rating] of stateMap) {
          stateShortage[state] = rating
        }
      }
      return [{
        oscaCode,
        label: occ.occupation_en,
        labelKo: occ.occupation_ko || occ.occupation_en,
        shortageRating: occ.shortage_rating,
        medianSalary: occ.median_salary_aud,
        onCsol: occ.on_csol,
        confidence: occ.confidence,
        stateShortage,
      }]
    })

    const salaries = occupations.map((o) => o.medianSalary).filter((s): s is number => s != null)
    const shortageCount = occupations.filter((o) => o.shortageRating != null && o.shortageRating >= 3).length
    const csolCount = occupations.filter((o) => o.onCsol).length

    result[conceptId] = {
      representativeOccupations: occupations,
      nationalShortagePct: occupations.length > 0 ? Math.round((shortageCount / occupations.length) * 100) : 0,
      medianSalaryMin: salaries.length > 0 ? Math.min(...salaries) : null,
      medianSalaryMax: salaries.length > 0 ? Math.max(...salaries) : null,
      medianSalaryMedian: median(salaries),
      csolCount,
      totalOccupations: occupations.length,
    }
  }

  return NextResponse.json(
    { concepts: result },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  )
}
