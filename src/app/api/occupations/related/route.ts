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

  const [prRes] = await Promise.all([
    supabase
      .from("country_pr_pathways")
      .select("*")
      .ilike("country", "au")
      .maybeSingle(),
  ])

  if (!occ?.related_broad_field) {
    return NextResponse.json({ courses: [], prPathway: prRes.data ?? null })
  }

  const { data: coursesData, error: coursesErr } = await supabase
    .from("courses_au")
    .select("id, title, institution_id, course_type, aqf_level, duration_years, tuition_fee_aud, cricos_url")
    .eq("broad_field", occ.related_broad_field)
    .order("id")
    .limit(4)

  if (coursesErr) {
    return NextResponse.json({ error: coursesErr.message }, { status: 500 })
  }

  const institutionIds = Array.from(
    new Set((coursesData ?? []).map((c) => c.institution_id).filter(Boolean)),
  ) as string[]

  interface CollegeRow { institution_id: string; name: string; website_url: string | null }
  const collegeMap: Record<string, { name: string; website_url: string | null }> = {}
  if (institutionIds.length > 0) {
    const { data: cols } = await supabase
      .from("colleges_au")
      .select("institution_id, name, website_url")
      .in("institution_id", institutionIds)
    for (const c of (cols as CollegeRow[] | null) ?? []) {
      collegeMap[c.institution_id] = { name: c.name, website_url: c.website_url }
    }
  }

  const courses = (coursesData ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    institution_id: c.institution_id,
    institution_name: collegeMap[c.institution_id]?.name ?? null,
    website_url: collegeMap[c.institution_id]?.website_url ?? null,
    course_type: c.course_type,
    aqf_level: c.aqf_level,
    duration_years: c.duration_years,
    tuition_fee_aud: c.tuition_fee_aud,
    cricos_url: (c as { cricos_url?: string | null }).cricos_url ?? null,
  }))

  return NextResponse.json({ courses, prPathway: prRes.data ?? null })
}
