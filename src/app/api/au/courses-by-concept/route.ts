import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { AU_CONCEPT_OCCUPATIONS } from "@/data/au-major-occupation-map"
import { getStudyConcept } from "@/data/study-concepts"

export const dynamic = "force-dynamic"

/**
 * GET /api/au/courses-by-concept?concept=nursing&limit=6
 *
 * Returns CRICOS courses for a given concept (major), grouped by state.
 * Uses broad_field from AU_CONCEPT_OCCUPATIONS to match courses.
 */
export async function GET(request: NextRequest) {
  const conceptId = request.nextUrl.searchParams.get("concept") ?? ""
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "6", 10) || 6, 20)

  if (!conceptId) {
    return NextResponse.json({ error: "concept query param is required" }, { status: 400 })
  }

  const concept = getStudyConcept(conceptId)
  if (!concept) {
    return NextResponse.json({ error: `Unknown concept: ${conceptId}` }, { status: 404 })
  }

  // Find broad fields for this concept
  const mapping = AU_CONCEPT_OCCUPATIONS.find((m) => m.conceptId === conceptId)
  const broadFields = mapping?.broadFields ?? []

  if (broadFields.length === 0) {
    return NextResponse.json({ courses: [], concept: conceptId })
  }

  const { data: courses, error } = await supabaseAdmin
    .from("courses_au")
    .select("id, institution_id, course_code, title, broad_field, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url")
    .in("broad_field", broadFields)
    .not("tuition_fee_aud", "is", null)
    .order("tuition_fee_aud", { ascending: true })
    .limit(limit * 3) // fetch more, then diversify

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Provider and campus data are maintained in colleges_au, not courses_au.
  const institutionIds = [...new Set((courses ?? []).map((c) => c.institution_id).filter(Boolean))] as string[]
  const institutionsById = new Map<string, { name: string; state: string | null }>()
  if (institutionIds.length > 0) {
    const { data: instRows } = await supabaseAdmin
      .from("colleges_au")
      .select("institution_id, name, state")
      .in("institution_id", institutionIds)
    for (const row of instRows ?? []) {
      institutionsById.set(row.institution_id, { name: row.name, state: row.state })
    }
  }

  // Diversify: pick from different institutions
  const seen = new Set<string>()
  const diversified: typeof courses = []
  for (const course of courses ?? []) {
    const key = course.institution_id ?? course.course_code
    if (key && seen.has(key)) continue
    if (key) seen.add(key)
    diversified.push(course)
    if (diversified.length >= limit) break
  }

  const result = diversified.map((course) => {
    const institution = course.institution_id ? institutionsById.get(course.institution_id) : null
    return {
      id: course.id,
      title: course.title,
      institutionName: institution?.name ?? course.institution_id ?? null,
      state: institution?.state ?? null,
      aqfLevel: course.aqf_level,
      durationYears: course.duration_years,
      tuitionFeeAud: course.tuition_fee_aud,
      cricosUrl: course.cricos_url,
      fieldName: course.broad_field,
    }
  })

  return NextResponse.json(
    { concept: conceptId, label: concept.label, labelKo: concept.labelKo, courses: result },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  )
}
