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
 * - representative occupations (ANZSCO code, label, shortage, salary, CSOL)
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

  // The legacy-named oscaCodes property contains ANZSCO v1.3 inputs. Resolve
  // those through occupations_au before looking up OSCA-keyed state data.
  const allAnzscoV13Codes = new Set<string>()
  for (const mapping of conceptMap.values()) {
    for (const code of mapping.oscaCodes) allAnzscoV13Codes.add(code)
  }

  if (allAnzscoV13Codes.size === 0) {
    return NextResponse.json({ concepts: {} })
  }

  // Resolve the ANZSCO v1.3 study-to-occupation mapping to current OSCA rows.
  const { data: occRows, error: occError } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, anzsco_v13, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, related_broad_field, pr_note_ko")
    .in("anzsco_v13", Array.from(allAnzscoV13Codes))

  if (occError) return NextResponse.json({ error: occError.message }, { status: 500 })

  const occByAnzscoV13 = new Map<string, Array<NonNullable<typeof occRows>[number]>>()
  for (const row of occRows ?? []) {
    if (!row.anzsco_v13) continue
    const matches = occByAnzscoV13.get(row.anzsco_v13) ?? []
    matches.push(row)
    occByAnzscoV13.set(row.anzsco_v13, matches)
  }

  const currentOscaCodes = [...new Set((occRows ?? []).map((row) => row.anzsco_code).filter((code): code is string => Boolean(code)))]
  let stateRows: Array<{ anzsco_code: string; state: string; shortage_rating: number }> = []
  if (currentOscaCodes.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("occupation_state_au")
      .select("anzsco_code, state, shortage_rating")
      .in("anzsco_code", currentOscaCodes)
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
    const occupations = mapping.representativeOccupations.map((rep) => {
      const matchedRows = occByAnzscoV13.get(rep.oscaCode) ?? []
      const stateShortage: Record<string, number> = {}
      for (const occ of matchedRows) {
        const stateMap = stateByOsca.get(occ.anzsco_code)
        if (stateMap) {
          for (const [state, rating] of stateMap) {
            stateShortage[state] = Math.max(stateShortage[state] ?? 0, rating)
          }
        }
      }
      const shortages = matchedRows.map((row) => row.shortage_rating).filter((rating): rating is number => rating != null)
      const salaries = matchedRows.map((row) => row.median_salary_aud).filter((salary): salary is number => salary != null)
      return {
        oscaCode: rep.oscaCode,
        label: rep.label,
        labelKo: rep.labelKo,
        shortageRating: shortages.length > 0 ? Math.max(...shortages) : null,
        medianSalary: median(salaries),
        onCsol: matchedRows.some((row) => row.on_csol),
        confidence: matchedRows.find((row) => row.confidence)?.confidence ?? null,
        stateShortage,
      }
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
