import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 })
  }

  const { data: occ, error: occErr } = await supabase
    .from("occupations_au")
    .select("related_broad_field")
    .eq("anzsco_code", code)
    .maybeSingle()

  if (occErr) {
    return NextResponse.json({ error: occErr.message }, { status: 500 })
  }

  if (!occ?.related_broad_field) {
    return NextResponse.json({ courses: [], prPathway: null })
  }

  const [coursesRes, prRes] = await Promise.all([
    supabase
      .from("courses_au")
      .select("id, title, institution_id, course_type, aqf_level, duration_years, tuition_fee_aud")
      .eq("broad_field", occ.related_broad_field)
      .order("id")
      .limit(4),
    supabase
      .from("country_pr_pathways")
      .select("*")
      .ilike("country", "au")
      .maybeSingle(),
  ])

  if (coursesRes.error) {
    return NextResponse.json({ error: coursesRes.error.message }, { status: 500 })
  }

  const institutionIds = Array.from(
    new Set((coursesRes.data ?? []).map((c) => c.institution_id).filter(Boolean)),
  ) as string[]

  const collegeMap: Record<string, string> = {}
  if (institutionIds.length > 0) {
    const { data: cols } = await supabase
      .from("colleges_au")
      .select("institution_id, name")
      .in("institution_id", institutionIds)
    for (const c of cols ?? []) collegeMap[c.institution_id] = c.name
  }

  const courses = (coursesRes.data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    institution_id: c.institution_id,
    institution_name: collegeMap[c.institution_id] ?? null,
    course_type: c.course_type,
    aqf_level: c.aqf_level,
    duration_years: c.duration_years,
    tuition_fee_aud: c.tuition_fee_aud,
  }))

  return NextResponse.json({ courses, prPathway: prRes.data ?? null })
}
